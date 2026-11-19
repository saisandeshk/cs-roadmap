# Review fix log

## G12 Security & cryptography (R2)
- web-security (must-fix): CS 253 latest term Fall 2021; F21 videos commented out -> unknown; public 2019-2020 playlist; assignments public.
- security-fundamentals: web/network now overview only; full chapters/modules moved to web-security / network-security.
- systems-security: removed duplicate Saltzer-Schroeder and BSRS rows; de-duplicated 6.566 lectures/labs and SS3P sections across nodes.
- network-security: added SEED Labs network labs (named). Declined: keep CS 161 as core over 6.566 + Bulletproof TLS (only free source covering ARP/DNS/BGP/DoS/firewalls).
- applied-cryptography: fixed Boneh public-video/assignment facts; Boneh-Shoup ZK/MPC chapters now only in cryptography-foundations.

## G3 Algorithms & theory (R1)
- algorithms: Coursera Part I marked Java-only/account/optional; AtCoder DP A-N listed.
- algorithm-design: Demaine hardness lectures named (2-3, 4-7, 8-9).
- advanced-algorithms: Karger stays primary (Cornell 6820 Zoom recordings need Cornell login, tested); CS261 playlist added; Gupta ch.14-17 optional; duplicate FoDS removed (kept in randomized).
- randomized-algorithms: Fall 2025 + Spring 2021 playlists added; M&U exercises folded into primary.
- learning-theory, computational-complexity, quantum-computing: exercise rows duplicating primary folded in; S-S&B PDF + EE531 caveat noted.
- approximation-algorithms: practice -> Fall 2021 homeworks 0-6.
- Declined: CS 170 videos stay `unknown` (no evidence).

## G4 Machine & OS (R2)
- operating-systems: primary course -> Toronto ECE344 Fall 2024 (all lectures public); CS 162 secondary (HW4, Project 0). OSTEP split: OS node ch.36-37, 39-40, 42; storage node ch.38, 41, 43-45.
- storage-and-file-systems (must-fix): ETH storage URL fixed (doku.php?id=modern_ssds), added as secondary (SSD-only); duplicate MIT fs lab and VFS docs removed.
- parallel-programming: primary course -> CMU 15-418 Fall 2026 (public videos, OpenMP/MPI); CS149 secondary; A1-A4 and 6.172 pointers fixed (L7-L8); Aalto ch.2 only in performance-engineering.
- performance-analysis: Bootlin demoted to secondary; no primary course.
- computer-architecture: MIPS caveat, ETH ID 227-0003-10V, Drepper moved, venus id, Lab 8/Project 4. concurrent-programming: ThreadSanitizer/loom added. linux-kernel-internals, virtualization-and-containers, performance-engineering, os-kernel-implementation, computer-systems: dedupes and small fixes.
- Declined: distinct storage text (McKusick page 404); ETH storage as primary (SSD-only scope).

