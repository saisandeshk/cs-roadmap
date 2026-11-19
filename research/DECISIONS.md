# Decision sheet: organization questions from the research

Every item has a recommendation. Reply with **"accept all"** or list overrides by number (e.g. "B4 keep, C2 reject").
Nothing here changes resources; it changes how the 129 nodes are structured. Presentation is decided separately (section E).

---

## A. Structure

**A1. Core CS stays at 25 nodes (~2,600 focused hours).**
Core is what you asked for (two languages, architecture, OS, parallel, plus math, algorithms, theory, networking, databases,
security, PL concepts, intro AI). It is long: roughly 1.5 years full-time. Heaviest items: computer-systems, operating-systems,
os-kernel-implementation, algorithms, algorithm-design.
- **Rec: keep all 25 as Core.** Alternative: mark os-kernel-implementation and theory-of-computation as "Core, deeper" (optional on a first pass).

**A2. Ten nodes have no primary course (book/website only).**
fuzzing-and-vuln-discovery, go-programming, high-performance-python, interpreters, large-scale-system-design, performance-analysis,
python-in-depth, scientific-python, storage-and-file-systems, virtualization-and-containers.
Workers searched and a reviewer re-checked; nothing with public lectures fits these scopes (each node's `notes` says why).
- **Rec: accept them as text-first nodes** (they all have named practice).

**A3. Clean up true duplicates across groups (I do this, no agents).**
32 URLs appear in nodes owned by different groups. Most are intentional slices (CS336 lectures split across 11 nodes, ETH DDCA
across 5). A handful are the same item doing the same job twice, e.g. 6.006 / algs4 / VisuAlgo in both algorithms and
data-structures; From Python to NumPy and numpy-100 in both scientific-python and high-performance-python; RLHF Book course in
both post-training and rl-for-llms; Statistical Rethinking in both statistics and bayesian-inference; OverTheWire Bandit in
dev-environment and security-fundamentals.
- **Rec: yes, I keep each in the node where it fits best and leave a pointer in the other.**

---

## B. Proposed node splits (29 proposals)

| # | Node | Proposal | Rec | Why |
|---|---|---|---|---|
| B1 | optimization | convex-optimization (theory) + optimization-for-ml | **Split** | ML path needs the second, Theory path the first |
| B2 | numerical-methods + gemm-and-tensor-cores | one new shared node "floating point & low-precision formats" (FP32 to FP8/MX/NVFP4) | **Split** | Two workers proposed the same gap from both sides; ML Systems needs it, numerical LA does not |
| B3 | calculus | single-variable + multivariable | **Split** | Many routes need only multivariable before matrix-calculus |
| B4 | consensus-and-replication | replication & consistency models + consensus protocols (Raft labs) | **Split** | Raft labs alone are 40+ h; consistency models are needed without them |
| B5 | distributed-transactions-and-storage | sharding & distributed KV + distributed transactions | **Split** | Two ~40 h units with different practice |
| B6 | advanced-algorithms | split out advanced data structures (6.851) | **Split** | Four areas in one node; streaming/sketching already lives in randomized-algorithms |
| B7 | computational-complexity | Complexity I + Complexity II (IP, PCP, derandomization) | **Split** | Two courses' worth; II optional |
| B8 | learning-theory | statistical learning theory + theory of deep learning | **Split** | Second is research-level; optional |
| B9 | linux-kernel-internals | kernel core + device drivers | **Split** | Drivers are a distinct skill; optional |
| B10 | systems-security | OS isolation/sandboxing + hardware security (side channels, TEEs) | **Split** | MIT 6.5950 is a full course on the second |
| B11 | c-programming | CS107 lectures 1-12 here, 13-25 cited in computer-systems | **Yes** | Resource slicing only, no new node |
| B12 | statistics | separate causal-inference-and-experimentation node | **No** | Already exists as causal-inference (ML Foundations branch) |
| B13 | go-programming | merge into a distributed-systems prep block | **No** | Reviewer disagreed; it stays a small optional node |
| B14 | virtualization-and-containers | hypervisors + containers | **No** | Small node; containers alone lean DevOps, which you excluded |
| B15 | performance-engineering | CPU tuning + algorithms-for-hardware | **No** | Worker itself recommends keeping one node |
| B16 | transactions-and-recovery | concurrency control + logging/recovery | **No** | Taught as one unit everywhere (~70 h) |
| B17 | advanced-database-systems | analytical engines + cloud-native platforms | **No** | Paper-driven advanced node; fine as one |
| B18 | large-scale-system-design | system design + SRE/reliability | **No** | SRE as its own node drifts toward DevOps |
| B19 | compiler-construction | front end + back end | **No** | Taught as one course; ~120 h is acceptable |
| B20 | program-verification | proof assistants/Hoare + separation logic/verified systems | **No** | Only if it exceeds ~90 h; it does not |
| B21 | binary-exploitation | separate reverse engineering | **No** | Only needed for a malware/RE path |
| B22 | neural-3d | neural rendering + 3D deep learning | **No** | Vision path already has 7 nodes |
| B23 | generative-models-at-scale | split out audio (and video) generation | **No** | Keep audio as an optional part inside the node |
| B24 | llm-applications | split out llmops-and-guardrails | **No** | Thin material; stays inside the AI-engineering branch |
| B25 | llm-agents | split out agent security & sandboxing | **No** | Small; already cross-linked to safety evals |
| B26 | scaling-and-pretraining | scaling laws + pretraining recipes | **No** | Fits one node |
| B27 | llm-inference-and-serving | fundamentals + fleet serving ops | **No** | Worker says it fits one node |
| B28 | model-parallelism | checkpointing & fault tolerance as own node | **No** | Short topic; keep inside |

Accepting the recommendations adds 10 nodes (B1-B10) for ~139 total. Split nodes reuse the existing researched resources;
I divide them, no new research needed.

---

## C. Prerequisite changes

**Hard-edge changes (decide individually):**

| # | Change | Rec |
|---|---|---|
| C1 | cpp-programming: c-programming hard -> soft (learncpp starts from zero) | **Accept** |
| C2 | distributed-systems-fundamentals: concurrent-programming soft -> hard (MIT labs need threads/locks) | **Accept** |
| C3 | distributed-transactions: transactions-and-recovery soft -> hard (Spanner/Percolator assume 2PL/MVCC) | **Accept** |
| C4 | program-verification: type-systems hard -> soft; add hard programming-language-concepts + discrete-math (SF teaches Hoare logic before types) | **Accept** |
| C5 | diffusion-and-flow-matching: generative-modeling-foundations hard -> soft; hard = deep-learning-fundamentals + probability (MIT 6.S184's own prereqs) | **Accept** |
| C6 | multi-view-geometry: optimization soft -> hard (bundle adjustment) | **Accept** |
| C7 | hardware-security (if B10): computer-architecture hard | **Accept** |
| C8 | cryptography-foundations: computational-complexity soft -> hard | **Reject** (Katz-Lindell / Joy of Crypto do not need it) |
| C9 | formal-methods-for-systems: consensus-and-replication soft -> hard | **Reject** (TLA+ is learnable before Raft) |
| C10 | interpreters: c-programming soft -> hard (clox half is C) | **Reject**, keep soft with a note (tree-walking half is Java/any language) |
| C11 | linear-algebra: drop soft calculus; vision-foundations: drop soft deep-learning-fundamentals | **Accept** |

**C12. All remaining soft-prerequisite additions (~60, listed in each node's `prereq_changes`).**
Examples: dev-environment -> python-in-depth/c-programming/data-structures/software-construction; scientific-python ->
ml-fundamentals; computer-architecture -> os-kernel-implementation (xv6 is RISC-V); databases-intro -> batch-and-stream-processing.
A few proposals point at each other and would create cycles (llm-evaluation <-> post-training, llm-applications ->
retrieval-and-rag -> llm-evaluation -> llm-applications, model-compression <-> llm-inference-and-serving). I resolve each cycle by
keeping the edge that follows learning order and list what I dropped.
- **Rec: accept all, with cycle resolution by me.**

---

## D. Things I will do during the merge (no decision needed, listed for transparency)
- Normalize facts for courses reused across nodes (e.g. CS336 `public_videos_url` present in some nodes only; one canonical
  ETH DDCA id/number already done).
- Re-run the validator (format, cycles) and the link check after the merge.
- Keep `considered`, `notes`, hours, level, access and video status untouched: that is your data for the presentation decisions.

## E. Deferred to the presentation phase (your call later, nothing to decide now)
- **Anchor courses vs per-node slices.** Some courses are primary across many nodes (Stanford CS336: 8 nodes; Berkeley CS 285: 4;
  CMU 15-445: 4; MIT 6.S894: 3; MIT 6.5840: 2). The data keeps exact per-node slices, so either "take CS336 once" or
  "node by node" can be presented.
- Path ordering, hours display, how optional branches and starting points are shown.

---

**Reference numbers (for scale):** focused hours by path from the node estimates: Core ~2,625; ML Foundations ~1,180;
ML Systems ~1,260; Theory ~1,420; OS & Performance ~1,065; Security ~1,060; PL & Compilers ~740; LLMs ~650;
Architecture ~560; Databases ~560; Distributed ~545; RL ~400; Vision ~385; Generative ~355; Safety ~295.
(Path totals include nodes shared with Core.)
