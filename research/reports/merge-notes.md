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
