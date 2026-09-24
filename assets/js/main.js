/* Scatto — small progressive enhancements. Every page works without this file. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  // Product gallery: thumbnails swap the main image
  var mainImg = document.querySelector(".gallery-main img");
  document.querySelectorAll(".gallery-thumbs button").forEach(function (btn, _, all) {
    btn.addEventListener("click", function () {
      if (!reduceMotion) {
        mainImg.addEventListener("load", function () {
          mainImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: "ease-out" });
        }, { once: true });
      }
      mainImg.src = btn.dataset.src;
      mainImg.removeAttribute("srcset");
      mainImg.alt = btn.querySelector("img").alt;
      all.forEach(function (b) { b.setAttribute("aria-current", String(b === btn)); });
    });
  });

  // Product gallery: hover magnifies the main image around the cursor
  var galleryMain = document.querySelector(".gallery-main");
  if (galleryMain && window.matchMedia("(hover: hover)").matches) {
    galleryMain.addEventListener("mouseenter", function () {
      // Drop srcset so the zoom uses the 1200px file, not the 600px one
      mainImg.removeAttribute("srcset");
    });
    galleryMain.addEventListener("mousemove", function (e) {
      var box = galleryMain.getBoundingClientRect();
      var x = ((e.clientX - box.left) / box.width) * 100;
      var y = ((e.clientY - box.top) / box.height) * 100;
      mainImg.style.transformOrigin = x + "% " + y + "%";
    });
  }

  // Photos rise into view as they scroll in. Only JS hides them, so they always show without it.
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });

    document.querySelectorAll(".tile-grid img, .wide-stack img, .rounded-img, .photo-band img").forEach(function (img) {
      // Side-by-side tiles arrive one after the other
      var i = Array.prototype.indexOf.call(img.parentNode.children, img);
      img.style.setProperty("--reveal-delay", (i % 2) * 0.12 + "s");
      img.classList.add("reveal");
      revealer.observe(img);
    });
  }

  // Contact form
  var form = document.querySelector(".js-inquiry-form");
  if (!form) return;

  // Pre-select fields from the URL: ?product=<kit-slug>&type=<inquiry-type>
  // (set by the "Inquire" / "Gift & corporate" links across the site)
  var params = new URLSearchParams(window.location.search);
  [["product", "kit"], ["type", "type"]].forEach(function (pair) {
    var value = params.get(pair[0]);
    var select = form.querySelector("select[name='" + pair[1] + "']");
    if (value && select && select.querySelector("option[value='" + CSS.escape(value) + "']")) {
      select.value = value;
    }
  });

  var status = form.querySelector(".form-status");
  var submit = form.querySelector("[type='submit']");

  function show(message, ok) {
    status.textContent = message;
    status.className = "form-status " + (ok ? "is-success" : "is-error");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      show("The contact form isn't connected yet. Set the Formspree form ID in contact.html.", false);
      return;
    }
    submit.disabled = true;
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show("Thank you! Your message is on its way. We'll be in touch soon.", true);
      })
      .catch(function () {
        show("Sorry, something went wrong sending your message. Please try again in a moment.", false);
      })
      .finally(function () {
        submit.disabled = false;
      });
  });
})();
