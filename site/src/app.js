/* CS Roadmap client. Reads data.json (built from research/ by site/build.py) and renders:
   home, a path (map, guide, courses), a topic page and an about page. No dependencies, no build step.
   Routes use plain hash names so they work on GitHub Pages and in previews:
     #home  #about  #p-<path>  #p-<path>--<map|guide|courses>  #p-<path>--map--<topic>  #n-<topic>          */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- persistence (optional; always guarded) */
  var NS = 'cs-roadmap:v1:';
  var store = {
    get: function (key, fallback) {
      try { var raw = window.localStorage.getItem(NS + key); return raw == null ? fallback : JSON.parse(raw); }
      catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(NS + key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
  };

  var DEFAULTS = {
    mode: 'dark', dir: 'auto', lines: 'all',
    scope: 'route', detail: 'essentials', layout: 'cards', start: 'map', hideDone: false,
  };
  var SETTINGS_KEY = 'settings-v2';
  var settings = Object.assign({}, DEFAULTS, store.get(SETTINGS_KEY, {}));
  var progress = store.get('progress', {}) || {};
  var checks = store.get('checks', {}) || {};
  var docEl = document.documentElement;
  var hostTheme = docEl.getAttribute('data-host-theme') || '';

  var D = null;
  var ix = { path: {}, rank: {}, succ: {}, anc: {}, byUrl: {}, search: [] };
  var ui = { scale: null, mapKey: '', selected: null, lastPath: null, courseFilter: 'courses', resetArmed: false, searchSel: -1 };

  /* ---------------------------------------------------------------- labels */
  var LEVEL = { intro: 'Intro', intermediate: 'Intermediate', advanced: 'Advanced' };
  var KIND = { book: 'Book', website: 'Website', course: 'Course', 'video-series': 'Video series', 'practice-site': 'Practice site', paper: 'Paper', docs: 'Docs', article: 'Article', tool: 'Tool' };
  var ACCESS = { free: 'Free', paid: 'Paid', mixed: 'Partly free', 'account-required': 'Free account' };
  var ROLE = { 'primary-text': 'Primary text', 'primary-course': 'Primary course', practice: 'Practice', secondary: 'Fills a gap', reference: 'Reference' };
  var VIDEOS = { public: 'Public', 'enrolled-only': 'Enrolled students only', none: 'Not recorded', unknown: 'Access unconfirmed' };
  var ASSIGN = { 'public-with-autograder': 'Public, with autograder', public: 'Public', partial: 'Partly public', restricted: 'Restricted', none: 'None', unknown: 'Unconfirmed' };
  var STATUS = { todo: 'Not started', doing: 'In progress', done: 'Done' };
  var VIEWS = { map: 'Map', guide: 'Guide', courses: 'Courses' };

  /* ---------------------------------------------------------------- small helpers */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>'; }
  function safeUrl(u) { return /^https?:\/\//i.test(String(u || '')) ? String(u) : '#'; }
  function ext(url, text, cls) { return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(safeUrl(url)) + '" target="_blank" rel="noopener">' + text + '</a>'; }
  function shortUrl(u) {
    try {
      var x = new URL(u); var p = x.pathname.replace(/\/$/, '');
      if (p.length > 30) p = p.slice(0, 28) + '…';
      return x.hostname.replace(/^www\./, '') + p;
    } catch (e) { return u; }
  }
  // Escape text, then turn bare URLs into links and `code` spans into code.
  function rich(text) {
    var s = esc(text);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/https?:\/\/[^\s<>"]+/g, function (m) {
      var trail = m.match(/(?:[).,;:\]]|&quot;|&#39;)+$/);
      var url = trail ? m.slice(0, -trail[0].length) : m;
      var raw = url.replace(/&amp;/g, '&');
      return '<a href="' + url + '" target="_blank" rel="noopener">' + esc(shortUrl(raw)) + '</a>' + (trail ? trail[0] : '');
    });
    return s;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function isWide() { return window.matchMedia('(min-width: 1100px)').matches; }
  // map direction actually in use: "auto" reads left to right on wide screens and top to bottom on narrow ones
  function dirNow() {
    if (settings.dir === 'LR' || settings.dir === 'TB') return settings.dir;
    return window.matchMedia('(min-width: 1000px)').matches ? 'LR' : 'TB';
  }
  // a usable term label ("Fall 2025"), not a sentence that happens to contain a year
  function termish(t) { var s = shortTerm(t); return /\d{4}/.test(s) && s.length <= 28 && !/^no\b/i.test(s); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------------------------------------------------------------- data access */
  function node(id) { return D.nodes[id]; }
  function has(id) { return Object.prototype.hasOwnProperty.call(D.nodes, id); }
  function homeOf(n) { return n.paths[0]; }
  function pathOf(id) { return ix.path[id]; }
  function hard(n) { return (n.hard || []).filter(has); }
  function soft(n) { return (n.soft || []).filter(has); }
  function pick(n, role) { for (var i = 0; i < n.resources.length; i++) if (n.resources[i].role === role) return n.resources[i]; return null; }
  function urlKey(u) { return String(u || '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/#.*$/, '').replace(/\/+$/, ''); }
  function publicLectures(n) {
    var r = pick(n, 'primary-course'); var c = r && r.course;
    return !!c && (c.videos === 'public' || !!c.public_videos_url);
  }
  function ancestors(id) {
    if (ix.anc[id]) return ix.anc[id];
    var out = {};
    hard(node(id)).forEach(function (p) { out[p] = true; Object.keys(ancestors(p)).forEach(function (a) { out[a] = true; }); });
    ix.anc[id] = out;
    return out;
  }
  function statusOf(id) { return progress[id] || 'todo'; }
  function setStatus(id, value) {
    if (value === 'todo') delete progress[id]; else progress[id] = value;
    store.set('progress', progress);
  }
  function rankSort(a, b) {
    var pa = ix.rank['p:' + homeOf(node(a))], pb = ix.rank['p:' + homeOf(node(b))];
    return (pa - pb) || (ix.rank[a] - ix.rank[b]);
  }

  function buildIndex() {
    D.paths.forEach(function (p, i) { ix.path[p.id] = p; ix.rank['p:' + p.id] = i; });
    D.order.forEach(function (id, i) { ix.rank[id] = i; ix.succ[id] = []; });
    D.order.forEach(function (id) {
      var n = node(id);
      hard(n).forEach(function (p) { ix.succ[p].push({ id: id, soft: false }); });
      soft(n).forEach(function (p) { ix.succ[p].push({ id: id, soft: true }); });
      n.resources.forEach(function (r) {
        var k = urlKey(r.url);
        (ix.byUrl[k] = ix.byUrl[k] || []).push({ node: id, res: r });
      });
      ix.search.push({ type: 'topic', id: id, title: n.title, sub: n.scope, text: (n.title + ' ' + n.scope).toLowerCase() });
      n.resources.forEach(function (r) {
        ix.search.push({ type: 'res', id: id, title: r.title, sub: (r.by ? r.by + ' · ' : '') + 'in ' + n.title, text: (r.title + ' ' + (r.by || '')).toLowerCase() });
      });
    });
  }

  /* Topics a path view shows: its own topics, plus (scope "route") every required prerequisite from other paths. */
  function routeIds(pid, opt) {
    opt = opt || {};
    var scope = opt.scope || settings.scope;
    var set = {};
    pathOf(pid).members.filter(has).forEach(function (id) { set[id] = true; });
    if (scope === 'route') Object.keys(set).forEach(function (id) { Object.keys(ancestors(id)).forEach(function (a) { set[a] = true; }); });
    var ids = Object.keys(set);
    if (opt.hideDone) ids = ids.filter(function (id) { return statusOf(id) !== 'done'; });
    return ids.sort(rankSort);
  }

  /* Prerequisite edges among a set of topics, reduced for drawing (a line is dropped when a longer chain already implies it). */
  function edgesAmong(ids) {
    var S = {}; ids.forEach(function (id) { S[id] = true; });
    var edges = [];
    ids.forEach(function (v) {
      hard(node(v)).forEach(function (u) { if (S[u]) edges.push({ from: u, to: v, soft: false }); });
      soft(node(v)).forEach(function (u) { if (S[u]) edges.push({ from: u, to: v, soft: true }); });
    });
    var hardAdj = {}, allAdj = {};
    ids.forEach(function (id) { hardAdj[id] = []; allAdj[id] = []; });
    edges.forEach(function (e) { allAdj[e.from].push(e.to); if (!e.soft) hardAdj[e.from].push(e.to); });
    function reachesIndirectly(adj, src, dst) {
      var stack = adj[src].filter(function (w) { return w !== dst; }), seen = {};
      stack.forEach(function (w) { seen[w] = true; });
      while (stack.length) {
        var v = stack.pop();
        if (v === dst) return true;
        adj[v].forEach(function (w) { if (!seen[w]) { seen[w] = true; stack.push(w); } });
      }
      return false;
    }
    return edges.filter(function (e) { return !reachesIndirectly(e.soft ? allAdj : hardAdj, e.from, e.to); });
  }

  /* ---------------------------------------------------------------- layered graph layout
     1. layers by longest path, then each topic is pulled down to just above its first dependant;
     2. long lines get virtual waypoints, one per skipped layer;
     3. barycentre sweeps order each layer to cut crossings (best ordering kept);
     4. positions: repeated isotonic regression places each node near its neighbours with a minimum gap. */
  function assignLayers(ids, edges) {
    var preds = {}, succs = {};
    ids.forEach(function (id) { preds[id] = []; succs[id] = []; });
    edges.forEach(function (e) { succs[e.from].push(e.to); preds[e.to].push(e.from); });
    var indeg = {}, queue = [], topo = [];
    ids.forEach(function (id) { indeg[id] = preds[id].length; if (!indeg[id]) queue.push(id); });
    while (queue.length) {
      var v = queue.shift(); topo.push(v);
      succs[v].forEach(function (s) { if (--indeg[s] === 0) queue.push(s); });
    }
    ids.forEach(function (id) { if (topo.indexOf(id) < 0) topo.push(id); });
    var layer = {};
    topo.forEach(function (v) { layer[v] = preds[v].reduce(function (m, p) { return Math.max(m, (layer[p] || 0) + 1); }, 0); });
    for (var i = topo.length - 1; i >= 0; i--) {
      var u = topo[i];
      if (succs[u].length) {
        var lim = Math.min.apply(null, succs[u].map(function (s) { return layer[s]; })) - 1;
        if (lim > layer[u]) layer[u] = lim;
      }
    }
    return { layer: layer, preds: preds, succs: succs };
  }

  function layoutGraph(ids, edges, o) {
    var TB = o.dir !== 'LR';
    var W = o.nodeW, H = o.nodeH, pad = o.pad, gutter = o.gutter || 0, DUMMY = 10;
    var major = TB ? H : W, minor = TB ? W : H;
    var gapMajor = o.gapMajor, gapMinor = o.gapMinor;
    var L0 = assignLayers(ids, edges), layer = L0.layer;
    var nLayers = ids.reduce(function (m, id) { return Math.max(m, layer[id] + 1); }, 1);
    var rows = []; for (var l = 0; l < nLayers; l++) rows.push([]);
    var lay = {}, isDummy = {}, up = {}, down = {}, dn = 0;
    function link(a, b) { (down[a] = down[a] || []).push(b); (up[b] = up[b] || []).push(a); }
    ids.forEach(function (id) { lay[id] = layer[id]; });
    var chains = edges.map(function (e) {
      var chain = [e.from], prev = e.from;
      for (var k = layer[e.from] + 1; k < layer[e.to]; k++) {
        var d = '~' + (dn++); isDummy[d] = true; lay[d] = k; link(prev, d); chain.push(d); prev = d;
      }
      link(prev, e.to); chain.push(e.to);
      return { e: e, chain: chain };
    });
    ids.forEach(function (id) { rows[lay[id]].push(id); });
    Object.keys(isDummy).forEach(function (d) { rows[lay[d]].push(d); });

    var pos = {};
    function index() { rows.forEach(function (r) { r.forEach(function (v, i) { pos[v] = i; }); }); }
    index();
    function bary(v, adj) { var n = adj[v]; if (!n || !n.length) return pos[v]; var s = 0; n.forEach(function (w) { s += pos[w]; }); return s / n.length; }
    function crossings() {
      var c = 0;
      for (var l = 0; l < nLayers - 1; l++) {
        var es = [];
        rows[l].forEach(function (u) { (down[u] || []).forEach(function (v) { es.push([pos[u], pos[v]]); }); });
        for (var i = 0; i < es.length; i++) for (var j = i + 1; j < es.length; j++) if ((es[i][0] - es[j][0]) * (es[i][1] - es[j][1]) < 0) c++;
      }
      return c;
    }
    function sweep(l, adj) {
      var b = {}; rows[l].forEach(function (v) { b[v] = bary(v, adj); });
      rows[l].sort(function (x, y) { return b[x] - b[y]; });
      rows[l].forEach(function (v, i) { pos[v] = i; });
    }
    var best = rows.map(function (r) { return r.slice(); }), bestC = crossings();
    for (var it = 0; it < 18; it++) {
      if (it % 2 === 0) for (var a = 1; a < nLayers; a++) sweep(a, up);
      else for (var b2 = nLayers - 2; b2 >= 0; b2--) sweep(b2, down);
      var c = crossings();
      if (c < bestC) { bestC = c; best = rows.map(function (r) { return r.slice(); }); }
    }
    rows = best; index();

    function size(v) { return isDummy[v] ? DUMMY : minor; }
    var x = {};
    rows.forEach(function (r) { var cur = 0; r.forEach(function (v, i) { if (i) cur += (size(r[i - 1]) + size(v)) / 2 + gapMinor; x[v] = cur; }); });
    function place(r, want) {
      var off = [0];
      for (var i = 1; i < r.length; i++) off[i] = off[i - 1] + (size(r[i - 1]) + size(r[i])) / 2 + gapMinor;
      var blocks = [];
      r.forEach(function (v, i) {
        blocks.push({ s: want[i] - off[i], n: 1 });
        while (blocks.length > 1) {
          var bb = blocks[blocks.length - 1], aa = blocks[blocks.length - 2];
          if (aa.s / aa.n > bb.s / bb.n) { aa.s += bb.s; aa.n += bb.n; blocks.pop(); } else break;
        }
      });
      var k = 0;
      blocks.forEach(function (blk) { for (var j = 0; j < blk.n; j++, k++) x[r[k]] = blk.s / blk.n + off[k]; });
    }
    function avg(v, adj) { var n = adj[v]; if (!n || !n.length) return x[v]; var s = 0; n.forEach(function (w) { s += x[w]; }); return s / n.length; }
    for (var pass = 0; pass < 12; pass++) {
      for (var p1 = 1; p1 < nLayers; p1++) place(rows[p1], rows[p1].map(function (v) { return avg(v, up); }));
      for (var p2 = nLayers - 2; p2 >= 0; p2--) place(rows[p2], rows[p2].map(function (v) { return avg(v, down); }));
    }
    for (var p3 = 0; p3 < nLayers; p3++) {
      place(rows[p3], rows[p3].map(function (v) {
        var n = (up[v] || []).concat(down[v] || []);
        if (!n.length) return x[v];
        var s = 0; n.forEach(function (w) { s += x[w]; }); return s / n.length;
      }));
    }
    var min = Infinity, max = -Infinity;
    Object.keys(x).forEach(function (v) { min = Math.min(min, x[v] - size(v) / 2); max = Math.max(max, x[v] + size(v) / 2); });
    var shift = pad + gutter - min;
    function cross(v) { return x[v] + shift; }
    function majorStart(l) { return pad + l * (major + gapMajor); }

    var boxes = {};
    ids.forEach(function (id) {
      var cc = cross(id), m = majorStart(lay[id]);
      boxes[id] = TB ? { x: cc - W / 2, y: m, w: W, h: H, c: cc, layer: lay[id] } : { x: m, y: cc - H / 2, w: W, h: H, c: cc, layer: lay[id] };
    });

    // spread line ends along a node edge so parallel lines stay readable
    var outs = {}, ins = {};
    chains.forEach(function (ch) {
      var s = ch.chain[0], t = ch.chain[ch.chain.length - 1];
      (outs[s] = outs[s] || []).push(ch); (ins[t] = ins[t] || []).push(ch);
    });
    function spread(list, key, set) {
      list.sort(function (p, q) { return key(p) - key(q); });
      var k = list.length, step = Math.min(14, (minor - 36) / Math.max(1, k - 1));
      list.forEach(function (ch, i) { set(ch, (i - (k - 1) / 2) * step); });
    }
    var dot = o.dot;   // station mode: lines start and end at a dot this far into the box (along the layer axis)
    if (dot == null) {
      Object.keys(outs).forEach(function (s) { spread(outs[s], function (ch) { return cross(ch.chain[1]); }, function (ch, v) { ch.o1 = v; }); });
      Object.keys(ins).forEach(function (t) { spread(ins[t], function (ch) { return cross(ch.chain[ch.chain.length - 2]); }, function (ch, v) { ch.o2 = v; }); });
    } else chains.forEach(function (ch) { ch.o1 = 0; ch.o2 = 0; });

    var lines = chains.map(function (ch) {
      var a = boxes[ch.chain[0]], b = boxes[ch.chain[ch.chain.length - 1]];
      var pts = [], kinds = [];
      if (dot != null) pts.push(TB ? [a.c, a.y + dot] : [a.x + dot, a.c]);
      else if (TB) pts.push([a.c + ch.o1, a.y + a.h]); else pts.push([a.x + a.w, a.c + ch.o1]);
      kinds.push('start');
      ch.chain.slice(1, -1).forEach(function (d) {
        var cc = cross(d), m = majorStart(lay[d]);
        if (TB) { pts.push([cc, m]); kinds.push('curve'); pts.push([cc, m + major]); kinds.push('line'); }
        else { pts.push([m, cc]); kinds.push('curve'); pts.push([m + major, cc]); kinds.push('line'); }
      });
      if (dot != null) pts.push(TB ? [b.c, b.y + dot] : [b.x + dot, b.c]);
      else if (TB) pts.push([b.c + ch.o2, b.y]); else pts.push([b.x, b.c + ch.o2]);
      kinds.push('curve');
      var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var p0 = pts[i - 1], q = pts[i];
        if (kinds[i] === 'line') d += ' L' + q[0].toFixed(1) + ',' + q[1].toFixed(1);
        else if (TB) { var my = (p0[1] + q[1]) / 2; d += ' C' + p0[0].toFixed(1) + ',' + my.toFixed(1) + ' ' + q[0].toFixed(1) + ',' + my.toFixed(1) + ' ' + q[0].toFixed(1) + ',' + q[1].toFixed(1); }
        else { var mx = (p0[0] + q[0]) / 2; d += ' C' + mx.toFixed(1) + ',' + p0[1].toFixed(1) + ' ' + mx.toFixed(1) + ',' + q[1].toFixed(1) + ' ' + q[0].toFixed(1) + ',' + q[1].toFixed(1); }
      }
      return { from: ch.e.from, to: ch.e.to, soft: ch.e.soft, weight: ch.e.weight, d: d };
    });

    var span = max - min + 2 * pad + gutter;
    var depth = 2 * pad + nLayers * major + (nLayers - 1) * gapMajor;
    return {
      boxes: boxes, lines: lines, layers: nLayers, TB: TB,
      width: TB ? span : depth, height: TB ? depth : span,
      layerStart: majorStart, layerSize: major,
    };
  }

  /* ---------------------------------------------------------------- shared fragments */
  function badge(pid, cls) {
    var p = pathOf(pid);
    return '<span class="badge' + (cls ? ' ' + cls : '') + '" style="--pc:var(--pc-' + esc(pid) + ')" aria-hidden="true">' + esc(p ? p.code : '?') + '</span>';
  }
  function topicLink(id, extraCls) {
    if (!has(id)) return '<span class="tlink is-off" title="Part of a path that is not published yet">' + esc(id.replace(/-/g, ' ')) + '</span>';
    var n = node(id), st = statusOf(id);
    return '<a class="tlink' + (st === 'done' ? ' is-done' : '') + (extraCls ? ' ' + extraCls : '') + '" href="#n-' + esc(id) + '" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<span class="dot"></span>' + esc(n.title) + (st === 'done' ? icon('check') : '') + '</a>';
  }
  function chipsFor(r) {
    var out = ['<span class="chip">' + esc(KIND[r.kind] || r.kind) + '</span>'];
    if (r.access) out.push('<span class="chip ' + (r.access === 'paid' ? 'chip-paid' : r.access === 'free' ? 'chip-free' : '') + '">' + esc(ACCESS[r.access] || r.access) + '</span>');
    if (r.verified === false) out.push('<span class="chip chip-warn" title="This link could not be opened when the data was last checked">Link unchecked</span>');
    return '<div class="chips">' + out.join('') + '</div>';
  }
  function shortTerm(t) { return String(t || '').split(' (')[0].split('; ')[0]; }
  function courseFacts(r) {
    var c = r.course; if (!c) return '';
    var rows = [];
    rows.push('<div><dt>Latest run</dt><dd title="' + esc(c.latest_term) + '">' + (c.latest_url ? ext(c.latest_url, esc(shortTerm(c.latest_term))) : esc(shortTerm(c.latest_term))) + '</dd></div>');
    var lec;
    var pubTerm = termish(c.public_videos_term) ? shortTerm(c.public_videos_term) : '';
    if (c.videos === 'public') {
      lec = '<span class="is-public">' + icon('play') + ' ' + esc(VIDEOS.public) + '</span>';
      if (c.public_videos_url) lec += ' · ' + ext(c.public_videos_url, esc(pubTerm && pubTerm !== shortTerm(c.latest_term) ? 'recordings from ' + pubTerm : 'recordings'));
    } else {
      lec = esc(VIDEOS[c.videos] || VIDEOS.unknown);
      if (c.public_videos_url) lec += ' · ' + ext(c.public_videos_url, icon('play') + ' public recordings' + (pubTerm ? ' from ' + esc(pubTerm) : ''));
    }
    rows.push('<div><dt>Lectures</dt><dd>' + lec + '</dd></div>');
    var asg = esc(ASSIGN[c.assignments] || ASSIGN.unknown);
    if (c.assignments_url) asg = ext(c.assignments_url, asg);
    rows.push('<div><dt>Assignments</dt><dd>' + asg + '</dd></div>');
    return '<dl class="facts">' + rows.join('') + '</dl>';
  }
  function alsoUsed(r, nid) {
    var list = (ix.byUrl[urlKey(r.url)] || []).filter(function (u) { return u.node !== nid; });
    var seen = {}; list = list.filter(function (u) { if (seen[u.node]) return false; seen[u.node] = true; return true; });
    if (!list.length) return '';
    var shown = list.slice(0, 5).map(function (u) { return topicLink(u.node); }).join('');
    return '<div class="also"><span class="k">Also used in</span>' + shown + (list.length > 5 ? '<span>and ' + (list.length - 5) + ' more</span>' : '') + '</div>';
  }
  function tick(nid, rid) {
    var on = !!(checks[nid] && checks[nid][rid]);
    return '<label class="tick"><input type="checkbox" data-check="' + esc(nid) + '|' + esc(rid) + '"' + (on ? ' checked' : '') + '> Done</label>';
  }
  function statusControl(id) {
    var st = statusOf(id);
    return '<div class="seg status" role="group" aria-label="Progress for this topic">' +
      ['todo', 'doing', 'done'].map(function (v) {
        return '<button type="button" data-status="' + v + '" data-node="' + esc(id) + '" aria-pressed="' + (st === v) + '">' +
          icon(v === 'done' ? 'check' : v === 'doing' ? 'half' : 'circle') + esc(STATUS[v]) + '</button>';
      }).join('') + '</div>';
  }
  function cycleButton(id) {
    var st = statusOf(id);
    return '<button type="button" class="cycle is-' + st + '" data-cycle="' + esc(id) + '" title="Change progress">' +
      icon(st === 'done' ? 'check' : st === 'doing' ? 'half' : 'circle') + esc(STATUS[st]) + '</button>';
  }

  /* ---------------------------------------------------------------- home */
  var HOW = [
    ['Every topic names its picks', 'One primary text and, where a good one exists, one primary course, plus practice and resources that fill specific gaps.'],
    ['Lines are prerequisites', 'A solid line means you need the earlier topic; a dashed one means it helps.'],
    ['Paths share topics', 'Mark what you already know and every path shortens to the route that is left.'],
  ];
  function familyTitle(p) { return (D.families.filter(function (f) { return f.id === p.family; })[0] || {}).title || ''; }
  function pathDone(pid) { return routeIds(pid, { scope: 'path' }).filter(function (id) { return statusOf(id) === 'done'; }).length; }
  function homeView() {
    var pub = D.paths.filter(function (p) { return p.published; });
    var first = pub[0], next = first ? nextUp(first.id)[0] : null;
    var head = '<div class="side-head"><div class="side-info">' +
      '<p class="eyebrow">' + (D.site.preview ? pub.length + ' of ' + D.stats.paths + ' paths published' : 'Computer science, mapped') + '</p>' +
      '<h1 class="side-title">' + esc(D.site.title) + '</h1>' +
      '<p class="side-desc">' + esc(D.site.tagline) + '</p>' +
      '<p class="meta"><b>' + D.stats.paths + '</b> paths · <b>' + D.stats.topics + '</b> topics · <b>' + D.stats.resources.toLocaleString('en-US') + '</b> resources</p></div><div class="side-act">' +
      (first ? '<a class="btn btn-primary btn-block btn-go" href="#p-' + esc(first.id) + '"><span class="ell">Start with ' + esc(first.title) + '</span>' + icon('arrow-right') + '</a>' : '') +
      (next ? '<p class="meta faint">First stop: <a href="#n-' + esc(next) + '">' + esc(node(next).title) + '</a></p>' : '') + '</div></div>';
    var list = '<nav class="outline-list" aria-label="Paths">' + D.families.map(function (f, i) {
      return '<div class="ogroup"><div class="ohead"><span class="n">' + pad2(i + 1) + '</span><span>' + esc(f.title) + '</span><span class="c">' + f.paths.length + '</span></div>' +
        f.paths.map(function (pid) {
          var p = pathOf(pid), done = p.published ? pathDone(pid) : 0;
          var inner = badge(pid) + '<span class="t">' + esc(p.title) + '</span><span class="c">' + (done ? '<b>' + done + '</b>/' : '') + p.count + '</span>';
          return p.published
            ? '<a class="orow orow-path" data-path="' + esc(pid) + '" href="#p-' + esc(pid) + '" title="' + esc(p.tagline) + '">' + inner + '</a>'
            : '<span class="orow orow-path is-off" data-path="' + esc(pid) + '" title="Not published yet">' + inner + '</span>';
        }).join('') + '</div>';
    }).join('') + '<p class="side-foot"><a href="#about">' + icon('info') + 'How to read the roadmap</a></p></nav>';
    ui.peek = first ? first.id : D.paths[0].id;
    var pane = '<div class="pane pane-home">' +
      '<div class="home-canvas" id="home-canvas"><p class="canvas-tag eyebrow">System map · ' + D.stats.paths + ' lines</p>' + overviewGraph() + '</div>' +
      '<div class="home-strip"><div class="peek" id="peek">' + peekHtml(ui.peek) + '</div>' +
      HOW.map(function (h, i) { return '<div class="how"><span class="n">' + pad2(i + 1) + '</span><b>' + esc(h[0]) + '</b><p>' + esc(h[1]) + '</p></div>'; }).join('') + '</div></div>';
    return '<div class="shell"><aside class="side" id="side" data-key="home" aria-label="Paths">' + head + list + '</aside>' + pane + '</div>';
  }
  // the card under the system map: the path last pointed at (Core CS until then)
  function peekHtml(pid) {
    var p = pathOf(pid), done = p.published ? pathDone(pid) : 0;
    return '<div class="peek-head" style="--pc:var(--pc-' + esc(pid) + ')">' + badge(pid, 'badge-lg') + '<div><p class="eyebrow">' + esc(familyTitle(p)) + ' path</p><b>' + esc(p.title) + '</b></div></div>' +
      '<p class="peek-tag">' + esc(p.tagline) + '</p>' +
      '<div class="peek-foot"><span class="meta">' + plural(p.count, 'topic') + (done ? ' · <b>' + done + '</b> done' : '') + '</span>' +
      (p.published ? '<a class="btn btn-sm" href="#p-' + esc(pid) + '">Open path' + icon('arrow-right') + '</a>' : '<span class="meta">Not published yet</span>') + '</div>';
  }

  function monthYear(iso) {
    var m = /^(\d{4})-(\d{2})/.exec(String(iso || ''));
    if (!m) return '—';
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1] + ' ' + m[1];
  }

  function overviewGraph() {
    var ids = D.paths.map(function (p) { return p.id; });
    var edges = D.pathLinks.map(function (l) { return { from: l.from, to: l.to, soft: false, weight: l.weight }; });
    var LR = window.matchMedia('(min-width: 1000px)').matches;   // left to right fills a wide canvas; top to bottom suits phones
    var lay = layoutGraph(ids, edges, LR ? { dir: 'LR', nodeW: 214, nodeH: 54, gapMajor: 120, gapMinor: 24, pad: 24 } : { dir: 'TB', nodeW: 204, nodeH: 52, gapMajor: 66, gapMinor: 18, pad: 24 });
    var maxW = D.pathLinks.reduce(function (m, l) { return Math.max(m, l.weight); }, 1);
    var svg = '<svg class="map-edges" width="' + lay.width + '" height="' + lay.height + '" viewBox="0 0 ' + lay.width + ' ' + lay.height + '">' +
      lay.lines.map(function (e) {
        var w = 1.5 + 3.5 * Math.sqrt(e.weight / maxW);
        return '<path class="edge" data-from="' + esc(e.from) + '" data-to="' + esc(e.to) + '" style="--line-color:var(--pc-' + esc(e.from) + ');stroke-width:' + w.toFixed(1) + 'px" d="' + e.d + '"><title>' + esc(pathOf(e.from).short + ' → ' + pathOf(e.to).short + ': ' + plural(e.weight, 'prerequisite')) + '</title></path>';
      }).join('') + '</svg>';
    var nodes = ids.map(function (pid) {
      var p = pathOf(pid), b = lay.boxes[pid];
      var inner = badge(pid) + '<span class="onode-t"><b>' + esc(p.short) + '</b><small>' + plural(p.count, 'topic') + '</small></span>';
      var style = 'left:' + b.x + 'px;top:' + b.y + 'px;width:' + b.w + 'px;height:' + b.h + 'px;--pc:var(--pc-' + esc(pid) + ')';
      return p.published
        ? '<a class="onode" data-path="' + esc(pid) + '" href="#p-' + esc(pid) + '" style="' + style + '">' + inner + '</a>'
        : '<div class="onode is-off" data-path="' + esc(pid) + '" style="' + style + '" title="Not published yet">' + inner + '</div>';
    }).join('');
    return '<div class="overview" id="overview"><div class="overview-sizer" style="width:' + lay.width + 'px;height:' + lay.height + 'px">' +
      '<div class="overview-canvas" data-w="' + lay.width + '" data-h="' + lay.height + '" style="width:' + lay.width + 'px;height:' + lay.height + 'px">' + svg + nodes + '</div></div></div>';
  }
  // fit the system map to its pane (both ways on wide screens); on narrow screens it fits the width and may scroll sideways
  function fitOverview() {
    var box = $('#home-canvas'), sizer = $('.overview-sizer'), canvas = $('.overview-canvas');
    if (!box || !sizer || !canvas) return;
    var w = +canvas.getAttribute('data-w'), h = +canvas.getAttribute('data-h');
    var cs = getComputedStyle(box);
    var aw = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var ah = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var s = aw / w;
    if (isWide()) s = Math.min(s, ah / h);
    s = Math.max(isWide() ? 0.5 : 0.62, Math.min(1.12, s));
    sizer.style.width = (w * s) + 'px';
    sizer.style.height = (h * s) + 'px';
    canvas.style.transform = 'scale(' + s + ')';
  }
  function overviewHighlight(pid) {
    var ov = $('#overview'); if (!ov) return;
    $$('.is-hl', ov).forEach(function (el) { el.classList.remove('is-hl'); });
    if (!pid) { ov.classList.remove('has-hl'); return; }
    ov.classList.add('has-hl');
    function mark(id) { $$('.onode[data-path="' + id + '"]', ov).forEach(function (n) { n.classList.add('is-hl'); }); }
    mark(pid);
    $$('.edge', ov).forEach(function (e) {
      var f = e.getAttribute('data-from'), t = e.getAttribute('data-to');
      if (f === pid || t === pid) { e.classList.add('is-hl'); mark(f === pid ? t : f); }
    });
  }

  /* ---------------------------------------------------------------- path page */
  /* The route in reading order: stages (prerequisite layers), topics numbered through the whole route. */
  var orderCache = {};
  function routeOrder(pid) {
    var key = pid + '|' + settings.scope;
    if (orderCache[key]) return orderCache[key];
    var all = routeIds(pid);
    var L = assignLayers(all, edgesAmong(all)).layer;
    var byLayer = [];
    all.forEach(function (id) { (byLayer[L[id]] = byLayer[L[id]] || []).push(id); });
    var stages = byLayer.filter(Boolean), order = [], num = {}, stageOf = {};
    stages.forEach(function (list, s) { list.forEach(function (id) { order.push(id); num[id] = order.length; stageOf[id] = s + 1; }); });
    orderCache[key] = { all: all, stages: stages, order: order, num: num, stageOf: stageOf };
    return orderCache[key];
  }

  /* Sidebar for a path (ctx: map, guide, courses or topic): what the path is, progress, the next step, and the numbered outline. */
  function pathSide(pid, ctx, selId) {
    var p = pathOf(pid), o = routeOrder(pid), wide = isWide();
    var own = o.all.filter(function (id) { return node(id).paths.indexOf(pid) >= 0; }).length;
    var extern = o.all.length - own;
    var done = o.all.filter(function (id) { return statusOf(id) === 'done'; }).length;
    var pct = o.all.length ? Math.round(100 * done / o.all.length) : 0;
    function href(id) {
      if (ctx === 'map') return wide ? '#p-' + pid + '--map--' + id : '#n-' + id;
      if (ctx === 'guide') return '#p-' + pid + '--guide--' + id;
      return '#n-' + id;
    }
    var head;
    if (ctx === 'topic' && !wide) {
      head = '<div class="side-mini"><a href="#p-' + esc(pid) + '">' + badge(pid) + '<span class="ell">' + esc(p.title) + '</span></a><span class="meta">' + (o.num[selId] ? pad2(o.num[selId]) + ' / ' + o.order.length : '') + '</span></div>';
    } else {
      var ready = nextUp(pid), next = ready[0];
      head = '<div class="side-head"><div class="side-info">' +
        (ctx === 'topic' ? '' : '<a class="side-back" href="#home">' + icon('arrow-left') + 'All paths</a>') +
        '<p class="eyebrow">' + badge(pid) + esc(familyTitle(p)) + ' path</p>' +
        '<h1 class="side-title">' + (ctx === 'topic' ? '<a href="#p-' + esc(pid) + '">' + esc(p.title) + '</a>' : esc(p.title)) + '</h1>' +
        (ctx === 'topic' ? '' : '<p class="side-desc">' + esc(p.tagline) + '</p>') +
        '<p class="meta">' + [plural(own, 'topic'), extern ? extern + ' borrowed' : '', plural(o.stages.length, 'stage')].filter(Boolean).join(' · ') + '</p></div>' +
        '<div class="side-act"><div class="progress" role="img" aria-label="' + done + ' of ' + o.all.length + ' topics done"><span style="width:' + pct + '%"></span></div>' +
        '<p class="meta"><b>' + done + '</b> / ' + o.all.length + ' done' + (pct ? ' · ' + pct + '%' : '') + '</p>' +
        (ctx === 'topic' ? '' : next
          ? '<a class="btn btn-primary btn-block btn-go" href="#n-' + esc(next) + '"><span class="ell">' + (statusOf(next) === 'doing' ? 'Continue: ' : 'Start: ') + esc(node(next).title) + '</span>' + icon('arrow-right') + '</a>' +
            (ready.length > 1 ? '<p class="meta faint">Also ready: ' + ready.slice(1, 3).map(function (id) { return '<a href="#n-' + esc(id) + '">' + esc(node(id).title) + '</a>'; }).join(' · ') + '</p>' : '')
          : '<p class="meta">Everything on this route is done.</p>') +
        '<nav class="seg seg-block" aria-label="Views">' + Object.keys(VIEWS).map(function (v) {
          return '<a href="#p-' + esc(pid) + '--' + v + '"' + (v === ctx ? ' aria-current="page"' : '') + '>' + icon(v === 'map' ? 'map' : v === 'guide' ? 'list' : 'library') + VIEWS[v] + '</a>';
        }).join('') + '</nav>' +
        (ctx === 'map' || ctx === 'guide'
          ? '<div class="side-tools"><button type="button" class="btn btn-sm" data-action="start">' + icon('flag') + 'Starting point</button>' +
            '<label class="switch"><input type="checkbox" data-toggle="hideDone"' + (settings.hideDone ? ' checked' : '') + '>Hide done</label></div>' : '') +
        '</div></div>';
    }
    var rows = o.stages.map(function (list, s) {
      return '<div class="ogroup"><div class="ohead"><span class="n">' + pad2(s + 1) + '</span><span>Stage ' + (s + 1) + '</span><span class="c">' + list.length + '</span></div>' +
        list.map(function (id) {
          var n = node(id), st = statusOf(id), isExt = n.paths.indexOf(pid) < 0, sel = id === selId;
          return '<a class="orow is-' + st + (isExt ? ' is-ext' : '') + (n.optional ? ' is-opt' : '') + (sel ? ' is-sel' : '') + '" data-id="' + esc(id) + '" href="' + href(id) + '" style="--pc:var(--pc-' + esc(homeOf(n)) + ')"' + (sel ? ' aria-current="true"' : '') + ' title="' + esc(STATUS[st] + (isExt ? ' · from ' + pathOf(homeOf(n)).short : '')) + '">' +
            '<span class="st"></span><span class="n">' + pad2(o.num[id]) + '</span><span class="t">' + esc(n.title) + '</span>' +
            (isExt ? '<span class="x">' + esc(pathOf(homeOf(n)).code) + '</span>' : n.optional ? '<span class="x x-opt">opt</span>' : '') + '</a>';
        }).join('') + '</div>';
    }).join('');
    var dest = '<div class="odest"><p class="eyebrow">' + icon('flag') + 'Where it leaves you</p><p>' + esc(p.destination) + '</p></div>';
    return head + '<details class="outline"' + (wide ? ' open' : '') + '><summary><span>Outline · ' + plural(o.all.length, 'topic') + '</span>' + icon('arrow-down') + '</summary>' +
      '<div class="outline-body">' + rows + dest + '</div></details>';
  }

  function pathView(pid, view, sel) {
    var pane = view === 'guide' ? '<div class="pane"><div class="doc">' + guideBody(pid, sel) + '</div></div>'
      : view === 'courses' ? '<div class="pane"><div class="doc">' + coursesBody(pid) + '</div></div>'
      : '<div class="pane pane-map">' + mapBody(pid, sel) + '</div>';
    return '<div class="shell" style="--pc:var(--pc-' + esc(pid) + ')"><aside class="side" id="side" data-key="path:' + esc(pid) + '" aria-label="Path outline">' +
      pathSide(pid, view, sel) + '</aside>' + pane + '</div>';
  }

  /* map */
  function mapIds(pid) { return routeIds(pid, { hideDone: settings.hideDone }); }
  function mapKey(pid) { return [pid, dirNow(), settings.lines, settings.scope, settings.hideDone, settings.hideDone ? JSON.stringify(progress) : ''].join('|'); }

  function mapBody(pid, sel) {
    var ids = mapIds(pid);
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
    var legend = '<div class="map-legend">' +
      '<span class="lg"><span class="lg-stn" style="--pc:var(--pc-' + esc(pid) + ')"></span>This path</span>' +
      (settings.scope === 'route' ? '<span class="lg"><span class="lg-stn is-ext"></span>From another path</span>' : '') +
      '<span class="lg"><span class="lg-stn is-opt" style="--pc:var(--pc-' + esc(pid) + ')"></span>Optional</span>' +
      '<span class="lg"><span class="lg-line"></span>Required</span>' +
      (settings.lines === 'all' ? '<span class="lg"><span class="lg-line is-soft"></span>Helpful</span>' : '') +
      '<span class="lg lg-hint">Drag to move · ' + (mac ? '⌘' : 'Ctrl') + ' + scroll to zoom</span></div>';
    var tools = '<div class="map-tools">' +
      '<div class="seg seg-soft" role="group" aria-label="Lines"><button type="button" data-set="lines" data-value="required" aria-pressed="' + (settings.lines === 'required') + '">Required</button><button type="button" data-set="lines" data-value="all" aria-pressed="' + (settings.lines === 'all') + '">+ Helpful</button></div>' +
      '<div class="seg seg-soft seg-icons" role="group" aria-label="Direction"><button type="button" data-set="dir" data-value="TB" aria-pressed="' + (dirNow() === 'TB') + '" title="Top to bottom">' + icon('arrow-down') + '</button><button type="button" data-set="dir" data-value="LR" aria-pressed="' + (dirNow() === 'LR') + '" title="Left to right">' + icon('arrow-right') + '</button></div>' +
      '<div class="seg seg-soft seg-icons" role="group" aria-label="Zoom"><button type="button" data-action="zoom-out" title="Zoom out">' + icon('minus') + '</button><button type="button" data-action="zoom-fit" title="Fit">' + icon('fit') + '</button><button type="button" data-action="zoom-in" title="Zoom in">' + icon('plus') + '</button></div>' +
      '</div>';
    if (!ids.length) return '<div class="mapbox"><div class="map-empty"><p>Every topic on this route is marked done.</p><p class="meta">Turn off “Hide done” in the sidebar to see the whole map.</p></div></div>';
    var selOk = sel && ids.indexOf(sel) >= 0 ? sel : null, open = selOk && isWide();
    return '<div class="mapbox' + (open ? ' has-drawer' : '') + '" id="mapbox">' +
      '<div class="map-vp" id="map-vp" tabindex="0" aria-label="Prerequisite map. The Guide view lists the same topics.">' +
      '<div class="map-sizer" id="map-sizer">' + mapCanvas(pid, ids) + '</div></div>' + legend + tools +
      '<aside class="drawer" id="drawer" aria-label="Topic details"' + (open ? '' : ' hidden') + '>' + (selOk ? drawerHtml(selOk, pid) : '') + '</aside></div>';
  }

  function mapCanvas(pid, ids) {
    var TB = dirNow() === 'TB';
    var lay = layoutGraph(ids, edgesAmong(ids), {
      dir: dirNow(), nodeW: TB ? 184 : 214, nodeH: TB ? 84 : 60, gapMajor: TB ? 34 : 62, gapMinor: TB ? 16 : 10,
      pad: 28, gutter: TB ? 56 : 30, dot: 9,
    });
    ui.lay = lay;
    var showSoft = settings.lines === 'all';
    var svg = '<svg class="map-edges" width="' + lay.width + '" height="' + lay.height + '" viewBox="0 0 ' + lay.width + ' ' + lay.height + '">' +
      lay.lines.filter(function (e) { return showSoft || !e.soft; }).map(function (e) {
        return '<path class="edge' + (e.soft ? ' is-soft' : '') + '" data-from="' + esc(e.from) + '" data-to="' + esc(e.to) + '" style="--line-color:var(--pc-' + esc(homeOf(node(e.from))) + ')" d="' + e.d + '"></path>';
      }).join('') + '</svg>';
    var labels = '';
    for (var l = 0; l < lay.layers; l++) {
      var at = lay.layerStart(l);
      labels += TB
        ? '<span class="stage-label" style="left:14px;top:' + (at + lay.layerSize / 2 - 6) + 'px">S' + (l + 1) + '</span>'
        : '<span class="stage-label" style="top:16px;left:' + at + 'px">Stage ' + pad2(l + 1) + '</span>';
    }
    var nodes = ids.map(function (id) {
      var n = node(id), b = lay.boxes[id], st = statusOf(id), isExt = n.paths.indexOf(pid) < 0;
      var cls = ['gnode', TB ? 'is-tb' : 'is-lr', isExt ? 'is-ext' : 'is-own', n.optional ? 'is-opt' : '', st !== 'todo' ? 'is-' + st : '', ui.selected === id ? 'is-sel' : ''].filter(Boolean).join(' ');
      var kicker = isExt ? pathOf(homeOf(n)).short : (LEVEL[n.level] || '');
      if (n.optional) kicker += ' · optional';
      var mark = st === 'done' ? icon('check', 'ic-done') : st === 'doing' ? icon('half', 'ic-doing') : '';
      return '<button type="button" class="' + cls + '" data-node="' + esc(id) + '" style="left:' + b.x.toFixed(1) + 'px;top:' + b.y.toFixed(1) + 'px;width:' + b.w + 'px;height:' + b.h + 'px;--pc:var(--pc-' + esc(homeOf(n)) + ')" ' +
        'aria-label="' + esc(n.title + (isExt ? ', prerequisite from ' + pathOf(homeOf(n)).short : '') + ', stage ' + (b.layer + 1) + ', ' + STATUS[st]) + '">' +
        '<span class="stn-dot"></span><span class="stn-label"><span class="stn-kicker">' + mark + esc(kicker) + '</span>' +
        '<span class="stn-name">' + esc(n.title) + '</span></span></button>';
    }).join('');
    return '<div class="map-canvas" id="map-canvas" style="width:' + lay.width + 'px;height:' + lay.height + 'px">' + labels + svg + nodes + '</div>';
  }

  function setScale(s, anchor) {
    var vp = $('#map-vp'), sizer = $('#map-sizer'), canvas = $('#map-canvas');
    if (!vp || !sizer || !canvas || !ui.lay) return;
    s = Math.max(0.35, Math.min(1.6, s));
    var old = ui.scale || s;
    var ax = anchor ? anchor.x : vp.clientWidth / 2, ay = anchor ? anchor.y : vp.clientHeight / 2;
    var cx = (vp.scrollLeft + ax) / old, cy = (vp.scrollTop + ay) / old;
    ui.scale = s;
    sizer.style.width = (ui.lay.width * s) + 'px';
    sizer.style.height = (ui.lay.height * s) + 'px';
    canvas.style.transform = 'scale(' + s + ')';
    vp.scrollLeft = cx * s - ax;
    vp.scrollTop = cy * s - ay;
  }
  function fitScale() {
    var vp = $('#map-vp'); if (!vp || !ui.lay) return 1;
    var fit = (vp.clientWidth - 4) / ui.lay.width;
    if (!ui.lay.TB) fit = Math.min(fit, (vp.clientHeight - 4) / ui.lay.height);
    return Math.max(0.3, Math.min(1, fit));
  }
  function setupMap(pid, keepView) {
    var vp = $('#map-vp'); if (!vp) return;
    var key = mapKey(pid);
    var prev = keepView && ui.mapKey === key ? { s: ui.scale, l: ui.scrollL, t: ui.scrollT } : null;
    ui.mapKey = key;
    if (prev && prev.s) {
      ui.scale = prev.s; setScale(prev.s); vp.scrollLeft = prev.l; vp.scrollTop = prev.t;
    } else {
      // open at a readable size; the Fit button zooms out to the whole route
      // left-to-right maps on wide screens open as large as the window height allows (up to full size), so labels stay readable
      var f = Math.max(isWide() ? 0.74 : 0.62, fitScale());
      if (isWide() && !ui.lay.TB) f = Math.max(0.74, Math.min(1, (vp.clientHeight - 8) / ui.lay.height));
      ui.scale = null; ui.scale = f; setScale(f); vp.scrollLeft = 0; vp.scrollTop = 0;
      // start on the first stage
      var first = Object.keys(ui.lay.boxes).map(function (k) { return ui.lay.boxes[k]; }).filter(function (b) { return b.layer === 0; });
      if (first.length) {
        var mid = first.reduce(function (s, b) { return s + b.c; }, 0) / first.length;
        if (ui.lay.TB) vp.scrollLeft = Math.max(0, mid * f - vp.clientWidth / 2);
        else vp.scrollTop = Math.max(0, mid * f - vp.clientHeight / 2);
      }
    }
    vp.addEventListener('scroll', function () { ui.scrollL = vp.scrollLeft; ui.scrollT = vp.scrollTop; }, { passive: true });
    vp.addEventListener('wheel', function (ev) {
      if (!(ev.ctrlKey || ev.metaKey)) return;
      ev.preventDefault();
      var r = vp.getBoundingClientRect();
      setScale((ui.scale || 1) * Math.exp(-ev.deltaY * 0.0022), { x: ev.clientX - r.left, y: ev.clientY - r.top });
    }, { passive: false });
    var drag = null;
    vp.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType !== 'mouse' || ev.button !== 0 || ev.target.closest('.gnode')) return;
      drag = { x: ev.clientX, y: ev.clientY, l: vp.scrollLeft, t: vp.scrollTop, moved: false };
      vp.setPointerCapture(ev.pointerId);
    });
    vp.addEventListener('pointermove', function (ev) {
      if (!drag) return;
      var dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 3) { drag.moved = true; vp.classList.add('is-dragging'); }
      if (drag.moved) { vp.scrollLeft = drag.l - dx; vp.scrollTop = drag.t - dy; }
    });
    function end() { drag = null; vp.classList.remove('is-dragging'); }
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('mouseover', function (ev) { var g = ev.target.closest('.gnode'); if (g) highlight(g.dataset.node); });
    vp.addEventListener('mouseleave', function () { highlight(ui.selected); });
    vp.addEventListener('focusin', function (ev) { var g = ev.target.closest('.gnode'); if (g) highlight(g.dataset.node); });
    highlight(ui.selected);
    if (ui.selected) revealNode(ui.selected);
  }
  // bring a station into view, centred in the part of the map the detail card does not cover
  function revealNode(id) {
    var vp = $('#map-vp'), b = ui.lay && ui.lay.boxes[id]; if (!vp || !b) return;
    var dr = $('#drawer'), cover = dr && !dr.hidden ? dr.offsetWidth + 28 : 0;
    var vw = Math.max(240, vp.clientWidth - cover), s = ui.scale || 1;
    var x0 = b.x * s, y0 = b.y * s, x1 = (b.x + b.w) * s, y1 = (b.y + b.h) * s;
    var left = vp.scrollLeft, top = vp.scrollTop;
    if (x0 < left || x1 > left + vw) left = Math.max(0, (x0 + x1) / 2 - vw / 2);
    if (y0 < top || y1 > top + vp.clientHeight) top = Math.max(0, (y0 + y1) / 2 - vp.clientHeight / 2);
    var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (vp.scrollTo) vp.scrollTo({ left: left, top: top, behavior: smooth ? 'smooth' : 'auto' }); else { vp.scrollLeft = left; vp.scrollTop = top; }
  }
  function highlight(id) {
    var canvas = $('#map-canvas'); if (!canvas) return;
    $$('.is-hl', canvas).forEach(function (el) { el.classList.remove('is-hl'); });
    if (!id || !canvas.querySelector('[data-node="' + id + '"]')) { canvas.classList.remove('has-hl'); return; }
    var edges = $$('.edge', canvas), upAdj = {}, dnAdj = {};
    edges.forEach(function (e) {
      var f = e.getAttribute('data-from'), t = e.getAttribute('data-to');
      (dnAdj[f] = dnAdj[f] || []).push(e); (upAdj[t] = upAdj[t] || []).push(e);
    });
    var keep = {}; keep[id] = true;
    function walk(adj, end) {
      var stack = [id], seen = {}; seen[id] = true;
      while (stack.length) {
        var v = stack.pop();
        (adj[v] || []).forEach(function (e) {
          e.classList.add('is-hl');
          var w = e.getAttribute(end);
          keep[w] = true;
          if (!seen[w]) { seen[w] = true; stack.push(w); }
        });
      }
    }
    walk(upAdj, 'data-from'); walk(dnAdj, 'data-to');
    canvas.classList.add('has-hl');
    $$('.gnode', canvas).forEach(function (g) { if (keep[g.dataset.node]) g.classList.add('is-hl'); });
  }

  function drawerHtml(id, pid) {
    var n = node(id), o = routeOrder(pid);
    var t = pick(n, 'primary-text'), c = pick(n, 'primary-course');
    var practice = n.resources.filter(function (r) { return r.role === 'practice'; });
    var isExt = n.paths.indexOf(pid) < 0;
    var bits = [o.stageOf[id] ? 'Stage ' + pad2(o.stageOf[id]) : '', isExt ? 'From ' + pathOf(homeOf(n)).short : '', LEVEL[n.level] || '', n.optional ? 'Optional' : ''].filter(Boolean);
    return '<div class="drawer-inner" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<div class="drawer-top"><p class="eyebrow">' + badge(homeOf(n), 'badge-sm') + bits.map(function (x) { return esc(x); }).join(' · ') + (o.num[id] ? ' · <b>' + pad2(o.num[id]) + '</b> / ' + o.order.length : '') + '</p>' +
      '<button type="button" class="btn btn-quiet btn-sm btn-icon" data-action="close-drawer" aria-label="Close details">' + icon('close') + '</button></div>' +
      '<h2 class="drawer-title">' + esc(n.title) + '</h2>' +
      '<p class="meta">' + [t ? '1 text' : '', c ? '1 course' : 'no course', practice.length ? plural(practice.length, 'practice item') : '', hard(n).length ? 'needs ' + hard(n).length : 'no prerequisites'].filter(Boolean).join(' · ') + '</p>' +
      '<p class="drawer-scope">' + esc(n.scope) + '</p>' + statusControl(id) +
      (t ? pickCard(t, id, true) : '') + (c ? pickCard(c, id, true) : noCourse(n)) +
      (practice.length ? '<div class="drawer-block"><p class="eyebrow">Practice</p><div class="chips">' + practice.map(function (r) { return ext(r.url, esc(r.title), 'tlink'); }).join('') + '</div></div>' : '') +
      relations(id) +
      '<a class="btn btn-primary btn-block btn-go" href="#n-' + esc(id) + '"><span>Open the full topic</span>' + icon('arrow-right') + '</a></div>';
  }

  /* guide */
  function nextUp(pid) {
    var ids = routeIds(pid);
    var ready = ids.filter(function (id) {
      return statusOf(id) !== 'done' && hard(node(id)).every(function (p) { return statusOf(p) === 'done'; });
    });
    var L = assignLayers(ids, edgesAmong(ids)).layer;
    ready.sort(function (a, b) { return (statusOf(b) === 'doing') - (statusOf(a) === 'doing') || L[a] - L[b] || rankSort(a, b); });
    return ready;
  }
  function guideBody(pid, sel) {
    var p = pathOf(pid), o = routeOrder(pid);
    var ready = nextUp(pid);
    var html = '<header class="doc-head"><p class="eyebrow">Guide · ' + plural(o.all.length, 'topic') + ' · ' + plural(o.stages.length, 'stage') + '</p>' +
      '<h2 class="doc-title">The route, stage by stage</h2>' +
      '<p class="lede">A stage needs only the stages before it. Each topic names the text and the course to learn it from; open a topic for the chapters, lectures and practice to use.</p>' +
      '<div class="doc-tools"><div class="seg" role="group" aria-label="Layout"><button type="button" data-set="layout" data-value="cards" aria-pressed="' + (settings.layout === 'cards') + '">Cards</button><button type="button" data-set="layout" data-value="table" aria-pressed="' + (settings.layout === 'table') + '">Table</button></div></div></header>';
    html += '<div class="nextup"><p class="eyebrow">' + icon('flag') + 'Next up · ready to start</p><div class="chips">' +
      (ready.length ? ready.slice(0, 8).map(function (id) { return topicLink(id); }).join('') + (ready.length > 8 ? '<span class="chip">+' + (ready.length - 8) + ' more</span>' : '') : '<span class="meta">Everything on this route is done.</span>') + '</div></div>';
    if (p.exits && p.exits.length) {
      html += '<div class="exits">' + p.exits.map(function (ex) {
        return '<div class="exit"><p class="eyebrow">' + icon('flag') + 'Finish with</p><h3>' + esc(ex.title) + '</h3><p>' + esc(ex.text) + '</p><div class="chips">' + ex.nodes.map(function (id) { return topicLink(id); }).join('') + '</div></div>';
      }).join('') + '</div>';
    }
    var stages = o.stages.map(function (list) { return list.filter(function (id) { return !settings.hideDone || statusOf(id) !== 'done'; }); });
    if (!stages.some(function (l) { return l.length; })) return html + '<div class="empty-state">Every topic here is marked done.</div>';
    if (settings.layout === 'table') {
      html += '<div class="tablebox"><table class="gtable"><thead><tr><th>Topic</th><th>Primary text</th><th>Primary course</th><th>Lectures</th><th>Progress</th></tr></thead><tbody>' +
        stages.map(function (list, s) {
          return list.length ? '<tr class="is-stage"><td colspan="5">Stage ' + pad2(s + 1) + ' · ' + plural(o.stages[s].length, 'topic') + '</td></tr>' + list.map(function (id) { return guideRow(id, pid); }).join('') : '';
        }).join('') + '</tbody></table></div>';
    } else {
      html += stages.map(function (list, s) {
        if (!list.length) return '';
        return '<section class="stage"><div class="stage-head"><span class="n">' + pad2(s + 1) + '</span><b>Stage ' + (s + 1) + '</b><small>' + plural(o.stages[s].length, 'topic') + '</small></div>' +
          '<div class="cards">' + list.map(function (id) { return guideCard(id, pid, o.num[id], id === sel); }).join('') + '</div></section>';
      }).join('');
    }
    return html;
  }
  function lectureTag(n) {
    var c = pick(n, 'primary-course');
    if (!c) return '<span class="lect is-closed">' + icon('book') + 'Text only</span>';
    var co = c.course || {};
    if (co.videos === 'public') return '<span class="lect is-public">' + icon('play') + 'Public</span>';
    if (co.public_videos_url) return '<span class="lect is-public">' + icon('play') + (termish(co.public_videos_term) ? 'Public (' + esc(shortTerm(co.public_videos_term)) + ')' : 'Older public recordings') + '</span>';
    return '<span class="lect is-closed">' + icon('lock') + esc(VIDEOS[co.videos] || VIDEOS.unknown) + '</span>';
  }
  function guideCard(id, pid, num, isSel) {
    var n = node(id), t = pick(n, 'primary-text'), c = pick(n, 'primary-course'), isExt = n.paths.indexOf(pid) < 0, st = statusOf(id);
    var count = { practice: 0, secondary: 0 };
    n.resources.forEach(function (r) { if (count[r.role] != null) count[r.role]++; });
    var needs = hard(n);
    return '<article class="gcard is-' + st + (isExt ? ' is-ext' : '') + (isSel ? ' is-flash' : '') + '" id="g-' + esc(id) + '" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<div class="gcard-top"><p class="eyebrow"><span class="gnum">' + pad2(num) + '</span><span class="dot"></span>' + esc(isExt ? 'From ' + pathOf(homeOf(n)).short : LEVEL[n.level] || '') + (n.optional ? ' · optional' : '') + '</p>' + cycleButton(id) + '</div>' +
      '<a class="gcard-title" href="#n-' + esc(id) + '">' + esc(n.title) + '</a>' +
      '<p class="gcard-scope">' + esc(n.scope) + '</p>' +
      '<dl class="gpicks">' +
      (t ? '<div><dt>Text</dt><dd>' + ext(t.url, esc(t.title)) + '<span>' + esc(t.by || '') + '</span></dd></div>' : '') +
      '<div><dt>Course</dt><dd>' + (c ? ext(c.url, esc(c.title)) + lectureTag(n) : '<span>No course fits; learn it from the text</span>') + '</dd></div></dl>' +
      '<div class="gcard-foot"><span>' + [count.practice ? plural(count.practice, 'practice item') : '', count.secondary ? count.secondary + ' gap-filling' : '', needs.length ? 'needs ' + needs.length : 'no prerequisites'].filter(Boolean).join(' · ') + '</span>' +
      '<a href="#n-' + esc(id) + '">Open' + icon('arrow-right') + '</a></div></article>';
  }
  function guideRow(id, pid) {
    var n = node(id), t = pick(n, 'primary-text'), c = pick(n, 'primary-course'), isExt = n.paths.indexOf(pid) < 0;
    return '<tr class="' + (isExt ? 'is-ext' : '') + '"><td><a href="#n-' + esc(id) + '">' + esc(n.title) + '</a><div class="muted">' + esc(isExt ? 'From ' + pathOf(homeOf(n)).short : LEVEL[n.level] || '') + (n.optional ? ' · optional' : '') + '</div></td>' +
      '<td>' + (t ? ext(t.url, esc(t.title)) + '<div class="muted">' + esc(t.by || '') + '</div>' : '') + '</td>' +
      '<td>' + (c ? ext(c.url, esc(c.title)) + '<div class="muted">' + esc(shortTerm((c.course || {}).latest_term)) + '</div>' : '<span class="muted">Text only</span>') + '</td>' +
      '<td>' + lectureTag(n) + '</td><td>' + cycleButton(id) + '</td></tr>';
  }

  /* courses: every resource of the route, grouped by what it is (the anchor-course view) */
  function coursesBody(pid) {
    var ids = routeIds(pid);
    var groups = {};
    ids.forEach(function (id) {
      node(id).resources.forEach(function (r) {
        var k = urlKey(r.url);
        (groups[k] = groups[k] || []).push({ id: id, r: r });
      });
    });
    function cat(r) {
      if (r.kind === 'course' || r.kind === 'video-series') return 'courses';
      if (r.role === 'practice' || r.kind === 'practice-site') return 'practice';
      if (r.kind === 'book' || r.kind === 'paper' || r.kind === 'article') return 'texts';
      return 'web';
    }
    var list = Object.keys(groups).map(function (k) {
      var items = groups[k];
      var titles = {}; items.forEach(function (u) { titles[u.r.title] = (titles[u.r.title] || 0) + 1; });
      var title = Object.keys(titles).sort(function (a, b) { return titles[b] - titles[a] || a.length - b.length; })[0];
      var first = items.filter(function (u) { return u.r.title === title; })[0].r;
      var topics = {}; items.forEach(function (u) { topics[u.id] = true; });
      var primary = items.filter(function (u) { return u.r.role === 'primary-text' || u.r.role === 'primary-course'; }).length;
      var course = null; items.forEach(function (u) { if (!course && u.r.course) course = u.r; });
      return { key: k, items: items, title: title, first: first, topics: Object.keys(topics).length, primary: primary, cat: cat(first), course: course };
    });
    var f = ui.courseFilter;
    var shown = list.filter(function (g) {
      if (f === 'primary') return g.primary > 0;
      if (f === 'all') return true;
      return g.cat === f;
    }).sort(function (a, b) { return b.topics - a.topics || b.primary - a.primary || a.title.localeCompare(b.title); });
    var filters = [['primary', 'Primary picks'], ['courses', 'Courses'], ['texts', 'Books and papers'], ['practice', 'Practice'], ['web', 'Sites and docs'], ['all', 'Everything']];
    var html = '<header class="doc-head"><p class="eyebrow">Courses · ' + plural(shown.length, 'resource') + ' shown · most-used first</p>' +
      '<h2 class="doc-title">Every resource on the route</h2>' +
      '<p class="lede">Grouped by resource instead of by topic: a course that serves several topics appears once, with the part each topic uses.</p>' +
      '<div class="doc-tools"><div class="seg seg-wrap" role="group" aria-label="Show">' + filters.map(function (x) {
        return '<button type="button" data-course-filter="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + '</button>';
      }).join('') + '</div></div></header>';
    html += '<div class="cgrid">' + shown.map(function (g) {
      var r = g.first;
      return '<article class="cgroup"><div class="cgroup-head"><div style="display:grid;gap:8px;min-width:0">' +
        '<p class="eyebrow">' + esc(KIND[r.kind] || r.kind) + (g.primary ? ' · primary in ' + plural(g.primary, 'topic') : '') + '</p>' +
        '<h3 class="cgroup-title">' + ext(r.url, esc(g.title)) + '</h3><span class="by">' + esc(r.by || '') + '</span>' + chipsFor(r) +
        (g.course ? courseFacts(g.course) : '') + '</div>' +
        '<div class="ccount"><b>' + g.topics + '</b>' + (g.topics === 1 ? 'topic' : 'topics') + '</div></div>' +
        '<ol class="cuses">' + g.items.sort(function (a, b) { return rankSort(a.id, b.id); }).map(function (u) {
          return '<li><div>' + topicLink(u.id) + '<div class="crole">' + esc(ROLE[u.r.role] || u.r.role) + '</div></div><div class="cuse">' + rich(u.r.use) + '</div></li>';
        }).join('') + '</ol></article>';
    }).join('') + '</div>';
    return html;
  }

  /* ---------------------------------------------------------------- topic page */
  function noCourse(n) {
    return '<div class="nocourse"><span class="pick-kicker">' + icon('book') + 'Primary course</span><p>No course with public material fits this topic well, so it is learned from the text and the practice' +
      (n.notes ? '. The curation notes say what was tried.' : '.') + '</p></div>';
  }
  function pickCard(r, nid, compact) {
    var label = r.role === 'primary-course' ? 'Primary course' : 'Primary text';
    return '<div class="pick">' +
      '<div class="pick-kicker">' + icon(r.role === 'primary-course' ? 'play' : 'book') + label + '</div>' +
      '<h3 class="pick-title">' + ext(r.url, esc(r.title) + icon('external')) + '</h3>' +
      '<span class="by">' + esc(r.by || '') + (r.edition_or_term ? ' · ' + esc(r.edition_or_term) : '') + '</span>' +
      chipsFor(r) + courseFacts(r) +
      '<p class="prose"><span class="k">Use</span>' + rich(r.use) + '</p>' +
      (compact ? '' : '<p class="prose" style="color:var(--muted)"><span class="k">Why</span>' + rich(r.why) + '</p>' + alsoUsed(r, nid)) +
      tick(nid, r.id) + '</div>';
  }
  function resourceItem(r, nid) {
    return '<li class="ritem"><div class="ritem-main">' +
      '<div class="ritem-title">' + ext(r.url, esc(r.title)) + '</div>' +
      '<div class="ritem-meta"><span class="by">' + esc(r.by || '') + (r.edition_or_term ? ' · ' + esc(r.edition_or_term) : '') + '</span>' + chipsFor(r) + '</div>' +
      courseFacts(r) +
      '<p class="prose"><span class="k">Use</span>' + rich(r.use) + '</p>' +
      '<p class="prose" style="color:var(--muted)"><span class="k">Why</span>' + rich(r.why) + '</p>' + alsoUsed(r, nid) +
      '</div><div>' + tick(nid, r.id) + '</div></li>';
  }
  function relations(id) {
    var n = node(id);
    var needs = n.hard || [], helps = n.soft || [];
    var leads = (ix.succ[id] || []).map(function (s) { return s.id; });
    function row(label, list) { return '<div class="rel-row"><span class="k">' + label + '</span><div class="chips">' + (list.length ? list.map(function (x) { return topicLink(x); }).join('') : '<span class="by">None</span>') + '</div></div>'; }
    return '<div class="rel">' + row('Needs first', needs) + (helps.length ? row('Helps to know', helps) : '') + (leads.length ? row('Leads to', leads) : '') + '</div>';
  }
  function topicView(id) {
    var n = node(id);
    // the outline beside a topic is the path you came from, or the topic's home path
    var ctx = ui.lastPath && pathOf(ui.lastPath) && pathOf(ui.lastPath).published && routeOrder(ui.lastPath).num[id] ? ui.lastPath : homeOf(n);
    ui.lastPath = ctx;
    var o = routeOrder(ctx), i = o.order.indexOf(id);
    var t = pick(n, 'primary-text'), c = pick(n, 'primary-course');
    var practice = n.resources.filter(function (r) { return r.role === 'practice'; });
    var gaps = n.resources.filter(function (r) { return r.role === 'secondary'; });
    var refs = n.resources.filter(function (r) { return r.role === 'reference'; });
    var open = settings.detail === 'all' ? ' open' : '';
    var paths = n.paths.map(function (p) { return pathOf(p).published ? '<a href="#p-' + esc(p) + '">' + esc(pathOf(p).short) + '</a>' : esc(pathOf(p).short); }).join(', ');
    var bits = [i >= 0 ? 'Stage ' + pad2(o.stageOf[id]) : '', LEVEL[n.level] || '', n.optional ? 'Optional' : '', n.branch ? 'Branch: ' + n.branch.replace(/-/g, ' ') : ''].filter(Boolean);
    var html = '<header class="topic-head" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<p class="eyebrow">' + badge(homeOf(n), 'badge-sm') + bits.map(function (x) { return esc(x); }).join(' · ') + (i >= 0 ? ' · <b>' + pad2(i + 1) + '</b> / ' + o.order.length : '') + '</p>' +
      '<h1>' + esc(n.title) + '</h1><p class="lede">' + esc(n.scope) + '</p>' +
      '<p class="meta">In ' + paths + '</p>' +
      '<div class="topic-bar">' + statusControl(id) + '</div>' + relations(id) + '</header>';
    html += '<section class="block"><div class="block-head"><h2>Start here</h2><p>The text and the course this topic is learned from</p></div><div class="picks">' +
      (t ? pickCard(t, id) : '') + (c ? pickCard(c, id) : noCourse(n)) + '</div></section>';
    if (practice.length) html += '<section class="block"><div class="block-head"><h2>Practice</h2><p>Named exercises, labs and problem sets</p></div><ul class="rlist">' + practice.map(function (r) { return resourceItem(r, id); }).join('') + '</ul></section>';
    if (gaps.length) html += '<details class="more"' + open + '><summary>' + icon('arrow-right') + 'Fills a gap<small>' + plural(gaps.length, 'resource') + '</small></summary><div class="more-body"><p class="by">Each covers something the primary picks leave out.</p><ul class="rlist">' + gaps.map(function (r) { return resourceItem(r, id); }).join('') + '</ul></div></details>';
    if (refs.length) html += '<details class="more"' + open + '><summary>' + icon('arrow-right') + 'Reference<small>' + plural(refs.length, 'resource') + '</small></summary><div class="more-body"><p class="by">For looking things up, not for reading cover to cover.</p><ul class="rlist">' + refs.map(function (r) { return resourceItem(r, id); }).join('') + '</ul></div></details>';
    if (n.considered && n.considered.length) html += '<details class="more"' + open + '><summary>' + icon('arrow-right') + 'Considered, not chosen<small>' + plural(n.considered.length, 'candidate') + '</small></summary><div class="more-body"><ul class="considered">' +
      n.considered.map(function (x) { return '<li>' + (x.url ? ext(x.url, esc(x.title)) : '<b>' + esc(x.title) + '</b>') + '<span class="prose" style="color:var(--muted);font-size:14px">' + rich(x.reason) + '</span></li>'; }).join('') + '</ul></div></details>';
    var oq = n.open_questions || [];
    if (n.notes || oq.length) html += '<details class="more"' + open + '><summary>' + icon('arrow-right') + 'Curation notes<small>last checked ' + esc(monthYear(n.last_verified)) + '</small></summary><div class="more-body">' +
      (n.notes ? '<p class="prose">' + rich(n.notes) + '</p>' : '') +
      (oq.length ? '<div><span class="k">Open questions</span><ul class="notes-list">' + oq.map(function (q) { return '<li class="prose" style="font-size:14px">' + rich(typeof q === 'string' ? q : JSON.stringify(q)) + '</li>'; }).join('') + '</ul></div>' : '') + '</div></details>';
    if (i >= 0) {
      var prev = o.order[i - 1], nxt = o.order[i + 1];
      html += '<nav class="pager" aria-label="Previous and next topic on ' + esc(pathOf(ctx).short) + '">' +
        (prev ? '<a class="pager-prev" href="#n-' + esc(prev) + '"><span class="eyebrow">' + icon('arrow-left') + 'Previous · ' + pad2(i) + '</span><b>' + esc(node(prev).title) + '</b></a>' : '') +
        (nxt ? '<a class="pager-next" href="#n-' + esc(nxt) + '"><span class="eyebrow">Next · ' + pad2(i + 2) + icon('arrow-right') + '</span><b>' + esc(node(nxt).title) + '</b></a>' : '') + '</nav>';
    }
    return '<div class="shell" style="--pc:var(--pc-' + esc(ctx) + ')"><aside class="side" id="side" data-key="path:' + esc(ctx) + '" aria-label="Path outline">' + pathSide(ctx, 'topic', id) + '</aside>' +
      '<div class="pane"><article class="doc topic">' + html + '</article></div></div>';
  }

  /* ---------------------------------------------------------------- about */
  function aboutView() {
    return '<section class="doc doc-solo about"><div class="doc-head"><p class="eyebrow">About</p><h1 class="doc-title">How to read the roadmap</h1>' +
      '<p class="lede">Each topic is a stop on a prerequisite map. Its page says what to learn it from and what to practise, and keeps the alternatives that were weighed so the choice can be revisited.</p></div>' +
      '<div class="about-grid">' +
      '<div class="about-card"><h2>On a topic page</h2><dl>' +
      '<div><dt>Primary text</dt><dd>The one book, set of notes or website to learn the topic from.</dd></div>' +
      '<div><dt>Primary course</dt><dd>The course to follow alongside it, preferring public lectures and assignments you can do.</dd></div>' +
      '<div><dt>Practice</dt><dd>Named labs, problem sets and exercises, not whole platforms.</dd></div>' +
      '<div><dt>Fills a gap</dt><dd>Only added when the primary picks leave something out; each one says what.</dd></div>' +
      '<div><dt>Reference</dt><dd>For looking things up.</dd></div>' +
      '<div><dt>Considered, not chosen</dt><dd>Strong candidates and the reason each lost.</dd></div></dl></div>' +
      '<div class="about-card"><h2>Course facts</h2><dl>' +
      '<div><dt>Latest run</dt><dd>The newest offering found, including 2026 runs.</dd></div>' +
      '<div><dt>Lectures</dt><dd>Whether that run’s videos are public. When they are not, the newest public recordings are linked.</dd></div>' +
      '<div><dt>Assignments</dt><dd>Public, public with an autograder, partly public, or restricted.</dd></div>' +
      '<div><dt>Link unchecked</dt><dd>The page refused automated checks when the data was verified; it is probably fine but was not opened.</dd></div></dl></div>' +
      '<div class="about-card"><h2>On the map</h2><dl>' +
      '<div><dt>Stages</dt><dd>Topics in the same stage have no prerequisites on each other. Earlier stages come first.</dd></div>' +
      '<div><dt>Solid and dashed lines</dt><dd>Required and helpful prerequisites. Lines implied by a longer chain are not drawn.</dd></div>' +
      '<div><dt>Station styles</dt><dd>A station in the path colour belongs to this path; a muted one is a prerequisite from another path; a dashed ring is optional.</dd></div>' +
      '<div><dt>Starting point</dt><dd>Mark what you already know; “Hide done” then shows only the route that is left. Progress stays in this browser.</dd></div></dl></div>' +
      '</div>' +
      '<div class="about-card"><h2>Where the data comes from</h2><p class="prose">Built from the research in the repository (<code>research/nodes</code>): ' + D.stats.topics + ' topics across ' + D.stats.paths +
      ' paths, each researched, independently reviewed and link-checked. Course facts were last checked in ' + esc(monthYear(D.site.checked)) + '. ' +
      (D.site.preview ? 'Paths are published one at a time; the rest are researched and follow in the same format. ' : '') +
      'Light or dark, map direction and other preferences are under Settings at the top of the page.' +
      (D.site.repo ? ' Source: ' + ext(D.site.repo, esc(D.site.repo.replace(/^https:\/\//, ''))) + '.' : '') + '</p></div></section>';
  }

  /* ---------------------------------------------------------------- dialogs */
  var OPTION_ROWS = [
    { group: 'Map', rows: [
      { key: 'dir', label: 'Direction', help: 'Which way prerequisites flow. Auto reads left to right on wide screens and top to bottom on phones.', choices: [['auto', 'Auto'], ['TB', 'Top to bottom'], ['LR', 'Left to right']] },
      { key: 'lines', label: 'Lines', help: 'Helpful (soft) prerequisites add context but also clutter.', choices: [['required', 'Required only'], ['all', 'Required and helpful']] },
    ] },
    { group: 'Content', rows: [
      { key: 'scope', label: 'Topics in a path', help: 'Whether a path shows the prerequisites it borrows from other paths.', choices: [['route', 'Path and its prerequisites'], ['path', 'This path only']] },
      { key: 'layout', label: 'Guide layout', help: 'Cards read like a syllabus; the table fits more on screen.', choices: [['cards', 'Cards'], ['table', 'Table']] },
      { key: 'detail', label: 'Topic pages', help: 'Show only the essentials first, or open every section.', choices: [['essentials', 'Essentials first'], ['all', 'Everything open']] },
      { key: 'start', label: 'A path opens on', choices: [['map', 'Map'], ['guide', 'Guide']] },
    ] },
  ];
  function optionsHtml() {
    function seg(row) {
      return '<div class="seg" role="radiogroup" aria-label="' + esc(row.label) + '">' + row.choices.map(function (ch) {
        var on = String(settings[row.key]) === ch[0];
        return '<label class="' + (on ? 'is-on' : '') + '"><input type="radio" name="opt-' + row.key + '" value="' + ch[0] + '"' + (on ? ' checked' : '') + ' data-opt="' + row.key + '">' + esc(ch[1]) + '</label>';
      }).join('') + '</div>';
    }
    var body = '<fieldset class="opt-group"><legend>Appearance</legend>' +
      '<div class="opt-row"><span>Light or dark</span>' + seg({ key: 'mode', label: 'Light or dark', choices: [['dark', 'Dark'], ['light', 'Light'], ['auto', 'Match device']] }) + '</div></fieldset>' +
      OPTION_ROWS.map(function (g) {
        return '<fieldset class="opt-group"><legend>' + esc(g.group) + '</legend>' + g.rows.map(function (row) {
          return '<div class="opt-row"><span>' + esc(row.label) + '</span>' + seg(row) + (row.help ? '<p class="opt-help">' + esc(row.help) + '</p>' : '') + '</div>';
        }).join('') + '</fieldset>';
      }).join('');
    return '<div class="dlg-frame"><div class="dlg-head"><div><h2 id="dlg-options-title">Settings</h2><p>Changes apply at once. Settings and progress stay in this browser.</p></div>' +
      '<button type="button" class="btn btn-quiet btn-sm" data-action="close-dialog" aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="dlg-body">' + body + '</div>' +
      '<div class="dlg-foot"><button type="button" class="btn btn-sm" data-action="reset-options">Restore defaults</button>' +
      '<button type="button" class="btn btn-sm' + (ui.resetArmed ? ' danger-confirm' : '') + '" data-action="reset-progress">' + (ui.resetArmed ? 'Click again to clear all progress' : 'Clear progress') + '</button>' +
      '<span class="grow"></span><button type="button" class="btn btn-primary btn-sm" data-action="close-dialog">Done</button></div></div>';
  }
  function openOptions() {
    var dlg = $('#dlg-options');
    ui.resetArmed = false;
    dlg.innerHTML = optionsHtml();
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  }
  function refreshOptions() {
    var dlg = $('#dlg-options');
    if (!dlg.open) return;
    var body = $('.dlg-body', dlg), top = body ? body.scrollTop : 0;
    var act = document.activeElement;
    var focusSel = act && act.name && dlg.contains(act) ? 'input[name="' + act.name + '"][value="' + act.value + '"]' : null;
    var focusAct = act && dlg.contains(act) ? act.getAttribute('data-action') : null;
    dlg.innerHTML = optionsHtml();
    if ($('.dlg-body', dlg)) $('.dlg-body', dlg).scrollTop = top;
    var again = focusSel ? $(focusSel, dlg) : focusAct ? $('[data-action="' + focusAct + '"]', dlg) : null;
    if (again) again.focus({ preventScroll: true });
  }

  function startHtml(pid) {
    var ids = routeIds(pid, { scope: 'route' });
    var groups = {};
    ids.forEach(function (id) { var h = homeOf(node(id)); (groups[h] = groups[h] || []).push(id); });
    var order = Object.keys(groups).sort(function (a, b) { return ix.rank['p:' + a] - ix.rank['p:' + b]; });
    var body = order.map(function (h) {
      return '<div class="start-group"><div class="start-group-head"><h3>' + badge(h, 'badge-sm') + esc(pathOf(h).title) + '</h3>' +
        '<button type="button" class="btn btn-quiet btn-sm" data-action="start-all" data-group="' + esc(h) + '">Tick all</button></div><div class="start-list">' +
        groups[h].map(function (id) {
          return '<label class="start-item"><input type="checkbox" value="' + esc(id) + '" data-group="' + esc(h) + '"' + (statusOf(id) === 'done' ? ' checked' : '') + '><span>' + esc(node(id).title) + '</span></label>';
        }).join('') + '</div></div>';
    }).join('');
    return '<div class="dlg-frame"><div class="dlg-head"><div><h2 id="dlg-start-title">Where are you starting from?</h2>' +
      '<p>Tick the topics you already know. They count as done, “Next up” moves forward, and “Hide done” leaves only the route that is left.</p></div>' +
      '<button type="button" class="btn btn-quiet btn-sm" data-action="close-dialog" aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="dlg-body">' + body + '</div>' +
      '<div class="dlg-foot"><button type="button" class="btn btn-sm" data-action="start-none">Untick everything</button><span class="grow"></span>' +
      '<button type="button" class="btn btn-sm" data-action="close-dialog">Cancel</button><button type="button" class="btn btn-primary btn-sm" data-action="start-save">Save starting point</button></div></div>';
  }
  function openStart(pid) {
    var dlg = $('#dlg-start');
    dlg.dataset.path = pid;
    dlg.innerHTML = startHtml(pid);
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  }

  /* ---------------------------------------------------------------- search */
  function runSearch(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var hits = ix.search.filter(function (e) { return terms.every(function (t) { return e.text.indexOf(t) >= 0; }); });
    var topics = hits.filter(function (h) { return h.type === 'topic'; });
    var seen = {};
    var res = hits.filter(function (h) { if (h.type !== 'res') return false; var k = h.title + '|' + h.id; if (seen[k]) return false; seen[k] = true; return true; });
    return topics.slice(0, 6).concat(res.slice(0, 8));
  }
  function renderSearch() {
    var input = $('#search'), box = $('#search-results');
    var q = input.value.trim();
    if (!q || !D) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
    var hits = runSearch(q);
    ui.searchHits = hits;
    if (ui.searchSel >= hits.length) ui.searchSel = hits.length - 1;
    var html = '';
    if (!hits.length) html = '<div class="sr-empty">Nothing matches “' + esc(q) + '” in the published paths.</div>';
    else {
      var lastType = '';
      hits.forEach(function (h, i) {
        if (h.type !== lastType) { html += '<div class="sr-group">' + (h.type === 'topic' ? 'Topics' : 'Resources') + '</div>'; lastType = h.type; }
        html += '<a class="sr-item" role="option" id="sr-' + i + '" href="#n-' + esc(h.id) + '" aria-selected="' + (i === ui.searchSel) + '"><span>' + esc(h.title) + '</span><small>' + esc(h.sub || '') + '</small></a>';
      });
    }
    box.innerHTML = html;
    box.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }
  function closeSearch() {
    var box = $('#search-results'), input = $('#search');
    if (box) box.hidden = true;
    if (input) input.setAttribute('aria-expanded', 'false');
    ui.searchSel = -1;
  }

  /* ---------------------------------------------------------------- routing and rendering */
  function parseHash() {
    var h = '';
    try { h = decodeURIComponent(location.hash.replace(/^#/, '')); } catch (e) { h = location.hash.replace(/^#/, ''); }
    if (!h || h === 'home') return { page: 'home' };
    if (h === 'about') return { page: 'about' };
    if (h.indexOf('n-') === 0) return { page: 'topic', id: h.slice(2) };
    if (h.indexOf('p-') === 0) {
      var parts = h.slice(2).split('--');
      return { page: 'path', path: parts[0], view: VIEWS[parts[1]] ? parts[1] : settings.start, sel: parts[2] || null };
    }
    if (h === 'main') return { page: 'keep' };
    return { page: 'home' };
  }
  function crumbs(r) {
    var parts = ['<a href="#home">Paths</a>'];
    var pid = r.page === 'path' ? r.path : r.page === 'topic' ? ui.lastPath : null;
    if (pid && pathOf(pid) && pathOf(pid).published) parts.push('<a href="#p-' + esc(pid) + '">' + esc(pathOf(pid).short) + '</a>');
    if (r.page === 'path' && VIEWS[r.view]) parts.push('<span>' + esc(VIEWS[r.view]) + '</span>');
    if (r.page === 'topic' && has(r.id)) parts.push('<span>' + esc(node(r.id).title) + '</span>');
    if (r.page === 'about') parts.push('<span>About</span>');
    $('#crumbs').innerHTML = parts.join('<span class="sep">/</span>');
  }
  function footer() {
    $('#footer').innerHTML = '<span>' + esc(D.site.title) + ' · ' + D.stats.topics + ' topics researched across ' + D.stats.paths + ' paths' + (D.site.preview ? ' · ' + D.stats.published + ' published' : '') + '</span>' +
      '<span>Course facts checked ' + esc(monthYear(D.site.checked)) + ' · <a href="#about">How to read it</a>' + (D.site.repo ? ' · ' + ext(D.site.repo, 'Source') : '') + '</span>';
  }

  function render(opts) {
    opts = opts || {};
    var r = parseHash();
    if (r.page === 'keep') return;
    closeSearch();
    var main = $('#main');
    var prevSide = $('#side'), sideKey = prevSide ? prevSide.getAttribute('data-key') : null, sideTop = prevSide ? prevSide.scrollTop : 0;
    var html;
    if (r.page === 'path') {
      if (!pathOf(r.path)) html = notFound('That path does not exist.');
      else if (!pathOf(r.path).published) html = notFound(pathOf(r.path).title + ' is researched but not published yet.');
      else {
        ui.lastPath = r.path;
        var sameMap = r.view === 'map' && ui.mapPath === r.path && $('#map-vp') && !opts.full;
        ui.selected = r.view === 'map' ? r.sel : null;
        if (sameMap && ui.mapKey === mapKey(r.path)) {   // only the selection changed: keep the map as it is
          updateDrawer(r.path, r.sel);
          syncOutline(r.sel);
          crumbs(r);
          return;
        }
        html = pathView(r.path, r.view, r.sel);
        ui.mapPath = r.view === 'map' ? r.path : null;
      }
    } else if (r.page === 'topic') {
      html = has(r.id) ? topicView(r.id) : notFound('That topic belongs to a path that is not published yet.');
      ui.mapPath = null;
    } else if (r.page === 'about') { html = aboutView(); ui.mapPath = null; }
    else { html = homeView(); ui.mapPath = null; }
    var keepY = opts.keepScroll ? window.scrollY : 0;
    // on wide screens the home page and the map are workspaces exactly one window tall
    var isMap = r.page === 'path' && r.view === 'map' && pathOf(r.path) && pathOf(r.path).published;
    document.body.toggleAttribute('data-fixed', isWide() && (r.page === 'home' || !!isMap));
    document.body.setAttribute('data-page', r.page);
    main.innerHTML = html;
    crumbs(r);
    var side = $('#side');
    if (side && side.getAttribute('data-key') === sideKey) side.scrollTop = sideTop;
    if (isMap) setupMap(r.path, opts.keepScroll);
    if (r.page === 'home') fitOverview();
    window.scrollTo(0, keepY);
    if (r.page === 'path' && r.view === 'guide' && r.sel && !opts.keepScroll) {
      var card = document.getElementById('g-' + r.sel);
      if (card) card.scrollIntoView({ block: 'start' });
    }
    revealOutline();
    if (!opts.keepScroll && !opts.silent) main.focus({ preventScroll: true });
  }
  // keep the selected topic visible in the sidebar outline
  function revealOutline() {
    var side = $('#side'), row = side && $('.orow.is-sel', side);
    if (!side || !row || !isWide()) return;
    var sr = side.getBoundingClientRect(), rr = row.getBoundingClientRect();
    if (rr.top < sr.top + 40 || rr.bottom > sr.bottom - 24) side.scrollTop += rr.top - sr.top - side.clientHeight / 2;
  }
  function syncOutline(sel) {
    $$('#side .orow.is-sel').forEach(function (a) { a.classList.remove('is-sel'); a.removeAttribute('aria-current'); });
    var row = sel ? $('#side .orow[data-id="' + sel + '"]') : null;
    if (row) { row.classList.add('is-sel'); row.setAttribute('aria-current', 'true'); }
    revealOutline();
  }
  function notFound(msg) { return '<section class="doc doc-solo"><div class="doc-head"><p class="eyebrow">Not found</p><h1 class="doc-title">Not here</h1><p class="lede">' + esc(msg) + '</p></div><p><a class="btn" href="#home">Back to all paths</a></p></section>'; }

  function updateDrawer(pid, sel) {
    var box = $('#mapbox'), drawer = $('#drawer');
    if (!box || !drawer) return;
    var ok = sel && has(sel) && $('#map-canvas [data-node="' + sel + '"]');
    $$('.gnode.is-sel').forEach(function (g) { g.classList.remove('is-sel'); });
    if (ok && isWide()) {
      $('#map-canvas [data-node="' + sel + '"]').classList.add('is-sel');
      drawer.innerHTML = drawerHtml(sel, pid);
      drawer.hidden = false;
      drawer.scrollTop = 0;
      box.classList.add('has-drawer');
      requestAnimationFrame(function () { revealNode(sel); });
    } else {
      drawer.hidden = true; drawer.innerHTML = ''; box.classList.remove('has-drawer');
    }
    highlight(ok ? sel : null);
  }

  // Only touch data-theme when this page set it: in "auto" an embedding host's own light/dark choice stays in charge.
  var ownTheme = settings.mode === 'light' || settings.mode === 'dark';
  function isDarkNow() {
    var t = docEl.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyLook() {
    if (settings.mode === 'light' || settings.mode === 'dark') { docEl.setAttribute('data-theme', settings.mode); ownTheme = true; }
    else if (ownTheme) {
      if (hostTheme) docEl.setAttribute('data-theme', hostTheme); else docEl.removeAttribute('data-theme');
      ownTheme = false;
    }
    $$('#theme-seg [data-value]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === settings.mode)); });
  }
  function saveSettings() { store.set(SETTINGS_KEY, settings); }
  function setSetting(key, value) {
    if (key === 'hideDone') value = !!value;
    settings[key] = value;
    saveSettings();
    if (key === 'mode') { applyLook(); refreshOptions(); return; }
    refreshOptions();
    render({ keepScroll: true, full: true, silent: true });
  }

  /* ---------------------------------------------------------------- events */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-action],[data-set],[data-status],[data-cycle],[data-course-filter],.gnode');
    if (!t) {
      if (!ev.target.closest('.search')) closeSearch();
      return;
    }
    if (t.classList.contains('gnode')) {
      var r = parseHash(), id = t.getAttribute('data-node');
      if (isWide() && r.page === 'path') location.hash = 'p-' + r.path + '--map--' + id;
      else location.hash = 'n-' + id;
      return;
    }
    if (t.hasAttribute('data-set')) { setSetting(t.getAttribute('data-set'), t.getAttribute('data-value')); return; }
    if (t.hasAttribute('data-status')) {
      setStatus(t.getAttribute('data-node'), t.getAttribute('data-status'));
      afterProgress();
      return;
    }
    if (t.hasAttribute('data-cycle')) {
      var cid = t.getAttribute('data-cycle'), next = { todo: 'doing', doing: 'done', done: 'todo' }[statusOf(cid)];
      setStatus(cid, next);
      afterProgress();
      return;
    }
    if (t.hasAttribute('data-course-filter')) {
      ui.courseFilter = t.getAttribute('data-course-filter');
      render({ keepScroll: true, full: true, silent: true });
      return;
    }
    var act = t.getAttribute('data-action');
    var dlg = t.closest('dialog');
    switch (act) {
      case 'options': openOptions(); break;
      case 'toggle-theme': setSetting('mode', isDarkNow() ? 'light' : 'dark'); break;
      case 'close-dialog': if (dlg) dlg.close(); break;
      case 'reset-options':
        settings = Object.assign({}, DEFAULTS); saveSettings(); applyLook(); refreshOptions(); render({ keepScroll: true, full: true, silent: true }); break;
      case 'reset-progress':
        if (!ui.resetArmed) { ui.resetArmed = true; refreshOptions(); setTimeout(function () { ui.resetArmed = false; refreshOptions(); }, 4000); break; }
        progress = {}; checks = {}; store.set('progress', progress); store.set('checks', checks); ui.resetArmed = false; refreshOptions(); render({ keepScroll: true, full: true, silent: true }); break;
      case 'zoom-in': setScale((ui.scale || 1) * 1.2); break;
      case 'zoom-out': setScale((ui.scale || 1) / 1.2); break;
      case 'zoom-fit': setScale(fitScale()); $('#map-vp').scrollLeft = 0; $('#map-vp').scrollTop = 0; break;
      case 'close-drawer': var rr = parseHash(); location.hash = 'p-' + rr.path + '--map'; break;
      case 'start': openStart(parseHash().path); break;
      case 'start-all': $$('#dlg-start input[data-group="' + t.getAttribute('data-group') + '"]').forEach(function (i) { i.checked = true; }); break;
      case 'start-none': $$('#dlg-start input[type="checkbox"]').forEach(function (i) { i.checked = false; }); break;
      case 'start-save':
        $$('#dlg-start input[type="checkbox"]').forEach(function (i) {
          if (i.checked) progress[i.value] = 'done';
          else if (progress[i.value] === 'done') delete progress[i.value];
        });
        store.set('progress', progress);
        if (dlg) dlg.close();
        render({ keepScroll: true, full: true, silent: true });
        break;
      default: break;
    }
  });
  function afterProgress() {
    // a full render is cheap; on the map, setupMap restores the zoom and scroll position
    render({ keepScroll: true, full: true, silent: true });
  }
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.hasAttribute('data-check')) {
      var parts = t.getAttribute('data-check').split('|');
      checks[parts[0]] = checks[parts[0]] || {};
      if (t.checked) checks[parts[0]][parts[1]] = true; else delete checks[parts[0]][parts[1]];
      store.set('checks', checks);
      return;
    }
    if (t.hasAttribute('data-toggle')) { setSetting(t.getAttribute('data-toggle'), t.checked); return; }
    if (t.hasAttribute('data-opt')) { setSetting(t.getAttribute('data-opt'), t.value); return; }
  });
  window.addEventListener('hashchange', function () { render(); });
  var resizeTimer = null, wasWide = null, wasDir = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var w = isWide(), d = dirNow(), page = parseHash().page;
      if (page === 'home') fitOverview();
      if (wasWide !== null && (w !== wasWide || d !== wasDir) && (page === 'path' || page === 'topic' || page === 'home')) render({ keepScroll: true, full: true, silent: true });
      wasWide = w; wasDir = d;
    }, 150);
  });
  document.addEventListener('keydown', function (ev) {
    var input = $('#search');
    if (ev.key === '/' && document.activeElement !== input && !/input|textarea|select/i.test((document.activeElement || {}).tagName || '') && !$('dialog[open]')) {
      ev.preventDefault(); input.focus(); return;
    }
    if (document.activeElement === input) {
      var hits = ui.searchHits || [];
      if (ev.key === 'ArrowDown') { ev.preventDefault(); ui.searchSel = Math.min(hits.length - 1, ui.searchSel + 1); renderSearch(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); ui.searchSel = Math.max(-1, ui.searchSel - 1); renderSearch(); }
      else if (ev.key === 'Enter') { var h = hits[ui.searchSel < 0 ? 0 : ui.searchSel]; if (h) { location.hash = 'n-' + h.id; input.value = ''; input.blur(); closeSearch(); } }
      else if (ev.key === 'Escape') { input.value = ''; closeSearch(); input.blur(); }
      return;
    }
    if (ev.key === 'Escape') {
      var r = parseHash();
      if (r.page === 'path' && r.sel && !$('dialog[open]')) location.hash = 'p-' + r.path + '--map';
    }
  });
  document.addEventListener('input', function (ev) { if (ev.target.id === 'search') { ui.searchSel = -1; renderSearch(); } });
  document.addEventListener('focusin', function (ev) { if (ev.target.id === 'search' && ev.target.value.trim()) renderSearch(); });
  document.addEventListener('click', function (ev) { if (ev.target.closest('.sr-item')) { $('#search').value = ''; closeSearch(); } });

  // pointing at a path (sidebar row or system-map station) shows it under the system map; pointing at a topic row lights it on the map
  function hoverTarget(el) { return el && el.closest ? el.closest('.orow-path, .onode[data-path], .orow[data-id]') : null; }
  document.addEventListener('mouseover', function (ev) {
    var t = hoverTarget(ev.target); if (!t) return;
    if (t.hasAttribute('data-path')) {
      var pid = t.getAttribute('data-path');
      if ($('#overview')) overviewHighlight(pid);
      if ($('#peek') && ui.peek !== pid) { ui.peek = pid; $('#peek').innerHTML = peekHtml(pid); }
    } else if ($('#map-canvas')) highlight(t.getAttribute('data-id'));
  });
  document.addEventListener('mouseout', function (ev) {
    var t = hoverTarget(ev.target); if (!t || hoverTarget(ev.relatedTarget) === t) return;
    if (t.hasAttribute('data-path')) overviewHighlight(null);
    else if ($('#map-canvas')) highlight(ui.selected);
  });

  /* ---------------------------------------------------------------- start */
  applyLook();
  fetch('data.json', { cache: 'no-cache' })
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (data) {
      D = data;
      buildIndex();
      footer();
      wasWide = isWide(); wasDir = dirNow();
      render({ silent: true });
    })
    .catch(function (err) {
      $('#main').innerHTML = '<section class="doc doc-solo"><h1 class="doc-title">The roadmap data did not load</h1><p class="lede" style="margin-top:12px">The page needs <code>data.json</code> next to it (' + esc(err.message) + '). ' +
        'To preview locally, build and serve the folder: <code>python3 site/build.py</code> then <code>python3 -m http.server --directory _site</code>.</p></section>';
    });
})();
