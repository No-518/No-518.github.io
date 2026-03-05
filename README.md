# Personal Homepage (Zero-Build Static Site)

Clean academic one-page homepage inspired by Jekyll Now-style layouts (header + sections + footer), implemented as plain HTML/CSS/JS.

## Files

- `index.html`: Content and structure (edit this to customize).
- `style.css`: Styling (CSS variables, responsive layout, subtle background pattern).
- `script.js`: Small enhancements (year + staggered reveal on scroll).
- `assets/avatar.svg`: Placeholder avatar (replace with your own).
- `.github/workflows/pages.yml`: Optional GitHub Pages deploy workflow (works for static sites).

## Customize

1. Update identity and links in `index.html`:
   - Name + subtitle (top header)
   - Social links (email, GitHub, Scholar, LinkedIn)
   - About text, interests, and buttons (CV/Scholar)
2. Replace the avatar:
   - Swap `assets/avatar.svg` for your photo (keep the filename), or update the `<img>` `src`.
3. Adjust styling in `style.css`:
   - Colors and spacing: `:root { ... }`
   - Fonts are loaded from Google Fonts in `index.html`

## Local Preview

From this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy To GitHub Pages

### Option A: Classic Pages (no Actions)

Recommended if you publish from a dedicated repository with these files in the repo root.

1. Create a GitHub repo (or use `username.github.io` for a user/org site).
2. Put `index.html`, `style.css`, `script.js`, `assets/`, and `.nojekyll` at the repo root.
3. GitHub repo Settings -> Pages:
   - Build and deployment: "Deploy from a branch"
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Your site will appear at:
   - Project site: `https://<user>.github.io/<repo>/`
   - User/Org site: `https://<user>.github.io/`

### Option B: GitHub Actions (included workflow)

This repo includes `.github/workflows/pages.yml` to deploy a static artifact. It also supports a monorepo layout by auto-detecting whether the site lives at repo root or in `personal-homepage/`.

1. In GitHub repo Settings -> Pages:
   - Build and deployment: Source = "GitHub Actions"
2. Push to `main`.
3. Check the Actions tab for the "Deploy static site to GitHub Pages" workflow run.

## Notes

- The site is "zero-build": no bundlers, no framework, just static files.
- Animations respect `prefers-reduced-motion`.

