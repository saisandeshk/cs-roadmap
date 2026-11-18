# Link check summary (2026-11-18)

`research/tools/check_links.py` over all node files: **1,812 links (1,254 unique): 1,628 ok, 146 blocked, 36 error, 2 broken.**

- **blocked (146):** sites that refuse automated clients (401/403/429: O'Reilly, Springer, github.com via proxy policy, YouTube rate limits, Cloudflare). Not evidence of dead links; see `link-check.tsv`.
- **error (36):** environment, not dead links. `web.stanford.edu` and `incompleteideas.net` fail TLS through this environment's proxy but return 200 over HTTP; `www.redbook.io` returns 200 over HTTP. Unreachable from this environment entirely: `web.stanford.edu/~boyd/*`, `web.stanford.edu/class/ee364a/`, `csapp.cs.cmu.edu`.
- **broken (2):**
  - MIT 6.1200J problem-sets URL (404) -> fixed to `/lists/problem-sets/` (200).
  - `waveland.com` (Shen & Lipasti publisher) returns 406/409 to scripted clients; already marked `verified: false`.
