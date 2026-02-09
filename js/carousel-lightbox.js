/* =========================================================
   carousel-lightbox.js — landing intro + simple carousel
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
    if (!video) return;

    const skipBtn = document.getElementById("skipBtn");
    const enterBtn = document.getElementById("enterBtn");
    const statusText = document.getElementById("statusText");
    const tapToPlay = document.getElementById("tapToPlay");

    const centerEnter = document.getElementById("centerEnter");
    const centerEnterLink = document.getElementById("centerEnterLink");

    const PORTFOLIO_URL = "https://kizsak.github.io/Portfolio/navigation.html";

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

    // Attempt autoplay; if blocked, show tap-to-play pill
    const attempt = video.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.catch(() => {
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
  // Simple carousel logic (optional)
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

      function go(next) {
        slides[index].classList.remove("is-active");
        if (dots[index]) dots[index].classList.remove("is-active");

        index = (next + slides.length) % slides.length;

        slides[index].classList.add("is-active");
        if (dots[index]) dots[index].classList.add("is-active");
      }

      prevBtn?.addEventListener("click", () => go(index - 1));
      nextBtn?.addEventListener("click", () => go(index + 1));

      // Make sure one slide is active
      slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("landing-video");
  const button = document.getElementById("enter-portfolio");

  if (!video || !button) return;

  // Safety: hide button on load
  button.classList.remove("is-visible");
  button.setAttribute("aria-hidden", "true");

  // Show button when video finishes
  video.addEventListener("ended", () => {
    button.classList.add("is-visible");
    button.setAttribute("aria-hidden", "false");
  });

  // Fallback: if autoplay fails or video is very short
  setTimeout(() => {
    if (video.paused || video.ended) {
      button.classList.add("is-visible");
      button.setAttribute("aria-hidden", "false");
    }
  }, 8000); // adjust to your video length if needed
});
