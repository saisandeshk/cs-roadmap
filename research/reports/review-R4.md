# Review R4: G7 (LLMs), G9 (ML systems), G10 (Data & distributed), 34 nodes

Method: I opened the live pages for CS336, CS329Z, CS224N, SLP3, MIT 6.S894 (home, lectures, labs, calendar), CMU 15-442, CMU 10-414, CMU 15-445 (Fall 2025, Spring 2026, Fall 2026), CMU 15-721, MIT 6.5840 schedule, MIT 6.5940 Fall 2026, CS 168 FA26, CS 144, CS 186, Cambridge ConcDisSys 2025-26, Waterloo CS 451, mlsysbook chapters, the MCP spec, the Raschka article, the YouTube playlists for CS336 (Spring 2025 and 2026) and MIT 6.824 (Spring 2020), and the CS336 A2/A3 READMEs. github.com pages were 403, so I used raw.githubusercontent.com. `nlp.stanford.edu/IR-book` returned 503 and `redbook.io` over https failed. The CMU 11-768 site is JS-only, so I could not verify its schedule.

Verified correct (no action): CS336 Spring 2026 (public YouTube playlist PLoROMvodv4rMqXOcazWaTUHhq-yembLCV with 18 videos, lectures 1-17 plus a Dan Fu guest lecture; lecture numbering and titles match every node that cites them); MIT 6.S894 Fall 2025 (10 lectures with public video, labs 1-11 public, Telerun for enrolled students only); CMU 15-445 Fall 2025 (public video, lecture numbers #1-#24 match all five nodes) and Fall 2026 (no public video link); CMU 10-414 Fall 2026 (Dettmers/Chen, 2022 videos public); MIT 6.5940 Fall 2026 (lecture and lab list); CMU 15-442 Spring 2026 (Lab 1/2/3 and week numbers); MIT 6.5840 Spring 2026 lecture list; SLP3 Aug 19 2026 chapter numbers; MCP spec 2026-07-28; Spark 4.3, Kafka 4.3, Flink 2.3 docs; mlsysbook chapter numbers.

## nlp-foundations
- [suggestion] SLP3 has no parsing or linguistic-structure chapter, so the scope item "linguistic structure" rests on the CS224N dependency-parsing lecture and A2, spaCy and NLTK. Fix: say so in `notes`, or move Eisenstein (currently in `considered`) to `reference` for parsing and syntax.
- [suggestion] spaCy course, NLTK book and HF LLM Course ch. 5-7 are three overlapping classic-pipeline resources. Fix: keep spaCy as the practice item and drop one of the other two, or state the distinct gap each fills.
- split/prereq: agree that `transformers` should be soft only. Adding soft `probability` is fine.

## language-modeling
- [suggestion] CS336 A1 is a heavy, unscaffolded 5-unit assignment, and the node correctly says so. Karpathy's "Let's build GPT" and "Let's reproduce GPT-2" are the lighter free video route and are already listed as secondary. Fix: state in `notes` that A1 is the capstone, not the entry point.
- [suggestion] `slp3-ch7` is marked `verified: false`, but the SLP3 index (http) lists ch. 7 "Transformers and Pretraining" in the Aug 19 2026 draft, so the claim is accurate. Fix: set `verified: true` and keep the http-only note in `open_questions`.
- split/prereq: agree, none needed. Soft `nlp-foundations` is fine.

## llm-architectures
- [should-fix] CS336 `course` block: `assignments_url` points at assignment1-basics, which is irrelevant to lectures 3-5, and `public_videos_url` is missing, although every other CS336 node supplies it. Fix: use the one playlist URL above and drop `assignments_url`, or point to lecture_03/04 PDFs.
- [should-fix] The primary text is Raschka's comparison article, last updated 2026-04-02 (confirmed on the page). That is seven months stale for the field's fastest-moving node, and the 2026-03-14 gallery page returned 406 to curl. Fix: keep the article as the spine but add in `notes` that models from after April 2026 are not covered, and name the Smol Playbook and tech reports as the refresh path. Re-check the gallery.
- [suggestion] The `olmo3` secondary ("architecture and stability sections") duplicates the same paper's "stability" slice in scaling-and-pretraining (`olmo3-recipe`). Fix: here, cite only the architecture and norm sections (post-norm, QK-norm, sliding window), and leave z-loss, LR schedule and mid-training to scaling-and-pretraining.
- [suggestion] CS336 lecture 5 (GPUs, TPUs) is cited in four nodes (here as optional, plus ml-performance-modeling, kernel-dsls, inference). Fix: anchor it once, in ml-performance-modeling.
- [suggestion] The numerics gap (admitted in `notes`) could be filled cheaply with CME 295 Autumn 2026 lecture 2 (MoE, MHA/MQA/GQA, RoPE, sampling), which has public video. See Overall.
- split/prereq: agree on soft `dl-engineering` for numerics. Agree that scaling-and-pretraining should list this node as soft.

## pretraining-data
- [suggestion] Clean node. CS336 L13-14 and A4 are distinct from the other CS336 slices, and the `course` block is complete. Fix: add the `public_videos_url` playlist, which is missing here but present in other nodes.
- split/prereq: agree on soft `nlp-foundations`.

## scaling-and-pretraining
- [should-fix] CS336 A3: the Spring 2026 README requires an 8-digit Stanford student ID (`A3_API_KEY`) for the hosted training API, so self-study is not possible as written. `assignments: partial` is correct, but `use` should state that the practical route is Marin or the Smol Playbook ablations. Also, the CS336 course page text for Spring 2026 A3 now includes initialisation and weight/activation dynamics ("Study and understand model initializations..."). Fix: re-read the A3 handout PDF and update the `use` description.
- [suggestion] `olmo3-recipe` points at the OLMo 2 arXiv ID (2501.00656) while the title says Olmo 3 (2512.13961 is in the edition field). Fix: make the primary URL 2512.13961 and cite OLMo 2 as secondary.
- [suggestion] Kaplan and Chinchilla share one entry, and both are referenced again in the Porian entry. This is fine, but `kaplan-chinchilla` should state the 2020 and 2022 dates in `edition_or_term`.
- split/prereq: disagree with the split. Agree on adding soft `llm-architectures` and `pretraining-data`.

## llm-evaluation
- [should-fix] The primary-course is a composite of CS336 lecture 12 and CS224N Winter 2026 A4. These are two different courses and terms, one lecture plus one assignment with `assignments: partial`, and `use` says "check the trace for exact coverage", so the worker never inspected the lecture. Better public material exists and is missing from the node:
  - Stanford CS329Z Fall 2026 (already used elsewhere): "Evaluation for Agentic Systems" (Nov 4), "LLM-as-Judge & Evaluation Infrastructure" (Nov 11) and "Agent Safety & Guardrails" (Nov 18), https://cs329z.stanford.edu/. Video links on the page currently end around week 5, so confirm that later lectures are posted.
  - Stanford CME 295 Autumn 2026, lecture 7 "LLM evaluation" (LLM-as-judge, biases, agent evaluation, benchmarks), https://cme295.stanford.edu/syllabus/. The playlist posts public video; lecture 7 was "coming soon" on 2026-11-18, but the Autumn 2025 edition is the same series.
  - Evidently AI's free "LLM evaluation for AI builders" course (3 weeks, video, 10 code tutorials), https://www.evidentlyai.com/llm-evaluation-course-practice.
  Fix: make CS329Z weeks 7-8 (or CME 295 lecture 7) the primary-course, keep CS336 L12 as the benchmarks lecture, and add the Evidently course as practice. Drop the CS224N A4 pairing, or keep it only as an optional exercise.
- [should-fix] `hamel-evals` (FAQ and Field Guide) is also assigned, with the same `use`, in llm-applications (`hamel-evals-apps`), and SWE-bench is covered here and in llm-agents `agent-benchmarks`. Fix: keep the Hamel posts here, where the content is evaluation-specific, and reference them from llm-applications by id without a second entry.
- [suggestion] `anthropic-agent-evals`: the publication date was not read. Fix: record it, or call it "undated" in `edition_or_term`.
- [suggestion] Fix: demote `contamination` and `helm` to `reference`.
- split/prereq: agree on soft `post-training` and soft `llm-applications`.

## post-training
- [should-fix] Distillation is assigned the same job in two nodes: `distillation-papers` here (Hinton, MiniLLM, GKD) and `distillation` in model-compression (Hinton, GKD). QLoRA is also in both. Fix: keep the LLM on-policy distillation here (MiniLLM, GKD, Thinking Machines blog) and keep only Hinton in model-compression, or the reverse.
- [suggestion] SLP3 now has a new Chapter 8 "Post-training" in the Aug 19 2026 draft (confirmed on the index). It is a free, current, citation-quality overview and is absent from this node. Fix: add it as a reference.
- [suggestion] CS336 L15-16 and A5 are secondary here and overlap G8's `rl-for-llms`. Fine, but the `use` text names only L15. Fix: either name L16 (RLVR) as G8 territory or drop it from the title.
- [suggestion] CME 295 Autumn 2026 lecture 3 (SFT, LoRA, RLHF/DPO, reasoning, on-policy distillation) is a short public-video overview for this node; add as optional.
- [suggestion] `smol-course` status is uncertain (the open question says units may refer to 2025). Fix: re-open the page and record the current unit list.
- split/prereq: agree on soft `llm-evaluation`.

## retrieval-and-rag
- [should-fix] No primary-course, and the only course cited (CS329Z) is a single lecture. Better public material exists:
  - DataTalks.Club LLM Zoomcamp 2026: free, 10 weeks, public YouTube lectures, self-checked homework. Module 1 is agentic RAG, module 2 is vector search (minsearch, PGVector), module 4 is evaluation of retrieval and answers, and later modules cover hybrid search and reranking. Source: https://github.com/DataTalksClub/llm-zoomcamp (README read via raw.githubusercontent.com). No GPU needed, about $1-5 in API credits. It is the only free course I found that covers the node's full RAG pipeline plus evaluation with graded or checkable exercises.
  - Stanford CME 295 (lecture on RAG, Nov 2025 edition; recordings linked from https://cme295.stanford.edu/syllabus/).
  - CMU 11-766 LLM Applications Spring 2026 has four sessions on retrieval, RAG and deep research (https://cmu-llms.org/). I could not confirm recordings; the site appears to offer slides only.
  Fix: make LLM Zoomcamp the primary-course, keep CS329Z L3 as the lecture, and note the gap on dense-retrieval theory (covered by SLP3 ch. 11 and Lin's text).
- [should-fix] Primary text IIR (2008) predates dense retrieval, vector search and RAG, so it covers only the IR-basics third of the scope. The node correctly pairs it with SLP3 ch. 11, but `slp3-ch11` is `verified: false`. Fix: set to true (the index lists ch. 11 "Information Retrieval and RAG" with slides) and say in `notes` that IIR is for BM25 and evaluation only.
- [suggestion] The IIR canonical URL (nlp.stanford.edu/IR-book) returned 503 again for me over http and failed over https. The Cambridge link is fine as the primary URL.
- [suggestion] Bloat: `faiss-docs`, `pinecone-faiss`, `hnsw-paper` and `ragpaper-survey` overlap. Fix: keep Pinecone's series plus the HNSW paper, and demote the others to a one-line `reference`.
- split/prereq: agree on soft `llm-evaluation` and on llm-applications soft-depending on this node.

## llm-applications
- [should-fix] The primary-course (CS329Z "Engineering AI Agents") is an agent course, so it only partly matches this node's scope (prompting, structured outputs, application evals, guardrails, cost/latency, production operation). The `use` text ("weeks 1-4: ... RAG, tool use/function calling and MCP, frameworks and agent design patterns") assigns the same lectures that llm-agents uses as its secondary (`cs329z-agents`: tool use, frameworks, patterns), and retrieval-and-rag uses the RAG lecture. Three nodes therefore use the same lectures, which is not a distinct slice. Fix: here use lecture 2 (LLMs for builders: structured I/O, context engineering), lecture 7-8 (evaluation, LLM-as-judge) and lecture 9 (safety and guardrails); leave tool use, frameworks, patterns, memory and multi-agent to llm-agents, and RAG to retrieval-and-rag. Also add LLM Zoomcamp (modules 1-5, including evaluation and monitoring) as practice.
- [should-fix] `anthropic-courses` is archived (read-only since 2026-09-15) and its examples use Claude 3 Haiku. A practice item that needs model swaps is weak. Fix: keep the interactive tutorial only as a pointer, and move the practice to LLM Zoomcamp or the Anthropic/OpenAI cookbook equivalents.
- [should-fix] Hamel Husain's FAQ and Field Guide are duplicated from llm-evaluation (see that node).
- [suggestion] Chapters 3-4 of the primary text (evaluation) overlap llm-evaluation, which lists Huyen's AI Engineering ch. 3-4 only under `considered`. Fix: choose where it belongs.
- [suggestion] CMU 11-766 (Diaz, Ippolito, Spring 2026), which the node lists as considered, is a closer scope match than CS329Z. Its materials are public at https://cmu-llms.org/ (HTTP 200). Recordings unconfirmed. Re-check before ruling it out.
- split/prereq: agree with splitting `llmops-and-guardrails`: nothing here covers production operation (CS329Z safety/guardrails plus OpenTelemetry GenAI conventions would form a start). Agree with the soft prereqs.

## llm-agents
- [should-fix] CMU 11-768 (Fall 2026) is the primary-course, but its site is JS-only (I could not read its schedule) and the worker's own open questions say assignments 2-3 are unconfirmed and the YouTube playlist ID is truncated. The `videos: public` claim covers only lectures 1-9. CS329Z (Fall 2026) offers two autograded homeworks (A2 agent harness is linked in this node) and public video links. Fix: record in `notes` that 11-768 lectures are partly public and still running, and make CS329Z the stated fallback. Update the video count after the term ends.
- [suggestion] `agent-benchmarks` bundles SWE-bench (also in llm-evaluation), tau-bench and AgentDojo. Fix: keep tau-bench and AgentDojo here, and cite SWE-bench from llm-evaluation.
- [suggestion] Primary text "Building effective agents" is a Dec 2024 article and the page itself warns the tooling has changed. It is still the right concept text, but add the current Anthropic agent engineering posts (already named in `use`) with dates.
- split/prereq: disagree with splitting `agent-security-and-sandboxing`. Agree with the soft prereqs.

## ml-performance-modeling
- [should-fix] Duplicate jobs across nodes: scaling-book Ch. 5 is read here (as primary), in distributed-training-fundamentals (`scaling-book-sharding`) and in model-parallelism (`scaling-book-training`); Ch. 7 (inference) is read here and in llm-inference-and-serving (`scaling-book-inference`); and kipply "Transformer Inference Arithmetic" appears here and in llm-inference-and-serving (`kipply-weng`). Fix: read Ch. 1, 4 and the roofline problems here; Ch. 3 and 5 once, in distributed-training-fundamentals; Ch. 7-8 once, in llm-inference-and-serving; and list kipply once.
- [suggestion] CS336 A2 is `public` here and `public-with-autograder` in kernel-dsls and distributed-training (see Overall). Use one value.
- split/prereq: agree, none needed.

## gpu-programming
- [should-fix] Slice overlap with gpu-performance-optimization: this node uses MIT 6.S894 lectures 1-5, 7, 9 and labs 1-3 and 7, while gpu-performance-optimization uses lectures 3-6 and labs 4, 5 and 8. Lectures 3-5 (memory parts 1-2, overlapping) are assigned to both. Fix: give lectures 1-2, 7 and 9 plus labs 1-3 and 7 here, and lectures 3-6 plus labs 4-5 to gpu-performance-optimization. Lecture 8 (Ampere to Hopper) and labs 6 and 10 stay in gemm.
- [suggestion] Facts about 6.S894 check out (Fall 2025, public YouTube links for lectures 1-10, labs public, Telerun enrolled-only). Note that the calendar lists 13 lectures but only 10 have posted video (the lecture 5 continuation video is "pending"), and no 2026 term exists (spring26, fall26 return 404). Fix: record "lectures 11-13: no video found".
- [suggestion] The PMPP 5th edition date is unresolved (Elsevier pages disagree: Feb 27, Jun 3 and Sep 1 2026). Fix: write "5th ed., 2026" without a day.
- [suggestion] An omission worth a check: UIUC ECE 408 (Hwu, the PMPP author) and ETH's "Programming Heterogeneous Computing Systems with GPUs" (Mutlu) may have public lectures. I did not verify either; check before considering them.
- split/prereq: agree, none needed.

## gpu-performance-optimization
- [should-fix] Overlap with gpu-programming (see above) and with gemm-and-tensor-cores: the Boehm worklog is the primary here and a secondary in gemm for kernels 5-10, but this node's `use` already says "re-implement kernels 1-6". Fix: state "kernels 1-6 here, 7-10 in gemm" in both nodes.
- [suggestion] LeetGPU is `practice` in four G9 nodes (gpu-programming, gpu-performance, gemm, kernel-dsls), each time with an overlapping problem list (Matrix Multiplication, Reduction, Softmax appear in more than one). Fix: assign one problem set per node without repeats.
- split/prereq: agree, none needed.

## gemm-and-tensor-cores
- [suggestion] `cmu-15442-tirx` is `verified: true` but the lab repo was not opened (the worker admits it); the URL is the schedule page, which I confirmed lists Lab 3 release on 03/11 and the Blackwell/TIRx lecture. Fix: point at the schedule URL only and drop the repo name, or mark the repo `verified: false`.
- [suggestion] This node needs Hopper or Blackwell hardware for its core practice. Fix: say which items are readable-only, so that a learner without a GPU has a path (Gordic post, Colfax tutorial, Modern GPU Programming book).
- split/prereq: agree with the low-precision split (FP8/MX/NVFP4), shared with model-compression.

## kernel-dsls
- [suggestion] CS336 lecture 6 is titled "Kernels, Triton, XLA" on both the course page and the YouTube playlist; the node (and the seed) call it "Kernels, Triton". The XLA portion is usable for ml-compilers. Fix: update the title and cross-reference.
- [suggestion] `use` says "Lecture 5 (GPUs, TPUs) and Lecture 6". Lecture 5 is already the anchor in ml-performance-modeling. Fix: keep only lecture 6 here, plus the A2 FlashAttention part.
- [suggestion] The Triton tutorials are the primary text, which is fine. The Triton docs URL is a docs tree, not a text; acceptable given there is no book.
- split/prereq: agree, none needed.

## dl-framework-internals
- [suggestion] The primary text is two ezyang posts (2019 and 2020). They predate PyTorch 2 (Dynamo/Inductor, DTensor), which are now in ml-compilers. Fix: say in `notes` that the posts cover eager, autograd and the dispatcher only.
- [suggestion] CMU 10-414 `videos` is `unknown` for the Fall 2026 run; the course page says "All lectures will be recorded" and links the 2022 videos. Fix: set `videos: enrolled-only` (the page implies Canvas) and keep the 2022 playlist as public.
- split/prereq: agree, none needed.

## ml-compilers
- [should-fix] The primary-course (MLC Summer 2022) is four years old, and the worker confirms its `mlc.ai/chapter_*` links are dead. TVM Unity, Relax and TIRx have changed since. CMU 15-442 Spring 2026 (same author) has the 2026 view but is slides-only, with `videos: unknown`. Fix: keep MLC 2022 for concepts but state "2022; TVM Unity APIs changed" in `notes`, and make the 15-442 week 7, 12 and 13 slides the "current" secondary. Also use CS336 lecture 6's XLA portion.
- [suggestion] The `cmu-15442-compiler` entry duplicates the Lab 3 reference in gemm-and-tensor-cores. Fix: keep the slides here and the lab there.
- split/prereq: agree with soft `gpu-programming`.

## distributed-training-fundamentals
- [should-fix] "Finding the Best Training Configuration" is in this node's `use` and also in model-parallelism's. The section presumes tensor and pipeline parallelism, which this node says to leave for the next one. Fix: remove it from here.
- [should-fix] `scaling-book-sharding` (Ch. 3 plus Ch. 5) duplicates Ch. 5 in ml-performance-modeling and model-parallelism (see ml-performance-modeling).
- [suggestion] `cmu-15442-distributed` and model-parallelism `cmu-lab2` are the same assignment (mlsyscourse/assignment-distributed-training). Fix: keep it in one node (parts 1-5 here, 6-9 in model-parallelism).
- split/prereq: agree, none needed.

## model-parallelism
- [should-fix] The primary-course is CMU 15-442 Spring 2026 with `videos: unknown`. A primary-course whose lectures are slides-only is weaker than CS336 lectures 7-8, which the node's own `considered` calls "public and good" and which are already primary in the previous node. The `course` block also puts a CS336 note in `public_videos_term`. Fix: state in `notes` that 15-442 is slides plus a public lab, and consider UCSD CSE 234 (Winter 2025, recordings per the other node) if recordings are confirmed.
- [should-fix] Primary text duplicates the Playbook, with the "Finding the Best Training Configuration" section also in the previous node (see above).
- [suggestion] The slide references are inconsistent: `use` names 15-442 "Week 6", "Week 11" and "Week 5". I confirmed Week 5 (DP/ZeRO), Week 6 (model/pipeline parallelism and rematerialization) and Week 11 (MoE, Mar 25); all correct.
- split/prereq: disagree with splitting fault tolerance.

## llm-inference-and-serving
- [should-fix] The primary-course is one CS336 lecture (L10, 1h25), and the worker says so. Slides-plus-video options: CMU 15-442 weeks 9-10 (slides public, confirmed on the schedule: continuous batching, PagedAttention, RadixAttention, speculative decoding), MIT 6.5940 Fall 2026 lectures 13 (LLM quantization and deployment), 15 (long context) and the Nov 24 "Efficient Inference in Production" guest lecture (public video, confirmed on the course page), and CME 295 lecture 5 (KV cache, speculative decoding, FlashAttention). Fix: use CS336 L10 plus MIT 6.5940 L13/L15 as the video track and CMU 15-442 weeks 9-10 as the slides. CMU 11-868 Spring 2026 (Lei Li) has a public site but no confirmed recordings in my search.
- [should-fix] Duplicates: scaling-book Ch. 7 and kipply (see ml-performance-modeling). `serving-papers` bundles five papers and `speculative-papers` three, which is a reading list rather than a gap statement. Fix: mark Orca, Sarathi, DistServe, SGLang and Mooncake with one-line gaps.
- [should-fix] Currency: the primary text is Gordic's "Inside vLLM", based on the vLLM V1 engine at commit 42172ad (Aug 2025), which is 15 months old. In a field where vLLM, SGLang, Dynamo and llm-d change monthly, state that engine details are as of Aug 2025. Also add EAGLE-3 and multi-token prediction (DeepSeek-V3) next to EAGLE.
- [suggestion] `llm-inference-scratch` (Tushar Amrit) is marked unvetted by the worker. Fix: drop it unless a quality check is recorded; `hf-continuous-batching` covers the same ground.
- split/prereq: disagree with splitting. Agree that compression and inference should link (see model-compression).

## model-compression
- [should-fix] `mit-labs` mixes numbering from two terms: its URL is the Fall 2024 page and `use` says "Lab 1 Pruning, Lab 2 Quantization, Lab 4 LLM Compression, Lab 5 LLM Deployment". The Fall 2026 page lists Lab 1 GPU Basics, Lab 2 Pruning, Lab 3 NAS, Lab 4 Quantization and Lab 5 LLM deployment on a laptop. Fix: state both term numberings explicitly, or use only the Fall 2026 labs.
- [should-fix] Distillation duplicates post-training (see that node). Also `quant-papers` includes QLoRA, which post-training already lists.
- [suggestion] The `course` block sets `public_videos_term` to "Fall 2026" but `public_videos_url` to the Fall 2024 playlist. Fix: separate them. Fall 2026 videos are linked individually on the page; lecture 19+ rows still show placeholders as of 2026-11-18, and the course is still running.
- [suggestion] The primary text is a chapter of a general ML-systems book (mlsysbook ch. 10), not a dedicated text. It is acceptable (the chapter exists and is organised as the node describes), but note that Menghani's survey (already listed) is the better single reference. For currency, add KV-cache quantization (KIVI) and rotation-based PTQ (QuaRot, SpinQuant) next to AWQ/GPTQ; I did not verify these.
- split/prereq: agree on adding the soft link between inference and compression.

## mlops-and-production
- [suggestion] The LLM-era gap is not covered: the node says LLM operations belong to the application nodes, but llm-applications proposes a split and nothing yet covers monitoring. DataTalks.Club LLM Zoomcamp modules 4-5 (evaluation, monitoring) fit here or in llm-applications.
- [suggestion] The primary text (2022) and the CS 329S and FSDL 2022 secondaries are all four years old. The `considered` list says the concepts are stable; fine, but note in `notes` which tool-specific parts are dated.
- split/prereq: agree, none needed.

## computer-networking
- [suggestion] Verified correct: CS 168 FA26 (Stoica, Ratnasamy; recordings playlist loads and individual lecture links exist; lecture list 1-16 core, 19-22 datacenters, 25-26 wireless), CS 144 Fall 2026 (Winstein; the page lists lab sessions and tutorials but not lecture video). `use` says "optional lectures 17-22" as Ethernet/ARP/NAT/TLS plus datacenter; check that range against the FA26 calendar (lectures 17-18 are not in my read; 19-22 are datacenters). Fix: re-read the calendar and correct.
- [suggestion] The primary text Kurose and Ross, plus the Kurose videos, plus CS 168's own free textbook (textbook.cs168.io) are three tracks for one text. Fine, as the node says the free textbook can substitute.
- split/prereq: agree on soft `operating-systems`.

## databases-intro
- [suggestion] `by` for CS 186 is Alvin Cheung (Fall 2026), but the public recordings are Spring 2024, taught by someone else if I recall correctly. I could not verify who. Fix: record the Spring 2024 lecturer.
- [suggestion] Three SQL practice sites (SQLBolt, pgexercises, Select Star SQL) in the same modality. The node already ranks them. Fix: mark SQLBolt as optional in `role` or drop it.
- [suggestion] CMU 15-445 `by` is "Andy Pavlo, Jignesh Patel" in all five DB nodes. For the cited Fall 2025 recordings, check the instructor; Spring 2026 lists Pavlo, Fall 2026 lists only Patel. Fix: give the instructor per term.
- split/prereq: agree, none needed.

## distributed-systems-fundamentals
- [should-fix] The primary text links Kleppmann's 2021-22 notes, but the 2025-26 notes exist at the same path pattern (https://www.cl.cam.ac.uk/teaching/2526/ConcDisSys/dist-sys-notes.pdf returned HTTP 200 with a PDF). The 2025-26 course page lists the same distributed-systems syllabus (RPC, models and faults, clocks, broadcast, replication, consensus, consistency, CRDTs, Spanner). Fix: link the current notes, and drop "2021-22" from `edition_or_term` after checking page count.
- [suggestion] MIT 6.5840 lecture numbers are 2026 numbers, but the video is the Spring 2020 playlist. 2020 numbering: L4 Primary-Backup Replication, L5 Go/Threads/Raft, L8 Zookeeper, L9 CRAQ, L12 Distributed Transactions, L13 Spanner, L14 OCC, L16 Memcached. For this node, lectures 1-3 match (Introduction, RPC and Threads, GFS), so it is fine here. Fix: none for this node, but see consensus-and-replication and distributed-transactions-and-storage.
- [suggestion] DDIA 2e: ch. 9 "The Trouble with Distributed Systems" is unconfirmed (worker's open question). A web search of the O'Reilly preview confirms ch. 10 "Consistency and Consensus", ch. 11 "Batch Processing" and ch. 6-8 (replication, sharding, transactions); ch. 9 is almost certainly Trouble with Distributed Systems. Fix: set `verified` accordingly and note the source.
- split/prereq: disagree with promoting `concurrent-programming` to hard. The primary route (Kleppmann notes plus Gossip Glomers) is language-agnostic; only the MIT labs need Go and threads. Keep it soft.

## consensus-and-replication
- [must-fix] The `use` for MIT 6.5840 cites "Lectures 4 (Paxos), 6-7 (Raft), 8 (consistency and linearizability), 9 (ZooKeeper), 13 (chain replication)" (Spring 2026 numbering, which I confirmed) and then says to "use the Spring 2020 YouTube playlist for video". The 2020 playlist (confirmed from the playlist page) has no Paxos lecture and no standalone linearizability lecture: its L4 is Primary-Backup Replication, L8 is Zookeeper, L9 is CRAQ (the 2026 L13 equivalent), L6-7 are Raft, L5 is Go/Threads/Raft. So lectures 4 and 8 have no public video, and the others have different numbers. Fix: give a per-lecture mapping (2026 L6-7 = 2020 L6-7; L9 ZooKeeper = 2020 L8; L13 chain replication = 2020 L9), and say that Paxos and linearizability have no MIT video; point to Kleppmann lectures 5-8 (already listed) for those.
- [suggestion] CS336-style duplicate: DDIA ch. 9 "fencing" is cited both in distributed-systems-fundamentals and here (ch. 10). Fine, but keep the `use` lists disjoint.
- split/prereq: agree with the split into replication/consistency models and consensus protocols.

## distributed-transactions-and-storage
- [should-fix] Same video-mapping problem: `use` cites "Lecture 11 (distributed transactions), Lecture 12 (Spanner), Lecture 14 (FaRM), Lecture 16 (memcached)" (2026 numbers, correct) plus the 2020 playlist, where these are L12, L13, L14 and L16. Only L14 and L16 coincide. Fix: write the 2020 numbers beside the 2026 ones.
- [should-fix] DDIA ch. 8 (Transactions) is this node's primary text and also `ddia2-txn` in transactions-and-recovery, and distributed transactions are only a soft prerequisite of that node. Fix: here use only the "distributed transactions and 2PC" sections of ch. 8 and ch. 7, and leave the isolation-level material to transactions-and-recovery.
- [suggestion] The primary-text DDIA ch. 7-8 covers sharding and 2PC but not Spanner, Calvin or distributed concurrency control; the papers in the reference list carry that. This is acceptable but `notes` should say it.
- split/prereq: agree with the split and agree that `transactions-and-recovery` should be hard.

## batch-and-stream-processing
- [should-fix] The primary-course (Waterloo CS 451/651 Fall 2025, Section 002 only) has `videos: none`, and the page says two sections exist, so the public material is slides and assignments only. The worker found no better course. Fix: record in `notes` that this is a slides-and-assignments course, and add Confluent's free Flink and Kafka Streams courses (already listed as practice) as the video track.
- [suggestion] `use` for the DDIA primary says "Chapter 11 and the following stream-processing chapters". Per the O'Reilly preview, the 2e chapter list is 11 Batch Processing, probably 12 Stream Processing, and 13 "A Philosophy of Streaming Systems". Fix: name the chapters (and confirm the numbers).
- [suggestion] `streaming-systems` has `verified: false` (the O'Reilly page returned 403) and the URL is a Safari Books listing. Fix: link the authors' page (streamingsystems.net, http only) or the publisher's catalog page.
- split/prereq: agree on soft `databases-intro`.

## formal-methods-for-systems
- [suggestion] Learn TLA+ v2 is a self-described work in progress whose last "What's New" entry is August 2023 (the page still carries the WIP banner as of today). It remains the best free text, but unfinished topics (refinement, keeping spec and code in sync) are covered only by Lamport's 2021 video course and Specifying Systems.
- [suggestion] Possible omissions I did not verify: deterministic simulation testing (FoundationDB's approach is cited in distributed-transactions-and-storage; Antithesis and TigerBeetle write-ups would fit here), and TLA+ Foundation conference talks. Verify before adding.
- [suggestion] `ironfleet` is also cited by MIT 6.5840 lecture 15; fine.
- split/prereq: disagree with making `consensus-and-replication` hard. The first practice exercises (bounded queue, 2PC, ring election) do not need Raft, so keep it soft. Agree that `discrete-math` is correct.

## large-scale-system-design
- [should-fix] No primary-course, and no course-like resource covers the node. The primary text (Vitillo) is also the one resource the worker could not open to confirm chapter structure ("from my knowledge of the book"). Missing, and directly relevant:
  - DDIA 2nd edition ch. 1-2 ("Trade-offs in Data Systems Architecture" and "Defining Nonfunctional Requirements": performance, reliability, scalability, maintainability). DDIA 2e is already primary in five other nodes, and its first two chapters are unused anywhere in my groups.
  - Google SRE Classroom (https://sre.google/classroom/, HTTP 200), a structured set of courses from the same source as the SRE book and workbook already listed.
  - Brendan Gregg's *Systems Performance* (capacity planning, USE method; the USE method page is already cited as a side note).
  Fix: add DDIA 2e ch. 1-2 and SRE Classroom, and state that no course exists (MIT 6.1800 and Cornell CS 5412 were checked; I found no public 6.1800 video). Verify the Vitillo chapter list from the book's page or table of contents.
- [suggestion] Bloat: Alex Xu's two volumes (paid) and Hello Interview (mixed) both serve interview-style practice. Fix: keep one.
- split/prereq: agree with splitting SRE/observability from system design patterns; the two are different skill sets.

## db-storage-and-indexing
- [suggestion] The primary text is Petrov Part I (2019), which is good, but CMU's lectures are aligned to Silberschatz (DSC7 ch. 12-14), which is already primary in databases-intro and listed here as `dsc7-storage`. Fine as is.
- [suggestion] BusTub: the Fall 2026 policy bans coding agents for P1-P2 (confirmed on the Fall 2026 page). Fix: mention this in `notes`, since self-learners should know the Fall 2025 specs are the ones to use.
- split/prereq: agree, none needed.

## query-processing
- [suggestion] The primary text is R&G 3rd edition (2003), which predates vectorised and compiled execution. CMU 15-445 lectures 11-16 use DSC7 ch. 15-16 (confirmed in the Fall 2025 readings). DSC7 is already the primary in databases-intro and a `considered` here. Fix: either adopt DSC7 as primary here and in transactions-and-recovery, or note that R&G is chosen for exposition clarity only.
- split/prereq: agree, none needed.

## transactions-and-recovery
- [should-fix] DDIA ch. 8 here duplicates its use as a primary text in distributed-transactions-and-storage (see that node).
- [suggestion] Text choice mirrors query-processing (R&G 2003 versus DSC7 ch. 17-19, which the CMU lectures use). Same note.
- split/prereq: disagree with splitting; CMU lectures 17-22 are one sequence, and a split would duplicate its resources.

## advanced-database-systems
- [should-fix] The primary text (Red Book, 2015) is marked `verified: false` (https fails; only http works, and it opened for me over http only) and is 11 years old. The node's scope is "in-memory and columnar storage, vectorized/compiled execution, modern OLAP, cloud-native databases"; the Red Book's chapters are for 2015-era systems, and the worker admits "no newer edition". Fix: say in `notes` that the Red Book gives background only, and make the Kersten, Lakehouse, Snowflake and Dremel papers (already listed) the core reading. Add DDIA 2e ch. 4 (it covers column storage and vector indexes, per the study notes I found) as a current text.
- [should-fix] The primary-course is CMU 15-721 with `videos: none` and `assignments: none` for the newest run (Fall 2025, Jignesh Patel, paper-reading only; I confirmed the page shows logistics and a paper-review requirement). The public Spring 2024 playlist is the usable course. Fix: say in `notes` that this is a lectures-only course with no assignments, and that the practice is DuckDB.
- [suggestion] `pavlo-2024` ("Databases in 2024") is from January 2025; check whether "Databases in 2025" exists (published around January 2026) and cite that.
- split/prereq: agree with the split (analytical engines versus cloud-native platforms).

## Overall

Systemic issues:
1. CS336 `course` blocks are inconsistent across the 11 nodes that use it (llm-architectures, language-modeling, pretraining-data, scaling-and-pretraining, llm-evaluation, post-training, ml-performance-modeling, kernel-dsls, distributed-training-fundamentals, llm-inference-and-serving). Facts about the course itself are identical and correct (term, instructors, public YouTube playlist). The differences are in fields: `public_videos_url` appears in only six; `assignments` is `public` for A2 in two nodes and `public-with-autograder` in two others; `assignments_url` points at A1 in nodes that use only lectures. Slices are mostly distinct (A1, A2 profiling, A2 FlashAttention, A2 DDP, A3, A4, A5 are separate), but lecture 5 is cited in four nodes, lecture 2 in three and lecture 3 in two.
2. Reuse of MIT 6.S894 (3 nodes) overlaps on lectures 3-5 (programming and performance) and lecture 6 (performance and gemm). Facts are consistent across the three nodes (Fall 2025, public video, labs partial).
3. Reuse of DDIA 2e: ch. 4, 5+9, 6+10, 7+8 and 11+ are all assigned, with ch. 8 appearing twice and ch. 1-2 unused (large-scale-system-design needs them). Chapter numbers 6, 7, 8, 10 and 11 are confirmed by an O'Reilly preview; ch. 9 is probable.
4. The Ultra-Scale Playbook is primary in two nodes with distinct halves, except for "Finding the Best Training Configuration" (in both). The Scaling Book is cited in three or four nodes with overlapping chapters (5 and 7).
5. MIT 6.5840: the facts are identical everywhere (Spring 2026, no video, Spring 2020 playlist), but lecture numbers are 2026 and the video is 2020, so five lecture references are wrong for video use (see consensus-and-replication, must-fix).
6. CMU 15-445 reuse is the cleanest in the set: five nodes, five disjoint lecture ranges, identical facts. Only the instructor field varies by term.
7. Missing courses that better fit several nodes: Stanford CME 295 (Transformers and LLMs, Autumn 2026, public video, covers architectures, training, RL, systems, agents and evaluation: https://cme295.stanford.edu/), DataTalks.Club LLM Zoomcamp 2026 (retrieval, RAG, agents, evaluation, monitoring), and the unused CS329Z lectures on evaluation, LLM-as-judge and guardrails. None of the 34 nodes cites CME 295 or LLM Zoomcamp.
8. Currency: the fast-moving nodes are mostly good (CS336 Spring 2026, CS329Z Fall 2026, CMU 11-768 Fall 2026, MCP 2026-07-28, SLP3 Aug 2026, vLLM/SGLang/Dynamo docs, Triton/CuTe DSL/TileLang/Helion/cuTile). Stale spots: the Raschka architecture article (Apr 2026), Inside vLLM (Aug 2025), the archived Anthropic courses repo, MLC 2022 and the 2008/2003/2015 books in the retrieval and database nodes.

Strongest areas: G9 GPU/kernel nodes (concrete labs, current hardware coverage), G10 database cluster (disjoint CMU slices, public specs), G7 pretraining-data and scaling-and-pretraining.
Weakest areas: llm-evaluation (composite course), retrieval-and-rag (no course, 2008 text), llm-applications (course mismatch, archived practice repo), large-scale-system-design (no course, DDIA ch. 1-2 unused), llm-inference-and-serving (one-lecture course, aging text), consensus-and-replication (video mapping).

Counts:
- G7 (10 nodes): must-fix 0, should-fix 12 (llm-architectures 2, scaling-and-pretraining 1, llm-evaluation 2, post-training 1, retrieval-and-rag 2, llm-applications 3, llm-agents 1; nlp-foundations, language-modeling, pretraining-data: 0).
- G9 (12 nodes): must-fix 0, should-fix 13 (ml-performance-modeling 1, gpu-programming 1, gpu-performance-optimization 1, ml-compilers 1, distributed-training-fundamentals 2, model-parallelism 2, llm-inference-and-serving 3, model-compression 2; others 0).
- G10 (12 nodes): must-fix 1 (consensus-and-replication), should-fix 8 (distributed-systems-fundamentals 1, distributed-transactions-and-storage 2, batch-and-stream-processing 1, large-scale-system-design 1, transactions-and-recovery 1, advanced-database-systems 2).
