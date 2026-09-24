# Scatto — website

Static catalog site for **Scatto** golf kits (*Swing the balance*). Plain HTML, CSS and JavaScript: no build step and no dependencies. Visitors browse the kits and send an inquiry through the contact form; there is no cart or checkout.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

You can also open `index.html` directly in a browser. The only exception is `404.html`, which uses root-absolute links because the host serves it at any URL.

## Structure

```
index.html                  Home
shop.html                   All kits
products/
  classic-navy-kit.html     Kit page
  _template.html            Copy this file to add a new kit (it's marked noindex)
about.html
contact.html                Inquiry form (Formspree) + FAQ
404.html, robots.txt, sitemap.xml
assets/
  css/styles.css            All styles. Colors and fonts are tokens at the top (:root)
  js/main.js                Mobile menu, product gallery, form pre-fill and submit
  images/brand/             logo.png (header), logo-full-white.png (footer), favicon.png, apple-touch-icon.png
  images/site/              Brand and gift banners, social-sharing image (og-image.jpg)
  images/products/<slug>/   Web-sized kit photos, each in two sizes (e.g. kit-1200.jpg and kit-600.jpg)
```

The header and footer are copied into every page, so a nav or footer change has to be made in all 7 HTML files. Search for `Site header` / `Site footer`.

## Before launch

Search the project for `TODO` to find each spot:

- [ ] **Logo files**: the logo, favicon and sharing image were cut out of the client's brand banner as PNGs. Ask the client for the original vector logo (SVG or AI) and re-export them, keeping the same filenames. The header logo is a compact version (squirrel and wordmark, no tagline) so it stays readable at small sizes; check that the client is happy with it.
- [ ] **Contact form**: create a form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in `contact.html`. Until then, the form shows a "not connected yet" message.
- [ ] **Domain**: replace `https://iam-arturo.github.io/scatto` with the real domain in all HTML files, `robots.txt` and `sitemap.xml`. It's used for canonical URLs, social sharing previews and structured data. In `404.html`, also change the `/scatto/` paths back to `/`.
- [ ] **Search engines**: remove the `<meta name="robots" content="noindex, nofollow">` lines marked `PREVIEW ONLY` from the 5 public pages. (Leave the ones in `404.html` and `products/_template.html`.)
- [ ] **Price**: the site shows **$89** as a placeholder. Update it in `index.html`, `shop.html` and `products/classic-navy-kit.html`, including the `"price"` in the page's JSON-LD block.
- [ ] **Specs**: add the kit's dimensions and weight to the Details table on the product page.
- [ ] **Copy**: the About story, product texts and FAQ are drafts for the client to review. The return-policy answer in the FAQ is intentionally generic.

## Add a new kit

1. Put its photos in `assets/images/products/<kit-slug>/`. Square photos work best. Export each one at 1200px and 600px, for example:
   `sips -s format jpeg -s formatOptions 78 -Z 1200 photo.jpg --out assets/images/products/<kit-slug>/main-1200.jpg`
   `sips -s format jpeg -s formatOptions 78 -Z 600 photo.jpg --out assets/images/products/<kit-slug>/main-600.jpg`
2. Copy `products/_template.html` to `products/<kit-slug>.html` and follow the checklist comment at the top of the file.
3. Add a card to `shop.html` (copy the existing `<article class="card">`).
4. Add an `<option value="<kit-slug>">` to the **Kit** select in `contact.html`.
5. Add the URL to `sitemap.xml`.

## Contact form pre-fill

Links can pre-select fields on the contact form:
`contact.html?product=classic-navy-kit&type=gift`
Here `product` matches a **Kit** option value, and `type` is one of `personal`, `gift`, `corporate`, `wholesale` or `other`.

## Preview on GitHub Pages

The client preview lives at **https://iam-arturo.github.io/scatto/**. Search engines are told not to index it.

GitHub Pages publishes the `main` branch (Settings → Pages → Deploy from a branch → `main` / root). Every push to `main` redeploys within a couple of minutes; you can watch progress in the **Actions** tab.

Because the preview is served under `/scatto/`, all pages use relative links. The one exception is `404.html` (see the launch checklist above).

## Deploy

Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages or GitHub Pages). There's no build command, and the publish directory is the repository root.
