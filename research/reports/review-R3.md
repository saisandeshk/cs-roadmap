# Review R3: groups G5 (ML foundations), G6 (Vision & generative), G8 (RL & safety)

33 nodes reviewed. Method: read every node file against WORKER_BRIEF, SCHEMA and skeleton; opened the primary course/text pages
and most secondary course pages (curl/WebFetch; github.com blocked, raw.githubusercontent used where possible); checked every
YouTube playlist ID that appears in these 33 nodes via oEmbed (all resolve except two whose oEmbed is disabled but whose
pages load: CS229 Autumn 2018 `PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU` = "Stanford CS229 ... Autumn 2018", CS224W
`PLoROMvodv4rPLKxIpqhjhPgdQy7imNkDn` = "Stanford CS224W: Machine Learning with Graphs"); checked ~20 arXiv IDs (all valid, titles
match). Overall the factual accuracy of the workers is high; the 2026 course claims I could test were right (listed under Overall).

Answers to the three adjudication questions are in `deep-learning-fundamentals`, the paper-as-primary nodes
(`self-supervised-learning`, `neural-3d`, `vision-language-models`, `generative-models-at-scale`, `adversarial-robustness`,
plus `deep-value-based-rl`, `model-based-rl`, `offline-rl-and-imitation`) and the "2026 claims" list in Overall.

---------------------------------------------------------------------------------------------------------------------------

# G5 ML foundations

