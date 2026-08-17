# The Reading Grove

A public browse-and-search site for the PiC library at [People in Centre](https://www.peopleincentre.org). Visitors can explore the catalog — arranged as subject-wise shelves — and request a book by email. No login, no editing: it is a read-only catalog site.

## Features

- **Browse the shelves** — the homepage shows the full catalog arranged on subject shelves (Architecture, Housing, Environment, Urban Planning, Disasters, Water, Construction, Rural Development, Society, General…), with books rendered as color-coded spines.
- **Search** — search across title, author, keywords, publisher, subject, accession number, and ISBN. Results filter the shelves in place.
- **Browse by subject** — click a subject chip to focus a single shelf with a search box scoped to it. Views are shareable via the URL hash (e.g. `#subject=DIS&q=flood`).
- **Request a book** — each book has a "Borrow this book" button that opens an email to `office@peopleincentre.com` with the subject *The Reading Grove* and the book's details pre-filled. Add your name and message in your mail app, then send.

## Data

- The catalog is `data/seedBooks.json` — 651 books bundled into the app as the canonical catalog (committed to the repo).
- The seed file is generated from `LibraryBooks2026.csv` by the script at `/tmp/opencode/generate_seed.py`. After changing the CSV, re-run `python3 /tmp/opencode/generate_seed.py` and commit the regenerated JSON.

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
