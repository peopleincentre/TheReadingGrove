# The Reading Grove

A public browse-and-search site for the PiC library at [People in Centre](https://www.peopleincentre.org). Visitors can explore the catalog — a flat, alphabetical gallery with category-colored cards — and request a book by email. No login, no editing: it is a read-only catalog site.

## Features

- **Browse the catalog** — the homepage shows the full catalog alphabetically, with color-coded cards. Each card's gradient background indicates its subject (Architecture, Housing, Environment, Urban Planning, Disasters, Water, Construction, Rural Development, Society, General…).
- **Search** — a general search box plus field filters for title, author, publisher, and keyword. Filters combine (AND) and are shareable via the URL hash (e.g. `#q=flood&subject=DIS&author=...`).
- **Browse by subject** — click a subject pill to narrow the gallery to that category (shows per-subject counts).
- **Request a book** — each book has a "Borrow this book" button that opens an email to `office@peopleincentre.com` with the subject *The Reading Grove* and the book's details pre-filled. Add your name and message in your mail app, then send.

## Data (editable catalog)

- The catalog lives as **one markdown file per book** in `data/books/` (e.g. `data/books/1.md`). Each file has YAML-style frontmatter with the book's metadata (title, authors, subject, publisher, year, isbn, copies, keywords); any free text below the `---` line becomes the book's `remarks`, shown in the detail view.
- `data/seedBooks.json` is **generated** from those markdown files by `scripts/generate-json.mjs` and is run automatically before every build, so the markdown files are the source of truth.
- **To edit a book:** open its file in `data/books/`, change the values, and push. CI rebuilds and redeploys automatically. Locally, run `npm run build` (regenerates the JSON) or `npm run dev`.
- `scripts/generate-md.mjs` regenerates the markdown files from an existing `seedBooks.json` (e.g. after re-running the CSV import). `LibraryBooks2026.csv` is kept as historical provenance.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Build

`npm run build` produces the static site in `dist/`. You can host that folder on any static server.

## Deploy to GitHub Pages

1. Push this project to the `main` branch of the GitHub repo `peopleincentre/TheReadingGrove`.
2. In the repo settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds the app and deploys automatically on every push to `main`.
4. The app is served at `https://peopleincentre.github.io/TheReadingGrove/` (the build uses a relative `base`, so it works under the sub-path).
