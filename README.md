# Marcus Cedric Pedrosa — Portfolio

A lightweight static portfolio website built with semantic HTML, CSS, and vanilla JavaScript. It includes responsive project cards, dark/light themes, keyboard-friendly navigation, project filtering, and optimized portrait/project imagery.

## Local development

No build step or package installation is required.

1. Clone or download the repository.
2. Start any local static server from the project root. For example:

   ```powershell
   npx serve .
   ```

   Or with Python:

   ```powershell
   python -m http.server 5500
   ```

3. Open the printed local URL in a browser.

Opening `index.html` directly also works for basic viewing, but a local server is recommended so relative asset paths behave like production.

## Project structure

- `index.html` — page content, navigation, project cards, and metadata
- `styles.css` — theme tokens, layout, responsive rules, and component styles
- `script.js` — theme, navigation, filters, image fallbacks, and reveal behavior
- `Myself_Pics/` — optimized portrait variants
- `Project_Screenshots/` — project screenshots and optimized card variants
- `Certificates/` and `CV/` — downloadable documents
- `.hintrc` — webhint configuration

## Updating the portfolio

- Add or edit projects in the project-card section of `index.html`.
- Keep project screenshots in `Project_Screenshots/` and provide AVIF/WebP card variants when possible.
- Update the CV and certificate files without changing their stable links unless necessary.
- Add a matching `data-category` when introducing a new project filter category.
- Keep external links on new-tab anchors paired with `rel="noopener noreferrer"`.

## Checks before publishing

- Run `node --check script.js`.
- Run `git diff --check`.
- Test keyboard navigation, `Escape` menu closing, both themes, project filters, and mobile widths.
- Confirm every image, project link, CV link, and certificate link loads.
- Run webhint or Lighthouse when a deployment URL is available.

## Deployment

This is a static site and can be deployed to Netlify, Vercel, GitHub Pages, or any static hosting provider. Publish the repository root as the site directory; no build command is needed. Before choosing a production domain, update canonical/SEO metadata, `robots.txt`, and `sitemap.xml` when those features are added.
