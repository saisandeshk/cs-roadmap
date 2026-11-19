# Merge notes (from worker reports)

## G12 Security & cryptography — done, 0 errors
- Splits (optional): binary-exploitation -> separate reverse-engineering/binary-analysis; systems-security -> separate hardware/side-channel/TEE (MIT 6.5950 is a full course).
- Overlap: network-security vs applied-cryptography on TLS.
- Prereq suggestions: binary-exploitation soft += computer-architecture, operating-systems; web-security soft += databases-intro; network-security soft += applied-cryptography; cryptography-foundations: computational-complexity soft -> hard (MIT 6.5620 route).
- Unverified: Stanford CS 253 current term/assignments (web.stanford.edu timeouts via proxy); Coursera Crypto I audit; CISPA recordings; Anderson 3e free chapters; Cloudflare pages (bot-blocked); MIT 6.5950 2026 Panopto (login); Katz-Lindell publisher page; Pass-Shelat/Katz-Lindell use notes generic.

## G7 LLMs — done, 0 errors
- Splits proposed: llm-applications -> + "llmops-and-guardrails"; llm-agents -> + agent security/sandboxing node (link to evals-and-red-teaming); optional scaling-and-pretraining -> scaling-laws vs recipes/stability.
- Soft prereq suggestions: scaling-and-pretraining += llm-architectures, pretraining-data; llm-architectures += dl-engineering; retrieval-and-rag += llm-evaluation; llm-applications += retrieval-and-rag, post-training; llm-agents += retrieval-and-rag, llm-evaluation; nlp-foundations += probability; post-training += llm-evaluation.
- Weak spots: llm-evaluation (no dedicated public course; composite); retrieval-and-rag has no primary course.
- Unverified: web.stanford.edu HTTPS / nlp.stanford.edu IR-book (503 via proxy); SLP3 ch7/ch11 PDFs; GitHub pages 403 to curl; HF Spaces client-side; CS336 per-lecture contents; CMU 11-711/11-766 video visibility; Huyen publisher page 403.

## G8 RL & safety — done, 0 errors
- No splits. Soft prereq suggestions: adversarial-robustness += security-fundamentals or llm-evaluation (LLM-attack half); model-based-rl: make Sutton-Barto ch.8 context explicit.
- Deliberate overlaps: rl-for-llms vs alignment-and-oversight (reward hacking, RLHF failures); evals-and-red-teaming vs model-organism papers.
- Course video status: CS234 W26 Canvas-only (public Spring 2024); CS 185/285 Sp26 recorded but unlinked (public Fall 2023); CS224R Sp25 public.
- Unverified: web.stanford.edu & incompleteideas.net https blocked (opened via http); GitHub 403 to curl; CS336 A5 autograder; ETH RTAI playback w/o login; MIT 6.S890 term; Gray Swan Arena (429); BlueDot unit readings not opened.
- Weak spots: off-policy evaluation and data poisoning only have papers.

## G2 Mathematics — done, 0 errors
- Splits proposed: calculus -> single-variable + multivariable; optimization -> convex-optimization (theory) + optimization-for-ml; new floating-point/mixed-precision node out of numerical-methods; causal/experimentation stays in G5 causal-inference.
- Soft prereq suggestions: optimization += matrix-calculus; statistics += linear-algebra; numerical-methods += calculus; information-theory += discrete-math, calculus. Consider dropping soft calculus -> linear-algebra.
- Notable: Berkeley EECS 127 Spring 2026 (public videos+hw) chosen over enrolled-only EE364a; 18.06 public videos are 2010; 6.1200 Spring 2026 videos unknown (public Spring 2024 OCW).
- Unverified: web.stanford.edu unreachable (Boyd cvxbook, EE364a page, VMLS, CS103, EE276, STATS 200); Harvard Stat 110 pages 403; Cover & Thomas Wiley (Cloudflare); micrograd video 429; 6.1200 pset solutions.

## G9 ML systems — done, 0 errors, 0 warnings
- PMPP 5th edition exists (Elsevier, 2026). MIT 6.S894 Fall 2025 (GPU programming; videos on YouTube; Telerun enrolled-only -> assignments partial).
- Splits proposed: low-precision formats (FP8/MX/NVFP4) node shared with model-compression; checkpointing & fault tolerance out of model-parallelism (shared with mlops).
- Reuse concentration: MIT 6.S894 primary-course in 3 nodes; Ultra-Scale Playbook primary-text in 2; CS336 primary-course in 4-5 nodes. Owner may want to anchor each once (organization decision).
- Prereq suggestions: ml-compilers soft += gpu-programming; soft link model-compression <-> llm-inference-and-serving.
- Thin: llm-inference-and-serving course = one CS336 lecture. ml-compilers newest public-video course is MLC Summer 2022.
- Unverified: O'Reilly pages 403; Tensara 522; BentoML handbook 502; GitHub 403 to curl (micrograd, picotron, TorchFeather, 15-442 lab repo not opened); recording access for CMU 15-442 / 11-868 / UCSD CSE 291A; YouTube 429 (individual videos not played); CS336 A2 handout PDF.

