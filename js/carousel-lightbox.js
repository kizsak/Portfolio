/* =========================================================
   site.js — shared JS for all pages (landing + carousel)
   ========================================================= */

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initLandingIntro();
    initImageCarousels();
  });

  // ---------------------------
  // Landing intro video logic
  // ---------------------------
  function initLandingIntro() {
    const video = document.getElementById("introVideo");
    if (!video) return; // not the landing page

    const skipBtn = document.getElementById("skipBtn");
    const enterBtn = document.getElementById("enterBtn");
    const statusText = document.getElementById("statusText");
    const tapToPlay = document.getElementById("tapToPlay");

    // Optional centered button (safe if missing)
    const centerEnter = document.getElementById("centerEnter");
    const centerEnterLink = document.getElementById("centerEnterLink");

    // Destination
    const PORTFOLIO_URL = "https://kizsak.github.io/Portfolio/navigation.html";

    // Wire links safely
    if (enterBtn) enterBtn.href = PORTFOLIO_URL;
    if (centerEnterLink) centerEnterLink.href = PORTFOLIO_URL;

    const revealEnter = () => {
      document.body.classList.add("intro-finished");

      if (enterBtn) enterBtn.setAttribute("aria-hidden", "false");
      if (centerEnter) centerEnter.setAttribute("aria-hidden", "false");

      if (statusText) statusText.textContent = "Intro finished.";
    };

    video.addEventListener("ended", revealEnter);

    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        try { video.pause(); } catch (e) {}
        revealEnter();
      });
    }

    // Autoplay fallback
    const tryPlay = video.play();
    if (tryPlay && typeof tryPlay.then === "function") {
      tryPlay.catch(() => {
        if (tapToPlay) tapToPlay.style.display = "inline-flex";
        if (statusText) statusText.textContent = "Tap to play the intro.";
      });
    }

    if (tapToPlay) {
      tapToPlay.addEventListener("click", async () => {
        tapToPlay.style.display = "none";
        if (statusText) statusText.textContent = "Intro playing…";
        try {
          await video.play();
        } catch (e) {
          revealEnter();
        }
      });
    }
  }

  // ---------------------------
  // Image carousel logic
  // ---------------------------
  function initImageCarousels() {
    const carousels = document.querySelectorAll(".img-carousel");
    if (!carousels.length) return;

    carousels.forEach((root) => {
      const slides = Array.from(root.querySelectorAll(".img-slide"));
      if (!slides.length) return;

      const prevBtn = root.querySelector('[data-dir="prev"]');
      const nextBtn = root.querySelector('[data-dir="next"]');
      const dotsWrap = root.querySelector(".img-carousel__dots");

      let index = slides.findIndex((s) => s.classList.contains("is-active"));
      if (index < 0) index = 0;

      // Build dots (if container exists)
      let dots = [];
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        dots = slides.map((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "img-carousel__dot" + (i === index ? " is-active" : "");
          b.setAttribute("aria-label", `Go to image ${i + 1}`);
          b.addEventListener("click", () => go(i));
          dotsWrap.appendChild(b);
          return b;
        });
      }
