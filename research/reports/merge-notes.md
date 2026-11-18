# Merge notes (from worker reports)

## G12 Security & cryptography — done, 0 errors
- Splits (optional): binary-exploitation -> separate reverse-engineering/binary-analysis (~180h combined); systems-security -> separate hardware/side-channel/TEE (MIT 6.5950 is a full course).
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