## G1 Programming — done, 0 errors
- Findings: CS 61A Fall 2026 dropped Scheme for Gleam and added an agentic-coding unit; Rust Book 3rd edition (Mar 2026); Missing Semester IAP 2026 refresh exists; Dabeaz Advanced Python Mastery archived 2026-10-22.
- Proposed: c-programming uses CS 107 lectures 1-12, lectures 13-25 belong to computer-systems; fold go-programming into distributed-systems prep (optional); cpp-programming hard c-programming -> soft (learncpp starts from zero); dev-environment as soft prereq of python-in-depth, c-programming, data-structures, software-construction; data-structures: CS 61B is Java (notes give Python alternative).
- No primary-course: python-in-depth, go-programming.
- Unverified: cppreference 403; web.stanford.edu flaky (CS 106L video status unknown); UNSW COMP6991 503; github.com 403; Ousterhout page; O'Reilly 403.

## Environment note (applies to all groups)
- github.com web pages: 403 from the egress proxy for curl (policy); workers used WebFetch where available.
- web.stanford.edu over HTTPS fails TLS through the proxy ("self-signed certificate in chain" even with the CA bundle); HTTP works. Several university hosts are unreachable from the egress (e.g. some *.csail.mit.edu, *.stanford.edu subdomains, assets.cambridge.org). Marked verified:false where not opened.

## G3 Algorithms & theory — done, 0 errors
- Video reality: 6.1210/6.1220 Spring 2026 not publicly recorded (public: 6.006 Spring 2020, 6.046 Spring 2015); 18.404 public Fall 2020; 6.5220 Karger Fall 2025 public on YouTube; CS 583 Spring 2026 no recordings; 15-855 O'Donnell Fall 2017 public; CS229M public Fall 2021.
- Splits proposed: advanced-algorithms -> advanced data structures / streaming & sketching / flows-LP core; computational-complexity -> Complexity I / II (IP, PCP, derandomization); learning-theory -> statistical learning theory / theory of deep learning.
- Overlap: 6.006 ~1/3 data structures (overlaps data-structures node).
- Soft prereq suggestions: complexity += probability; randomized, complexity, advanced-algorithms, learning-theory += linear-algebra; quantum += theory-of-computation or algorithm-design; approximation += computational-complexity.
- Unverified: CLRS MIT Press page (403); Mitzenmacher-Upfal 2e page (only 1e opened); some chapter numbers from memory; SSBD free PDF (huji) blocked; Gupta NYU approx 403; Stanford CS168; Karger NB problem sets public?; KAIST EE531 Spring 2026 not reviewed (promising).

## G5 ML foundations — done, 0 errors
- No splits. Soft prereq suggestions: ml-fundamentals, deep-learning-fundamentals += scientific-python; transformers += dl-engineering; probabilistic-graphical-models += bayesian-inference.
- REVIEW FLAG (mine): deep-learning-fundamentals uses CS231n (a vision course) as primary-course; MIT 6.7960 (Fall 2024 OCW, public videos) or CMU 11-785 may fit the scope better. Reviewer should judge.
- dl-engineering & transformers use Karpathy video-series in the primary-course slot (no real course).
- Findings: nanoGPT deprecated Nov 2025 -> nanochat/build-nanogpt; CS229 recent terms enrolled-only (public: Autumn 2018); CS188 Spring 2026 public playlist; Statistical Rethinking 2026 public.
- Unverified: GitHub contents (403); CS229/CS224W playlist oEmbed; CMU 10-708 Panopto public access; 11-785 / 6.7960 Fall 2026 / CS224N 2026 video policy; CS221, STATS 361 timed out; Kohavi and What If chapter numbers from memory.

## G6 Vision & generative — done, 0 errors
- Strong 2026 public-video courses found: MIT 6.8300 Sp26 (Panopto public), TUM 3D CV SS2026, KAIST CS479 Sp26, MIT MAS.S60 Sp26, MIT 6.S184 IAP 2026, Stanford CME296 Sp26, CMU 10-799 Sp26.
- Splits proposed: neural-3d -> neural rendering / 3D DL & feed-forward reconstruction; generative-models-at-scale -> split out audio (and optionally video).
- CLIP objective: SSL teaches objective, VLM teaches CLIP as a system.
- Prereq suggestions (soft): vision-language-models += self-supervised-learning; neural-3d += diffusion-and-flow-matching; generative-models-at-scale += vision-language-models, self-supervised-learning; multi-view-geometry += probability. Relax: diffusion-and-flow-matching hard generative-modeling-foundations -> soft (6.S184 needs only prob + DL). Promote: multi-view-geometry optimization soft -> hard (bundle adjustment).
- Unverified: Michigan EECS 498 pages 404 (Fall 2019 playlist works); CS231A canonical URL failed (alias used, Spring 2025); CS180 / 6.S058 / 16-825 video status; UDL & Bishop chapter numbers from atlas notes/memory; CS236 homework restricted; TUM SS26 playlist completeness.

