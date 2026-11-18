#!/usr/bin/env python3
"""Check every resource URL in research/nodes/*.yaml.

Writes research/reports/link-check.tsv and prints a summary.
Statuses: ok (2xx/3xx), blocked (401/403/429: site refuses bots, check by hand), broken (404/410/5xx), error (network/timeout).
"""
import concurrent.futures as cf
import pathlib
import subprocess

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"


def status(url):
    def run(method):
        cmd = ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-L", "--max-time", "25", "-A", UA]
        if method == "HEAD":
            cmd.append("-I")
        cmd.append(url)
        try:
            return subprocess.run(cmd, capture_output=True, text=True, timeout=40).stdout.strip() or "000"
        except subprocess.TimeoutExpired:
            return "000"

    code = run("HEAD")
    if not code.startswith(("2", "3")):
        code = run("GET")
    c = int(code) if code.isdigit() else 0
    if 200 <= c < 400:
        return "ok", code
    if c in (401, 403, 429, 999):
        return "blocked", code
    if c == 0:
        return "error", code
    return "broken", code


def main():
    items = []
    for f in sorted((ROOT / "nodes").glob("*.yaml")):
        d = yaml.safe_load(f.read_text()) or {}
        for r in d.get("resources") or []:
            items.append((f.stem, r.get("id", "?"), r.get("url", "")))
            c = r.get("course") or {}
            for k in ("latest_url", "public_videos_url", "assignments_url"):
                if c.get(k):
                    items.append((f.stem, f"{r.get('id', '?')}.{k}", c[k]))
    urls = sorted({u for _, _, u in items})
    with cf.ThreadPoolExecutor(16) as ex:
        res = dict(zip(urls, ex.map(status, urls)))
    out = ROOT / "reports" / "link-check.tsv"
    out.parent.mkdir(exist_ok=True)
    counts = {}
    with out.open("w") as fh:
        fh.write("status\tcode\tnode\tresource\turl\n")
        for node, rid, u in items:
            s, code = res[u]
            counts[s] = counts.get(s, 0) + 1
            fh.write(f"{s}\t{code}\t{node}\t{rid}\t{u}\n")
    print(f"{len(items)} links ({len(urls)} unique):", counts)
    for node, rid, u in items:
        s, code = res[u]
        if s in ("broken", "error"):
            print(f"  {s} {code} {node}/{rid} {u}")


if __name__ == "__main__":
    main()
