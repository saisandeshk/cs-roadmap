# Review R1: G1 (languages and tooling), G2 (mathematics), G3 (algorithms and theory)

Reviewer R1, 2026-11-18. Scope: 27 nodes. I opened about 260 distinct URLs from the node files. All but 16 returned HTTP 200:
- Stanford hosts (ee364a, cvxbook, vmls) did not resolve even over http.
- GitHub, cppreference, MIT Press, Wiley, Harvard hsites and Illinois mediaspace returned 403.

I checked 37 YouTube playlist IDs. All resolve to the title the node claims. Two course packages were read page by page: CS 61B Fa26 and Sp26, and EECS 127 Sp26.

**Result: 0 must-fix, 23 should-fix.** I found no wrong primary pick and no wrong video claim. Remaining problems are coverage, Python-first fit, vague practice items and duplication across nodes.

Facts I checked and confirmed:
- CS 61B Fa26: lecture list, per-lecture YouTube videos, labs and homeworks match. The Sp26 playlist ID is correct.
- CS 61A Fa26: per-lecture YouTube playlists are public.
- Rust Book 3rd edition, Rust 1.98, edition 2024.
- ECE 1724 Fall 2026: public mp4 recordings, 12 lecture decks, public assignment pages.
- Missing Semester IAP 2026: 9 lectures and a YouTube playlist.
- MIT 6.102 sp26: readings 01-19 and PS0-PS4. Starter code is on github.mit.edu (login), so assignments are partial.
- Sipser's page says "2026 lectures will not be recorded", with 2020 videos linked.
- EECS 127 Sp26: lectures 1-28 and the playlist match the node's lecture ranges.
- MIT 6.046 Sp15: lectures 1-24 match the node's description (FPT is lecture 18).
- 6.006 Sp20: public, with Python problem sets.
- MIT 18.06 Sp25 (Nike Sun, notes on Canvas only), 18.335 Fall 2025 and 18.063 IAP 2026: all as described.
- CLRS 4e chapter numbers in algorithms and advanced-algorithms match my memory of the table of contents.
- Mitzenmacher-Upfal 2e chapter numbers match my memory.
- MIT 6.5220 Fall 2025 playlist exists, titled "MIT 6.5220 Randomized Algorithms Fall 2025".
- de Wolf arXiv v6 is dated 27 Aug 2026.
- Every CSES problem name I tested exists, about 45 of them.
- go.dev/dl shows go1.27.x.

## data-structures
- [should-fix] The Python-first learner is only handled by prose, with no resource entries. The note says "re-implement the 61B projects in Python with pytest" and "use Open Data Structures or Runestone pythonds3". Open Data Structures is not Python: it is Java, C++ and pseudocode. pythonds3 is only in `considered`, and I could not open it (403). Evidence: CS 61B Fa26 lectures 1-4, Lab 1-3 and HW2 are Java-syntax work; the node itself calls this a cost. Fix, keeping 61B as primary:
  1. Add a short bridge resource, such as "Java for Python Programmers" (Brad Miller, Runestone / DePaul PDF), plus 61B textbook ch. 1-2 and HW2, with an hours budget (about 10-15).
  2. Add a Python-native path as a named alternative route. Two candidates: (a) MIT 6.006 Sp20, whose problem sets are Python (OCW assignments page lists .py templates) and which has public videos on sequences, sets/hashing, heaps, AVL and graphs; (b) Goodrich, Tamassia, Goldwasser, *Data Structures and Algorithms in Python* (paid book). Because 6.006 is the algorithms primary and algorithms hard-depends on data-structures, the node must say which comes first.
  3. Promote pythonds3 from `considered` if the owner can open it.
  I judge 61B still the right primary for the learner who is happy to learn Java. It needs no Python data-structures course because its stated prerequisite is 61A-style Python, and the node says so.
