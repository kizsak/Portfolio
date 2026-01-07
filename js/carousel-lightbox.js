/* =========================================================
   carousel-lightbox.js
   - Carousel (prev/next + keyboard)
   - Caption + short description (tools)
   - Essay panel ("Process Notes") via data-essay templates
   - Lightbox (click image to open)
========================================================= */

(function () {
  "use strict";

  function initCarouselAndPanels() {
    // Scope everything to the first carousel on the page
    const carouselSection = document.querySelector(".gallery-carousel");
    if (!carouselSection) return;

    const images = Array.from(carouselSection.querySelectorAll(".carousel-image"));
    if (images.length === 0) return;

    const prevBtn = carouselSection.querySelector(".carousel-btn.prev");
    const nextBtn = carouselSection.querySelector(".carousel-btn.next");

    // Left panel
    const titleEl = document.querySelector("#image-caption");
    const descEl  = document.querySelector("#image-description");

    // Bottom essay panel
    const essayPanel = document.querySelector(".essay-panel");
    const essayBody  = document.querySelector("#essay-body");

    let index = images.findIndex(img => img.classList.contains("active"));
    if (index < 0) index = 0;

    function getTitleHTML(img) {
      return img.getAttribute("data-caption") || img.getAttribute("alt") || "";
    }

    function getShortHTML(img) {
      // Style A: direct HTML description
      const direct = img.getAttribute("data-description");
      if (direct) return direct;

      // Style B: short template reference (your data-desc)
      const templateId = img.getAttribute("data-desc");
      if (templateId) {
        const tpl = document.getElementById(templateId);
        if (tpl && tpl.tagName.toLowerCase() === "template") {
          return tpl.innerHTML;
        }
      }

      return "";
    }

    function getEssayHTML(img) {
      const essayId = img.getAttribute("data-essay");
      if (!essayId) return "";

      const tpl = document.getElementById(essayId);
      if (tpl && tpl.tagName.toLowerCase() === "template") {
        return tpl.innerHTML;
      }
      return "";
    }

    function show(i) {
      index = (i + images.length) % images.length;

      images.forEach((img, idx) => {
        img.classList.toggle("active", idx === index);
      });

      const img = images[index];

      // Title (left)
      if (titleEl) {
        titleEl.innerHTML = getTitleHTML(img);
        titleEl.style.display = "block";
      }

      // Short tools line (left)
      if (descEl) {
        const shortHTML = getShortHTML(img);
        descEl.innerHTML = shortHTML;
        descEl.style.display = shortHTML ? "block" : "none";
      }

      // Essay panel (bottom)
      if (essayBody) {
        const essayHTML = getEssayHTML(img);
        essayBody.innerHTML = essayHTML;

        // hide panel if no essay exists for this image
        if (essayPanel) {
          essayPanel.style.display = essayHTML ? "block" : "none";
        }
      }
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // Keyboard support (avoid when typing)
    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // ----------------------------
    // Lightbox (optional)
    // ----------------------------
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.querySelector(".lightbox-close");

    function openLightbox(img) {
      if (!lightbox || !lightboxImg) return;

      const full = img.getAttribute("data-full") || img.getAttribute("src");
      lightboxImg.src = full || "";
      lightboxImg.alt = img.getAttribute("alt") || "";

      if (lightboxCaption) {
        lightboxCaption.innerHTML = getTitleHTML(img) || "";
      }

      lightbox.classList.add("open");
      document.body.classList.add("no-scroll");
      lightbox.setAttribute("aria-hidden", "false");
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("open");
      document.body.classList.remove("no-scroll");
      lightbox.setAttribute("aria-hidden", "true");
      if (lightboxImg) lightboxImg.src = "";
      if (lightboxCaption) lightboxCaption.innerHTML = "";
    }

    // Click active image to open
    images.forEach((img) => {
      img.addEventListener("click", () => openLightbox(img));
      img.style.cursor = "zoom-in";
    });

    // Close interactions
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    // Initial render
    show(index);
  }

  document.addEventListener("DOMContentLoaded", initCarouselAndPanels);
})();
