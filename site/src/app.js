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
  function termish(t) { return /\d{4}/.test(String(t || '')); }

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
  function homeView() {
    var pub = D.paths.filter(function (p) { return p.published; });
    var first = pub[0];
    var html = '<section class="hero wrap">' +
      '<div class="hero-main"><p class="eyebrow">' + (D.site.preview ? pub.length + ' of ' + D.stats.paths + ' paths published' : 'A personal map of computer science') + '</p>' +
      '<h1>' + esc(D.site.title) + '</h1>' +
      '<p class="lede">' + esc(D.site.tagline) + '</p>' +
      '<div class="hero-actions">' + (first ? '<a class="btn btn-primary" href="#p-' + esc(first.id) + '">' + icon('map') + 'Open ' + esc(first.title) + '</a>' : '') +
      '<a class="btn" href="#about">' + icon('info') + 'How to read it</a></div></div>' +
      '<aside class="hero-panel" aria-label="How the roadmap works"><ul class="how">' +
      '<li><span class="how-glyph">' + icon('book') + '</span><span><b>Every topic names its picks</b>One primary text and, where a good one exists, one primary course, plus practice and resources that fill specific gaps.</span></li>' +
      '<li><span class="how-glyph">' + icon('map') + '</span><span><b>Lines are prerequisites</b>A solid line means you need the earlier topic; a dashed one means it helps.</span></li>' +
      '<li><span class="how-glyph">' + icon('flag') + '</span><span><b>Paths share topics</b>Mark what you already know and every path shortens to the route that is left.</span></li>' +
      '</ul><dl class="hero-stats"><div><dt>topics</dt><dd>' + D.stats.topics + '</dd></div><div><dt>paths</dt><dd>' + D.stats.paths + '</dd></div>' +
      '<div><dt>resources</dt><dd>' + D.stats.resources.toLocaleString('en-US') + '</dd></div></dl>' +
      '<p class="hero-note">Course facts checked ' + esc(monthYear(D.site.checked)) + '</p></aside></section>';

    html += '<section class="section wrap"><div class="sysmap-head"><h2>System map</h2>' +
      '<p>Each path is a line. A line runs from one path to another when topics in the second require topics in the first; thicker lines carry more prerequisites.</p></div>' +
      overviewGraph() + '</section>';

    // the line index: families split into two columns of about the same height
    var fams = D.families.map(function (f) {
      return '<div class="family"><h3 class="family-title">' + esc(f.title) + ' <small>' + f.paths.length + '</small></h3><div class="plist">' + f.paths.map(pathLine).join('') + '</div></div>';
    });
    var sizes = D.families.map(function (f) { return f.paths.length + 1; });
    var total = sizes.reduce(function (a, b) { return a + b; }, 0), best = 1, bestGap = Infinity, run = 0;
    sizes.forEach(function (s, i) { run += s; var gap = Math.abs(total - 2 * run); if (i < sizes.length - 1 && gap < bestGap) { bestGap = gap; best = i + 1; } });
    html += '<section class="section wrap"><div class="section-head"><h2>Paths</h2><p>' +
      (D.site.preview ? 'Every path is researched. ' + esc(pub.map(function (p) { return p.title; }).join(', ')) + (pub.length === 1 ? ' is' : ' are') + ' published first; the others follow in the same format.'
        : 'Pick a path to open its map, its guide and the courses it uses. Paths share topics, so progress in one shows up in the others.') + '</p></div>' +
      '<div class="lines-index"><div class="lines-col">' + fams.slice(0, best).join('') + '</div><div class="lines-col">' + fams.slice(best).join('') + '</div></div></section>';
    return html;
  }
  function pathLine(pid) {
    var p = pathOf(pid);
    var main = badge(pid) + '<span class="pline-main"><span class="pline-title">' + esc(p.title) + '</span><span class="pline-tag">' + esc(p.tagline) + '</span></span>';
    if (!p.published) return '<div class="pline is-off" style="--pc:var(--pc-' + esc(pid) + ')">' + main + '<span class="pline-meta"><span>' + plural(p.count, 'topic') + '</span><span>Not published yet</span></span></div>';
    var done = routeIds(pid, { scope: 'path' }).filter(function (id) { return statusOf(id) === 'done'; }).length;
    return '<a class="pline" href="#p-' + esc(pid) + '" style="--pc:var(--pc-' + esc(pid) + ')">' + main +
      '<span class="pline-meta"><span>' + plural(p.count, 'topic') + '</span>' + (done ? '<b>' + done + ' done</b>' : icon('arrow-right')) + '</span></a>';
  }

  function monthYear(iso) {
    var m = /^(\d{4})-(\d{2})/.exec(String(iso || ''));
    if (!m) return '—';
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1] + ' ' + m[1];
  }

  function overviewGraph() {
    var ids = D.paths.map(function (p) { return p.id; });
    var edges = D.pathLinks.map(function (l) { return { from: l.from, to: l.to, soft: false, weight: l.weight }; });
    var lay = layoutGraph(ids, edges, { dir: 'TB', nodeW: 176, nodeH: 40, gapMajor: 46, gapMinor: 16, pad: 24 });
    var maxW = D.pathLinks.reduce(function (m, l) { return Math.max(m, l.weight); }, 1);
    var svg = '<svg class="map-edges" width="' + lay.width + '" height="' + lay.height + '" viewBox="0 0 ' + lay.width + ' ' + lay.height + '">' +
      lay.lines.map(function (e) {
        var w = 1.4 + 3.2 * Math.sqrt(e.weight / maxW);
        return '<path class="edge" style="--line-color:var(--pc-' + esc(e.from) + ');stroke-width:' + w.toFixed(1) + 'px" d="' + e.d + '"><title>' + esc(pathOf(e.from).short + ' → ' + pathOf(e.to).short + ': ' + plural(e.weight, 'prerequisite')) + '</title></path>';
      }).join('') + '</svg>';
    var nodes = ids.map(function (pid) {
      var p = pathOf(pid), b = lay.boxes[pid];
      var inner = badge(pid) + '<span>' + esc(p.short) + '</span>';
      var style = 'left:' + b.x + 'px;top:' + b.y + 'px;width:' + b.w + 'px;height:' + b.h + 'px;--pc:var(--pc-' + esc(pid) + ')';
      return p.published
        ? '<a class="onode" href="#p-' + esc(pid) + '" style="' + style + '">' + inner + '</a>'
        : '<div class="onode is-off" style="' + style + '" title="Not published yet">' + inner + '</div>';
    }).join('');
    return '<div class="overview"><div class="overview-sizer" style="width:' + lay.width + 'px;height:' + lay.height + 'px">' +
      '<div class="overview-canvas" data-w="' + lay.width + '" data-h="' + lay.height + '" style="width:' + lay.width + 'px;height:' + lay.height + 'px">' + svg + nodes + '</div></div></div>';
  }
  // scale the path overview to the column; below a readable size it scrolls sideways instead
  function fitOverview() {
    var box = $('.overview'), sizer = $('.overview-sizer'), canvas = $('.overview-canvas');
    if (!box || !sizer || !canvas) return;
    var w = +canvas.getAttribute('data-w'), h = +canvas.getAttribute('data-h');
    var s = Math.max(0.6, Math.min(1, (box.clientWidth - 2) / w));
    sizer.style.width = (w * s) + 'px';
    sizer.style.height = (h * s) + 'px';
    canvas.style.transform = 'scale(' + s + ')';
  }

  /* ---------------------------------------------------------------- path page */
  function pathView(pid, view, sel) {
    var p = pathOf(pid);
    var all = routeIds(pid);
    var own = all.filter(function (id) { return node(id).paths.indexOf(pid) >= 0; });
    var extern = all.length - own.length;
    var done = all.filter(function (id) { return statusOf(id) === 'done'; }).length;
    var homes = {};
    all.forEach(function (id) { var h = homeOf(node(id)); if (node(id).paths.indexOf(pid) < 0) homes[h] = true; });
    var homeNames = Object.keys(homes).sort(function (a, b) { return ix.rank['p:' + a] - ix.rank['p:' + b]; }).map(function (h) { return pathOf(h).short; });
    var pct = all.length ? Math.round(100 * done / all.length) : 0;

    var head = '<section class="phead wrap wrap-wide is-' + view + '" style="--pc:var(--pc-' + esc(pid) + ')">' +
      '<div><p class="eyebrow">' + badge(pid, 'badge-sm') + esc((D.families.filter(function (f) { return f.id === p.family; })[0] || {}).title || '') + ' path</p>' +
      '<h1>' + esc(p.title) + '</h1><p class="lede">' + esc(p.tagline) + '</p>' +
      '<p class="pfacts" style="margin-top:12px"><span><b>' + own.length + '</b> topics in this path</span>' +
      (settings.scope === 'route' && extern ? '<span><b>' + extern + '</b> prerequisites from ' + esc(homeNames.join(', ')) + '</span>' : '') +
      (p.optional ? '<span><b>' + p.optional + '</b> optional</span>' : '') + '</p></div>' +
      '<div class="phead-side"><div class="dest"><span class="k">Where it leaves you</span><p>' + esc(p.destination) + '</p></div></div>' +
      lineDiagram(all, done, pct) + '</section>';

    var tabs = '<div class="wrap wrap-wide" style="--pc:var(--pc-' + esc(pid) + ')"><div class="ptabs-row"><nav class="tabs" aria-label="Views">' +
      Object.keys(VIEWS).map(function (v) {
        return '<a class="tab" href="#p-' + esc(pid) + '--' + v + '"' + (v === view ? ' aria-current="page"' : '') + '>' + icon(v === 'map' ? 'map' : v === 'guide' ? 'list' : 'library') + VIEWS[v] + '</a>';
      }).join('') + '</nav>' +
      '<button type="button" class="btn btn-sm" data-action="start" title="Set starting point">' + icon('flag') + '<span class="btn-label">Set starting point</span></button></div></div>';

    var body = view === 'guide' ? guideBody(pid) : view === 'courses' ? coursesBody(pid) : mapBody(pid, sel);
    return head + tabs + '<section class="pbody wrap wrap-wide">' + body + '</section>';
  }

  /* the path's stages as stops on its line; a stop fills in as its topics are done */
  function lineDiagram(all, done, pct) {
    var L = assignLayers(all, edgesAmong(all)).layer, stages = [];
    all.forEach(function (id) { (stages[L[id]] = stages[L[id]] || []).push(id); });
    var stops = stages.map(function (list, i) {
      var d = list.filter(function (id) { return statusOf(id) === 'done'; }).length;
      var cls = 'stop' + (d === list.length ? ' is-done' : d ? ' is-part' : '') + (i === stages.length - 1 ? ' is-end' : '');
      return '<li class="' + cls + '" title="Stage ' + (i + 1) + ': ' + plural(list.length, 'topic') + (d ? ', ' + d + ' done' : '') + '"><span class="stop-dot"></span><span class="stop-n">' + (i + 1) + '</span></li>';
    }).join('');
    return '<div class="linediagram" role="img" aria-label="' + stages.length + ' stages, ' + done + ' of ' + all.length + ' topics done (' + pct + '%)">' +
      '<span class="k">Stages</span><div class="ld-scroll"><ol class="stops">' + stops + '</ol></div>' +
      '<span class="ld-done"><b>' + done + '</b> of ' + all.length + ' topics done</span></div>';
  }

  /* map */
  function mapIds(pid) { return routeIds(pid, { hideDone: settings.hideDone }); }
  function mapKey(pid) { return [pid, dirNow(), settings.lines, settings.scope, settings.hideDone, settings.hideDone ? JSON.stringify(progress) : ''].join('|'); }

  function mapBody(pid, sel) {
    var ids = mapIds(pid);
    var tools = '<div class="maptools"><div class="legend">' +
      '<span class="lg"><span class="lg-stn" style="--pc:var(--pc-' + esc(pid) + ')"></span>In this path</span>' +
      (settings.scope === 'route' ? '<span class="lg"><span class="lg-stn is-ext"></span>Prerequisite from another path</span>' : '') +
      '<span class="lg"><span class="lg-stn is-opt" style="--pc:var(--pc-' + esc(pid) + ')"></span>Optional</span>' +
      '<span class="lg"><span class="lg-line"></span>Required</span>' +
      (settings.lines === 'all' ? '<span class="lg"><span class="lg-line is-soft"></span>Helpful</span>' : '') +
      '<span class="lg">' + icon('check') + 'Done</span></div>' +
      '<div class="tools">' +
      '<label class="switch"><input type="checkbox" data-toggle="hideDone"' + (settings.hideDone ? ' checked' : '') + '>Hide done</label>' +
      '<div class="seg" role="group" aria-label="Lines"><button type="button" data-set="lines" data-value="required" aria-pressed="' + (settings.lines === 'required') + '">Required</button><button type="button" data-set="lines" data-value="all" aria-pressed="' + (settings.lines === 'all') + '">+ Helpful</button></div>' +
      '<div class="seg" role="group" aria-label="Direction"><button type="button" data-set="dir" data-value="TB" aria-pressed="' + (dirNow() === 'TB') + '" title="Top to bottom">' + icon('arrow-down') + '</button><button type="button" data-set="dir" data-value="LR" aria-pressed="' + (dirNow() === 'LR') + '" title="Left to right">' + icon('arrow-right') + '</button></div>' +
      '<div class="seg" role="group" aria-label="Zoom"><button type="button" data-action="zoom-out" title="Zoom out">' + icon('minus') + '</button><button type="button" data-action="zoom-fit" title="Fit to width">' + icon('fit') + '</button><button type="button" data-action="zoom-in" title="Zoom in">' + icon('plus') + '</button></div>' +
      '</div></div>';
    if (!ids.length) return tools + '<div class="empty-state">Every topic on this route is marked done. Turn off “Hide done” to see the whole map.</div>';
    var selOk = sel && ids.indexOf(sel) >= 0 ? sel : null;
    return tools + '<div class="mapbox' + (selOk && isWide() ? ' has-drawer' : '') + '" id="mapbox">' +
      '<div class="map-vp" id="map-vp" tabindex="0" aria-label="Prerequisite map. Use the Guide tab for the same topics as a list.">' +
      '<div class="map-sizer" id="map-sizer">' + mapCanvas(pid, ids) + '</div></div>' +
      '<div class="map-hint">Drag to move · ' + (/Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘' : 'Ctrl') + ' + scroll to zoom</div>' +
      '<aside class="drawer" id="drawer" aria-label="Topic details"' + (selOk && isWide() ? '' : ' hidden') + '>' + (selOk ? drawerHtml(selOk, pid) : '') + '</aside></div>';
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
        : '<span class="stage-label" style="top:16px;left:' + at + 'px">Stage ' + (l + 1) + '</span>';
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
  // the map is a workspace: it takes the rest of the window below the path header (never less than a usable minimum)
  function sizeMap() {
    var vp = $('#map-vp'); if (!vp) return;
    var top = vp.getBoundingClientRect().top + window.scrollY;
    var h = window.innerHeight - top - 14;
    if (window.innerWidth < 760) h = Math.max(h, Math.round(window.innerHeight * 0.68));   // phones: a tall map, the page scrolls to it
    h = Math.max(420, Math.min(1400, h));
    document.documentElement.style.setProperty('--map-h', h + 'px');
  }
  function setupMap(pid, keepView) {
    var vp = $('#map-vp'); if (!vp) return;
    sizeMap();
    var key = mapKey(pid);
    var prev = keepView && ui.mapKey === key ? { s: ui.scale, l: ui.scrollL, t: ui.scrollT } : null;
    ui.mapKey = key;
    if (prev && prev.s) {
      ui.scale = prev.s; setScale(prev.s); vp.scrollLeft = prev.l; vp.scrollTop = prev.t;
    } else {
      // open at a readable size; the Fit button zooms out to the whole route
      ui.scale = null; var f = Math.max(isWide() ? 0.74 : 0.62, fitScale()); ui.scale = f; setScale(f); vp.scrollLeft = 0; vp.scrollTop = 0;
      if (ui.lay.TB) {   // top-to-bottom maps are wide: start centred on the first stage
        var first = Object.keys(ui.lay.boxes).map(function (k) { return ui.lay.boxes[k]; }).filter(function (b) { return b.layer === 0; });
        if (first.length) {
          var mid = first.reduce(function (s, b) { return s + b.c; }, 0) / first.length;
          vp.scrollLeft = Math.max(0, mid * f - vp.clientWidth / 2);
        }
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
  function revealNode(id) {
    var vp = $('#map-vp'), b = ui.lay && ui.lay.boxes[id]; if (!vp || !b) return;
    var s = ui.scale || 1;
    var x0 = b.x * s, y0 = b.y * s, x1 = (b.x + b.w) * s, y1 = (b.y + b.h) * s;
    if (x0 < vp.scrollLeft || x1 > vp.scrollLeft + vp.clientWidth) vp.scrollLeft = Math.max(0, (x0 + x1) / 2 - vp.clientWidth / 2);
    if (y0 < vp.scrollTop || y1 > vp.scrollTop + vp.clientHeight) vp.scrollTop = Math.max(0, (y0 + y1) / 2 - vp.clientHeight / 2);
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
    var n = node(id);
    var t = pick(n, 'primary-text'), c = pick(n, 'primary-course');
    var practice = n.resources.filter(function (r) { return r.role === 'practice'; });
    return '<button type="button" class="btn btn-quiet btn-sm drawer-close" data-action="close-drawer" aria-label="Close details">' + icon('close') + '</button>' +
      '<div class="drawer-inner" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<p class="eyebrow">' + badge(homeOf(n), 'badge-sm') + esc(pathOf(homeOf(n)).short) + ' · ' + esc(LEVEL[n.level] || '') + (n.optional ? ' · optional' : '') + '</p>' +
      '<h2>' + esc(n.title) + '</h2><p class="prose" style="color:var(--muted)">' + esc(n.scope) + '</p>' +
      statusControl(id) +
      (t ? pickCard(t, id, true) : '') + (c ? pickCard(c, id, true) : noCourse(n)) +
      (practice.length ? '<div class="block"><div class="block-head"><h3>Practice</h3></div><div class="chips">' + practice.map(function (r) { return ext(r.url, esc(r.title), 'tlink'); }).join('') + '</div></div>' : '') +
      relations(id) +
      '<a class="btn btn-primary" href="#n-' + esc(id) + '">Open the full topic ' + icon('arrow-right') + '</a></div>';
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
  function guideBody(pid) {
    var p = pathOf(pid);
    var ids = routeIds(pid, { hideDone: settings.hideDone });
    var ready = nextUp(pid);
    var html = '<div class="nextup"><span class="k">' + icon('flag') + ' Next up</span><div class="nextup-list">' +
      (ready.length ? ready.slice(0, 8).map(function (id) { return topicLink(id); }).join('') + (ready.length > 8 ? '<span class="chip">+' + (ready.length - 8) + ' more ready</span>' : '') : '<span>Everything on this route is done.</span>') +
      '</div></div>';
    html += '<div class="maptools"><div class="legend"><span class="lg">' + (settings.layout === 'table' ? 'Compact table' : 'Cards') + ' · stages follow the prerequisite order</span></div><div class="tools">' +
      '<label class="switch"><input type="checkbox" data-toggle="hideDone"' + (settings.hideDone ? ' checked' : '') + '>Hide done</label>' +
      '<div class="seg" role="group" aria-label="Layout"><button type="button" data-set="layout" data-value="cards" aria-pressed="' + (settings.layout === 'cards') + '">Cards</button><button type="button" data-set="layout" data-value="table" aria-pressed="' + (settings.layout === 'table') + '">Table</button></div></div></div>';
    if (p.exits && p.exits.length) {
      html += '<div class="exits">' + p.exits.map(function (ex) {
        return '<div class="exit"><h3>' + icon('flag') + 'Finish with: ' + esc(ex.title) + '</h3><p>' + esc(ex.text) + '</p><div class="chips">' + ex.nodes.map(function (id) { return topicLink(id); }).join('') + '</div></div>';
      }).join('') + '</div>';
    }
    if (!ids.length) return html + '<div class="empty-state">Every topic here is marked done.</div>';
    var L = assignLayers(ids, edgesAmong(ids)).layer;
    var stages = [];
    ids.forEach(function (id) { (stages[L[id]] = stages[L[id]] || []).push(id); });
    if (settings.layout === 'table') {
      html += '<div class="tablebox"><table class="gtable"><thead><tr><th>Topic</th><th>Primary text</th><th>Primary course</th><th>Lectures</th><th>Progress</th></tr></thead><tbody>' +
        stages.map(function (list, i) {
          return '<tr class="is-stage"><td colspan="5">Stage ' + (i + 1) + ' · ' + plural(list.length, 'topic') + '</td></tr>' + list.map(function (id) { return guideRow(id, pid); }).join('');
        }).join('') + '</tbody></table></div>';
    } else {
      html += stages.map(function (list, i) {
        return '<div class="stage"><div class="stage-head"><span class="k">Stage</span><b>' + (i + 1) + '</b><small>' + plural(list.length, 'topic') + '</small></div>' +
          '<div class="cards">' + list.map(function (id) { return guideCard(id, pid); }).join('') + '</div></div>';
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
  function guideCard(id, pid) {
    var n = node(id), t = pick(n, 'primary-text'), c = pick(n, 'primary-course'), isExt = n.paths.indexOf(pid) < 0, st = statusOf(id);
    var count = { practice: 0, secondary: 0, reference: 0 };
    n.resources.forEach(function (r) { if (count[r.role] != null) count[r.role]++; });
    var needs = hard(n);
    return '<article class="gcard' + (isExt ? ' is-ext' : '') + (st === 'done' ? ' is-done' : '') + '" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<div class="gcard-head"><div><p class="eyebrow gcard-kicker"><span class="dot"></span>' + esc(isExt ? 'From ' + pathOf(homeOf(n)).short : LEVEL[n.level] || '') + (n.optional ? ' · optional' : '') + '</p>' +
      '<a class="gcard-title" href="#n-' + esc(id) + '">' + esc(n.title) + '</a></div>' + cycleButton(id) + '</div>' +
      '<p class="gcard-scope">' + esc(n.scope) + '</p>' +
      '<dl class="picks-mini">' +
      (t ? '<div><dt>Text</dt><dd>' + ext(t.url, esc(t.title)) + ' <span>' + esc(t.by || '') + '</span></dd></div>' : '') +
      '<div><dt>Course</dt><dd>' + (c ? ext(c.url, esc(c.title)) + ' ' + lectureTag(n) : '<span>No course fits this topic; learn it from the text.</span>') + '</dd></div></dl>' +
      '<div class="gcard-foot"><span>' + [count.practice ? plural(count.practice, 'practice item') : '', count.secondary ? count.secondary + ' gap-filling' : '', needs.length ? 'needs ' + needs.length : 'no prerequisites'].filter(Boolean).join(' · ') + '</span>' +
      '<a href="#n-' + esc(id) + '">Open ' + icon('arrow-right') + '</a></div></article>';
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
    var html = '<div class="cfilter"><div class="seg" role="group" aria-label="Show">' + filters.map(function (x) {
      return '<button type="button" data-course-filter="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + '</button>';
    }).join('') + '</div><span class="chip">' + plural(shown.length, 'resource') + ' · most-used first</span></div>';
    html += '<p class="prose" style="color:var(--muted)">This view groups the route by resource instead of by topic. A course that serves several topics appears once, with the part each topic uses.</p>';
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
    var t = pick(n, 'primary-text'), c = pick(n, 'primary-course');
    var practice = n.resources.filter(function (r) { return r.role === 'practice'; });
    var gaps = n.resources.filter(function (r) { return r.role === 'secondary'; });
    var refs = n.resources.filter(function (r) { return r.role === 'reference'; });
    var open = settings.detail === 'all' ? ' open' : '';
    var paths = n.paths.map(function (p) { return pathOf(p).published ? '<a href="#p-' + esc(p) + '">' + esc(pathOf(p).short) + '</a>' : esc(pathOf(p).short); }).join(', ');
    var html = '<article class="topic wrap" style="--pc:var(--pc-' + esc(homeOf(n)) + ')">' +
      '<header class="topic-head"><p class="eyebrow">' + badge(homeOf(n), 'badge-sm') + '<span>' + paths + '</span><span>·</span><span>' + esc(LEVEL[n.level] || '') + '</span>' + (n.optional ? '<span>· optional</span>' : '') + (n.branch ? '<span>· branch: ' + esc(n.branch.replace(/-/g, ' ')) + '</span>' : '') + '</p>' +
      '<h1>' + esc(n.title) + '</h1><p class="lede">' + esc(n.scope) + '</p>' +
      '<div class="topic-bar">' + statusControl(id) + '</div>' + relations(id) + '</header>';
    html += '<section class="block"><div class="block-head"><h2>Start here</h2><p>The text and the course this topic is learned from.</p></div><div class="picks">' +
      (t ? pickCard(t, id) : '') + (c ? pickCard(c, id) : noCourse(n)) + '</div></section>';
    if (practice.length) html += '<section class="block"><div class="block-head"><h2>Practice</h2><p>Named exercises, labs and problem sets.</p></div><ul class="rlist">' + practice.map(function (r) { return resourceItem(r, id); }).join('') + '</ul></section>';
    if (gaps.length) html += '<details class="more"' + open + '><summary>Fills a gap<small>' + plural(gaps.length, 'resource') + '</small>' + icon('arrow-right') + '</summary><div class="more-body"><p class="by">Each covers something the primary picks leave out.</p><ul class="rlist">' + gaps.map(function (r) { return resourceItem(r, id); }).join('') + '</ul></div></details>';
    if (refs.length) html += '<details class="more"' + open + '><summary>Reference<small>' + plural(refs.length, 'resource') + '</small>' + icon('arrow-right') + '</summary><div class="more-body"><p class="by">For looking things up, not for reading cover to cover.</p><ul class="rlist">' + refs.map(function (r) { return resourceItem(r, id); }).join('') + '</ul></div></details>';
    if (n.considered && n.considered.length) html += '<details class="more"' + open + '><summary>Considered, not chosen<small>' + plural(n.considered.length, 'candidate') + '</small>' + icon('arrow-right') + '</summary><div class="more-body"><ul class="considered">' +
      n.considered.map(function (x) { return '<li>' + (x.url ? ext(x.url, esc(x.title)) : '<b>' + esc(x.title) + '</b>') + '<span class="prose" style="color:var(--muted);font-size:14px">' + rich(x.reason) + '</span></li>'; }).join('') + '</ul></div></details>';
    var oq = n.open_questions || [];
    if (n.notes || oq.length) html += '<details class="more"' + open + '><summary>Curation notes<small>last checked ' + esc(monthYear(n.last_verified)) + '</small>' + icon('arrow-right') + '</summary><div class="more-body">' +
      (n.notes ? '<p class="prose">' + rich(n.notes) + '</p>' : '') +
      (oq.length ? '<div><span class="k">Open questions</span><ul class="notes-list">' + oq.map(function (q) { return '<li class="prose" style="font-size:14px">' + rich(typeof q === 'string' ? q : JSON.stringify(q)) + '</li>'; }).join('') + '</ul></div>' : '') + '</div></details>';
    return html + '</article>';
  }

  /* ---------------------------------------------------------------- about */
  function aboutView() {
    return '<section class="about wrap"><div style="display:grid;gap:12px"><p class="eyebrow">About</p><h1>How to read the roadmap</h1>' +
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
    if (r.page === 'path' && pathOf(r.path)) {
      parts.push('<a href="#p-' + esc(r.path) + '">' + esc(pathOf(r.path).short) + '</a>', '<span>' + esc(VIEWS[r.view]) + '</span>');
    } else if (r.page === 'topic' && has(r.id)) {
      var p = ui.lastPath && pathOf(ui.lastPath) && pathOf(ui.lastPath).published ? ui.lastPath : null;
      if (p) parts.push('<a href="#p-' + esc(p) + '">' + esc(pathOf(p).short) + '</a>');
      parts.push('<span>' + esc(node(r.id).title) + '</span>');
    } else if (r.page === 'about') parts.push('<span>About</span>');
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
    document.body.toggleAttribute('data-wide', r.page === 'path');
    main.innerHTML = html;
    crumbs(r);
    if (r.page === 'path' && r.view === 'map' && pathOf(r.path) && pathOf(r.path).published) setupMap(r.path, opts.keepScroll);
    if (r.page === 'home') fitOverview();
    window.scrollTo(0, keepY);
    if (!opts.keepScroll && !opts.silent) main.focus({ preventScroll: true });
  }
  function notFound(msg) { return '<section class="wrap empty-state"><h1>Not here</h1><p class="lede" style="margin-top:12px">' + esc(msg) + '</p><p style="margin-top:18px"><a class="btn" href="#home">Back to all paths</a></p></section>'; }

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
    var btn = $('#btn-theme');
    if (btn) {
      var dark = isDarkNow();
      btn.innerHTML = icon(dark ? 'sun' : 'moon');
      btn.setAttribute('aria-label', dark ? 'Switch to light' : 'Switch to dark');
      btn.setAttribute('title', dark ? 'Switch to light' : 'Switch to dark');
    }
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
      if (page === 'path' && $('#map-vp')) sizeMap();
      if (wasWide !== null && (w !== wasWide || d !== wasDir) && page === 'path') render({ keepScroll: true, full: true, silent: true });
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
      $('#main').innerHTML = '<section class="wrap empty-state"><h1>The roadmap data did not load</h1><p class="lede" style="margin-top:12px">The page needs <code>data.json</code> next to it (' + esc(err.message) + '). ' +
        'To preview locally, build and serve the folder: <code>python3 site/build.py</code> then <code>python3 -m http.server --directory _site</code>.</p></section>';
    });
})();
