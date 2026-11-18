# Review R2: G4 (Machine & OS), G11 (Hardware & compilers), G12 (Security & cryptography)

35 nodes reviewed (13 + 14 + 8). Date of review 2026-11-18.

Scratch copies of the pages I opened are in `/tmp/claude-0/-home-user-cs-roadmap/36c7e6f8-5da9-5f83-ba80-b2193901c20d/scratchpad/R2/`.
Things I could not check: YouTube playback (rate limits), O'Reilly/Packt/Springer/Elsevier pages (bot walls), `github.com` pages,
`csapp.cs.cmu.edu` (timeout), MIT Panopto folders (login). Where I say "verified", I read the page text myself.

## Adjudications (questions asked by the coordinator)

1. **operating-systems: is Berkeley CS 162 the best primary course given the owner's preference for public lecture videos?
   No.** The CS 162 Fall 2026 home page links every lecture to bCourses (no YouTube, no public playlist); the only public
   recordings are third-party Bilibili mirrors of Fall 2020 to Spring 2022 (the node says this itself). Pintos grading needs the
   course autograder. The node's own secondary, **Toronto ECE344 Fall 2024 (Eyolfson)**, fits the owner's rule better: I opened the
   page and all 35 lectures have YouTube links (kernels, process creation, scheduling, VM and page tables, threads, locks,
   semaphores, disks, filesystems and inodes, page replacement, allocators, virtual machines), and the six lab specs (process
   viewer, process manager, VM, user threads, synchronization, filesystems) are public at compeng-gg.github.io/2024-fall-ece344-docs/.
   Recommendation: promote ECE344 to `primary-course`, demote CS 162 to secondary "for the Pintos projects and the current
   syllabus". I did not find a better course with official public recordings plus autograded labs for the conceptual (non-kernel)
   OS scope; MIT 6.1810 (public Fall 2020 videos, `make grade` labs) is better but is already the primary of
   os-kernel-implementation.
