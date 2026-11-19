# CS Roadmap

A personal map of computer science. Topics are nodes, prerequisites are lines between them, and paths are
specializations that run through shared topics. Every topic names one primary text and, where a good one exists,
one primary course, plus named practice and resources that fill specific gaps. Course facts (latest run, whether
lectures are public, assignment access) were checked in November 2026.

- **139 topics** across **15 paths**: Core CS, ML & DL Foundations, LLMs & NLP, Reinforcement Learning, Computer Vision,
  Generative Models, AI Safety & Interpretability, ML Systems & GPU Computing, Distributed Systems, Database Systems,
  OS Internals & Performance Engineering, Computer Architecture & Hardware, Programming Languages & Compilers,
  Security & Cryptography, Theory & Advanced Algorithms.
- Website: https://saisandeshk.github.io/cs-roadmap/
  ML Systems & GPU Computing is published first, with every prerequisite it needs; the other paths are researched and follow.

## Layout

| Folder | What it holds |
|---|---|
| `research/skeleton.yaml` | Paths, topics and prerequisites (the graph) |
| `research/nodes/*.yaml` | One file per topic: resources with what to use and why, course facts, alternatives considered, curation notes |
| `research/DECISIONS.md` | Structure decisions applied to the graph |
| `research/reports/` | Independent reviews, fix log, link checks |
| `research/tools/` | `validate.py` (format, prerequisites, cycles) and `check_links.py` |
| `site/` | The website: `build.py`, `config.yaml`, `content/paths.yaml`, and the static app in `src/` |
| `.github/workflows/site.yml` | Validates, builds and deploys the website |

## Build and preview locally

```bash
python3 -m pip install pyyaml        # only dependency
python3 research/tools/validate.py   # check the data
python3 site/build.py                # writes _site/
python3 -m http.server --directory _site 8000
# open http://localhost:8000
```

## Publish on GitHub Pages

1. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to the default branch. The `Site` workflow validates the data, builds `_site/` and deploys it.
3. To publish more paths, edit `site/config.yaml` (`publish_paths: all` publishes everything).

Reader settings (light or dark, map direction, guide layout and more) are explained in `site/README.md`.