## G1 Programming (R1)
- python-programming: 61A labs/hw/projects as first practice; Exercism names 16 exercises; MIT 6.100L promoted to fallback; counts corrected.
- python-in-depth: Hettinger/Beazley PyCon talks added; duplicate Exercism removed.
- c-programming: SEE CS107 is an older run of the same course (added lectures 2-7 as free video companion); reading order explicit; King's C Programming as alternative.
- cpp-programming: Algorithmica chapters for performance idioms; Tour of C++ chapters and CppCon talks named; CS106L public videos are 2019 only.
- rust-programming: ECE 1724 numbering fixed (slide decks 1-9).
- software-construction: duplicate 6.102 psets replaced with OCW 6.005 Sp16 (public starter code); Ousterhout page verified.
- dev-environment: Wizard Zines limited to free zines.
- data-structures: Java-for-Python bridge + all-Python route via MIT 6.006 Spring 2020; USF visualizer split out.
- Declined: algorithms-node overlap (G3's); CS107 lecture count stays 13-25 (site lists 25).

## G2 Mathematics (R1)
- discrete-math: practice = 6.1200 psets 01-10 + CS 70 hw/discussions 00-10 (solutions); NNG4 optional.
- calculus: 18.01SC videos = Jerison Fall 2006 lectures.
- linear-algebra: practice = 18.06 psets 1-10 paired to lectures + exams with solutions (4th-ed numbering noted).
- probability: Stat 110 videos "2011-era (term unconfirmed)".
- statistics: 18.650 wording softened; ISLP in considered; Rethinking 2024 reuses 2023 playlist; duplicate Seeing Theory removed.
- optimization: EE127 lectures 26-27 added; paired by topic.
- information-theory: MacKay range 8-11.
- numerical-methods: primary course -> UT ALAFF (embedded videos, answers); 18.335 secondary; ODEs via FNC ch.6; duplicate practice replaced with 18.335 psets 1-4.
- Declined: none.

## G11 Hardware & compilers (R2)
- processor-design: primary course -> Berkeley EECS 151 RISC-V CPU project; ETH DDCA secondary (L7-L13 videos, MIPS-lab caveat).
- ETH DDCA unified across nodes (id eth-ddca, 227-0003-10V), distinct lectures/labs per node.
- digital-logic, advanced-microarchitecture, programming-language-concepts: extras moved to considered; PLC route = Grossman A -> Grossman B + PLAI.
- memory-systems: URL -> ETH Fall 2025 (matches lecture numbers); CS 152 coherence/consistency lectures added; thin ETH coverage noted.
- Added: Sze/Emer NeurIPS 2019 accelerator tutorial video; Bendersky JIT series; GC Handbook chapters checked.
- Fixes: CS143 archive.org link removed; NJU Chinese-only videos noted; type-systems no-public-video caveat; Agner Fog verified; in-group duplicates (PLAI, Crafting Interpreters, CS143, Compiler Explorer) removed.
- Declined: CS 6120 "no video" claim (Fall 2025 page links videos for lessons 2-7 and 12; only 14 lacks one).

## G5 ML foundations (R3)
- deep-learning-fundamentals: primary course -> MIT 6.7960 (OCW Fall 2024, public videos); CS231n A1-A2 kept as practice (vision framing stated).
- ml-fundamentals: CS229 videos -> unknown, assignments -> restricted; psets rewritten as self-implemented exercises; CS229 notes as reading spine.
- applied-ml-practice: d2l-shift moved to considered; Inria module overlap resolved.
- dl-engineering: Manning 2nd ed. linked (published 2026-02-18); duplicate recipe removed.
- probabilistic-graphical-models: CMU 10-708 videos public (28 YouTube links); CS228 staleness caveat.
- graph-neural-networks: 2021 lectures predate graph transformers (noted). intro-ai, scientific-python, bayesian-inference: small fixes.
- Declined: deep-learning-for-vision change (G6's node); suggestions needing unverified sources.

## G6 Vision & generative (R3)
- vision-foundations (must-fix): Szeliski 2e chapter numbers fixed (ch.8 stitching, ch.9 motion, ch.11 SfM); coverage-gap note (features, classical recognition); CS231A PS1 only here.
- multi-view-geometry: CS231A PS2-3 only; TUM playlist question resolved.
- deep-learning-for-vision: CS231n lecture numbers labelled as 2026 schedule.
- neural-3d: Foundations of CV ch.45 added as secondary; primary text NeRF-era caveat; default NeRF exercise named.
- self-supervised-learning: cookbook stops before DINOv2/v3, V-JEPA 2, LeJEPA (noted).
- vision-language-models: Li et al. survey in considered; smol-course question closed.
- generative-modeling-foundations: unverified Bishop chapter numbers dropped.
- diffusion-and-flow-matching: weaker extras moved to considered; CMU overlap with generative-models-at-scale removed.
- generative-models-at-scale: coverage caveat; Dieleman latents post read first; overlaps removed.
- Declined: CS231n cross-group overlap; optional merges.

## G10 Data & distributed (R4)
- consensus-and-replication (must-fix): per-lecture MIT 6.5840 Spring 2020 video mapping added; Paxos and linearizability have no MIT video (stated); notes chapters moved to new numbering.
- distributed-transactions-and-storage: 2020 lecture numbers added; DDIA ch.8 limited to 2PC sections; Spanner/Calvin via papers.
- distributed-systems-fundamentals: Kleppmann notes -> 2025-26 PDF; chapter map updated (6 replica consistency, 7 consensus/Raft).
- transactions-and-recovery: owns isolation levels; R&G kept for exposition.
- batch-and-stream-processing: DDIA ch.12-13 named; CS 451 slides+assignments only.
- large-scale-system-design: DDIA ch.1-2 and SRE Classroom added; no course exists (stated).
- advanced-database-systems: DDIA ch.4 added; "Databases in 2025" retrospective; Red Book background only; 15-721 no assignments.
- db-storage-and-indexing, query-processing: BusTub agent-ban note; R&G vs DSC7 note.
- Not done: Vitillo chapter list (marked from memory); Streaming Systems authors' page (http-only, kept O'Reilly URL).