2. **processor-design: does a course whose lab ISA is MIPS fit a node scoped to RISC-V? No.** I downloaded the ETH DDCA Spring 2026
   lab manuals: Lab 7 ("In the remaining last three labs, we will build a MIPS processor ... program the processor using MIPS
   assembly"), Lab 8.1 and Lab 9 ("The Performance of MIPS") never mention RISC-V (MIPS appears 16/21/17 times, RISC-V 0 times).
   The Harris text the node pairs it with is the RISC-V edition, so the text and the course use different ISAs. See the node entry.
3. **The five nodes with no primary course.**
   - high-performance-python: agree, no suitable course with public material that I could find. I could not find a counter-example either.
   - virtualization-and-containers: agree for a full course. Best partials: the UNSW COMP9242 2026/T3 Virtual Machines lecture
     (the page has public echo360 `.../public` links; already in the node) and the UPB linux-kernel-labs virtualization lecture (slides).
   - **storage-and-file-systems: disagree.** ETH "Understanding and Designing Modern Storage Systems" (227-0085-44L) has public YouTube
     lecture playlists (Spring 2024 and Spring 2026 livestream) and an MQSim project. The node dismissed it with a URL that does not exist.
     It covers SSD/flash/FTL only, not file-system design, so it is a partial primary at best (see node entry).
   - interpreters: agree. Crafting Interpreters is itself a complete course; I know of no public course covering tree-walk plus bytecode better.
     (Berkeley CS 61A no longer has a Scheme-interpreter project; its current projects are Hog, Cats, Ants, Animator.)
   - fuzzing-and-vuln-discovery: agree. I found no fuzzing course with public recordings (CISPA WS25/26 is account-gated; UCR CS 250,
     Purdue, Waterloo pages show syllabi/slides at best).

## computer-systems
- [suggestion] `csapp-labs` is `verified: false` and I also could not open csapp.cs.cmu.edu (timeout). The fallback in the node
  (Fall 2015 Panopto, linked from the official 2015 schedule) is real: I confirmed the Panopto folder link and "Videotaped lectures
  and recitations" on `https://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html`. Verified: 15-213 Fall 2026 page,
  Gibbons/Goldstein, labs via Autolab, Dive into Systems v1.2. No change needed beyond a note that 2015 uses the same 3e textbook.
- Primary text and primary course are correct picks. Coverage is complete for the scope.
- split/prereq: n/a (none proposed).

## computer-architecture
- [should-fix] `eth-ddca` (secondary) says "Verilog labs are good" but never says that the ETH labs and lectures on ISA/assembly are
  MIPS-based (Labs 7-9 verified as MIPS). The node scope is RISC-V. Fix: add "MIPS ISA in labs; use for microarchitecture concepts, not for ISA practice".
- [should-fix] Cross-node inconsistency for the same course: this node writes `227-0003-10V` and `latest_url .../ddca/spring2026/doku.php?id=start`;
  digital-logic, hdl-and-fpga, processor-design and advanced-microarchitecture write `227-0003-10L` and `.../digitaltechnik/spring2026/...`.
  The course page itself says `227-0003-10V`. Fix: use 10V and one canonical URL in all five nodes.
- [suggestion] Primary pair (P&H RISC-V 2nd ed. + CS 61C) is right. Verified on cs61c.org: Fall 2026, "Recordings will be published to
  bCourses", Labs 0-7 as listed, Project 2 CS61Classify, Project 3 CS61CPU; the optional Lab 8/Project 4 (61kaChow, SIMD/threads) is
  not mentioned in the node and fits "SIMD and multicore basics". Public videos remain Summer 2020 (not re-verified, YouTube blocked).
- [suggestion] Resource id `ripes-venus` names Ripes but the resource is Venus; rename id to `venus`.
- split/prereq: disagree (moot). The skeleton already has digital-logic as a *soft* prereq, so "make it soft only for the ETH route" changes nothing.

## operating-systems
- [should-fix] Primary course choice: see Adjudication 1. Fix: promote `ece344` (Fall 2024, public videos, public labs) to primary-course;
  keep `cs162` as secondary; state in `course.videos` for CS 162 that Fall 2026 is bCourses-only.
- [suggestion] `cs162` `use` lists Homeworks 0-3 and Projects 1-3 in the order "User Programs, Threads, File Systems". The Fall 2026 page lists
  Homework 0-4 (Introduction, List, Shell, HTTP, **Memory**) and Projects 0 Pregame, 1 User Programs, 2 Threads, 3 File Systems. Add HW4 (Memory) and Project 0.
- [suggestion] ECE344 labs are public but I did not see an autograder; set `assignments: public`, which the node did.
- split/prereq: disagree. Adding concurrent-programming as a soft prereq of OS is backwards: the skeleton has operating-systems as soft prereq of
  concurrent-programming and OSTEP ch. 26-34 already teach threads/locks here.

## os-kernel-implementation
- Primary pick (xv6 book + MIT 6.1810) is the best choice. Verified: Fall 2026 page, schedule "under construction", lab menu util, syscall,
  pgtbl (page tables), traps, cow, lock, net, fs, mmap matches the node. 2020 YouTube videos from the official 2020 schedule are the newest public run.
- [suggestion] This node and storage-and-file-systems both assign the 6.1810 fs lab, and the OS/storage/kernel nodes all assign the OSTEP
  `filesystems-checker` project; see storage entry for the dedup.
- split/prereq: agree. Add computer-architecture (soft); xv6 is RISC-V and 61C covers what is needed.

## concurrent-programming
- [should-fix] Same resource, same job in two nodes: McKenney's perfbook memory-ordering chapters and appendix are `reference` here and
  `secondary` in memory-systems; herd7/litmus material in memory-systems overlaps Preshing + Rust Atomics ch. 3/7 here. Also `ostep-threads-hw`
  (threads-intro/api/locks) repeats the OSTEP homework list in operating-systems. Fix: keep each in one node and cross-reference.
- [suggestion] Primary text (AMP 2e, Java-based) and course (KAIST CS431, Rust-based) differ in language; the node acknowledges the Rust
  requirement. Verified from the repo README: Spring 2024, English-subtitled YouTube playlist, Rust homework templates. Later terms unverified, as the node says.
- [suggestion] No resource for testing concurrent code (Rust `loom`, ThreadSanitizer, Jepsen-style model checking). Add one tool.
- split/prereq: agree. Soft prereq on rust-programming (a node exists in G1).

## parallel-programming
- [should-fix] Consider making CMU 15-418/618 the primary course. Verified Fall 2026 page: 41 YouTube links on the current schedule (videos for
  most lectures, including interconnects, snooping and directory coherence), Assignments 1 Exploring parallel computing, **2 GPU/CUDA, 3 OpenMP, 4 MPI**
  (Autolab). The scope names OpenMP and MPI, which are 15-418 assignments but not CS149 assignments (CS149 uses threads, ISPC, CUDA). CS149 Fall 2025 states
  it did not publish videos that year (page: "videos from a prior version of the course (2023)"). Using the newest run with public videos is the
  owner's rule. Fix: primary = 15-418 Fall 2026; CS149 (2023 playlist + public GitHub assignments) as secondary.
- [should-fix] Wrong lecture pointer: notes say "pull lectures 5 and 8 of 6.172" for work/span. OCW list: L5 is "C to Assembly"; work/span is L7 "Races and
  Parallelism" and L8 "Analysis of Multithreaded Algorithms".
- [should-fix] 15-418 entry misdescribes assignments: "A1, A3 OpenMP, plus later MPI/CUDA-style". Fix: A1 exploring parallel computing, A2 CUDA, A3 OpenMP, A4 MPI.
- [should-fix] `aalto-ppc` (use: ch. 1-3 plus lectures) overlaps performance-engineering's `aalto-ppc-ch2`: same chapter, same job. Keep in one node.
- split/prereq: agree on adding a soft edge to performance-engineering for work/span, but better to cover work/span directly with 6.172 L7-L8.

## performance-engineering
- Primary text (Algorithmica) and course (6.172 OCW Fall 2018) are right. Verified OCW: 23 lectures, videos public, assignments/projects public.
  The node's "watch lectures 1-17" skips L18-L23 (DSLs/autotuning, Leiserchess, TSP tuning, graph optimization, dynamic languages); fine as a choice but say so.
- [should-fix] `aalto-ppc-ch2` and `drepper-memory` duplicate resources used in parallel-programming and computer-architecture/memory-systems (Drepper is in three nodes with
  three different section lists). Fix: assign each a single home.
- [suggestion] `agner-fog` is `verified: true` here but `verified: false` for the same site in advanced-microarchitecture; make consistent.
- [suggestion] Lemire's blog is in `considered`; it is the standard source for SIMD/bit-hack idioms and counts as a hidden gem. Promote to reference.
- split/prereq: split disagree (one node with an optional branch is fine); prereq agree (soft computer-architecture).

## performance-analysis
- [should-fix] The primary-course (Bootlin Linux debugging/profiling/tracing) does not match the scope: it is a 3-day paid embedded-Linux training whose free slides cover gdb,
  strace, valgrind, perf, ftrace, eBPF tools, kernel debugging; labs target STM32MP1/BeaglePlay boards; no USE method, no disk/network analysis methodology.
  Verified on bootlin.com/training/debugging/ (public sessions Nov-Dec 2026 and Jan 2027, 699-799 EUR; materials free). The node's own notes call it a weak fit. Fix: demote to
  `secondary` ("tool tour: perf, ftrace, eBPF slides") and leave primary-course empty; no better course with public videos was found.
- [suggestion] Methodology complement worth adding: Raj Jain's CSE 567M "Computer Systems Analysis" (WUSTL; slides plus audio/video lecture list on classes.engineering.wustl.edu/~jain/);
  it teaches measurement, experiment design and queueing rather than tooling. I could not confirm video hosting or currency (2008-2017 offerings).
- [suggestion] Practice is strong (bpftrace and BCC tutorials, FlameGraph, perf). Good.
- split/prereq: agree on a soft prereq for command-line tools; the right target is the existing `dev-environment` node.

## high-performance-python
- Agree with the primary text. I confirmed High Performance Python 3rd ed. exists (O'Reilly, April 2025, ISBN 9781098165963, Gorelick and Ozsvald) even though the O'Reilly page is bot-blocked.
- [suggestion] `verified: false` can stay; the `use` text lists chapter topics "not checked against the 3e TOC". They match the 3e structure I know (profiling, lists/tuples, dicts/sets, iterators,
  vector/matrix, compiling to C, async, multiprocessing, clusters, less RAM) but unconfirmed.
- [suggestion] No-course conclusion accepted (Adjudication 3). A conference tutorial by the authors (PyData/EuroPython) would be the closest video, but I could not verify one.
- split/prereq: disagree on adding parallel-programming as a soft prereq for a single multiprocessing chapter; the book and stdlib docs suffice. Agree on an optional rust-programming link for PyO3.

## linux-kernel-internals
- [should-fix] Bloat/overlap: `kernel-process` (HOWTO, submitting patches, KernelNewbies tutorial) and `lfd103` (LF "Beginner's Guide to Linux Kernel Development", also "development process, tools, first patch") do the same
  job in the same modality. Keep LFD103 or the docs, not both.
- [suggestion] Primary text is a compromise (LKP 2e, Packt Feb 2024, 6.1 LTS, unverified in the node: Packt is Cloudflare-blocked). UPB labs are 5.10-based with no videos; the node says to
  check that they build on 6.x. Both caveats are honest; no better single text exists.
- split/prereq: split agree (core vs device drivers); prereq agree.

## virtualization-and-containers
- Agree no primary course (Adjudication 3). Verified the UNSW COMP9242 2026/T3 page: Virtual Machines lecture in week 4 with papers Barham 2003 and Waldspurger 2002, public echo360 links.
- [suggestion] `jos-vm` is a SIGCSE-style paper about a lab built on JOS; I see no evidence the lab itself is public. Mark as design reference only, or drop.
- [suggestion] Add UPB linux-kernel-labs virtualization lecture (Xen and KVM overview slides) as a free secondary.
- split/prereq: split agree (hypervisors vs containers); prereq none.

## storage-and-file-systems
- [must-fix] The conclusion "no primary course" rests on a wrong fact. `considered` lists ETH `.../projects_and_seminars/spring2026/doku.php?id=modern_storage_systems`; that page reads "This topic does not exist
  yet" (the link checker marked it OK because DokuWiki answers 200). The real page is `.../spring2026/doku.php?id=modern_ssds`: "Understanding and Designing Modern Storage Systems: 227-0085-44L", weekly lectures
  (NAND flash, SSD organization, FTL, MQSim, processing in flash), YouTube "Lecture Playlist from Spring 2024" and "Livestream Lecture Playlist Spring 2026". Fix: use it as the SSD/flash secondary-course
  (or primary-course for that half), fix the URL, set videos public, assignments partial (MQSim project). Prereq noted on the page: DDCA plus C/C++.
- [should-fix] Same primary text as operating-systems: both use OSTEP persistence (ch. 36-45) and the same file-* simulators. Fix: let operating-systems stop at ch. 36-39 + crash consistency, and give this node the
  advanced material as the text. A distinct candidate is the file-system chapters of McKusick et al., *The Design and Implementation of the FreeBSD Operating System* (FFS, ZFS), or Pate's *UNIX Filesystems*
  (I did not open these; propose as candidates to verify).
- [should-fix] Cross-node duplicates: `mit-fs-lectures-lab` (6.1810 fs lab) and `ostep-fs-checker` are also assigned in os-kernel-implementation. Keep one home each.
- [suggestion] CoW file systems and ZFS have only docs (the node says so); add the Btrfs paper (Rodeh) as a reference.
- split/prereq: prereq disagree on soft concurrent-programming (journaling does not need it); agree on a databases cross-link.

## advanced-operating-systems
- Primary text (CMU 15-712 reading list, last updated 2026-10-27 per node) and course (UNSW COMP9242 2026/T3) are sound. Verified COMP9242: 2026/T3, lecture table with microkernels/seL4, execution models, hardware
  considerations, Unix/Linux internals, multicore/memory ordering, VMs, performance analysis; echo360 public links; "Project Spec (TBD)" so assignments `partial` is right.
- [suggestion] `cs262a` (videos unknown, topic split "not checked") adds little; either describe it or drop it. `sigops-hof` is a good checklist.
- split/prereq: agree on soft [concurrent-programming, linux-kernel-internals].

## digital-logic
- [should-fix] Bloat: NandGame, Nand2Tetris Part I and Ben Eater's 8-bit computer are three "build the machine from gates" resources in the same modality, plus HDLBits and Digital. Keep two (e.g. Nand2Tetris
  projects 1-3 and HDLBits), put the rest in `considered`.
- [suggestion] Nand2Tetris `videos: unknown`: the Part I lectures are watchable on the course site/Coursera; resolve and record.
- Primary pair (Harris RISC-V ed. ch. 1-3, 5 + ETH DDCA L1-L6) matches the scope; ETH L1-L6 are ISA-independent so the MIPS issue does not apply here. Verified Spring 2026 schedule: L1 transistors/gates, L2-L3 combinational, L4a FSM, L4b labs/FPGAs, L5 HDL, L6 timing and verification.
- split/prereq: prereq agree (computer-systems soft is fine but not needed).

## hdl-and-fpga
- Primary text (ZipCPU tutorial) and course (EECS 151/251A Fall 2026) are reasonable. No fact errors found; EECS 151 videos enrolled-only is consistent with processor-design. Note the ZipCPU tutorial is Verilog, the node scope says SystemVerilog; EECS 151 labs supply SV.
- [suggestion] The ETH course appears as primary in digital-logic, processor-design and advanced-microarchitecture and secondary here and in computer-architecture. That is five nodes citing one course with different lecture ranges; fine if the final graph treats it as one course with slices.
- split/prereq: none.

## processor-design
- [must-fix] Primary-course does not fit the RISC-V scope: the ETH DDCA labs that build the processor (Labs 7, 8.1/8.2, 9) are MIPS (verified from the Spring 2026 manuals; the node's open question inferred it from a lab title). The node scope says "Single-cycle
  and pipelined RISC-V cores"; the primary text (Harris RISC-V ed. ch. 6-7) is RISC-V. Fix: make **Berkeley EECS 151 FPGA final project (pipelined RV32I in SystemVerilog, public docs, Fall 2026)** the build route and primary-course, with
  ETH L9-L13 listed as ISA-agnostic concept videos with an explicit "labs are MIPS" caveat. EECS 151 videos are enrolled-only, so state that.
- [suggestion] Add Linux Foundation LFD111x "Building a RISC-V CPU Core" (Steve Hoover, free to audit on edX, browser-based Makerchip, TL-Verilog; I confirmed it exists and is free to audit, I did not review content depth such as hazards/branch prediction).
  It is the only RISC-V core-building course with public video that I found.
- [suggestion] `ece4750` (Cornell tinyRV1, handouts only, no video) and `cs61c-proj3` (Logisim) are fine as secondary; `learn-fpga` is also in hdl-and-fpga (different part).
- split/prereq: agree: keep computer-architecture hard but say this node is HDL implementation.

## advanced-microarchitecture
- [should-fix] Bloat: four lecture/handout courses for OoO (ETH DDCA, Berkeley CS 152, Cornell ECE 4750 T06-T10, CMU 18-447 Spring 2015) plus Shen-Lipasti. Keep ETH (public video) and either CS 152 labs/BOOM or Cornell problems; archive the rest.
- [suggestion] Facts verified: ETH DDCA Spring 2026 L14 OoO, L15a dataflow/superscalar, L15b and L17 branch prediction, L16a-b OoO/load-store, L18a VLIW, L18b systolic, L19 SIMD. CAQA 7th ed. exists (Elsevier lists Dec 2, 2025; retailers Oct-Nov 2025). I could not check
  CAQA 7e chapter numbering against its table of contents; the node's "Ch. 3" mapping is from the 6th ed. structure. Note `agner-fog` is `verified: false` here but true in performance-engineering.
- split/prereq: none.

## memory-systems
- [should-fix] The primary course points to ETH Computer Architecture **Fall 2026** (`latest_url`), but the `use` text and lecture numbers are for **Fall 2025**. Verified: Fall 2026 (schedule through L18, last edited 2026-11-17) has no multiprocessors, memory-ordering or cache-coherence
  lectures (L13 interconnects, L14 NoC, L15 bottleneck acceleration, L16 simulation, L17 prefetching, L18 virtual memory), while Fall 2025 has L20b-L21c (multiprocessors, ordering, coherence) and L22-L24. A reader following the latest URL gets a different syllabus.
  Fix: point `latest_url` at the term whose lecture list matches the `use` text, or write both term lists.
- [should-fix] Scope coverage: "coherence protocols, memory consistency models" are thin in the primary course (about three lectures in 2025) and rely on CAQA ch. 5 and the Primer. Add a note, or add Berkeley CS 152 / MIT 6.5900 coherence-consistency lectures (already in `considered`) as secondary.
- [suggestion] `perfbook-memory-ordering` duplicates concurrent-programming's perfbook entry (see there).
- split/prereq: agree on a soft concurrent-programming prereq.

## hardware-accelerators
- [should-fix] Primary course MIT 6.5930 Spring 2026 has no public lecture videos (node says so) and partial assignments; the owner prefers public videos. A public video source exists and is missing: the MIT tutorial page `https://eyeriss.mit.edu/tutorial.html` lists the NeurIPS 2019 tutorial
  video "Efficient Processing of Deep Neural Network: from Algorithms to Hardware Architectures" and MLSys 2020 "How to Evaluate DNN Accelerators", with slide decks (ISCA 2019, 11 parts). I did not play the videos (URLs not exposed in the scraped text). Fix: add as secondary video track for Sze ch. 3-9.
- [suggestion] Cornell ECE 5545 videos remain Spring 2022 only (page says "Schedule (Under Construction)"); correct as stated.
- split/prereq: none.

## programming-language-concepts
- [should-fix] Text/course language mismatch: primary text PLAI uses Racket; primary course Grossman Parts A-C start with SML, then Racket, then Ruby. The node tells the reader to choose one; make that concrete (e.g. Part B only with PLAI, or Part A with CS 3110's OCaml book).
- [should-fix] Bloat: eight resources. `uw-cse341-fa26` (enrolled-only, partial) duplicates Grossman; `brown-1730` is also enrolled-only and PLAI-based; `beautiful-racket` is tangential. Keep Grossman, PLAI, SMoL Tutor, SICP/CS 3110 as options; move the rest to `considered`.
- [suggestion] Coursera video access is `unknown`; resolve before keeping Grossman as primary.
- split/prereq: prereq agree (soft discrete-math).

## interpreters
- [should-fix] Same resource, same job as programming-language-concepts: `plai-interp` repeats PLAI's evaluation/desugaring/laziness chapters assigned there. Keep in one node (programming-language-concepts); here keep only the cross-reference.
- [suggestion] Many parallel resources for "write a small interpreter" (lsbasi, interpreter-book/compiler-book in Go, mal, CodeCrafters). Keep Crafting Interpreters, mal and one of lsbasi/Ball.
- [suggestion] 50 h for all 30 chapters of Crafting Interpreters (jlox and clox with GC) looks low; common reports are 60-80 h. State the range.
- Agree no primary course (Adjudication 3).
- split/prereq: split agree as optional (tree-walk vs bytecode VM); make c-programming hard only for Part III, as the node proposes.

## compiler-construction
- [should-fix] `stanford-cs143` `public_videos_url` is an archive.org mirror of an academictorrents dump. Replace with the official Stanford Online/Lagunita listing or say "no official public video". Verified (over http): CS 143 page lists Final 2026, Midterm 2026, PA1-PA5, Cool manual, lectures including Automatic Memory Management and JIT; term inferred from those files.
- [suggestion] Facts fine: EaC 3e (2022), Sandler book (No Starch, 2024) and test suite, CMU 15-411 and UW CSE 401 Spring 2026.
- split/prereq: split disagree for now (front end vs back end), 120 h with two builds as options is workable. Prereq none.

## compiler-optimization
- [should-fix] CS 6120 video claim is overstated. On the Fall 2025 lessons page only lessons 1, 8, 9, 10, 11 and 13 show "video" links; lessons 2-7 (local analysis, data flow, global analysis, SSA, LLVM) and 12 (dynamic compilers) show discussion/tasks only. The
  node's use text ("Lessons 1-8", "lesson 12") and `videos: public` therefore need qualifying: use the 2020 self-guided version's videos (public_videos_url already points there) for lessons 2-7.
- [suggestion] Verified: `.../cs6120/2026fa/` returns 404; the Fall 2025 site is the newest. 15-745 notes page header says "Spring 2027" with Aug 26-Oct 30 dates (a header typo for Fall 2026, as the node suspects).
- split/prereq: none.

## type-systems
- [should-fix] Primary course Penn CIS 5000 (Software Foundations, Lean) is enrolled-only (recordings in Canvas), assignments partial, and is primarily a proof-assistant course (the course site's `sf-ts-lean.zip` Type Systems volume is one of three).
  It is also the Hoare-logic course used by program-verification. The owner's rule prefers public videos; this one has none. Fix: say so prominently, or choose a course with public recordings (I did not verify an alternative; Cornell CS 6110 and CMU 15-312/814 were
  not confirmed public in the node either). Keep TAPL plus SF PLF as the core.
- [suggestion] OPLSS archives are the only public video route and are a plausible substitute; the entry is fine.
- split/prereq: prereq: agree with the idea that type-systems and program-verification are not strictly ordered; see program-verification.

## program-verification
- Primary text SF (LF, PLF Hoare chapters, SLF) and course MIT FRAP 6.5120 are good; FRAP's course site is JS-rendered so videos stay `unknown`. No fact errors found.
- [suggestion] `penn-cis5000-hoare` duplicates type-systems' course entry (same course, different parts); fine but note it is enrolled-only in both.
- split/prereq: prereq agree: hard type-systems is heavier than needed (SF teaches Hoare before types); use hard [programming-language-concepts, discrete-math], soft type-systems. Split: agree as optional.

## program-analysis
- [should-fix] The primary course NJU "Software Analysis" has `latest_term: Spring 2020` and videos only on Bilibili in Chinese (English slides, English assignments, online judge). Record `videos: public (Chinese-language)` explicitly; the term/latest-run is not a real latest term.
  Mitigation already in node: Cambridge OptComp, CMU 17-355 Fall 2026 (slides, partial homework).
- [suggestion] Verified: SPA book "Last revision: September 2026" (node says Oct 15, 2026, check which; the page text I read says September 2026).
- split/prereq: prereq agree (soft discrete-math).

## language-runtimes
- [should-fix] Coverage gap: the scope has four parts (GC, virtual machines, JIT, dynamic-language implementation) but the primary text (GC Handbook) covers only GC, and the course (CMU 17-770) has no videos, partial assignments, and no Fall 2026 offering (verified: Fall 2025 page exists,
  `fall2026/` is 404). The JIT/VM half rests on lecture notes, PEP 744 and the V8 blog. Fix: add one structured JIT/VM text or tutorial series (e.g. Aycock's survey "A Brief History of Just-In-Time", or a hands-on JIT tutorial series); I did not verify specific URLs.
- [should-fix] `cs6120-runtime`: lesson 12 (dynamic compilers) has no video on the Fall 2025 page (see compiler-optimization); lesson 11 has one.
- [suggestion] Chapter numbers of the GC Handbook are "from memory" (open question); verify against gchandbook.org.
- split/prereq: prereq agree (soft compiler-construction).

## security-fundamentals
- Primary text and course (CS 161) are the best pair; verified fa26.cs161.org: Fall 2026, Wagner and Kao, YouTube recording links per lecture, Projects 1-3. Playlist public status not stated on the page; Fall 2025 playlist per node.
- [should-fix] Cross-node overlap: this node assigns the textbook chapters 17-24 (web) and 25-39 (network) and the same CS 161 lectures, which web-security (`cs161-web`) and network-security (primary text and primary course) reuse as their own primaries. Also `bsrs` (ch. 5, 6, 8) and Saltzer-Schroeder are assigned both here and in systems-security (`bsrs-sandbox`, `saltzer`), same chapters.
  Fix: here trim `use` to ch. 1-16 plus an overview of web/network, or let the specialization nodes use different primaries.
- split/prereq: prereq agree (no hard edge needed; discrete-math soft only for crypto).

## binary-exploitation
- Primary course pwn.college Program Security and primary text Nightmare are sound; module counts verified on the module page (Reverse Engineering 36, ROP 30, Dynamic Allocator Misuse 40, Program Exploitation 14; 159 total). `mbe` (RPISEC Spring 2015) is old but correctly labelled.
- [suggestion] Nightmare has no stated update date; note that it targets older glibc (use how2heap per glibc version, which the node does).
- split/prereq: split agree (reverse engineering is half the work at ~180 h); prereq agree (soft computer-architecture and operating-systems).

## fuzzing-and-vuln-discovery
- Agree no primary course. Fuzzing Book "Last change 2024-07-01" verified.
- [suggestion] `fuzzing101` last changelog 2021-2022 (older AFL++ and target versions); say so and pair with the AFL++ docs for current flags.
- [suggestion] CMU 17-355 (Fall 2026, in program-analysis) has fuzzing and symbolic-execution lectures with public slides; link it here as a syllabus companion.
- [suggestion] The `vuln-discovery` half of the title (code auditing, static analysis with CodeQL/Semgrep) is only touched through the Trail of Bits handbook; note it or add a named exercise.
- split/prereq: prereq agree (soft program-analysis).

## web-security
- [must-fix] Wrong/unknown facts for the primary course. The node says CS 253 latest term "~2020" and "could not load" the site. The page (opened over http) shows **"CS 253 Web Security Fall 2021"** with schedule through the Dec 7 final, readings per lecture, YouTube links on each lecture, an assignments policy (five 15% assignments, Gradescope) and course projects. Fix: latest_term Fall 2021 (public YouTube videos linked
  from the page; the 2019 videos are the older set), assignments `partial` (described, not verified as downloadable); reword notes to match.
- [suggestion] Primary text (PortSwigger Web Security Academy) is the right pick. `cs155-proj2` is Stanford-hosted and unverified over https; fine.
- split/prereq: prereq agree (soft databases; web-development if such a node exists).

## systems-security
- Primary course MIT 6.566 Spring 2026 is a good fit for isolation and privilege separation; verified Labs 1-5 and the Previous years list. Side channels and TEEs come from 6.5950, whose 2026 videos are enrolled-only (Spring 2025 is on Panopto/OCW).
- [suggestion] `bsrs-sandbox` duplicates security-fundamentals' `bsrs` chapters (see there).
- split/prereq: split agree (hardware/side channels vs OS isolation); prereq: agree promoting computer-architecture only if the hardware half is required.

## network-security
- [should-fix] Primary text and primary course are the CS 161 networking chapters/lectures that security-fundamentals already assigns (ch. 25-39). The node's own added value is Bulletproof TLS, RFC 8446, the MIT lectures and practice. Fix: make the MIT 6.566 network/secure-channel lectures plus Bulletproof TLS the core, or de-duplicate with security-fundamentals as above.
- [should-fix] Omission: SEED Labs (seedsecuritylabs.org; named labs for TCP attacks, DNS attacks, firewalls, VPN) are public VM-based labs that match the scope's "attacks and defenses, firewalls"; the node only lists them in the fundamentals node's `considered`. Add as practice and name the labs.
- [suggestion] BGP/RPKI and DDoS are thin (the node says so).
- split/prereq: prereq agree (soft applied-cryptography), overlap on TLS with applied-cryptography is acknowledged.

## applied-cryptography
- [should-fix] `boneh-cs255` fact: the node says videos `enrolled-only` and the public set is "Coursera Cryptography I". The Online Cryptography page `crypto.stanford.edu/~dabo/courses/OnlineCrypto/` says "This page contains all the lectures in the free cryptography course" and lists every lecture with a Coursera lecture link plus slides; CS 255 Winter 2026 itself says "Videos: cs255 online (for videos and slides covering some of the material in class)". Fix: record the public video set as the Online Cryptography course lectures (Coursera-hosted, listed on the Stanford page) and note CS 255 Winter 2026 homework and two projects (password manager first) are public on cs255.stanford.edu.
- [suggestion] Primary text choice (Serious Cryptography 2e, Aug 2024) is fine; Boneh-Shoup v0.6 free as the alternative.
- split/prereq: none.

## cryptography-foundations
- Primary text (Joy of Cryptography) and course (MIT 6.5620 Fall 2026, verified site; Spring 2018 playlist the newest confirmed public videos) are fine.
- [suggestion] `pass-shelat` is a 2010 note set and `katz-lindell` a paid text; both serve as theory references, which is fine, but `katz-lindell` could be the primary text if the owner wants rigor (the node says so).
- split/prereq: partly disagree with promoting computational-complexity soft->hard: MIT 6.5620 assumes it, the Joy of Cryptography route does not. Keep soft and note the course requirement.

## Overall

- **Counts:** must-fix 3 (storage-and-file-systems, processor-design, web-security); should-fix 31 (G4: 13, G11: 14, G12: 4; shared-duplicate items are counted once per node where they must be resolved). By group: G4 must 1 / should 13; G11 must 1 / should 14; G12 must 1 / should 4.
- **Systemic issue 1: link-check "ok" is not content-check.** DokuWiki-style sites (ETH SAFARI) return 200 for non-existent topics; the storage node cites such a page as existing. Facts about "page exists" must come from reading the text.
- **Systemic issue 2: cross-node duplication.** The same resource with the same job appears in several nodes: OSTEP persistence/homework (OS, storage, concurrent), 6.1810 fs/lock labs (kernel, storage, concurrent), Drepper (3 nodes), perfbook (2), Aalto ch. 2 (2), PLAI (plc and interpreters), CS 161 chapters (3 nodes), BSRS and Saltzer-Schroeder (2), ETH DDCA (5 nodes, with inconsistent course ID and URL). A dedup pass owned by one reviewer would remove about ten resource rows.
- **Systemic issue 3: video policy.** Of the 27 primary courses in these groups, about a third have enrolled-only or no current-term video (CS 162, CS 149, EECS 151, CS 61C, 15-213, CIS 5000, CS 143, 15-411, 17-770, MIT 6.5930, Bootlin). The nodes handle this with `public_videos_term`, but in two cases (OS, parallel) a better public-video option already sits in the same node as a secondary.
- **Stale or mixed-term data:** ETH memory-systems latest vs use term; CS 6120 Fall 2025 videos only on 6 of 14 lessons; CS 253 Fall 2021 not ~2020; NJU course "Spring 2020".
- **Strongest areas:** G12 security-fundamentals, binary-exploitation, systems-security and cryptography (clear primaries, current terms, specific practice); computer-systems; os-kernel-implementation; compiler-construction/optimization text choices; performance-engineering and performance-analysis practice lists.
- **Weakest areas:** processor-design (MIPS mismatch), storage-and-file-systems (wrong dismissal of the ETH course, duplicate text), type-systems and language-runtimes (primary course or text covers only part of scope, no public video), performance-analysis (primary course mismatch).
- Not verified by me: the exact video lists on YouTube playlists (rate limits), GitHub repos, O'Reilly/Packt/Springer/Elsevier pages, MIT Panopto, `csapp.cs.cmu.edu`.
