#!/usr/bin/env python3
"""Build the CS Roadmap website from the research data.

    python3 site/build.py                  # writes _site/ (what GitHub Pages serves)
    python3 site/build.py --preview DIR    # also writes a one-page preview (CSS and JS inlined) plus data.json to DIR

Inputs
  research/skeleton.yaml, research/nodes/*.yaml   the curated data (single source of truth)
  site/config.yaml                                which paths to publish
  site/content/paths.yaml                         path descriptions, families and line badges
  site/src/                                       index.html, styles.css, app.js (no build tools, no dependencies)
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import re
import shutil

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
SRC = SITE / "src"
RESEARCH = ROOT / "research"

NODE_KEYS = ("id", "title", "scope", "level", "paths", "optional", "branch", "hard", "soft",
             "resources", "considered", "notes", "open_questions", "last_verified")
RES_KEYS = ("id", "role", "kind", "title", "by", "url", "edition_or_term", "access", "use", "why", "verified", "course")


def read_yaml(path: pathlib.Path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def ancestors(start, nodes, key="hard"):
    """All prerequisites (of the given kind) of the start nodes, transitively."""
    seen, stack = set(), list(start)
    while stack:
        for parent in nodes[stack.pop()].get(key) or []:
            if parent not in seen:
                seen.add(parent)
                stack.append(parent)
    return seen


def path_links(path_ids, members, nodes):
    """Path-level links: A -> B when a topic whose home path is B requires a topic whose home path is A.

    A topic's home path is the first path it lists. Links that would close a cycle are dropped,
    heavier links first, so the overview drawing stays acyclic.
    """
    home = {nid: n["paths"][0] for nid, n in nodes.items()}
    weight: dict[tuple[str, str], int] = {}
    for b in path_ids:
        for nid in members[b]:
            if home[nid] != b:
                continue
            for parent in nodes[nid].get("hard") or []:
                a = home[parent]
                if a != b:
                    weight[(a, b)] = weight.get((a, b), 0) + 1
    rank = {p: i for i, p in enumerate(path_ids)}
    adjacency = {p: set() for p in path_ids}

    def reaches(src, dst):
        stack, seen = [src], {src}
        while stack:
            v = stack.pop()
            if v == dst:
                return True
            for w in adjacency[v] - seen:
                seen.add(w)
                stack.append(w)
        return False

    links = []
    for (a, b), w in sorted(weight.items(), key=lambda kv: (-kv[1], rank[kv[0][0]], rank[kv[0][1]])):
        if reaches(b, a):
            continue
        adjacency[a].add(b)
        links.append({"from": a, "to": b, "weight": w})
    return links


def clean_node(n):
    out = {k: n[k] for k in NODE_KEYS if n.get(k) not in (None, "", [])}
    out["resources"] = [{k: r[k] for k in RES_KEYS if r.get(k) not in (None, "")} for r in n.get("resources") or []]
    return out


def build_data():
    skeleton = read_yaml(RESEARCH / "skeleton.yaml")
    order = [n["id"] for n in skeleton["nodes"]]
    nodes = {}
    for f in sorted((RESEARCH / "nodes").glob("*.yaml")):
        d = read_yaml(f)
        nodes[d["id"]] = d
    missing = sorted(set(order) - set(nodes))
    if missing:
        raise SystemExit(f"node files missing for: {', '.join(missing)}")

    config = read_yaml(SITE / "config.yaml")
    copy = read_yaml(SITE / "content" / "paths.yaml")
    path_ids = list(skeleton["paths"])
    family_paths = [p for fam in copy["families"] for p in fam["paths"]]
    if sorted(family_paths) != sorted(path_ids):
        raise SystemExit("site/content/paths.yaml: the families must list every path exactly once")

    publish = path_ids if config.get("publish_paths") == "all" else list(config.get("publish_paths") or [])
    unknown = [p for p in publish if p not in path_ids]
    if unknown:
        raise SystemExit(f"site/config.yaml: unknown paths in publish_paths: {', '.join(unknown)}")

    members = {p: [i for i in order if p in nodes[i]["paths"]] for p in path_ids}
    include: set[str] = set()
    for p in publish:
        own = set(members[p])
        include |= own | ancestors(own, nodes, "hard")
        include |= {s for v in own for s in nodes[v].get("soft") or []}

    paths_out = []
    for fam in copy["families"]:
        for p in fam["paths"]:
            c = copy["paths"].get(p) or {}
            for ex in c.get("exits") or []:
                bad = [n for n in ex.get("nodes", []) if n not in members[p]]
                if bad:
                    raise SystemExit(f"site/content/paths.yaml: exit '{ex.get('title')}' of {p} lists topics outside the path: {bad}")
            paths_out.append({
                "id": p,
                "title": skeleton["paths"][p],
                "short": c.get("short", skeleton["paths"][p]),
                "code": c.get("code", p[:2].upper()),
                "family": fam["id"],
                "tagline": c.get("tagline", ""),
                "destination": c.get("destination", ""),
                "exits": c.get("exits") or [],
                "count": len(members[p]),
                "optional": sum(1 for i in members[p] if nodes[i].get("optional")),
                "published": p in publish,
                "members": members[p] if p in publish else [],
            })

    shipped = [i for i in order if i in include]
    urls = {re.sub(r"#.*$", "", r["url"]).rstrip("/").lower() for n in nodes.values() for r in n.get("resources") or []}
    checked = max((str(n.get("last_verified", "")) for n in nodes.values()), default="")
    return {
        "site": {
            "title": config["title"],
            "tagline": config["tagline"],
            "repo": config.get("repo", ""),
            "built": dt.date.today().isoformat(),
            "checked": checked,
            "preview": len(publish) < len(path_ids),
        },
        "families": [{"id": f["id"], "title": f["title"], "paths": f["paths"]} for f in copy["families"]],
        "paths": paths_out,
        "pathLinks": path_links([p["id"] for p in paths_out], members, nodes),
        "order": shipped,
        "nodes": {i: clean_node(nodes[i]) for i in shipped},
        "stats": {"topics": len(order), "paths": len(path_ids), "resources": len(urls), "published": len(publish)},
    }


def write_site(data, out: pathlib.Path):
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    for name in ("index.html", "styles.css", "app.js"):
        shutil.copy2(SRC / name, out / name)
    (out / "data.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":"), default=str), encoding="utf-8")
    (out / ".nojekyll").write_text("", encoding="utf-8")


def write_preview(data, out: pathlib.Path):
    """One self-contained page (fonts aside) plus data.json, for sharing a preview outside GitHub Pages."""
    html = (SRC / "index.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    js = (SRC / "app.js").read_text(encoding="utf-8")
    if "</script" in js.lower() or "</style" in css.lower():
        raise SystemExit("app.js or styles.css contains a closing tag that would break inlining")
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body[^>]*>(.*?)</body>", html, re.S).group(1)
    title = re.search(r"<title>.*?</title>", head, re.S).group(0)
    fonts = "\n".join(re.findall(r'<link rel="(?:preconnect|stylesheet)" href="https://fonts[^>]*>', head))
    early = re.search(r"<script>.*?</script>", head, re.S).group(0)
    body = body.replace('<script src="app.js"></script>', f"<script>\n{js}\n</script>")
    page = "\n".join([title, '<meta name="claude:viewport-fit-sides" content="cover">', fonts,
                      f"<style>\n{css}\n</style>", early, body.strip(), ""])
    out.mkdir(parents=True, exist_ok=True)
    (out / "index.html").write_text(page, encoding="utf-8")
    (out / "data.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":"), default=str), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--out", default=str(ROOT / "_site"), help="output folder for GitHub Pages (default: _site)")
    ap.add_argument("--preview", help="also write a single-page preview to this folder")
    args = ap.parse_args()
    data = build_data()
    write_site(data, pathlib.Path(args.out))
    if args.preview:
        write_preview(data, pathlib.Path(args.preview))
    pub = [p["short"] for p in data["paths"] if p["published"]]
    print(f"built {args.out}: {len(data['nodes'])} topics shipped for {', '.join(pub)} "
          f"({data['stats']['topics']} researched across {data['stats']['paths']} paths)")


if __name__ == "__main__":
    main()