## intro-ai
- [suggestion] The Fall 2026 page (https://inst.eecs.berkeley.edu/~cs188/fa26/, Pierson/Kao confirmed) has a "Recordings Playlist" href that
  is truncated (`PLDdJTMNkoQko`, as the worker saw) and its per-lecture "Video" links point to old webcasts (oEmbed titles
  "COMPSCI 188 - 2018-08-23 - Introduction to Artificial Intelligence"). Recording `videos: unknown` for Fall 2026 is therefore right;
  add a note not to use the fa26 per-lecture links. Spring 2026 (Klein, Russell; every lecture 1-28 has a recording link) and the
  SP26 playlist title "[CS188 SP26] Live Lectures" are confirmed.
- [suggestion] The fa26 page also links a second playlist (`PLp8QV47qJEg7YElaVxVC1LhD-THpGCUkw`, titled "[CS188 SP25] Discussion 1");
  Berkeley's discussion-section recordings are a free extra for the written-homework style problems. Optional.
- split/prereq: none proposed.

## scientific-python
- [suggestion] Inconsistent use of the Inria MOOC: title of `sklearn-mooc-m1` says "Modules 1-2" but `use` says "Only Module 1";
  `applied-ml-practice` says "Modules 1-2 skim (pipeline basics already seen)". Harmonise to "Module 1 here; Modules 3-4, 8 in applied-ml-practice".
- [suggestion] Mild bloat: `pdsh` (Ch. 5 sklearn API) and `sklearn-mooc-m1` do the same job (introduce the estimator/pipeline API); `scipy-lectures`
  NumPy chapter overlaps `numpy-docs`/`from-python-to-numpy`. Keep pdsh only for IPython/Jupyter productivity (Ch. 1) or drop it.
- No primary-course is a reasonable call (agree).

## ml-fundamentals
- [should-fix] `cs229-psets` / course `assignments: partial`: the claim "PS0 public PDF" is not reproducible. On the Autumn 2018 syllabus page
  (http://cs229.stanford.edu/syllabus-autumn2018.html) the only problem-set hrefs are `materials/ps0.pdf` and `ps/ps1/ps1.pdf`, and both
  resolve to 404 (http://cs229.stanford.edu/materials/ps0.pdf, .../ps/ps1/ps1.pdf, also under web.stanford.edu/class/cs229/). PS1-PS4 zips
  point to Piazza. Fix: set `assignments: restricted` (or unknown), keep the CS229 notes (https://cs229.stanford.edu/main_notes.pdf, live PDF),
  and name a public assignment set instead (Cornell CS 4/5780 has an Assignments tab at https://www.cs.cornell.edu/courses/cs4780/ , not opened in detail;
  or the ISLP/Hands-On notebooks the node already lists).
- [should-fix] `cs229` `videos: enrolled-only` for Summer 2026 is inferred, not stated: https://cs229.stanford.edu/ says only "course documents are shared
  only with Stanford affiliates"; it says nothing about video. Write `unknown (no public playlist found)`.
- [suggestion] Primary pick agrees: Murphy PML1 is the best single modern text for this exact scope (chapter map matches the book: ch. 9 LDA/NB,
  10 logistic, 11 linear, 12 GLM, 16 exemplar, 17 kernels, 18 trees, 20 PCA, 21 clustering). But it is ~600 pages for a 140 h node; make
  the CS229 notes the reading spine of the course route and Murphy the depth text, which the `use` text half-says already.
- split/prereq: agree with `soft: [scientific-python]` (the sklearn/NumPy practice items assume it).

## applied-ml-practice
- [should-fix] Redundant: `huyen-shift` and `d2l-shift` both teach covariate/label/concept shift (same job, same modality: reading). Drop `d2l-shift` or
  restrict Huyen to the training-data/feature/offline-evaluation chapters.
- [suggestion] `trustworthy-experiments` chapter numbers (Ch. 1-3, 6-7, 17-19, 21) are "from memory" per its own `use`; they agree with my recollection of the 2020 TOC but
  nobody opened a TOC. Mark as unverified in open_questions (already there) and keep.
- [suggestion] Primary-text is a docs section, not a book; acceptable (no better single text exists), but say in notes that Raschka 1811.12808 is the
  conceptual spine for the statistics of evaluation.
- split/prereq: none.

## deep-learning-fundamentals
- [should-fix] Q1 adjudication (primary-course fit). CS231n is a computer-vision course, not a general DL course. The lectures that match this node's scope are L2-8
  of the Spring 2026 schedule (https://cs231n.stanford.edu/schedule.html: linear classifiers/softmax, regularization+SGD/Adam, backprop, CNNs, architectures+BatchNorm,
  RNN/LSTM, attention) and they are framed on images (kNN, "visual viewpoint", captioning). The assignments are excellent and verified live
  (A1: kNN, softmax, 2-layer net, FC nets; A2: BatchNorm, Dropout, ConvNets, PyTorch/CIFAR-10, RNN captioning; https://cs231n.github.io/assignments2026/assignment1/ and
  /assignment2/). The only public lectures are the 2025 playlist (verified title "Stanford CS231N Deep Learning for Computer Vision I 2025"); the 2026 course page itself says they are
  "not reflective of this offering". The owner's own seed list treats CS231n A1/A2 only as `support` practice, with UDL as primary; the worker promoted it to primary-course.
  A better general-DL course with public lectures and problem sets exists: **MIT 6.7960 Deep Learning, Fall 2024 on OCW**
  (https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/ , verified: Lecture Videos, Lecture Notes, Problem Sets, Readings; Isola/Beery/Bernstein; topics MLPs, CNNs, RNNs,
  graph nets, transformers, backprop/autodiff, generalization; Lec 02 "How to Train a Neural Net"). It is more theory-leaning and assumes 18.05 + intro ML, so it is not strictly easier.
  Fix: either (a) make 6.7960 (Fall 2024 OCW videos + psets) the primary-course and keep CS231n A1-A2 as the practice route (matches the owner's seed), or (b) keep CS231n but state plainly in `use`
  that lectures 2-8 are vision-framed, cite the 2025 playlist as the video source, and move 6.7960 from `considered` to a named secondary. I prefer (a).
- [should-fix] Duplicate assignment with `deep-learning-for-vision`: both nodes assign CS231n lectures 5-8 (CNNs, architectures, RNNs, attention) and Assignments 1-2 (here: A1-A2; there: "Assignment 1 and 2 ... ConvNets, network visualization").
  A learner doing the roadmap in order does the same assignments twice. Fix: in deep-learning-for-vision keep only L9-11 + A3 Q1 and drop A1-A2 / L5-8.
- [suggestion] Coverage check passes: UDL Ch. 3-11 map to the scope (UDL numbering verified from memory of the TOC; the site is a JS app); RNNs via d2l and the CS231n RNN lecture, training dynamics via Karpathy's recipe and Zero to Hero. Gap: no explicit
  item on initialization/normalization beyond UDL Ch. 7/11 and Karpathy makemore part 3 (already in zero-to-hero `use`), so fine.
- [suggestion] Omission (cheap, high-value): Karpathy's "Zero to Hero" is `secondary`; for backprop-from-scratch it is arguably the best 5 hours in the node. Consider promoting micrograd + makemore 1-3 to a named `practice` item.
- split/prereq: agree with `soft: [scientific-python]` (A1-A2 assume NumPy fluency).

## dl-engineering
- [should-fix] Open question is resolvable: the Manning page for the second edition exists (https://www.manning.com/books/deep-learning-with-pytorch-second-edition, "Howard Huang, Eli Stevens, Luca Antiga, Thomas Viehmann"; the owner's seed also cites
  the 2nd edition and the code repo `deep-learning-with-pytorch/dlwpt-code-2e`). The node lists the 2020 first edition and says the 2nd is "in progress". Link the 2nd edition and say MEAP vs published after checking the page.
- [suggestion] The Karpathy nanoGPT deprecation claim is correct (README: "Update Nov 2025 ... nanoGPT ... is now very old and deprecated", pointing to nanochat); the GPT-2 video title verified ("Let's reproduce GPT-2 (124M)").
  Consider listing nanochat as the maintained, current companion in `considered` rather than ignoring it.
- [suggestion] Mild bloat: `recipe` (Karpathy) is also in deep-learning-fundamentals with a near-identical `use` (same job twice across nodes). Keep it in one place (fundamentals) and refer to it here.
- Primary-course as a single video is honestly labeled (kind video-series). Agree.
- split/prereq: none.

## transformers
- [suggestion] Redundancy: four explainers do the same job (UDL ch. 12 primary, `illustrated-transformer`, `d2l-attention`, `formal-algorithms`). `formal-algorithms` (pseudocode) is the one that adds something; consider dropping `d2l-attention` or `illustrated-transformer`.
- [suggestion] Effort: `cs336-a1` (BPE tokenizer + full transformer LM + AdamW + training) alone is a 30+ hour assignment; the node budget is 40 h. Mark it optional and keep the Karpathy build + `transformer-from-scratch` capstone as the core.
  (Spring 2026 syllabus confirmed: A5 "Alignment and Reasoning RL", lectures 15-17 as below; A1 handout details were not re-opened.)
- [suggestion] The primary "course" is one YouTube lecture; that is fine, but `role: primary-course` with a single video should be noted in notes (it is).
- split/prereq: agree with `soft: [dl-engineering]`.

## bayesian-inference
- Verified: Statistical Rethinking 2026 repo README (6 Jan - 13 Mar 2026; beginner Tuesday / experienced Friday; "I will record lectures and make them available to the general public"); playlist `PLDcUM9US4XdNOlqSyhe38US8mFgmqzI14` is titled "Statistical Rethinking 2026". Primary pair is the right pick.
- [suggestion] Coverage: Rethinking (R/Stan/ulam) does not teach variational inference or Python PPLs at all; both are carried only by secondaries (Murphy PML2 ch. 10, Blei review, BMCP). That is the honest design, but say in `notes` that VI is not covered by either primary resource.
- [suggestion] Mild bloat: `think-bayes` (reference, beginner on-ramp) plus `bmcp`, `pymc-numpyro` practice all do "Python Bayesian code". Fine, but two reference books for the same gap (gpml and pml2 ch. 18 on GPs) overlap; keep gpml as reference and trim PML2 ch. 18.
- split/prereq: none.

## probabilistic-graphical-models
- [should-fix] Video status is wrong/underdetermined. The CMU 10-708 Spring 2020 lectures page (https://www.cs.cmu.edu/~epxing/Class/10708-20/lectures.html) contains 28 public `youtu.be` links (oEmbed: "Lecture 01 Introduction", "Lecture 02 Undirected GMs",
  "Lecture 03 Directed GMs", channel "CMU 10-708 PGM"), and the Spring 2019 site links a public playlist (`PLoZgVqqHOumTY2CAQHL45tQp6kmDnDcqn`, oEmbed title "Spring 2019", same channel). The node records `videos: unknown` with "Panopto, public access not confirmed".
  Fix: `videos: public`, `public_videos_term: Spring 2020 (YouTube channel CMU-10-708-PGM; 2019 playlist above)`. This also removes the node's only open question and makes 10-708 a genuinely public-video primary-course.
- [suggestion] Primary text pick (Ermon/Kuleshov CS228 notes) agrees. A caveat worth recording: the notes' last substantive update was ~2018-2020 (worker found "mid-2025" only via a third-party aggregator), and the notes carry no exercises; the practice items fill that.
- [suggestion] Omission: Sargur Srihari's PGM slide set (https://cedar.buffalo.edu/~srihari/CSE674/, live, slides only, no videos found) and David Barber's free BRML book would be useful free alternatives to Koller-Friedman; I could not open Barber's site (503). Low priority.
- split/prereq: mild disagree with `soft: [bayesian-inference]`: both nodes are optional; CS228 notes cover sampling and variational inference themselves, and bayesian-inference is the heavier, later-feeling node. Keep as is.

## causal-inference
- Facts verified: Brady Neal course page live (Fall 2020), playlist title "Causal Inference Course Lectures", `assignments: none` is right.
- [suggestion] Omission: Peters, Janzing, Schoelkopf, *Elements of Causal Inference* (MIT Press, open access) is the ML-oriented SCM/DAG counterpart and is a better fit for the ML audience than Pearl's Primer (paid). Add as `secondary`. (MIT Press page returned 403 to me; open-access status is from memory.)
- [suggestion] Mild bloat: three Python-practice resources (`facure`, `dowhy`, plus code in Mixtape/Effect). Fine; but `causalml-book` (DML) and `athey-wager` (video series, R) both cover heterogeneous effects; one would do.
- split/prereq: none.

## graph-neural-networks
- [should-fix] Scope vs primary-course: scope names "graph transformers" and "geometric deep learning"; the primary-course's only public recordings (CS224W 2021 playlist, verified live) predate graph transformers. The node already says so and patches with GDL course (2022) and GraphGPS paper. Record this honestly in the primary-course `use` ("lectures 2021; graph transformers from GraphGPS/GDL only").
  Fall 2026 facts verified: https://cs224w.stanford.edu/ ("Lecture Videos: are available on Canvas for all the enrolled Stanford students"; "lecture slides and assignments will be posted online as the course progresses"; Leskovec + guest Kanatsoulis).
- [suggestion] Bloat: first-pass explainers overlap (`udl-ch13`, `distill-gnn`, `foundational-papers` Kipf blog, Hamilton ch. 5). Keep Distill + Hamilton; make UDL ch. 13 optional.
- [suggestion] Omission: Veličković's Cambridge L45 Graph Representation Learning lectures (YouTube, 2021) and Ma/Tang "Deep Learning on Graphs" are alternatives to the aging Hamilton book; not verified by me, so only a pointer.
- split/prereq: none.

---------------------------------------------------------------------------------------------------------------------------

# G6 Vision & generative

## vision-foundations
- [must-fix] Szeliski 2nd edition chapter numbers in `szeliski-2e.use` are wrong. The 2e has 15 chapters (verified via publisher TOC search result): Ch. 8 Image alignment and stitching, Ch. 9 Motion estimation, Ch. 11 Structure from motion and SLAM,
  Ch. 14 Image-based rendering. The node says "9 (image stitching), 9.x/11 (alignment, SfM), 9.4 / 16 (optical flow and motion)": there is no Ch. 16, stitching is Ch. 8 and optical flow is in Ch. 9. The numbers look like a mix with the 1st edition.
  Fix: "Ch. 3 image processing, Ch. 7 feature detection and matching, Ch. 8 alignment and stitching, Ch. 9 motion estimation (optical flow), Ch. 6 recognition"; confirm against the PDF TOC.
- [should-fix] Coverage: the scope item "features" (Harris/SIFT/RANSAC matching) and "classical recognition" are not covered by the primary text. Foundations of CV (TOC verified at https://visionbook.mit.edu/) has no local-feature chapter and ch. 50 is deep-era recognition; only FPCV (SIFT Detector, Face Detection modules), Szeliski Ch. 7 and CS180 Project 3 carry them.
  Say so in `notes` (the `why` of the primary text claims coverage it does not have), or add Szeliski Ch. 7 to the primary `use`.
- [should-fix] Duplicate with `multi-view-geometry`: CS231A PS1 (camera models, calibration, single-view metrology) is assigned here and again as PS1 of "PS 1-3" in multi-view-geometry. Assign PS1 in one node only.
- [suggestion] FPCV is labeled primary-course but kind video-series with no `course` block; fine, but `videos`/`assignments` facts should be filled (videos public on the site, assignments none).
- split/prereq: agree: drop the soft prereq on deep-learning-fundamentals (Foundations Part III and FPCV teach what is needed).

## deep-learning-for-vision
- [should-fix] CS231n duplicate with deep-learning-fundamentals (see there): lectures 5-8 and Assignments 1-2 are assigned in both nodes.
- [should-fix] Facts: CS231n "2026 schedule adds video understanding, distributed training and world models" is consistent with the Spring 2026 schedule seen (Lectures 5-9 CNNs, architectures, RNN, attention, detection/segmentation confirmed; later lectures not enumerated by me).
  The mapping "lectures 5-11 of the 2025 videos" cannot be checked without playing the playlist; the worker lists it as 2025 numbering whereas the page I read is the 2026 schedule. State that the lecture numbers are from the 2026 schedule and may be offset in the 2025 playlist.
- [suggestion] Primary pick: d2l is the best executable text for the CNN-to-detection-to-segmentation chain; agree. Alternative worth listing in `considered` (public videos, from-scratch PyTorch assignments): Michigan Online EECS 498-007/598-005 (Justin Johnson), YouTube playlist `PL5-TkQAfAZFbzxjBHtzdVCWE0Zbhomg7r` (oEmbed: "Deep Learning for Computer Vision", Michigan Online, public). It appears in the node's ID list but only as prose in `considered`; the Johnson-hosted pages are 404 (confirmed: web.eecs.umich.edu/~justincj/teaching/eecs498/FA2019/ and WI2022/ both 404), so videos are public but assignments are not reachable at the old URL.
- [suggestion] Bloat: `cv3dst` (TUM 2021/22 playlist) and `hf-cv-course` overlap on detection/segmentation; the HF course is community-quality. Keep one.
- split/prereq: agree (vision-foundations soft only).

## self-supervised-learning
- Q2 adjudication: primary-text is an arXiv paper (Cookbook of SSL, 2304.12210, verified, 24 Apr 2023). I agree it is the best available teaching text for the scope: nothing book-length treats contrastive, distillation (DINO/BYOL), masked modeling and JEPA under one framework with training recipes. Alternatives checked and found weaker:
  Foundations of CV ch. 30/33 (short, conceptual, free), Lilian Weng posts (blog, 2019/2021), CS294-158 SSL lecture (one lecture). Keep, but say in notes that it stops before DINOv2/v3, V-JEPA 2 and LeJEPA, which the paper path supplies (all five arXiv IDs verified: 2508.10104, 2506.09985, 2511.08544, 2504.01017, 2304.07193 is DINOv2).
- Facts verified for 6.8300 (https://scenerepresentations.org/courses/2026/spring/advances-in-cv/): Spring 2026; Module 2 lectures "Introduction to Representation Learning and Generative Modeling (Tue Mar 31)", "Image Representation Learning (Apr 21)", "Video Representation Learning (Apr 23)", "Guest lecture: Mathilde Caron (Apr 28)" all exist with Recording/Slides links; psets are repos `6-8300/pset-2-2026`, `pset3-2026`; OCW Spring 2025 page lists Lecture Videos. Recordings are Panopto viewer links; the lecture viewer page loads titled "6.8300 Lecture on 4/23/2026 (Thu)" without a redirect, so "public" is plausible; I could not play one.
  Note the course's formal prerequisite is 6.7960 Deep Learning and it is advanced graduate level; for 35 h with 4 lectures used it is fine, but a learner who has done deep-learning-for-vision may find the slides thin for SSL; the CS231n A3 practice item is the safety net.
- [suggestion] Overlap: CLIP-style objectives sit here and in vision-language-models (the node says so). The `cs231n-a3-ssl` item (A3 Q2, Q4: verified in the 2026 A3 page, "Q2: Self-Supervised Learning for Image Classification", "Q4: CLIP and Dino") is the right practice; do not repeat OpenCLIP practice in both nodes.
- split/prereq: agree with adding `soft: generative-modeling-foundations`.

## multi-view-geometry
- [should-fix] `tum-3dcv`: the node flags that the playlist id looks short (`PLNkLZ4QZfEDs`). It resolves (oEmbed title "Lecture: 3D Computer Vision (SS26)", channel cvprtum), so this open question can be closed. Number of videos not checked.
- [should-fix] Duplicate: CS231A PS1 (see vision-foundations).
- [suggestion] Primary pick (H&Z) agrees; the free path is well documented. `slam-handbook` (Cambridge 2026, draft in a repo) was not opened by me; keep `verified` honest.
- split/prereq: disagree with making `optimization` hard: TUM Ch. 6 teaches Gauss-Newton/LM inside the course and `optimization` in this skeleton is convex-optimization-leaning. Keep soft; agree with adding soft `probability` (RANSAC, robust estimation).

## neural-3d
- Q2 adjudication: primary-text = Eurographics STAR "Neural Fields in Visual Computing and Beyond" (2111.11426, Nov 2021). It is a good conceptual survey but it predates 3D Gaussian splatting and all feed-forward reconstruction, i.e. about half of the scope. No book covers the area. Better-fitting structured text options (all free): Foundations of CV ch. 45 "Radiance Fields" (TOC verified) and the 3DGS surveys the node already cites (2401.03890, 2403.11134).
- [should-fix] Make coverage explicit: either swap `primary-text` for a composite that matches scope (the Neural Fields STAR for the formalism + Foundations ch. 45 + the 3DGS survey 2401.03890 as the post-2023 text) or record in `notes` that the primary text covers only NeRF-era neural fields and that 3DGS and feed-forward reconstruction come from papers and CMU 16-825. Foundations ch. 45 is listed in `multi-view-geometry` but not here: add it as a short secondary.
- [suggestion] Szeliski 2e Ch. 14 (Image-based rendering) is, as I recall, where neural rendering/NeRF is treated in the 2nd edition; verify the section before listing.
- Primary-course facts verified: KAIST CS479 Spring 2026 (https://3dml.kaist.ac.kr/, Minhyuk Sung; prerequisite CS371; 15 YouTube links on the page; assignments page exists); CMU 16-825 Fall 2026 page live; 6.8300 differentiable-rendering lectures (Mar 10, 12, 17, 19) confirmed.
- [suggestion] Bloat: three NeRF-from-scratch assignments listed (KAIST A2, Berkeley CS180 P4, CMU 16-825) plus nerfstudio/gsplat. Fine as options, but name one default.
- split/prereq: agree with the split proposal in principle (neural rendering vs 3D deep learning / feed-forward / generative 3D); at 50 h the node is overloaded. Agree with `soft: diffusion-and-flow-matching`.

## vision-language-models
- Q2 adjudication: primary-text = "An Introduction to Vision-Language Modeling" (2405.17247, 27 May 2024, verified). It is the only newcomer-oriented VLM primer and I agree with it as primary. One stronger/longer alternative to record in `considered`: Li et al., "Multimodal Foundation Models: From Specialists to General-Purpose Assistants" (arXiv 2309.10020, FnT 2024, verified live) with the CVPR 2023 tutorial; it also covers generation and instruction tuning but is 2023 and 100+ pages.
- Facts verified: MIT MMAI Spring 2026 schedule has Week 4.1 (Feb 24) "More multimodal fusion", 4.2 (Feb 26) "Multimodal alignment [slides][video]" with CLIP reading, 5.1 (Mar 3) "Large multimodal models [slides][video]"; videos are youtu.be links, so `videos: public` is right (it is a general multimodal course, not VLM-only, as the node says).
  CS336 Spring 2026 Lecture 17 is "Alignment - multimodality [Percy]" (lecture_17.py), so the claim holds. `smol-vlm-finetune` URL `.../smol-course/unit3/1` is "Introduction to Vision Language Models": the open question about unit numbering can be closed (unit4/1 is "Coming Soon").
- [suggestion] Practice is heavy for a 40 h node: nanoVLM (about 6 h of H100 per README), SmolVLM2 fine-tune, lmms-eval, OpenCLIP. Mark nanoVLM and OpenCLIP as alternatives, not both required.
- split/prereq: agree with `soft: self-supervised-learning`.

## generative-modeling-foundations
- [suggestion] Coverage: UDL ch. 14-18 is the right primary text (numbering confirmed); the node honestly flags energy-based models as weak (CS236 + Goodfellow ch. 20). CS294-158 SP24 (HW1-HW4 titles verified on the course page: Autoregressive, Latent Variable, GANs/Implicit, Diffusion) is a good primary-course.
- [suggestion] `bishop` is listed with chapter numbers "as I recall"; either open the TOC or drop the numbers.
- [suggestion] `goodfellow-ch20` and `weng-vae-flows` are marginal; `vae-intro` + UDL already cover the VAE derivation twice.
- split/prereq: agree with no change.

## diffusion-and-flow-matching
- [should-fix] Bloat. The node has 4 course items (6.S184, CMU 10799, 6.S183 psets, HF diffusion course), 3 blog-style tutorials doing the same job (`luo-unified`, `song-score-blog`, `weng-diffusion`, plus `dieleman-posts`), 3 reference papers/monographs (`flow-matching-guide`, `principles-diffusion`, `edm`), and 4 separate "implement DDPM" exercises (`cs231n-a3-ddpm` Q3, CS294-158 HW4, CMU HW1, 6.S184 Lab 2/3). For 55 h this is too much. Fix: keep 6.S184 text+course+labs and CMU 10799 HW1-2 as the implementation pair; demote `cs231n-a3-ddpm` and `weng-diffusion` to `considered`; keep one tutorial (Luo, for the ELBO bridge) and Dieleman for intuition.
- Facts verified: 6.S184 2026 page (Holderrieth, Erives; Lectures table with Slides/Recording columns; notes arXiv 2506.02070); CMU 10-799 Spring 2026 Mini 3 (announcement "The recording of our first lecture is up on YouTube", Homework 1 out Jan 15); 6.S183 playlist `PL_1TbuIu65A_G908tHHvTnyQsueR17rMh` = "MIT 6.S183 A Practical Introduction to Diffusion Models, IAP 2025" (2025, as the node says).
- [suggestion] 6.8300 also has three diffusion lectures (Diffusion 1: "Mathematical Foundations of Diffusion Models, ODE and SDE perspective, score matching and flow", Apr 2 etc.) public; node only mentions them as `considered`. Fine.
- split/prereq: agree with changing the hard prereq (6.S184 itself asks only for probability + deep learning).

## generative-models-at-scale
- Q2 adjudication: primary-text = SD3 paper (2403.03206). Honest case study, but it teaches rectified flow + MM-DiT for images only; the scope also lists distillation, video, audio, conditioning and evaluation, all of which are carried by secondaries.
  A book or notes text does not exist for the whole scope. The closest structured text is the CME296 slide decks/cheatsheet (https://cme296.stanford.edu/, syllabus verified: Lectures 4-8 = latent space/guidance, architectures (U-Net, DiT, MMDiT), training (Flow-GRPO, Diffusion-DPO, DreamBooth/LoRA, distillation), evaluation (FID, CLIPScore, PickScore, LPIPS, MLLM-as-judge), trending (video)); it is a close one-to-one match to the scope.
- [should-fix] Record in `notes` that the primary text covers only about a third of the scope, and consider making the CME296 slides/cheatsheet the primary-text and SD3 a primary case study within it; the course and text would then agree. At minimum move Dieleman's latents post (April 2025) into the primary reading since it is the better conceptual text.
- [should-fix] Course facts verified: CME296 Spring 2026 (Amidi): 8 lectures Apr 3 - May 29, midterm May 1, final June 8, each with a video column and midterm/final solutions linked; no homework (so `assignments: none` is right; the exams are the only checkable work).
- [suggestion] Duplicate across nodes: `eval-gen` (Rethinking FID 2401.09603) is also in generative-modeling-foundations `eval-papers`; `cmu-10799-scale` repeats lectures 6-13 of the same course used in diffusion-and-flow-matching. Say "lectures 9-11 here, 2-7 there" and avoid listing 6-7 twice.
- split/prereq: agree with splitting audio out; agree with `soft: vision-language-models`; `soft: self-supervised-learning` is weak (only DINO-style FD evaluation and tokenizer context), I would drop it.

---------------------------------------------------------------------------------------------------------------------------

# G8 RL & safety

## rl-foundations
- Facts verified: CS234 Winter 2026 page (http://web.stanford.edu/class/cs234/): "Videos of the lecture content will also be made available to enrolled students through canvas"; "Spring 2024 materials here" link; schedule and modules page confirm Lectures 1-4 = intro, tabular MDP planning, policy evaluation, Q-learning (with Sutton-Barto chapter pointers and a link to Silver's lecture 4); Assignments 1-3 released with starter code and LaTeX. Spring 2024 playlist title verified ("Stanford CS234 I Reinforcement Learning I Spring 2024 I Emma Brunskill"). Silver playlist `PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ` verified ("DeepMind x UCL | Introduction to Reinforcement Learning 2015").
- [suggestion] CS234 is the right course here only for L1-4; fine. Because Winter 2026 videos are Canvas-only, the practical learner path is the 2024 playlist plus Winter 2026 slides: say so in the one-line `why` (it does in `notes`).
- [suggestion] Omission: Plaat, *Deep Reinforcement Learning* (Springer 2022, free preprint https://arxiv.org/abs/2201.02135, course site https://deep-reinforcement-learning.net/) is a single graduate textbook covering value-based, policy-based, model-based, and self-play/multi-agent; it fits several RL nodes (see deep-value-based-rl). Add it as `considered` here.
- split/prereq: none.

## bandits-and-exploration
- [should-fix] The CS234 lecture mapping "Winter 2026 Lectures 9-12 (slides lecture9-lecture12): bandits, UCB, Thompson, exploration in MDPs" does not match the page. On the modules page, lecture 9 and 10 slides appear under both "Imitation Learning and Learning from Human Input and Batch RL" and "Data Efficient RL"; the schedule shows week 6 as "Offline RL / Bandits ... Strategic data gathering / Exploration" and week 7 "Exploration". Open the slide PDFs (lecture9..14pre/post at web.stanford.edu/class/cs234/slides/) and list the real lecture numbers; the "Bandit Algorithms Book Section 7.1" reading is attached to the L10-12 block, which is consistent with a shift of about one lecture.
- [suggestion] Omission: Murphy RL Overview §7.1-7.2 (regret, Thompson sampling, UCB, Bayes-adaptive; verified in the arXiv HTML TOC) is a free, current, short complement and is not listed here although the same document is a reference in 5 other RL nodes.
- [suggestion] Primary-course honesty is good (no standalone course); `arena-2-1` is test-backed practice; keep.
- split/prereq: none.

## deep-value-based-rl
- [must-fix] Q2 adjudication and wrong coverage claim. `murphy-value` (primary-text) says Chapter 2 covers "distributional RL". It does not: in RL: An Overview v5 (Dec 2025; verified on the arXiv HTML) chapter 2 "Value-based RL" covers MDP basics, DP, MC/TD, SARSA, Q-learning, neural fitted Q, DQN, replay, prioritized replay, deadly triad, target networks, Double DQN, dueling, noisy nets, multi-step, Rainbow, "Bigger, Better, Faster";
  distributional RL is §7.3 (quantile regression, classification), a short section in "Other topics". The scope item "distributional RL" then rests on the Bellemare/Dabney/Rowland book (a secondary). Fix: correct the `use`, point distributional RL to §7.3 + the book, and note that each DQN extension is only a few paragraphs.
- [should-fix] Is a survey the best primary text? Murphy ch. 2 is the most current free single text, but it is a terse survey. Better teaching text exists: Plaat, *Deep Reinforcement Learning* (https://arxiv.org/abs/2201.02135, https://deep-reinforcement-learning.net/, Springer 2022; chapters on value-based methods (DQN, Rainbow), policy-based, model-based, two-agent self-play) has worked examples and a taught course; Sutton-Barto ch. 9-11 plus the DQN paper sequence is the other route. Recommend `primary-text` = Plaat ch. 3 (value-based) with Murphy ch. 2 as the current-notation reference, or keep Murphy and state the thinness.
- Course facts verified: CS 185/285 Spring 2026 (https://rail.eecs.berkeley.edu/deeprlcourse/): Levine; Lectures 7-8 = "Value-Based RL", "Q-learning in Practice"; HW3 "Q-Learning and Actor Critic"; the page links only the Fall 2023 playlist (`PL_iWQOsE6TfVYGEGiAOMaOzzv41Jfm_Ps`, "CS 285: Deep RL, 2023"). `homework_spring2026` repo: raw.githubusercontent README 404 (repo not reachable to me; the worker's assignments URL is unverified from here).
- [suggestion] Bloat: three Atari/CartPole DQN exercises (`cleanrl-dqn`, `hf-deep-rl-unit-3`, `arena-dqn`). Suggest ARENA (from scratch) then CleanRL (reference); drop HF unit 3.
- split/prereq: agree (no change).

## policy-gradient-methods
- [suggestion] Primary pick (Spinning Up) agrees (the worker's own note admits stale code; math and docs are what is used). Consistency: here the primary is Spinning Up while the value-based node uses Murphy; both are fine.
- [suggestion] Bloat: three PPO implementation resources (`cleanrl-ppo`, `arena-ppo`, `hf-deep-rl-units-4-8`) plus Spinning Up exercises. Keep ARENA (from scratch), CleanRL (reference), 37-details post; drop HF units 4-8.
- Course facts verified: CS285 Spring 2026 schedule (L5 Policy Gradients, L6 Actor Critic, L9-10 Advanced Policy Gradients Part 1-2; HW2 "Policy Gradients"); CS224R Spring 2026 (Finn): Policy gradients Apr 8, Actor-critic Apr 10, Off-policy actor-critic Apr 15; "Lecture videos: Not public ... (The Spring 2025 lecture videos were published on YouTube)"; playlist `PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL` = "Stanford CS224R Deep Reinforcement Learning" (it does not state the year; the page states Spring 2025).
- split/prereq: none.

## model-based-rl
- [should-fix] Open question closed: Fall 2023 `hw4` is the model-based assignment. `raw.githubusercontent.com/berkeleydeeprlcourse/homework_fall2023/main/hw4/cs285/scripts/run_hw4.py` imports `cs285.agents.model_based_agent.ModelBasedAgent` and `SoftActorCritic`
  (i.e. learned-dynamics MPC + MBPO). Update `mbrl-hw` to "Fall 2023 hw4 (model-based RL: ensembles, MPC/CEM, MBPO)" and drop "expected to be one of them". Spring 2026 has no model-based homework (HW1-HW5 = Imitation, PG, Q-Learning+AC, LLM RL, Offline RL; verified on the 2026 page), so the Fall 2023 repo is the only graded route.
- [suggestion] Q2 adjudication: primary-text = Moerland et al. survey (2006.16712, FnT 2023). Agree as the most systematic single text; Plaat's textbook ch. on model-based RL (Dyna, MuZero, Dreamer-style; arXiv 2201.02135) is the textbook alternative and also fits `deep-value-based-rl` and `multi-agent-rl` (self-play). Record it in `considered`.
- [suggestion] Facts: Spring 2026 L15-16 = Model-Based RL Part 1-2 (verified); CS224R 11 = "Model-Based RL" (May 6) consistent with slide name `11_cs224r_mbrl_2026.pdf`.
- split/prereq: agree (Sutton-Barto ch. 8 context).

## offline-rl-and-imitation
- [suggestion] Q2 adjudication: primary-text = Levine et al. offline RL tutorial (2005.01643). It is the canonical tutorial; I agree it is the best single text for the offline half. For imitation/IRL the primary is a different paper (Osa); the split of the scope across two papers is acknowledged.
- [suggestion] Off-policy evaluation is the thinnest scope item (only DOPE). Add Levine's CS285 OPE material (lectures 17-18) explicitly and Precup's/Thomas' OPE tutorial if one is located; I did not find a better public resource either.
- Facts verified: CS285 Spring 2026 L2-3 Behavioral Cloning 1-2, L17-18 Offline RL 1-2, HW1 "Imitation Learning", HW5 "Offline RL".
- [suggestion] `corl-practice` repo is archived (the node says so); keep Minari as the main.
- split/prereq: none.

## multi-agent-rl
- [suggestion] Agree: MARL book (Albrecht, Christianos, Schaefer; playlist `PLkoCa1tf0XjCU6GkAfRCkChOOSH6-JC_2` verified) is the right primary pair. Omission: Plaat's textbook (ch. on two-agent zero-sum self-play, AlphaZero-style search) is a free, textbook-form source for the "AlphaZero-style search" scope item that is now carried by a paper plus Silver slides.
- [suggestion] `farina-6s890` page says Fall 2024 and has no videos; flag in `notes` that it is notes-only (it does).
- split/prereq: agree (game-theory basics are inside MARL book ch. 3-4).

## rl-for-llms
- [should-fix] Wrong lecture reference: `cs336-a5.why` and `considered` say "lectures 15-17 (post-training, RLVR)". On the Spring 2026 schedule (https://cs336.stanford.edu/): 15 = "Mid/post-training (SFT/RLHF)", 16 = "Post-training - RLVR", 17 = "Alignment - multimodality [Percy]". Use lectures 15-16. (Lecture 17 is the one used in vision-language-models.)
- [suggestion] Course and facts: playlist `PLoROMvodv4rMqXOcazWaTUHhq-yembLCV` = "Stanford CS336: Language Modeling from Scratch | Spring 2026"; Assignment 5 "Alignment and Reasoning RL ... Optional Part 2: ... safety alignment methods such as DPO" confirmed; CS285 Spring 2026 L14 "LLM RL" and HW4 "LLM RL" confirmed; CS224R slides 08-10 consistent with the 2026 schedule.
- [suggestion] Bloat: the RLHF Book code repo and ARENA 2.4.x and TRL docs all implement GRPO/PPO on a small LM; choose ARENA (tested) + TRL (library). `rl-llm-survey` and `core-llm-rl-papers` overlap on the post-R1 literature; keep the survey as map only.
- [suggestion] Primary text + primary course (RLHF Book + its course) agree; the course has `assignments: none`, so CS336 A5 and ARENA fill it (the node says so).
- split/prereq: none.

## ai-safety-foundations
- [should-fix] Level mismatch in the primary-course. Node level is `intro`, hard prereq only deep-learning-fundamentals. Harvard CS 2881R (https://boazbk.github.io/mltheoryseminar/) is "a graduate-level course ... We require mathematical maturity and proficiency with proofs, probability, and information theory, along with foundations of ML at the level of CS 181 or MIT 6.036", and Fall 2026 states in-person attendance is mandatory (lectures listed: Sep 3 Introduction, Cyber Capabilities, Modern LLM Training, ..., Dec 3 Ajeya Cotra; Fall 2025 archive has the full videos).
  The node's own `notes` concedes this. Better fits for an intro node: the textbook's own course (the Hendrycks book site links slides and lecture videos per chapter via the curriculum page, and "Intro to AI Safety" on Coursera is an abridged video version, both verified on https://www.aisafetybook.com/) and CAIS "Intro to ML Safety" (https://course.mlsafety.org/: lecture recordings 🎥, slides, notes, coding assignments, site is 2023 material). Fix: make the Hendrycks curriculum (book + chapter videos/slides) the primary-course and Harvard CS 2881R a secondary "advanced follow-up".
- [suggestion] Omission (hidden gem): Robert Miles' AI Safety YouTube channel and the Alignment Forum curated sequences; both are free and cover the "alignment problem / specification gaming" items in an accessible form. Not verified by me.
- [suggestion] Primary-text pick agrees (only textbook-format free resource spanning risk, technical, governance). 
- split/prereq: agree (no change).

## mechanistic-interpretability
- Verified: ARENA ch. 1 (https://learn.arena.education/chapter1_transformer_interp/) matches the `use` list exactly (1.1 Transformers from Scratch, 1.2 Intro to Mech Interp, 1.3.1 Linear Probes, 1.3.2 Function Vectors/Model Steering, 1.3.3 SAEs, 1.3.4 Activation Oracles, 1.4.1 IOI, 1.4.2 SAE Circuits, 1.5.1-1.5.4 Bracket, Grokking, OthelloGPT, Superposition SAEs, plus Monthly Algorithmic Problems).
- [suggestion] Coverage gap: the scope names "transcoders and attribution graphs"; ARENA ch. 1 has no section on them (the node acknowledges and patches with Circuit Tracing/Biology + `circuit-tracer`). Make that explicit in the primary-course `use`.
- [suggestion] Index "through October 2026" for transformer-circuits.pub and the Gemma/Neuronpedia claims were not re-verified by me.
- [suggestion] Bloat: three library reference entries (`transformerlens-docs`, `nnsight-docs`, `saelens`) plus ARENA; fine.
- split/prereq: agree (no change).

## evals-and-red-teaming
- [suggestion] Omission: Apollo Research, "A Starter Guide For Evals" (https://www.apolloresearch.ai/blog/a-starter-guide-for-evals , live) is a short, practical text on eval design that fits the primary-text slot better than a tool manual; add as a secondary (or primary alongside Inspect docs).
- [suggestion] `jailbreak-papers`, `scheming-evals`, `red-teaming-papers` overlap with adversarial-robustness `llm-adversarial-papers` and alignment-and-oversight `misalignment-evidence`: Sleeper Agents (2401.05566) is assigned in three nodes, Alignment faking (2412.14093) and Emergent Misalignment (2502.17424) in two, GCG (2307.15043) and "Are aligned neural networks adversarially aligned?" in two. Assign each paper to one node and cross-reference. Same for Gandalf/Tensor Trust (here `gandalf`, `tensor-trust`; adversarial-robustness `gandalf-adv`).
- [suggestion] Practice sites are free and volatile; only `inspect-practice` is a structured exercise. Agree with node notes.
- split/prereq: none.

## alignment-and-oversight
- [should-fix] The `primary-text` is a curated reading list (BlueDot Technical AI Safety), not a text; the node says so, and says individual readings were not opened. Because the readings change between cohorts, the node should name a stable core set from the secondary list as the actual reading spine (Casper et al. 2307.15217, Gao 2210.10760, Burns 2312.09390, Greenblatt 2312.06942) and demote BlueDot to the "map".
- [suggestion] Duplicate: `harvard-alignment-lectures` is the same course and same playlist as ai-safety-foundations' primary-course, with different lectures. Fine, but state which lectures belong where (Fall 2026 page lists "Grading Reward Hacking", "Model Policies", "Alignment Recursive Self-Improvement" as new topics).
- [suggestion] `ji-survey` and `anthropic-research-directions` both "map the field"; keep one.
- split/prereq: none.

## adversarial-robustness
- [should-fix] Q2 adjudication, coverage: primary-text = Kolter-Madry notes (https://adversarial-ml-tutorial.org/, verified: chapters 1-4, "notes are in very early draft form", Chapter 5 never finished). They cover adversarial examples and adversarial training only, i.e. 2 of the 5 scope items; certified defenses, data poisoning and prompt injection come from papers. The notes are the best classic teaching text, but a 2018 draft.
  Better complement (free, current, authoritative taxonomy covering evasion, poisoning, privacy and abuse/prompt-injection attacks plus mitigations): NIST AI 100-2 E2025, "Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations" (https://csrc.nist.gov/pubs/ai/100/2/e2025/final , verified live). Add it as a secondary (or reference) and say in `notes` that the primary-text covers the classic half only.
- [should-fix] `eth-rtai`: Fall 2025 page verified (https://eth-sri.github.io/teaching/rtai25: Vechev, "recordings on the ETH video portal"); the portal page is a JS app and I could not confirm playback without login, so `videos: public` is unverified. Slides/exercises restricted (the worker's claim stands). The 2020 playlist (`PLWjm4hHpaNg6c-W7JjNYDEC_kJK9oSp0Y`, "Reliable and Interpretable Artificial Intelligence (2020)") is confirmed public and should be named as the safe public-video fallback.
- [suggestion] Duplicates with evals-and-red-teaming (see there). `mlsafety-robustness` (week of CAIS course) fine.
- split/prereq: agree with soft prereq on `llm-evaluation`/security for the LLM half.

---------------------------------------------------------------------------------------------------------------------------

# Overall

**Systemic issues**
1. Course reuse across nodes without de-duplication. CS231n (Spring 2026) is primary-course in two consecutive nodes with overlapping lectures (L5-8) and the same Assignments 1-2; CS231A PS1 is used in two G6 nodes; CS285 is the primary-course of 6 RL nodes (fine, but each should name disjoint lectures and homeworks; the worker mostly does); ARENA chapter 2 is used in 7 nodes; Karpathy's recipe appears in two G5 nodes; GCG/Sleeper Agents/alignment-faking papers and Gandalf/Tensor Trust appear in 2-3 safety nodes. Pick one home per item.
2. Practice bloat in implement-it-yourself items: DDPM implemented 4 times, DQN 3 times, PPO 3 times, NeRF 3 times. Name one default per node and mark the rest optional.
3. "Primary text" is a paper/survey or a docs site in 11 of 33 nodes (SSL, neural-3d, VLM, generative-at-scale, deep-value-based-rl, model-based-rl, offline RL, adversarial-robustness (draft notes), evals (Inspect docs), alignment (reading list), dl-engineering (PyTorch docs)). For SSL, VLM and offline RL the paper is genuinely the best available; for deep-value-based-rl, neural-3d and generative-at-scale a better-fitting text or course-notes spine exists (Plaat textbook; Foundations ch. 45 + 3DGS survey; CME296 slides), see per-node findings.
4. Chapter-number claims "from memory" (Kohavi, Bishop, UDL, GDL, Hamilton ch. 8-9) are mostly right but not verified; one wrong set found (Szeliski 2e). Prefer section titles over numbers when the TOC was not opened.
5. Workers recorded `videos: unknown` for sources where public YouTube links exist (CMU 10-708); and `enrolled-only` where the page is silent (CS229). Probing the course page's links resolves these cheaply.

**2026 claims checked (accurate unless listed above)**: CS188 Fa26 (Pierson, Kao) / Sp26 (Klein, Russell) and SP26 playlist; CS229 Summer 2026 (page silent on video); CS231n Spring 2026 (staff; videos Canvas-only; 2025 playlist; Assignments 1-3 contents); CS234 Winter 2026 (Canvas-only; Spring 2024 playlist; assignments 1-3 with starter code); CS 185/285 Spring 2026 (lecture and HW lists; only Fall 2023 videos); CS224R Spring 2026 (Canvas-only; Spring 2025 on YouTube); CS224W Fall 2026 (Canvas-only; slides/assignments posted as the course progresses); CS336 Spring 2026 (A5; lectures 15-17); Statistical Rethinking 2026; MIT 6.S184 2026, MMAI Spring 2026, 6.8300 Spring 2026 (Recording links; OCW Spring 2025); CMU 10-799 Spring 2026; CME296 Spring 2026; KAIST CS479 Spring 2026 (YouTube links); TUM 3DCV SS26 playlist; Harvard CS 2881R Fall 2026 page; ARENA chapters 1 and 2 contents; Murphy RL Overview v5 (1 Dec 2025); nanoGPT deprecation note; sklearn/pandas/Matplotlib/NumPy/PyTorch docs versions. Not verifiable by me: ETH RTAI video playback, 6.8300 Panopto playback, CS285 Spring 2026 homework repo (github 403), BlueDot unit contents, Transformer Circuits index through Oct 2026.

**Strongest areas**: G6 generative (diffusion, 2026-fresh public courses with labs) and G8 interpretability/evals (ARENA); G5 transformers, bayesian-inference (Rethinking 2026), ml-fundamentals. Fact accuracy of IDs/versions across the groups is excellent.

**Weakest areas**: deep-learning-fundamentals course choice (vision-framed); neural-3d primary text (pre-3DGS); generative-models-at-scale primary text (one paper for a broad scope); deep-value-based-rl primary text (thin survey, wrong coverage claim); adversarial-robustness primary text (classic half only); alignment-and-oversight (reading list as text); ai-safety-foundations course level; PGM video status.

**Counts**: must-fix: G5 0, G6 1 (vision-foundations), G8 1 (deep-value-based-rl). should-fix: G5 10 (ml-fundamentals 2, applied-ml-practice 1, deep-learning-fundamentals 2, dl-engineering 1, probabilistic-graphical-models 1, graph-neural-networks 1, plus bayesian/causal none; scientific-python/intro-ai/transformers suggestions only) -> exact tally: ml-fundamentals 2, applied-ml 1, DL-fund 2, dl-eng 1, PGM 1, GNN 1 = 8; G6 12 (vision-foundations 2, DL-vision 2, multi-view-geometry 2, neural-3d 1, diffusion 1, generative-at-scale 2, plus self-supervised/VLM/generative-foundations none = 10); G8 9 (bandits 1, deep-value 1, model-based 1, rl-for-llms 1, ai-safety 1, alignment 1, adversarial 2 = 8).
