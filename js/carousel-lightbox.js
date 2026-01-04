/* =========================================================
   Portfolio Site JS
   - Lightbox for any image with: [data-lightbox]
   - Carousel for any element with: [data-carousel]
========================================================= */

(function () {
  "use strict";

  // ---------------------------
  // Lightbox (single reusable modal)
  // ---------------------------

  const lightbox = createLightbox();

  function createLightbox() {
    const root = document.createElement("div");
    root.className = "lightbox";
    root.setAttribute("aria-hidden", "true");

    root.innerHTML = `
      <div class="lightbox-dialog" role="dialog" aria-modal="true">
        <div class="lightbox-toolbar">
          <div class="lightbox-title" data-lb-title>Preview</div>
          <div class="lb-actions">
            <button class="lb-btn" type="button" data-lb-prev aria-label="Previous">‹</button>
            <button class="lb-btn" type="button" data-lb-next aria-label="Next">›</button>
            <button class="lb-btn" type="button" data-lb-close aria-label="Close">✕</button>
          </div>
        </div>
        <div class="lightbox-body">
          <img alt="" data-lb-img />
        </div>
      </div>
    `;

    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(root);
    });

    const imgEl = root.querySelector("[data-lb-img]");
    const titleEl = root.querySelector("[data-lb-title]");
    const btnClose = root.querySelector("[data-lb-close]");
    const btnPrev = root.querySelector("[data-lb-prev]");
    const btnNext = root.querySelector("[data-lb-next]");

    let currentGroup = [];
    let currentIndex = 0;
    let lastFocusEl = null;

    function openWith(group, index) {
      currentGroup = group;
      currentIndex = index;
      lastFocusEl = document.activeElement;

      render();
      root.classList.add("is-open");
      root.setAttribute("aria-hidden", "false");

      // Focus close for accessibility
      btnClose.focus();
      document.addEventListener("keydown", onKeyDown);
    }

    function close() {
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      document.removeEventListener("keydown", onKeyDown);
      if (lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
    }

    function render() {
      if (!currentGroup.length) return;

      const el = currentGroup[currentIndex];
      const src = el.getAttribute("data-full") || el.getAttribute("src");
      const title = el.getAttribute("data-title") || el.getAttribute("alt") || "Preview";

      imgEl.src = src;
      imgEl.alt = title;
      titleEl.textContent = title;
    }

    function prev() {
      if (!currentGroup.length) return;
      currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
      render();
    }

    function next() {
      if (!currentGroup.length) return;
      currentIndex = (currentIndex + 1) % currentGroup.length;
      render();
    }

    function onKeyDown(e) {
      if (!root.classList.contains("is-open")) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    // Click outside dialog closes
    root.addEventListener("click", (e) => {
      if (e.target === root) close();
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", prev);
    btnNext.addEventListener("click", next);

    return { openWith, close, prev, next };
  }

  // ---------------------------
  // Bind lightbox to any [data-lightbox] images
  // Grouping:
  // - If images share the same data-group value, they become a set
  // - Otherwise each image is its own group (or page-wide group if you want)
  // ---------------------------

  function initLightbox() {
    const imgs = Array.from(document.querySelectorAll("img[data-lightbox]"));
    if (!imgs.length) return;

    // build groups by data-group
    const groups = new Map();
    imgs.forEach((img) => {
      const g = img.getAttribute("data-group") || "__default__";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(img);
    });

    imgs.forEach((img) => {
      img.addEventListener("click", () => {
        const g = img.getAttribute("data-group") || "__default__";
        const groupArr = groups.get(g) || [img];
        const index = groupArr.indexOf(img);
        lightbox.openWith(groupArr, Math.max(index, 0));
      });
    });
  }

  // ---------------------------
  // Carousel
  // Works for each [data-carousel]
  // Requires .car-track inside, and buttons with [data-dir="-1"] / [data-dir="1"]
  // ---------------------------

  function initCarousels() {
    const carousels = Array.from(document.querySelectorAll("[data-carousel]"));
    if (!carousels.length) return;

    carousels.forEach((carousel) => {
      const track = carousel.querySelector(".car-track");
      if (!track) return;

      const slides = Array.from(track.children);
      if (slides.length <= 1) return;

      let index = 0;

      const btnPrev = carousel.querySelector('[data-dir="-1"]');
      const btnNext = carousel.querySelector('[data-dir="1"]');

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(${-index * 100}%)`;
      }

      if (btnPrev) btnPrev.addEventListener("click", () => goTo(index - 1));
      if (btnNext) btnNext.addEventListener("click", () => goTo(index + 1));

      // Allow swipe on mobile (simple)
      let startX = null;
      carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      carousel.addEventListener("touchend", (e) => {
        if (startX == null) return;
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        startX = null;

        if (Math.abs(dx) < 35) return;
        if (dx > 0) goTo(index - 1);
        else goTo(index + 1);
      });

      goTo(0);
    });
  }

  // ---------------------------
  // Boot
  // ---------------------------

  document.addEventListener("DOMContentLoaded", () => {
    initLightbox();
    initCarousels();
  });
})();
