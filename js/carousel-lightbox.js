(function () {
  "use strict";

  function initCarousel() {
    const images = Array.from(document.querySelectorAll(".carousel-image"));
    if (images.length === 0) return;

    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");

    const titleEl = document.querySelector("#image-caption");      // H2
    const descEl  = document.querySelector("#image-description");  // DIV or P

    let index = images.findIndex(img => img.classList.contains("active"));
    if (index < 0) index = 0;

    function getTitleHTML(img) {
      // Prefer data-caption (may include <em>), fallback to alt
      return img.getAttribute("data-caption") || img.getAttribute("alt") || "";
    }

    function getDescriptionHTML(img) {
      // Style A: direct HTML description
      const direct = img.getAttribute("data-description");
      if (direct) return direct;

      // Style B: template reference (comp-design.html)
      const templateId = img.getAttribute("data-desc");
      if (templateId) {
        const tpl = document.getElementById(templateId);
        if (tpl && tpl.tagName.toLowerCase() === "template") {
          return tpl.innerHTML;
        }
      }

      return "";
    }

    function show(i) {
      index = (i + images.length) % images.length;

      images.forEach((img, idx) => {
        img.classList.toggle("active", idx === index);
      });

      const img = images[index];

      if (titleEl) {
        titleEl.innerHTML = getTitleHTML(img);
        titleEl.style.display = "block";
      }

      if (descEl) {
        descEl.innerHTML = getDescriptionHTML(img);
        descEl.style.display = "block";
        descEl.style.opacity = "1";
        descEl.style.visibility = "visible";
      }
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // keyboard support
    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    show(index);
  }

  document.addEventListener("DOMContentLoaded", initCarousel);
})();