- [should-fix] Cross-node duplication with `algorithms`.
  - Percolation appears three times: 61B Project 3, COS 226 Percolation, and Coursera Part I Percolation in algorithms.
  - Deque/RandomizedQueue and Kd-Trees appear in both COS 226 here and Coursera Part I there.
  - CSES problems repeat across the two nodes: Distinct Numbers, Apartments, Ferris Wheel, Traffic Lights, Counting Rooms, Message Route and Building Roads.
  - algs4 is a secondary in both. VisuAlgo is listed in both (`ds-visualizations` here, `visualgo` in algorithms).
  Fix: let data-structures own the structure-building tasks (61B projects, COS 226 queues and Percolation) and algorithms own CSES DP/graph problems and Coursera Kd-Trees and 8 Puzzle. Drop the duplicate CSES list from one node and keep one VisuAlgo entry.
- [should-fix] `ds-visualizations` bundles VisuAlgo and USF Galles under one URL (VisuAlgo). Give USF its own entry or drop it; the schema allows one URL per entry.
- [suggestion] `cos226-assignments` is Java, the same language as 61B. If the Python route above is adopted, note that Princeton COS 226 specs are language-neutral but grading is Java-only.
- split/prereq: agree with soft dev-environment (61B Lab 4 is git; Lab 1 and HW1 are setup).

## c-programming
- [should-fix] The primary-course is enrolled-only for video, which is the situation the owner asked about. The node says SEE "Programming Paradigms" is "a different course". It is not a different course: Stanford Engineering Everywhere lists it as "CS107 - Programming Paradigms" (Jerry Cain, 24 lectures, public). Its content is older (C and C++ memory, then Scheme, concurrency) and it assumes C++ background, so it is not a drop-in. Fix: correct that note, and add it as a `secondary` public-video companion for CS107 lectures on C memory, generics and void* (check lecture-to-topic mapping before listing the lectures). Alternatively list CS50x 2026 weeks 4-5 (memory) as the public-video teaser. I did not find a better public-video C course than CS107's materials. Keeping CS107 as primary is defensible because the slides, quizzes and assignment specs are public. The FAQ confirms lectures are recorded to Canvas for CGOE students.
- [should-fix] The primary-text choice is arguably wrong for a Python-first learner. Modern C is rigorous and C23-current, but it is a dense, standard-semantics text; the node already adds Beej and Dive into Systems ch. 1-2 as on-ramps. K. N. King (in `considered`, "could not open the author page") is the usual learner's text. Fix: either keep Modern C and mark the reading order explicitly (Dive into Systems 1-2, then Modern C levels 1-2), or record King as a co-primary alternative with a publisher link (informit.com is already used elsewhere in the node).
- [suggestion] The note says lectures "13-25". The Autumn 2026 site lists 24 lectures (no lecture 20). Say "13-24".
- [suggestion] `level: intermediate` for a first C course; the node's own hard prerequisite is Python only. Consider `intro`.
- split/prereq: agree with the split. computer-systems already treats CS107 as a no-public-video alternative, so the facts are consistent.

## cpp-programming
- [should-fix] Scope item "performance idioms" is not covered. The node defers it to G4/G9 (Algorithmica, Performance Ninja), but the skeleton scope for this node lists it. Fix: either amend the scope, or add one specific resource here, such as a named Algorithmica chapter or Performance Ninja lab. Concepts/ranges (C++20) and constexpr/C++23 library features are covered only through Tour 3e and the learncpp appendix. Name the Tour chapters that cover them.
- [should-fix] The primary-course has no confirmed public video of the current course (`videos: unknown`). I could not find any 2024-2026 CS106L recordings, and the course site loads its content by script. The only public playlist is Fall 2019 (title verified: "Stanford CS 106L Fall 2019 Lectures"), which predates C++20. The node handles this honestly with CppCon Back to Basics, but `use` for the course (Fall 2026 slides 1-16) cannot be followed along by video. Fix: keep CS106L as primary for slides and activities, and state in `why` that video is 2019 only. Consider a named Back to Basics talk list rather than "search the channel".
- [suggestion] `learncpp` ch. 18-19 are unfinished. I confirmed the home page lists chapter summaries for 1-17 and 20-27 only. The node already covers this with Tour 3e.
- [suggestion] `hackingcpp` and `cppstories` share one entry; `cppquiz` and `exercism-cpp` are both small-drill practice. Acceptable, but exercism-cpp is the weakest.
- split/prereq: agree with downgrading hard c-programming to soft. learncpp assumes no prior C, and the node's own note says so. Keep python-programming as the hard prerequisite.

