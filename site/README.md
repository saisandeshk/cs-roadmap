# Website

A static site with no build tools and no runtime dependencies. `build.py` turns the research data into
`data.json` and copies `src/` next to it; the browser app in `src/app.js` renders everything from that file.

```
site/
  build.py            research/*.yaml  ->  _site/{index.html, styles.css, app.js, data.json}
  config.yaml         title, tagline, which paths to publish
  content/paths.yaml  path families, line badges, taglines, "where it leaves you", optional exits
  src/index.html      page shell and icon set
  src/styles.css      palettes, type and all component styles
  src/app.js          routing, map layout, views, progress, search, options
```

`python3 site/build.py --preview DIR` also writes a single-page version (CSS and JS inlined, plus `data.json`) for
sharing a preview outside GitHub Pages.

## Layout

Every page except About is an app shell: a sidebar outline beside a workspace. On the home page the sidebar lists
the paths by family and the workspace is the system map (how the paths connect). On a path or topic page the sidebar
shows the path (progress, the next topic to start, Map / Guide / Courses) and its outline: stages, with the topics
numbered through the route and marked not started, in progress or done. Below 1100px wide the sidebar sits above the
content and the outline folds away.

## Views

| Address | View |
|---|---|
| `#home` | Paths grouped by family, beside the system map; pointing at a path shows what it is |
| `#p-mlsys--map` | Prerequisite map filling the window. Click a topic (on the map or in the outline) for a detail card; hover to trace what it needs and unlocks |
| `#p-mlsys--guide` | The same route as ordered stages, with "Next up" and the ways to finish the path; `--guide--<topic>` jumps to a topic |
| `#p-mlsys--courses` | The route grouped by resource: a course serving several topics appears once, with the part each topic uses |
| `#n-<topic>` | Topic page: primary text and course, practice, gap-fillers, references, alternatives considered, notes; previous and next topic on the path |
| `#about` | How to read the roadmap |

Progress (not started / in progress / done, per topic and per resource) and the starting point are stored in the
browser's local storage. Nothing is sent anywhere.

## Settings

The look is fixed: a route-map style where each path keeps its own line colour, on neutral zinc palettes (dark by
default, and light). Headings, labels, buttons and numbers use JetBrains Mono; reading text and topic names use Inter.
Readers can change these under **Settings** (the sun / moon / screen switch in the top bar picks light, dark or the
device setting); the defaults live in `DEFAULTS` at the top of `src/app.js`.

| Setting | Choices | Default |
|---|---|---|
| Light or dark (`mode`) | Dark, Light, Match device | Dark |
| Map direction (`dir`) | Auto (left to right on wide screens, top to bottom on phones), Top to bottom, Left to right | Auto |
| Map lines (`lines`) | Required only, Required and helpful | Required and helpful |
| Topics in a path (`scope`) | The path and the prerequisites it borrows from other paths, or this path only | Path and prerequisites |
| Guide layout (`layout`) | Cards (syllabus-like), compact table | Cards |
| Topic pages (`detail`) | Essentials first (extra sections folded), everything open | Essentials first |
| A path opens on (`start`) | Map, Guide | Map |

A course that serves several topics (CS336 serves six on the ML Systems route) is shown topic by topic on the map,
in the guide and on topic pages, and once with all its uses in the Courses view.

## Colours and type

`src/styles.css` defines a light palette (`--l-*`) and a dark palette (`--d-*`); the light/dark blocks map them onto
the tokens components use. Primary buttons use `--ink` (white on dark, black on light); `--accent` is for links,
focus and the selected topic; map surfaces carry a faint dot grid (`--dot`). Each path has an identity colour
(`--pcl-*` light, `--pcd-*` dark), used for its code badge, its map lines and its stations.
