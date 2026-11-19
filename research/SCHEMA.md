# Research node format

One YAML file per node: `research/nodes/<node-id>.yaml`. Only the owning group writes a node's file.
This is a **data-collection** format. How the roadmap is finally organized and presented is decided later, so record everything
that could matter for that decision (alternatives considered, level, access, video availability).
**No time estimates anywhere** (no hours, weeks or durations): the owner does not want fixed time attached to anything.

```yaml
# --- copied from research/skeleton.yaml (edit only via prereq_changes / split_proposal below) ---
id: operating-systems
title: Operating Systems
group: G4
paths: [core]
hard: [computer-systems]
soft: []
scope: "Processes, scheduling, virtual memory, ..."

# --- curation data ---
level: intro            # intro | intermediate | advanced
resources:
  - id: ostep                         # short slug, unique within this node
    role: primary-text                # primary-text | primary-course | secondary | reference | practice
    kind: book                        # book | website | course | video-series | practice-site | paper | docs | article | tool
    title: "Operating Systems: Three Easy Pieces"
    by: "Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau"
    url: https://pages.cs.wisc.edu/~remzi/OSTEP/
    edition_or_term: "Version 1.10"
    access: free                      # free | paid | mixed | account-required
    use: "Virtualization (ch. 4-24), Concurrency (26-34), Persistence (36-45); do the homework simulators."
    why: "The clearest conceptual treatment of OS; free; homework simulators for every chapter."
    verified: true                    # you opened this URL during this research and it is live and matches
  - id: mit-6-1810
    role: primary-course
    kind: course
    title: "MIT 6.1810 Operating System Engineering"
    by: "MIT (Kaashoek, Morris)"
    url: https://pdos.csail.mit.edu/6.1810/
    edition_or_term: "Fall 2025"
    access: free
    use: "All labs (util, syscall, pgtbl, traps, cow, thread, net, lock, fs, mmap)."
    why: "..."
    verified: true
    course:                           # REQUIRED when kind == course
      latest_term: "Fall 2025"        # newest offering found (check for 2026 runs)
      latest_url: https://pdos.csail.mit.edu/6.1810/2025/
      videos: public                  # public | enrolled-only | none | unknown  (for latest_term)
      public_videos_term: "Fall 2020" # newest run whose lecture videos are publicly watchable (omit if same as latest)
      public_videos_url: https://www.youtube.com/...
      assignments: public-with-autograder   # public-with-autograder | public | partial | restricted | none | unknown
      assignments_url: https://pdos.csail.mit.edu/6.1810/2025/labs/
considered:                           # strong candidates NOT chosen, kept for later decisions
  - {title: "Operating System Concepts (Silberschatz)", url: "https://...", reason: "Encyclopedic; kept out because OSTEP covers the same ground more clearly."}
notes: "Curation rationale, coverage gaps, anything the reviewer should know."
split_proposal: null                  # or "Split into X (...) and Y (...) because ..."
prereq_changes: null                  # or "Add hard: [x] because ..."
open_questions: []                    # things you could not resolve or verify
last_verified: 2026-11-18
```

## Rules
- Exactly **one** `primary-text` (a book OR a website/online text, whichever is genuinely best).
- At most **one** `primary-course`. If no course is good enough, omit it and say why in `notes`.
- `secondary`/`reference` only when they fill a named gap (stated in `why`). `practice` items must be specific
  (named labs, problem sets, modules, exercises), not "do the whole site", unless the site is itself a structured curriculum.
- Every resource needs `use` and `why`. Every URL must be HTTPS and opened by you (`verified: true`); if you could not open it, set
  `verified: false` and explain in `open_questions`.
- Books: choose purely on quality. Paid is fine; link the publisher or author page.
- Websites/practice: prefer free when quality is comparable.
