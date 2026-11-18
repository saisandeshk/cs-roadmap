#!/usr/bin/env python3
"""Validate research/skeleton.yaml and research/nodes/*.yaml.

Usage: python3 research/tools/validate.py [--group G4] [--skeleton-only]
"""
import argparse
import pathlib
import sys
from collections import defaultdict

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
ROLES = {"primary-text", "primary-course", "secondary", "reference", "practice"}
KINDS = {"book", "website", "course", "video-series", "practice-site", "paper", "docs", "article", "tool"}
ACCESS = {"free", "paid", "mixed", "account-required"}
VIDEOS = {"public", "enrolled-only", "none", "unknown"}
ASSIGN = {"public-with-autograder", "public", "partial", "restricted", "none", "unknown"}
LEVELS = {"intro", "intermediate", "advanced"}
REQUIRED_RES = ["id", "role", "kind", "title", "url", "access", "use", "why", "verified"]


def load_skeleton():
    sk = yaml.safe_load((ROOT / "skeleton.yaml").read_text())
    nodes = {n["id"]: n for n in sk["nodes"]}
    return sk, nodes


def check_skeleton(sk, nodes):
    errs = []
    if len(nodes) != len(sk["nodes"]):
        errs.append("duplicate node ids in skeleton")
    for n in sk["nodes"]:
        for p in n["paths"]:
            if p not in sk["paths"]:
                errs.append(f"{n['id']}: unknown path {p}")
        if n["group"] not in sk["groups"]:
            errs.append(f"{n['id']}: unknown group {n['group']}")
        for k in ("hard", "soft"):
            for d in n.get(k, []):
                if d not in nodes:
                    errs.append(f"{n['id']}: unknown {k} prereq {d}")
    # cycle check over hard+soft edges
    graph = {n: nodes[n].get("hard", []) + nodes[n].get("soft", []) for n in nodes}
    state = {}

    def dfs(u, stack):
        state[u] = 1
        for v in graph.get(u, []):
            if v not in graph:
                continue
            if state.get(v) == 1:
                errs.append("cycle: " + " -> ".join(stack + [u, v]))
            elif not state.get(v):
                dfs(v, stack + [u])
        state[u] = 2

    for n in graph:
        if not state.get(n):
            dfs(n, [])
    return errs


def check_node(path, skel_nodes):
    errs, warns = [], []
    try:
        d = yaml.safe_load(path.read_text())
    except Exception as e:  # noqa: BLE001
        return [f"YAML parse error: {e}"], []
    nid = path.stem
    if d.get("id") != nid:
        errs.append(f"id '{d.get('id')}' != filename '{nid}'")
    if nid not in skel_nodes:
        warns.append("node not in skeleton (new/split node?)")
    if d.get("level") not in LEVELS:
        errs.append(f"level must be one of {sorted(LEVELS)}")
    if not isinstance(d.get("estimated_hours"), (int, float)):
        errs.append("estimated_hours missing or not a number")
    res = d.get("resources") or []
    if not res:
        errs.append("no resources")
    roles = defaultdict(int)
    ids, urls = set(), set()
    for i, r in enumerate(res):
        tag = f"resource[{i}] {r.get('id', '?')}"
        for f in REQUIRED_RES:
            if f not in r or r[f] in (None, ""):
                errs.append(f"{tag}: missing {f}")
        if r.get("role") not in ROLES:
            errs.append(f"{tag}: bad role {r.get('role')}")
        if r.get("kind") not in KINDS:
            errs.append(f"{tag}: bad kind {r.get('kind')}")
        if r.get("access") not in ACCESS:
            errs.append(f"{tag}: bad access {r.get('access')}")
        url = str(r.get("url", ""))
        if not url.startswith("https://"):
            errs.append(f"{tag}: url must be https")
        if url in urls:
            warns.append(f"{tag}: duplicate url within node")
        urls.add(url)
        if r.get("id") in ids:
            errs.append(f"{tag}: duplicate resource id")
        ids.add(r.get("id"))
        roles[r.get("role")] += 1
        if r.get("verified") is not True:
            warns.append(f"{tag}: not verified")
        if r.get("kind") == "course":
            c = r.get("course") or {}
            if not c:
                errs.append(f"{tag}: course block required for kind=course")
            else:
                if c.get("videos") not in VIDEOS:
                    errs.append(f"{tag}: course.videos must be one of {sorted(VIDEOS)}")
                if c.get("assignments") not in ASSIGN:
                    errs.append(f"{tag}: course.assignments must be one of {sorted(ASSIGN)}")
                if not c.get("latest_term"):
                    errs.append(f"{tag}: course.latest_term missing")
    if roles["primary-text"] != 1:
        errs.append(f"needs exactly one primary-text (has {roles['primary-text']})")
    if roles["primary-course"] > 1:
        errs.append(f"at most one primary-course (has {roles['primary-course']})")
    if roles["primary-course"] == 0:
        warns.append("no primary-course (explain in notes)")
    return errs, warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--group")
    ap.add_argument("--skeleton-only", action="store_true")
    a = ap.parse_args()
    sk, nodes = load_skeleton()
    serr = check_skeleton(sk, nodes)
    print(f"skeleton: {len(nodes)} nodes, {len(sk['paths'])} paths, {len(serr)} errors")
    for e in serr:
        print("  ERROR", e)
    if a.skeleton_only:
        sys.exit(1 if serr else 0)
    nd = ROOT / "nodes"
    files = sorted(nd.glob("*.yaml")) if nd.exists() else []
    if a.group:
        files = [f for f in files if nodes.get(f.stem, {}).get("group") == a.group or f.stem not in nodes]
    total_err = 0
    for f in files:
        e, w = check_node(f, nodes)
        total_err += len(e)
        if e or w:
            print(f"{f.stem}: {len(e)} errors, {len(w)} warnings")
            for x in e:
                print("  ERROR", x)
            for x in w:
                print("  warn ", x)
    expected = [n for n in nodes if not a.group or nodes[n]["group"] == a.group]
    missing = [n for n in expected if not (nd / f"{n}.yaml").exists()]
    print(f"node files: {len(files)} checked, {total_err} errors; missing {len(missing)}: {', '.join(missing) if missing else '-'}")
    sys.exit(1 if (serr or total_err) else 0)


if __name__ == "__main__":
    main()
