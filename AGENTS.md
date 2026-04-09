# Repository Guidelines

## Project Structure & Module Organization
This repository is a Hugo site with a custom theme. Treat source files as the only editing surface:

- `content/posts/`: Markdown posts with TOML front matter.
- `content/bookmarks/` and `content/videos/`: section index pages.
- `data/bookmarks.json` and `data/videos.json`: structured content rendered into lists/galleries.
- `themes/matej/layouts/`: Hugo templates and partials.
- `themes/matej/static/css/` and `themes/matej/static/js/`: site styling and small client-side scripts.
- `static/`: published assets such as images.

Do not hand-edit generated output in `public/` rebuild from source instead.

## Build, Test, and Development Commands
- `hugo server -D`: run the local dev server and include drafts.
- `hugo --gc --minify`: produce a production build in `public/`.
- `hugo new posts/my-post.md`: scaffold a new post from `archetypes/default.md`.

The GitHub Pages workflow in `.github/workflows/hugo.yaml` builds with Hugo and deploys the generated site artifact.

## Coding Style & Naming Conventions
Follow the existing repository style:

- Use 4-space indentation in HTML, CSS, JSON, and TOML.
- Keep filenames lowercase and hyphenated, for example `profile-links.html` or `book-reflections.md`.
- Posts use TOML front matter with `+++` delimiters and fields like `title`, `date`, `group`, and `draft`.
- Keep `group` values short and lowercase because templates render them directly as section labels.
- Prefer editing theme assets in `themes/matej/` over adding parallel overrides unless there is a clear reason.

## Testing Guidelines
There is no automated test suite in this repository. Validation is manual:

- Run `hugo --gc --minify` before opening a PR.
- Preview touched pages with `hugo server -D`.
- If you change templates, CSS, bookmarks, or videos, verify the archive, bookmarks, and videos pages in a browser.
- If you edit JSON data files, ensure they stay valid and consistently formatted.

## Commit & Pull Request Guidelines
Recent history uses short lowercase subjects such as `add structure` and `grade center`. Keep commit messages concise and imperative, but make them more descriptive than one-word summaries when possible.

PRs should include a brief scope summary, note affected content or templates, link related issues when applicable, and attach screenshots for any visible UI or layout change.
