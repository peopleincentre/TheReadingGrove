# The Reading Grove

A web app to manage the PiC office library: browse and search books on a virtual bookshelf, track borrow/return of multiple copies, manage members, and export the catalog.

## Data

- **651 books** from `LibraryBooks2026.csv` are bundled as the canonical catalog in `data/seedBooks.json` (which is committed to the repo).
- Books are categorized into subjects (Architecture, Housing, Environment, Urban Planning, Disasters, Water, Construction, Rural Development, Society, General, Theory, Technology), each with its own color on the shelf.
- Each book tracks **multiple copies** (`copies` field). A book is only marked as fully borrowed when all its copies are checked out.
- Per-visitor changes (borrows, returns, edits, new members) are saved in the browser's `localStorage` under the key `library_data_v2` and are merged on top of the committed catalog on every load.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. (Optional) Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. Create a GitHub repository named `TheReadingGrove` and push this project to `main`.
2. In the repo settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds the app and deploys the `dist/` folder to Pages automatically on every push to `main`.
4. The app will be available at `https://<your-username>.github.io/TheReadingGrove/` (the Vite build uses a relative `base` so it works under the sub-path).

## Build

`npm run build` produces the static site in `dist/`. You can host that folder on any static server.

## Regenerating the catalog

The seed file is generated from `LibraryBooks2026.csv` by the script at `/tmp/opencode/generate_seed.py`. After changing the CSV, re-run `python3 /tmp/opencode/generate_seed.py` and commit the regenerated `data/seedBooks.json`.
