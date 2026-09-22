/* Scatto — small progressive enhancements. Every page works without this file. */
(function () {
  "use strict";

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
      mainImg.src = btn.dataset.src;
      mainImg.removeAttribute("srcset");
      mainImg.alt = btn.querySelector("img").alt;
      all.forEach(function (b) { b.setAttribute("aria-current", String(b === btn)); });
    });
  });

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
