(function () {
  "use strict";

  function init() {
    const carouselSection = document.querySelector(".gallery-carousel");
    const essayBody = document.getElementById("essay-body");

    // This log is KEY: if you don't see it in DevTools -> Console,
    // you're not loading the updated file.
    console.log("✅ carousel-lightbox.js running", {
      hasCarousel: !!carouselSection,
      hasEssayBody: !!essayBody
    });

    if (!carouselSection) return;

    const images = Array.from(carouselSection.querySelectorAll(".carousel-image"));
    if (!images.length) return;

    const prevBtn = carouselSection.querySelector(".carousel-btn.prev");
    const nextBtn = carouselSection.querySelector(".carousel-btn.next");

    const titleEl = document.getElementById("image-caption");
    const descEl  = document.getElementById("image-description");

    const essayPanel = document.querySelector(".essay-panel");

    let index = images.findIndex(img => img.classList.contains("active"));
    if (index < 0) index = 0;

    function getTitleHTML(img) {
      return img.getAttribute("data-caption") || img.getAttribute("alt") || "";
    }

    function getShortHTML(img) {
      const direct = img.getAttribute("data-description");
      if (direct) return direct;

      const templateId = img.getAttribute("data-desc");
      if (templateId) {
        const tpl = document.getElementById(templateId);
        if (tpl && tpl.tagName.toLowerCase() === "template") return tpl.innerHTML;
      }
      return "";
    }

    function getEssayHTML(img) {
      const essayId = img.getAttribute("data-essay");
      if (!essayId) return "";

      const tpl = document.getElementById(essayId);
      if (tpl && tpl.tagName.toLowerCase() === "template") return tpl.innerHTML;

      console.warn("⚠️ Missing essay template:", essayId);
      return "";
    }

    function show(i) {
      index = (i + images.length) % images.length;

      images.forEach((img, idx) => img.classList.toggle("active", idx === index));
      const img = images[index];

      if (titleEl) titleEl.innerHTML = getTitleHTML(img);

      if (descEl) {
        const shortHTML = getShortHTML(img);
        descEl.innerHTML = shortHTML;
        descEl.style.display = shortHTML ? "block" : "none";
      }

      if (essayBody) {
        const essayHTML = getEssayHTML(img);
        essayBody.innerHTML = essayHTML;

        if (essayPanel) {
          essayPanel.style.display = essayHTML ? "block" : "none";
        }
      }
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    nextBtn && nextBtn.addEventListener("click", next);
    prevBtn && prevBtn.addEventListener("click", prev);

    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    show(index);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
