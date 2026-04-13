# Repository Guidelines

## Project Structure & Module Organization
This repository is a Hugo site with a custom theme. Edit source files, not generated output.

- `content/posts/`: blog posts in Markdown with TOML front matter.
- `content/posts/<slug>/index.md`: page bundles for posts that ship local assets such as images.
- `content/bookmarks/` and `content/videos/`: section landing pages.
- `data/bookmarks.json`, `data/videos.json`, `data/projects.json`: structured content rendered by templates.
- `themes/matej/layouts/`: Hugo templates and partials.
- `themes/matej/static/css/` and `themes/matej/static/js/`: theme styles and small scripts.
- `static/`: site assets copied as-is at build time.

Do not hand-edit `public/` or `resources/`; rebuild them from source.

## Build, Test, and Development Commands
- `hugo server -D`: run the local site with drafts enabled.
- `hugo --gc --minify`: build the production site into `public/`.
- `hugo new posts/my-post.md`: scaffold a new post from `archetypes/default.md`.

The deployment workflow lives in `.github/workflows/hugo.yaml` and publishes the Hugo build to GitHub Pages.

## Coding Style & Naming Conventions
Use the existing formatting in touched files:

- 4-space indentation in HTML, CSS, JSON, and TOML.
- TOML front matter with `+++`, for example `title`, `date`, `group`, and `draft`.
- Lowercase section labels in `group` because templates render them directly.
- Prefer lowercase content slugs and stable paths; avoid renaming existing files without a reason.

Keep JSON entries consistently ordered and formatted like the surrounding records.

## Testing Guidelines
There is no automated test suite in this repository. Validate changes manually:

- Run `hugo --gc --minify` before opening a PR.
- Preview affected pages with `hugo server -D`.
- If you change templates, CSS, or data files, check the archive, bookmarks, videos, and projects sections in a browser.
- If you edit JSON data, confirm it remains valid.

## Commit & Pull Request Guidelines
Recent commits use short lowercase subjects such as `update css simplification` and `friendly scoll deadspace`. Keep commits concise and imperative, but make them more descriptive than one-word summaries.

PRs should summarize scope, note any affected sections or templates, link related issues when relevant, and include screenshots for visible layout or styling changes.