## python-programming
- [should-fix] Practice is vague. `exercism-python` says "do the track concepts ... then a handful of Practice exercises". Name the concepts and cap the count. The 61A labs, homeworks and projects are the real practice and are public with local tests, which the node says; make that the first practice entry.
- [suggestion] Facts to refresh: Fa26 shows homeworks through HW 8 and labs through at least Lab 10, not "homeworks 1-7, labs 00-09". Also note that Fa26 homework includes Gleam/TypeScript alternates and that earlier terms are gone (cs61a.org/fa25, sp26 and sp25 return 404; inst.eecs.berkeley.edu is behind CalNet login). The open question about which term the per-lecture YouTube videos come from is still open.
- [suggestion] `considered` lists MIT 6.100L Fall 2022 as the fallback with public videos. Promote it to a one-line `secondary` ("if 61A is too fast") or leave it.

## python-in-depth
- [should-fix] No primary-course and no public video at all. Idiomatic-Python talks are a known gap-filler: Raymond Hettinger's PyCon talks ("Transforming Code into Beautiful, Idiomatic Python", "Super considered super!") and David Beazley's PyCon talks (live-coding generators, concurrency, GIL). Fix: add them as one `secondary` video-series entry. I did not open the YouTube pages, so mark `verified: false`.
- [suggestion] `exercism-python-deep` repeats the URL of `exercism-python` in python-programming (same job, different level). Name the concept exercises (decorators, generators, context managers, dataclasses) or drop it.
- [suggestion] Facts confirmed: Python 3.15.2 docs, fluentpython.com is the companion site for the 2nd edition, and the typing.python.org spec site is live.
- split/prereq: agree with soft dev-environment.

## rust-programming
- [suggestion] `rust-atomics-locks` is stated as "only as a pointer" and belongs to G4. Remove or mark it clearly as the G4 hand-off to avoid bloat.
- [suggestion] COMP6991 (UNSW) and CS 110L (Stanford) are the other public-video Rust courses; neither was verified. If either is reachable later it competes with ECE 1724, which I found solid (public mp4, 4 assignments, Rustrace editor required, sample midterms with answers).
- [suggestion] The ECE 1724 `use` mentions "lectures 1-7". The site lists 12 lecture decks across 11 sessions; say "decks 1-9" if the intent is ownership through lifetimes (deck 9 is Lifetimes).
- split/prereq: agree (no change).

## go-programming
- [suggestion] No primary-course is stated honestly. Fine.
- split/prereq: disagree with merging into G10. Keep as a standalone optional node. Agree with soft dev-environment.

## software-construction
- [should-fix] The primary-text and the primary-course are the same material. `mit-6102-readings`, `mit-6102` and `mit-6102-psets` all point at 6.102 sp26 and give the same psets as use. The practice entry repeats the course `use`. Fix: keep the readings as the text and the course for the schedule; make `mit-6102-psets` list only what is not in the course (the test-first routine and the TypeScript-to-Python retrofit already in `python-spec-practice`).
- [should-fix] Assignments are partial because starter code is on github.mit.edu, but a fully public package exists and is mentioned only in `considered`: OCW 6.005 Software Construction Spring 2016 (Java), with Problem Sets 0-4 whose pages offer starter zips (checked: ps1 page offers `ps1.zip`). Fix: add it as a `practice` fallback ("6.005 Sp16 ps0-ps4 with ps*.zip starters") and say it is the self-contained route.
- [suggestion] The scope says "6.1020-style"; the live site is 6.102 and the node says so. Fine.
- [suggestion] The Philosophy of Software Design page opens over http (200); set `verified: true`, or note the https failure.
- split/prereq: agree with soft dev-environment.

