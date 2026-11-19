# Website

A static site with no build tools and no runtime dependencies. `build.py` turns the research data into
`data.json` and copies `src/` next to it; the browser app in `src/app.js` renders everything from that file.

```
site/
  build.py            research/*.yaml  ->  _site/{index.html, styles.css, app.js, data.json}
  config.yaml         title, tagline, which paths to publish
  content/paths.yaml  path families, line badges, taglines, "where it leaves you", optional exits
  src/index.html      page shell and icon set
  src/styles.css      themes (skins) and all component styles
  src/app.js          routing, map layout, views, progress, search, options
```

`python3 site/build.py --preview DIR` also writes a single-page version (CSS and JS inlined, plus `data.json`) for
sharing a preview outside GitHub Pages.

## Views

| Address | View |
|---|---|
| `#home` | Paths grouped by family, and how the paths connect |
| `#p-mlsys--map` | Prerequisite map. Click a topic for its details beside the map; hover to trace what it needs and unlocks |
| `#p-mlsys--guide` | The same route as ordered stages, with "Next up" and the ways to finish the path |
| `#p-mlsys--courses` | The route grouped by resource: a course serving several topics appears once, with the part each topic uses |
| `#n-<topic>` | Topic page: primary text and course, practice, gap-fillers, references, alternatives considered, notes |
| `#about` | How to read the roadmap |

Progress (not started / in progress / done, per topic and per resource) and the starting point are stored in the
browser's local storage. Nothing is sent anywhere.

## Presentation options to choose from

Everything below can be switched live under **Options** on the site. Once you pick, set the defaults in
`DEFAULTS` at the top of `src/app.js` (and, if you like, remove the choices you do not want from `OPTION_ROWS`
and `SKINS`).

| Setting | Choices | Default |
|---|---|---|
| Theme (`skin`) | **Transit**: route-map look, each path has its own line colour. **Datasheet**: engineering datasheet, grid paper, monospace labels, square corners. **Library**: reading-room look, book typography, catalogue-card topics | Transit |
| Light or dark (`mode`) | Match device, Light, Dark | Match device |
| Map direction (`dir`) | Auto (left to right on wide screens, top to bottom on phones), Top to bottom, Left to right | Auto |
| Map lines (`lines`) | Required only, Required and helpful | Required only |
| Topics in a path (`scope`) | The path and the prerequisites it borrows from other paths, or this path only | Path and prerequisites |
| Guide layout (`layout`) | Cards (syllabus-like), compact table | Cards |
| Topic pages (`detail`) | Essentials first (extra sections folded), everything open | Essentials first |
| A path opens on (`start`) | Map, Guide | Map |

Open question kept for you: whether a course that serves several topics (CS336 serves six topics on this route)
should be presented once, as in the Courses view, or topic by topic, as on the map and in the guide. The site
currently offers both.

## Themes

Each skin in `src/styles.css` defines a light palette (`--l-*`) and a dark palette (`--d-*`), fonts and corner
radii; the light/dark blocks map those onto the tokens components use. Path colours (`--pcl-*`, `--pcd-*`) are
shared by every skin. To drop a skin, delete its block and its entry in `SKINS`.
