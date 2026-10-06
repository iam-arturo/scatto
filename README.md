# Scatto — website

Static catalog site for **Scatto** golf kits (*Swing the balance*). Plain HTML, CSS and JavaScript: no build step and no dependencies. Visitors browse the kits and email Scatto at contact@scattogolf.com to order; there is no cart or checkout.

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
contact.html                Contact email + FAQ
404.html, robots.txt, sitemap.xml
assets/
  css/styles.css            All styles. Colors and fonts are tokens at the top (:root)
  js/main.js                Mobile menu, product gallery, videos, photo motion
  images/brand/             logo.png (header), logo-full-white.png (footer), favicon.png, apple-touch-icon.png
  images/site/              Brand and gift banners, social-sharing image (og-image.jpg)
  images/products/<slug>/   Web-sized kit photos, each in two sizes (e.g. kit-1200.jpg and kit-600.jpg)
  video/<slug>/             Kit video (opening.mp4) with its start frame, end frame and gallery thumbnail
```

The header and footer are copied into every page, so a nav or footer change has to be made in all 7 HTML files. Search for `Site header` / `Site footer`.

## Before launch

Search the project for `TODO` to find each spot:

- [ ] **Logo files**: the logo, favicon and sharing image were cut out of the client's brand banner as PNGs. Ask the client for the original vector logo (SVG or AI) and re-export them, keeping the same filenames. The header logo is a compact version (squirrel and wordmark, no tagline) so it stays readable at small sizes; check that the client is happy with it.
- [ ] **Domain**: replace `https://iam-arturo.github.io/scatto` with the real domain in all HTML files, `robots.txt` and `sitemap.xml`. It's used for canonical URLs, social sharing previews and structured data. In `404.html`, also change the `/scatto/` paths back to `/`.
- [ ] **Search engines**: remove the `<meta name="robots" content="noindex, nofollow">` lines marked `PREVIEW ONLY` from the 5 public pages. (Leave the ones in `404.html` and `products/_template.html`.)
- [ ] **Specs**: add the kit's dimensions and weight to the Details table on the product page.
- [ ] **Copy**: the About story, product texts and FAQ are drafts for the client to review. The return-policy answer in the FAQ is intentionally generic.

## Add a new kit

1. Put its photos in `assets/images/products/<kit-slug>/`. Square photos work best. Export each one at 1200px and 600px, for example:
   `sips -s format jpeg -s formatOptions 78 -Z 1200 photo.jpg --out assets/images/products/<kit-slug>/main-1200.jpg`
   `sips -s format jpeg -s formatOptions 78 -Z 600 photo.jpg --out assets/images/products/<kit-slug>/main-600.jpg`
2. Copy `products/_template.html` to `products/<kit-slug>.html` and follow the checklist comment at the top of the file.
3. Add a card to `shop.html` (copy the existing `<article class="card">`).
4. Add the URL to `sitemap.xml`.

## Kit video

The case-opening video appears in two places: the "What's inside" section of the home page, where it plays once when scrolled into view, and the product gallery, as the second thumbnail. It has no sound and a corner button to pause, play or replay it. Visitors who have reduced motion turned on, or no JavaScript, see the final frame (the open case) as a still.

The original was 1280×720. Both spots are square, so the export crops its sides and extends the plain background at the top and bottom. To replace it, export the new video and its stills with the same filenames:

```sh
SRC=~/Downloads/new-video.mp4; OUT=assets/video/classic-navy-kit
VF="crop=1040:720:120:0,split[a][b];[a]pad=1040:1040:0:160,fillborders=top=160:bottom=160:mode=smear,gblur=sigma=24[bg];[bg][b]overlay=0:160,scale=960:960:flags=lanczos"
ffmpeg -i "$SRC" -filter_complex "$VF" -an -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart $OUT/opening.mp4
ffmpeg -ss 0 -i "$SRC" -filter_complex "$VF" -frames:v 1 -q:v 4 $OUT/opening-start.jpg
ffmpeg -sseof -0.05 -i "$SRC" -filter_complex "$VF" -frames:v 1 -q:v 4 $OUT/opening-end.jpg
ffmpeg -ss 4.5 -i "$SRC" -filter_complex "$VF,crop=720:720:120:120,scale=300:300" -frames:v 1 -q:v 4 $OUT/opening-thumb.jpg
```

The crop assumes the product stays in the middle 1040px of a 1280×720 frame; check the stills before publishing. Install ffmpeg with `brew install ffmpeg`.

## Preview on GitHub Pages

The client preview lives at **https://iam-arturo.github.io/scatto/**. Search engines are told not to index it.

GitHub Pages publishes the `main` branch (Settings → Pages → Deploy from a branch → `main` / root). Every push to `main` redeploys within a couple of minutes; you can watch progress in the **Actions** tab.

Because the preview is served under `/scatto/`, all pages use relative links. The one exception is `404.html` (see the launch checklist above).

## Deploy

Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages or GitHub Pages). There's no build command, and the publish directory is the repository root.