## dev-environment
- [should-fix] `wizard-zines` states "which are currently free was not checked" and is `mixed`. Resolve it or drop the entry; a hidden gem the owner cannot use for free is not a gap-filler.
- [suggestion] Verified: TLCL Seventh Internet Edition (596 pp) and Missing Semester IAP 2026 (9 lectures, playlist titled "Missing Semester IAP 2026").
- split/prereq: agree that dev-environment becomes a soft prerequisite of c-programming, data-structures and software-construction.

## discrete-math
- [should-fix] Practice is the weakest in the node. The only `practice` item is NNG4 (Lean on natural numbers), which touches induction only; it does not touch logic, counting, graph theory or number theory. Fix: add named problem sets. For example: MCS chapter problems for ch. 1-5, 9 and 15 (name the problem numbers or the 6.1200 problem sets by number), 6.1200 Spring 2024 warm-up problems and problem sets (OCW pages exist), and CS 70 homeworks and discussions with solutions. Project Euler is a free number-theory and counting drill; I have not opened it. Keep NNG4 as optional.
- [suggestion] The 6.1200 lecture gallery has 24 lectures (confirmed). The CS 70 page links lecture recordings to bCourses only; `videos: enrolled-only` is right.
- [suggestion] `levin-dmoi` and `concrete-math` are fine. Concrete Math is reference only and the page is the Knuth page.
- split/prereq: none.

## calculus
- [suggestion] The one-primary-course rule leaves multivariable (half the scope: partial derivatives, gradients, multiple integrals) in a secondary. That is acceptable. If the owner splits the node as proposed, 18.02SC becomes the primary of the multivariable node.
- [suggestion] Minor: 18.01SC lists Fall 2010 as the public video term. The lecture videos are Jerison's Fall 2006 recordings (the Fall 2006 playlist title is verified). State Fall 2006 lectures.
- [suggestion] `strang-calculus` and `3b1b-calculus` fill nearly the same intuition gap. Keep 3b1b, trim Strang to a reference.
- split/prereq: agree with the single-variable/multivariable split. It matches how matrix-calculus, optimization and probability use it. Also agree with making calculus a soft prerequisite of matrix-calculus via the multivariable half only.

## linear-algebra
- [should-fix] There is no `practice` item. The node has 7 resources and none is practice. Fix: add the 18.06 problem sets and exams with solutions (the OCW assignments page is already in the course block) as an explicit practice entry, plus VMLS exercises, or the Interactive Linear Algebra checkpoints. Name which problem sets pair with lectures 1-11, 14-17, 21-25 and 29-31.
- [suggestion] `vmls` is `verified: false` (web.stanford.edu unreachable from here too). Keep the flag.
- [suggestion] 18.06 Spring 2025 (Nike Sun) is confirmed on the mitmath/1806 README: notes Canvas-only. Public videos are Strang Spring 2010 (title verified). That is the right call.
- split/prereq: agree with dropping soft calculus. Strang's 18.06 needs none.

## probability
- [should-fix] The primary-course facts are unverified. `stat110` is `verified: false`, `latest_term: Fall 2025` came from a search snippet, and the video term is "not stated". The YouTube playlist is live (title "Statistics 110: Probability"). I could not open hsites.harvard.edu (403) either. Fix: a human should open the course site once to confirm the term and the Strategic Practice URL. Until then label `videos: public` as "2011-era recordings (term unconfirmed)".
- [suggestion] Practice is strong. Stat 110 Strategic Practice plus homework is the right drill.
- [suggestion] The `stat110-practice` URL and the course URL are the same site; fine.
- split/prereq: agree.