## G4 Machine & OS — done, 0 errors
- Video reality: 15-213 F26 enrolled-only (public Fall 2015 Panopto); CS 61C F26 enrolled-only (public Summer 2020); CS 162 F26 enrolled-only, NO official public playlist; 6.1810 public Fall 2020; CS149 public Fall 2023; 6.172 public OCW Fall 2018; UNSW COMP9242 2026 T3 public echo360.
- REVIEW FLAG (mine): operating-systems primary-course CS 162 has no official public videos; reviewer should consider an OS course with public lectures (e.g. Wisconsin CS 537 / Remzi, ECE344 Fall 2024 fully public, or 6.1810 Fall 2020).
- No primary course: high-performance-python, virtualization-and-containers, storage-and-file-systems.
- Splits proposed: virtualization-and-containers -> hypervisors / containers; linux-kernel-internals -> core subsystems / device drivers; performance-engineering -> CPU tuning / algorithms-for-hardware.
- Prereq suggestions (soft): os-kernel-implementation += computer-architecture (xv6 is RISC-V); performance-engineering += computer-architecture; concurrent-programming += rust-programming (CS431 is Rust); advanced-operating-systems += concurrent-programming, linux-kernel-internals.
- Cross-group overlaps: ETH DDCA also primary for G11 digital-logic/processor-design; CS107 is G1 c-programming primary (only considered here); CUDA content goes to G9.
- Time-sensitive: Pacheco 3e (new author Steven Wright) dated 2026-12-28, not out yet -> kept 2e. 1024cores.net now a gambling domain (not linked).
- Unverified: csapp.cs.cmu.edu; O'Reilly (HPP, LKD); Packt LKP 2e (search snippet only); Springer Bugnion; perf-ninja.com; ppc-exercises.cs.aalto.fi; Stanford CS 240; YouTube 429; KAIST CS431 post-2024 terms; 6.5810 / CS 736 reading lists not public; CS 61C Fall 2020 recordings.

## G11 Hardware & compilers — done, 0 errors
- ETH DDCA Spring 2026 (public videos+labs) anchors digital-logic, processor-design (MIPS lab ISA), advanced-microarchitecture; ETH Computer Architecture Fall 2026 in progress (Fall 2025 full public). H&P CAQA 7th ed. (Dec 2025).
- Video gaps: EECS 151 F26 enrolled-only; MIT 6.5930 Sp26 not recorded (Cornell ECE 5545 2022 is the public-video secondary); CS143 no recent official videos (archived Aiken); CIS 5000 F26 enrolled-only; 6.512 FRAP video unknown; CMU 17-770 no recordings; program-analysis course (NJU) videos in Chinese.
- No primary course: interpreters.
- Prereq changes proposed: program-verification hard type-systems -> soft, hard += programming-language-concepts, discrete-math; interpreters c-programming soft -> hard (clox) or split tree-walking vs bytecode; language-runtimes soft += compiler-construction; program-analysis soft += discrete-math; memory-systems soft += concurrent-programming.
- Splits (optional): program-verification -> proof assistants + Hoare logic / separation logic + verified systems; compiler-construction -> front end / back end.
- Unverified: Springer (Sze book, Primer) bot challenges; Shen & Lipasti, Agner Fog 406; Coursera audit for Grossman; CS152 recordings (401); ETH Fall 2026 playback; 15-745 term label; FRAP JS site; CS143 HTTP-only with 2021 syllabus dates; GC Handbook/TAPL chapter numbers from memory.

## G10 Data & distributed — done, 0 errors
- computer-networking primary course switched to Berkeley CS 168 Fall 2026 (public videos); CS 144 kept as optional TCP-stack practice.
- Video reality: CS 186 F26 enrolled-only (public Spring 2024); 6.5840 Sp26 no public videos (public Spring 2020); CMU 15-445 F26/Sp26 login-only (public Fall 2025); 15-721 public Spring 2024; Waterloo CS 451 no videos; Kleppmann Cambridge public 2020 series.
- No primary course: large-scale-system-design.
- Splits proposed for consensus-and-replication, distributed-transactions-and-storage, large-scale-system-design, transactions-and-recovery, advanced-database-systems (see each file's split_proposal).
- Prereq changes: distributed-systems-fundamentals concurrent-programming soft -> hard; distributed-transactions-and-storage transactions-and-recovery soft -> hard; batch-and-stream-processing soft += databases-intro; computer-networking soft += operating-systems.
- Unverified: DDIA 2e chapter numbers 9/10/12/13 (O'Reilly 403); redbook.io HTTPS; Streaming Systems page; UDS chapter structure; R&G / BHG chapter numbers from slide indexes; GitHub repos via WebFetch only.
