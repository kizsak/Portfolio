(function () {
  "use strict";

  function initCarousel() {
    const images = Array.from(document.querySelectorAll(".carousel-image"));
    if (images.length === 0) return;

    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");

    const titleEl = document.querySelector("#image-caption");      // H2
    const descEl  = document.querySelector("#image-description");  // DIV or P

    // NEW: Essay panel outlet (optional; only exists on comp-design.html)
    const essayEl = document.querySelector("#essay-body");         // DIV

    let index = images.findIndex(img => img.classList.contains("active"));
    if (index < 0) index = 0;

    function getTitleHTML(img) {
      return img.getAttribute("data-caption") || img.getAttribute("alt") || "";
    }

    function getTemplateHTML(templateId) {
      if (!templateId) return "";
      const tpl = document.getElementById(templateId);
      if (tpl && tpl.tagName && tpl.tagName.toLowerCase() === "template") {
        return tpl.innerHTML;
      }
      return "";
    }

    function getDescriptionHTML(img) {
      // Style A: direct HTML description
      const direct = img.getAttribute("data-description");
      if (direct) return direct;

      // Style B: template reference (data-desc="desc-...")
      const templateId = img.getAttribute("data-desc");
      if (templateId) return getTemplateHTML(templateId);

      return "";
    }

    // NEW: Long-form essay HTML (data-essay="essay-...")
    function getEssayHTML(img) {
      const essayId = img.getAttribute("data-essay");
      if (essayId) return getTemplateHTML(essayId);
      return "";
    }

    function show(i) {
      index = (i + images.length) % images.length;

      images.forEach((img, idx) => {
        img.classList.toggle("active", idx === index);
      });

      const img = images[index];

      // Caption
      if (titleEl) {
        titleEl.innerHTML = getTitleHTML(img);
        titleEl.style.display = "block";
      }

      // Short description (left panel)
      if (descEl) {
        const shortHTML = getDescriptionHTML(img);
        descEl.innerHTML = shortHTML;
        descEl.style.display = shortHTML ? "block" : "none";
        descEl.style.opacity = "1";
        descEl.style.visibility = "visible";
      }

      // Essay panel (bottom) — only updates if the page has #essay-body
      if (essayEl) {
        const essayHTML = getEssayHTML(img);

        // If there's no essay for this image, clear/hide the panel content
        essayEl.innerHTML = essayHTML || "";

        // Optional: hide the whole panel if empty (requires .essay-panel wrapper)
        const panel = document.querySelector(".essay-panel");
        if (panel) {
          panel.style.display = essayHTML ? "block" : "none";
        }
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