## statistics
- [suggestion] The `why` for 18.650 says it "follows the same chapters as All of Statistics". I did not find a reading map from 18.650 to AoS; the course uses its own lecture notes. Soften to "similar topic order" or cite a syllabus mapping.
- [suggestion] AoS is terse for a first pass. ISLP (free, Python labs) is named only in `open_questions`. Add it to `considered` with a one-line reason.
- [suggestion] Statistical Rethinking lists the 2023 playlist while saying 2024 is the newest. The xcelab page confirms "Most recent lectures: Rethinking2024". Add the 2024 playlist URL.
- split/prereq: agree with soft linear-algebra. Agree with a separate causal/experimentation node (G5 causal-inference already exists).

## matrix-calculus
- [suggestion] Facts confirmed: arXiv 2501.14787 (7 Jan 2025, Bright, Edelman, Johnson); 18.063 is January 2026 (Edelman, Johnson, two psets via Canvas); public videos are IAP 2023.
- [suggestion] `mml-ch5` and `parr-howard` are redundant, both being a gentler notation on-ramp. Keep one.
- split/prereq: agree with soft matrix-calculus for optimization.

## optimization
- [suggestion] Text and course mismatch. The primary-text is Boyd-Vandenberghe (ch. 2-5, 9-11), while the primary-course is EE127, which uses CEG plus BV and has its own sequence (5 lectures of linear algebra review, SGD, Fenchel). That is the right pick for the ML-flavoured scope: EE127 Spring 2026 is the newest fully public run (confirmed), and EE364a's newest public videos are 2023 (title verified). I agree with EE127 as primary and EE364a as secondary; say in `why` that the pairing is by topic, not by chapter.
- [suggestion] EE364a Winter 2025-26 status and the BV page are unreachable from here; keep the `verified: false`.
- [suggestion] EE127 lectures 26-27 (L1/Lasso, Newton's method, SVM) are not in `use`; add them since Newton's method belongs in the scope.
- split/prereq: agree with the split into convex-optimization and optimization-for-ml. Agree with the soft prerequisites on matrix-calculus and probability.

## numerical-methods
- [should-fix] The primary-course has no public lecture video, and the course content does not cover ODE solvers. 18.335 on OCW (Spring 2019) has notes and psets only; Fall 2025 recordings are MIT-only. The scope includes "ODE solvers basics", which only the text (FNC ch. 6) covers. fast.ai's 2017 videos fill the video gap but are dated. Fix: say in `why` that the course does not cover ODEs and name the FNC chapter. Evaluate UT Austin ALAFF (integrated text, videos and programming activities; the site loads, but I could not read the video details, so treat the video claim as unverified) as a video-bearing alternative primary-course.
- [should-fix] `fnc-practice` repeats the primary-text URL and role (FNC exercises). Fix: keep the from-scratch implementation list (LU with pivoting, Householder QR, power/inverse iteration, CG), which is good, and drop the "FNC exercises" duplication or move the 18.335 problem sets into the course entry.
- [suggestion] `floating-point-gui` and `goldberg-fp` do the same job; one is enough.
- split/prereq: agree with splitting out floating point and mixed precision (the mlsys path needs it more). Agree with soft calculus.

## information-theory
- [suggestion] The MacKay `use` lists "8-10 ... 9-11" with overlapping ranges. MacKay ch. 8 is dependent random variables, 9 is communication over a noisy channel, 10 is the noisy-channel coding theorem, 11 is error-correcting codes. Rewrite as "8-11".
- [suggestion] MacKay's lecture series is 2012 (title verified); no newer public full course was found. EE276 and 6.7480 are enrolled-only or MIT-only; the node says so. Fine.
- split/prereq: agree with soft discrete-math and soft calculus.

## algorithms
- [should-fix] The Coursera Part I practice entry is Java-only and the access terms are unconfirmed. For a Python-first learner this is the weakest practice item, and it overlaps with the data-structures node (see that node). Fix: say it is Java, mark access `account-required` with the note that audit rights were not checked, and prefer CSES, USACO Guide and AtCoder DP (all verified live) as the main practice.
- [suggestion] Facts confirmed: 6.006 Sp20 playlist title, OCW psets in Python, Spring 2026 term (toc.csail.mit.edu: 6.1210, Chapman/Kalai/Leiserson). The Spring 2020 videos are still the best public run. CLRS chapter numbers are correct.
- [suggestion] AtCoder A-N omits L (Deque) from the listed names; add it or say "A-N".
- [suggestion] Algorithms Illuminated is listed in `considered` as the gentler on-ramp. For a learner who finds CLRS too dense it is a better named fallback than anything in `secondary`; consider promoting it.
- split/prereq: no change.

## algorithm-design
- [should-fix] `demaine-hardness` has a vague `use`: "check the OCW lecture list for the reduction-from-SAT/3-Partition/Hamiltonicity lectures". Name them. The OCW lecture notes list SAT (L4), SAT Reductions (L5), Circuit SAT (L6) and Planar SAT (L7). Fix: "lectures 4-7, then the 3-Partition lecture" (check the video gallery numbering).
- [suggestion] 6.046 Sp15 is the newest public video run (24 lectures, 11 recitations, confirmed) but gives one lecture to NP and one to greedy (L12 is MST). The node says this and adds Erickson, Demaine and CS 170. Fine.
- [suggestion] CS 170 Fall 2026 lecture notes are public PDFs but no recordings; the node's `unknown` should read `enrolled-only` or `none` if no recording link exists (none found on the page).
- split/prereq: agree with explicit soft discrete-math.

## theory-of-computation
- split/prereq: agree with soft algorithms; NP-completeness proofs use algorithmic reductions. No other findings. The primary-course is correctly described: 18.404 Fall 2026 is not recorded, 2020 videos are public, psets are posted.

## advanced-algorithms
- [should-fix] Choice of primary-course. Karger 6.854 has recordings from 2013, 2020 and 2021 (Fall 2021 confirmed on the materials page), and the problem sets are on NB. Cornell CS 5820/6820 Fall 2025 is newer and has per-lecture recordings (Zoom links on the lecture page) with matchings, flows, LP duality, approximation, spectral methods and Markov chains. I could not tell whether those Zoom recordings play without a Cornell login. Fix: someone should test one link. If it plays, Cornell is the better primary for "newest public run"; if not, keep Karger and say so.
- [should-fix] The Roughgarden CS261 `use` says "YouTube playlist: 'A Second Course in Algorithms'" with no URL. The playlist `PLEGCF-WLh2RJh2yDxlJJjnKswWdoO8gAc` is already used in approximation-algorithms; put the URL in the course block here.
- [suggestion] The primary-text, Gupta's notes, covers gradient and mirror descent (ch. 13-17), which are not in the scope. Mark those chapters optional.
- [suggestion] `foundations-of-data-science` has the same URL and role as in randomized-algorithms; fine, but cross-reference.
- split/prereq: agree with splitting out advanced data structures and streaming/sketching (four areas in one node). Agree with soft probability and soft linear-algebra.

## randomized-algorithms
- [should-fix] The primary-course has no `public_videos_url` although the playlist exists: `PL278F9gM5aZb8HXAh2yT3QmwyYQZrQUNH` (title "MIT 6.5220 Randomized Algorithms Fall 2025"). The course page lists it as the current-term YouTube link and also lists a Spring 2021 playlist (`PL278F9gM5aZZq8bBde-IU5W6bh4LOr-Xh`, 33 videos). Add both.
- [should-fix] `mu-exercises` duplicates the primary-text URL and role (the validator already warns). The exercises have no public solutions. Fix: merge it into the primary-text `use`, and keep only Quanrud's homework (public) as practice.
- [suggestion] The M&U 2e chapter numbers in `use` match my memory of the table of contents, but the node says they are unchecked; I could not open Cambridge either.
- split/prereq: agree with soft linear-algebra.

## approximation-algorithms
- [suggestion] The primary-course (Chekuri CS 583 Sp26) has no current recordings; Fall 2021 is behind a 403 I also hit. The node is honest about this. A fix would only come from evaluating the NYU course (Gupta, 403) or Copenhagen (Pagh, 2021, unopened).
- [suggestion] Two items in `secondary` are the same job as `roughgarden-cs261-approx` (an on-ramp) and `vazirani-approx` (second text).
- split/prereq: agree with soft computational-complexity (for the hardness unit) and soft linear-algebra and optimization.

## computational-complexity
- [suggestion] O'Donnell Fall 2017 (title "Graduate Complexity Theory at CMU" in the node; the 15-455 playlist title is verified) is the right primary. Cornell CS 6810 Spring 2026 is correctly secondary (notes only). The UCSC CSE 204 playlist (2022) is a fair fresher video alternative and sits in `considered`.
- split/prereq: agree with the split into Complexity I and II; the scope is two courses. Agree with soft probability and linear-algebra.

## learning-theory
- [suggestion] The EE531 playlist the node calls "very recent" has 17 videos in total, so it is not a candidate for primary-course. Say so.
- [suggestion] The primary-text URL points to Cambridge; the free author PDF (huji.ac.il) was blocked. Put the PDF URL in `use` or `notes`, marked unverified.
- split/prereq: agree with the split into statistical learning theory and deep-learning theory. Agree with soft algorithm-design and linear-algebra.

## quantum-computing
- [suggestion] Facts confirmed: de Wolf v6 revised 27 Aug 2026; Watrous playlist title is "Understanding Quantum Information & Computation With John Watrous". IBM `assignments: partial` is fair.
- [suggestion] Mermin (named by O'Donnell as his favourite) and Waterloo QIC 710 are in `considered`. For a CS-first learner Mermin is a plausible alternative primary-text, but I could not open its page. No change.
- split/prereq: agree with soft theory-of-computation and soft algorithm-design.

## Overall
- Strongest areas:
  - Algorithms and theory: the primary-course picks (6.006 Sp20, 6.046 Sp15, 18.404 F20, O'Donnell 2017) are the best public-video runs I could find, and the node text states when the newest run is enrolled-only.
  - Optimization, matrix calculus and rust-programming are well-chosen and accurate.
  - Primary-course claims were accurate on every page I opened.
- Weakest areas:
  - C: the primary-course videos are enrolled-only, with no public-video substitute.
  - Numerical methods: the primary-course has no public videos and does not cover the ODE part of the scope.
  - Software construction: the primary-course has no videos, and the public starter code the owner could use sits in `considered`.
  - The data-structures node treats the Python-first learner in prose only.
- Systemic issues:
  1. Practice duplication. Several practice items reuse the primary resource's URL (`mu-exercises`, `fnc-practice`, `mit-6102-psets`, `sipser-problem-sets`, `ssbd-exercises`). Practice should name something the primary entry does not already assign. Some, such as `sipser-problem-sets`, are fine as named problem sets.
  2. Cross-node overlap between data-structures and algorithms (Percolation, queues, CSES lists, algs4, VisuAlgo).
  3. Missing playlist URLs in course blocks when the playlist exists (randomized-algorithms, advanced-algorithms).
  4. Unverified Stanford and Harvard hosts: web.stanford.edu is unreachable and hsites.harvard.edu returns 403. Items depending on them (Stat 110 term, EE364a Winter 2025-26, cvxbook, VMLS) should be confirmed by hand.
  5. The practice role is missing in linear-algebra and weak in discrete-math.
- Network limits for this review: YouTube playlist pages gave titles and counts only, not per-lecture playback. Cornell Zoom recordings, UT ALAFF video details, Runestone and Project Euler were not opened.
