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

  // Videos: a corner button pauses, plays and replays them
  document.querySelectorAll("video").forEach(function (video) {
    var button = video.parentNode.querySelector(".video-toggle");
    if (!button) return;
    function sync() {
      var state = video.ended ? "ended" : video.paused ? "paused" : "playing";
      button.dataset.state = state;
      button.setAttribute("aria-label", { ended: "Replay video", paused: "Play video", playing: "Pause video" }[state]);
    }
    ["play", "pause", "ended"].forEach(function (type) { video.addEventListener(type, sync); });
    button.addEventListener("click", function () {
      // play() restarts an ended video from the beginning
      if (video.paused) video.play().catch(function () {});
      else video.pause();
    });
    sync();
    button.hidden = false;
  });

  // Videos marked data-play-in-view play once when mostly on screen, then rest on the open case.
  // With reduced motion they keep the open-case poster until someone presses play.
  if (!reduceMotion && "IntersectionObserver" in window) {
    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.play().catch(function () {}); // e.g. iOS Low Power Mode blocks autoplay
        player.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    document.querySelectorAll("video[data-play-in-view]").forEach(function (video) {
      // The first frame shows until it plays, so the start looks seamless
      video.poster = video.dataset.startPoster;
      player.observe(video);
    });
  }

  // Product gallery: thumbnails swap the main image, or show the video
  var mainImg = document.querySelector(".gallery-main img");
  var galleryVideo = document.querySelector(".gallery-main video");
  document.querySelectorAll(".gallery-thumbs button").forEach(function (btn, _, all) {
    btn.addEventListener("click", function () {
      all.forEach(function (b) { b.setAttribute("aria-current", String(b === btn)); });
      var showVideo = btn.hasAttribute("data-video");
      mainImg.parentNode.classList.toggle("is-video", showVideo);
      if (showVideo) {
        galleryVideo.currentTime = 0;
        galleryVideo.play().catch(function () {});
        return;
      }
      if (galleryVideo) galleryVideo.pause();
      if (!reduceMotion) {
        mainImg.addEventListener("load", function () {
          mainImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: "ease-out" });
        }, { once: true });
      }
      mainImg.src = btn.dataset.src;
      mainImg.removeAttribute("srcset");
      mainImg.alt = btn.querySelector("img").alt;
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
})();
