# Link check summary (re-run 2026-11-19, after review fixes)

`research/tools/check_links.py` over all node files: **1,829 links (1,269 unique): 1,638 ok, 148 blocked, 42 error, 1 broken.**

- **blocked (148):** sites that refuse automated clients (401/403/429: O'Reilly, Springer, github.com via proxy policy, YouTube rate limits, Cloudflare). Not evidence of dead links; see `link-check.tsv`.
- **error (42):** environment, not dead links. `web.stanford.edu`, `cme296.stanford.edu`, `incompleteideas.net` and `cms.cispa.saarland` fail TLS through this environment's proxy; `www.redbook.io` and `timroughgarden.org` answer over HTTP (the latter 406 to scripted clients). Unreachable from this environment entirely: `web.stanford.edu/~boyd/*`, `web.stanford.edu/class/ee364a/`, `csapp.cs.cmu.edu`.
- **broken (1):** `waveland.com` (Shen & Lipasti publisher) returns 406/409 to scripted clients; marked `verified: false` in its node.

First run (2026-11-18) found one genuinely broken URL (MIT 6.1200J problem sets), which was fixed.
