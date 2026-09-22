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
  images/brand/             logo.svg, logo-white.svg, favicon.svg  (placeholders)
  images/products/<slug>/   Web-sized kit photos
  scatto_golf_kit.png       Original high-resolution photo (not used by the pages)
```

The header and footer are copied into every page, so a nav or footer change has to be made in all 7 HTML files. Search for `Site header` / `Site footer`.

## Before launch

Search the project for `TODO` to find each spot:

- [ ] **Logo**: replace `assets/images/brand/logo.svg` (navy, used in the header), `logo-white.svg` (footer) and `favicon.svg`. Keep the same filenames and nothing else needs to change.
- [ ] **Contact form**: create a form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in `contact.html`. Until then, the form shows a "not connected yet" message.
- [ ] **Domain**: replace `https://iam-arturo.github.io/scatto` with the real domain in all HTML files, `robots.txt` and `sitemap.xml`. It's used for canonical URLs, social sharing previews and structured data. In `404.html`, also change the `/scatto/` paths back to `/`.
- [ ] **Search engines**: remove the `<meta name="robots" content="noindex, nofollow">` lines marked `PREVIEW ONLY` from the 5 public pages. (Leave the ones in `404.html` and `products/_template.html`.)
- [ ] **Price**: the site shows **$89** as a placeholder. Update it in `index.html`, `shop.html` and `products/classic-navy-kit.html`, including the `"price"` in the page's JSON-LD block.
- [ ] **Specs**: add the kit's dimensions, weight and materials to the Details table on the product page.
- [ ] **Copy**: the About story, product texts and FAQ are drafts for the client to review. The return-policy answer in the FAQ is intentionally generic.

## Add a new kit

1. Put its photos in `assets/images/products/<kit-slug>/`. Resize large photos first, for example:
   `sips -s format jpeg -s formatOptions 82 -Z 1600 photo.png --out assets/images/products/<kit-slug>/main.jpg`
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
