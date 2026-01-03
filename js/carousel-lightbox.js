(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    const images = Array.from(document.querySelectorAll(".carousel-image"));
    if (!images.length) return;

    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const captionEl = document.getElementById("image-caption");
    const descriptionEl = document.getElementById("image-description");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

    let current = 0;

    function renderDescriptionFromTemplate(templateId) {
      if (!templateId || !descriptionEl) return false;
      const tpl = document.getElementById(templateId);
      if (!tpl) return false;

      // Works for <template> and for normal elements
      if (tpl.tagName.toLowerCase() === "template" && tpl.content) {
        descriptionEl.innerHTML = tpl.innerHTML;
      } else {
        descriptionEl.innerHTML = tpl.innerHTML;
      }
      return true;
    }

    function updateTextFromImage(index) {
      const img = images[index];
      if (!img) return;

      if (captionEl) captionEl.innerHTML = img.dataset.caption || "";

      // Mode 1: direct HTML string in data-description (your other pages)
      if (img.dataset.description) {
        if (descriptionEl) descriptionEl.innerHTML = img.dataset.description;
        return;
      }

      // Mode 2: template reference in data-desc (your comp-design page)
      if (img.dataset.desc) {
        const ok = renderDescriptionFromTemplate(img.dataset.desc);
        if (!ok && descriptionEl) descriptionEl.innerHTML = "";
        return;
      }

      // If neither exists:
      if (descriptionEl) descriptionEl.innerHTML = "";
    }

    function showSlide(index) {
      images[current].classList.remove("active");
      current = (index + images.length) % images.length;
      images[current].classList.add("active");
      updateTextFromImage(current);
    }

    // Ensure only one active on load
    images.forEach((img) => img.classList.remove("active"));
    images[0].classList.add("active");
    updateTextFromImage(0);

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showSlide(current - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showSlide(current + 1);
      });
    }

    function openLightboxFromImage(img) {
      if (!lightbox || !lightboxImg) return;

      const fullSrc = img.dataset.full || img.src;
      lightboxImg.src = fullSrc;
      lightboxImg.alt = img.alt || "";

      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    }

    function closeLightbox() {
      if (!lightbox || !lightboxImg) return;

      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");

      // avoid flashing old image next open
      lightboxImg.src = "";
      lightboxImg.alt = "";
    }

    // Clicking the active image opens lightbox
    images.forEach((img) => {
      img.addEventListener("click", () => {
        if (img.classList.contains("active")) openLightboxFromImage(img);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showSlide(current - 1);
      if (e.key === "ArrowRight") showSlide(current + 1);
    });
  });
})();
