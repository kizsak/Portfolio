/* =========================================================
   Portfolio Carousel + Caption + Card Click Safety
   Works with:
   - .carousel-image (one should have .active initially)
   - .carousel-btn.prev / .carousel-btn.next (buttons)
   - #image-caption OR #image-description (caption target)
========================================================= */

(function () {
  "use strict";

  function initCardClickSafety() {
    // Only enable on pages that actually have the card grid
    const cardGrid = document.querySelector(".card-grid");
    if (!cardGrid) return;

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const link = card.querySelector("a");
      if (!link) return;

      card.style.cursor = "pointer";

      card.addEventListener("click", (e) => {
        // If user clicked an actual interactive element, do nothing
        const interactive = e.target.closest("a, button, input, textarea, select, label");
        if (interactive) return;

        link.click();
      });
    });
  }

  function initCarousel() {
    const images = Array.from(document.querySelectorAll(".carousel-image"));
    if (images.length === 0) return; // no carousel on this page

    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");

    // Caption target: support either ID
    const captionEl =
      document.querySelector("#image-caption") ||
      document.querySelector("#image-description");

    let index = Math.max(0, images.findIndex((img) => img.classList.contains("active")));
    if (index === -1) index = 0;

    // Ensure only one active at start
    images.forEach((img, i) => img.classList.toggle("active", i === index));

    function getCaptionFor(img) {
      // Prefer explicit data-caption, fallback to alt, fallback to empty
      return img.getAttribute("data-caption") || img.getAttribute("alt") || "";
    }

    function render() {
      images.forEach((img, i) => img.classList.toggle("active", i === index));

      if (captionEl) {
        const text = getCaptionFor(images[index]);
        captionEl.textContent = text;
        // Make sure it’s visible (helps if older CSS hid it)
        captionEl.style.display = "block";
        captionEl.style.opacity = "1";
        captionEl.style.visibility = "visible";
      }
    }

    function next() {
      index = (index + 1) % images.length;
      render();
    }

    function prev() {
      index = (index - 1 + images.length) % images.length;
      render();
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // Keyboard support (optional but nice)
    document.addEventListener("keydown", (e) => {
      // Don’t hijack typing in inputs
      const tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;

      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Initial paint
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCardClickSafety();
    initCarousel();
    console.log("✔ carousel + captions initialized");
  });
})();
