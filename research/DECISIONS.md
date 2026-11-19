# Decisions (owner-approved, applied 2026-11-19)

Rule from the owner: **no time estimates anywhere** (no hours, weeks or durations). Removed from every node, the schema and
the validator (`estimated_hours` is now rejected).

## A. Structure
- **A1.** Core CS keeps all its subjects as required. (Calculus is now two Core nodes after split B3, so Core has 26 nodes.)
- **A2.** Ten nodes stay text-first (no suitable course exists): fuzzing-and-vuln-discovery, go-programming,
  high-performance-python, interpreters, large-scale-system-design, performance-analysis, python-in-depth, scientific-python,
  storage-and-file-systems, virtualization-and-containers. (floating-point-and-low-precision, created by B2, is also text-first.)
- **A3.** Same-job duplicates across groups removed or turned into distinct slices: algs4 and VisuAlgo (algorithms vs
  data-structures), From Python to NumPy (kept in high-performance-python), OverTheWire (Bandit in dev-environment, Natas in
  security-fundamentals), Drepper (memory-systems vs performance-engineering), Statistical Rethinking (preview in statistics,
  full course in bayesian-inference), RLHF Book and course (post-training vs rl-for-llms).

## B. Node splits applied (129 -> 139 nodes)
| Item | From | To |
|---|---|---|
| B1 | optimization | convex-optimization (Theory), optimization-for-ml (ML Foundations) |
| B2 | numerical-methods + gemm-and-tensor-cores | new floating-point-and-low-precision (ML Systems) |
| B3 | calculus | calculus-single-variable, calculus-multivariable (both Core) |
| B4 | consensus-and-replication | replication-and-consistency, consensus-protocols |
| B5 | distributed-transactions-and-storage | sharding-and-distributed-kv, distributed-transactions |
| B6 | advanced-algorithms | advanced-algorithms (flows, LP, online), new advanced-data-structures |
| B7 | computational-complexity | computational-complexity (I), new advanced-complexity (optional) |
| B8 | learning-theory | learning-theory (statistical), new deep-learning-theory (optional) |
| B9 | linux-kernel-internals | linux-kernel-internals (core), new linux-device-drivers (optional) |
| B10 | systems-security | systems-security (OS isolation), new hardware-security |
| B11 | c-programming | CS107 lectures sliced between c-programming and computer-systems (no new node) |

Kept as single nodes (B12-B28): statistics, go-programming, virtualization-and-containers, performance-engineering,
transactions-and-recovery, advanced-database-systems, large-scale-system-design, compiler-construction, program-verification,
binary-exploitation, neural-3d, generative-models-at-scale, llm-applications, llm-agents, scaling-and-pretraining,
llm-inference-and-serving, model-parallelism.

## C. Prerequisites applied
- **C1** cpp-programming: hard python-programming, soft c-programming.
- **C2** distributed-systems-fundamentals: concurrent-programming is hard.
- **C3** distributed-transactions: transactions-and-recovery is hard.
- **C4** program-verification: hard programming-language-concepts + discrete-math; type-systems soft.
- **C5** diffusion-and-flow-matching: hard deep-learning-fundamentals + probability; generative-modeling-foundations soft.
- **C6** multi-view-geometry: convex-optimization is hard.
- **C7** hardware-security: computer-architecture is hard.
- **C8-C10** rejected: cryptography-foundations, formal-methods-for-systems and interpreters keep their soft edges.
- **C11** linear-algebra no longer lists calculus; vision-foundations no longer lists deep-learning-fundamentals.
- **C12** ~60 soft additions applied. Dropped to avoid cycles (learning order kept): llm-evaluation -> post-training,
  llm-evaluation -> llm-applications, operating-systems -> concurrent-programming, parallel-programming ->
  performance-engineering, model-compression -> llm-inference-and-serving (the reverse edge is kept).

## D. Merge housekeeping done
- Facts for reused courses aligned (CS336 and RLHF course public-video links filled in every node that uses them).
- Validator: 139 nodes, 0 errors, no cycles.

## E. Deferred to the presentation phase
- Anchor courses vs per-node slices (CS336 is primary in 8 nodes; Berkeley CS 285 in 4; CMU 15-445 in 4; MIT 6.S894 in 3).
- Path ordering, how optional nodes and branches are shown, starting points.

## F. Owner additions (2026-11-19)
- **deep-learning-fundamentals:** Stanford CS 312 *Deep Learning Alchemy* (https://deep-learning-alchemy.github.io/, Fall 2026)
  as a secondary course: six public experiment assignments and outcome-prediction quizzes with answer slides;
  recordings announced as public, not yet posted. Deep-ML *Deep Neural Networks* collection as practice.
- **ml-fundamentals:** Deep-ML *An Introduction to Statistical Learning* and *Machine Learning Fundamentals*
  collections as practice (https://www.deep-ml.com/collections).
- Site: every path published (`site/config.yaml: publish_paths: all`).
- **ml-fundamentals / applied-ml-practice:** Pyrcz, *Applied Machine Learning in Python: A Hands-on Guide with Code*
  (https://geostatsguy.github.io/MachineLearningDemos_Book/intro.html, free e-book with notebooks) as a secondary
  resource: method walkthroughs in ml-fundamentals; training, feature and model-checking chapters in applied-ml-practice.
- **c-programming:** King, *C Programming: A Modern Approach* (2nd ed.) is now the primary text (best for learning C,
  exercises and projects every chapter); Gustedt, *Modern C* (C23) moves to secondary for C11-C23 and precise semantics.
