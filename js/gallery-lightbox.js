(() => {
  "use strict";

  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");
  const titleEl = document.getElementById("lightboxTitle");
  const metaEl = document.getElementById("lightboxMeta");
  const notesWrap = document.getElementById("lightboxNotesWrap");
  const notesEl = document.getElementById("lightboxNotes");

  if (!lightbox) return;

  function openLightbox({ full, title, meta, notes, alt }) {
    imgEl.src = full;
    imgEl.alt = alt || title || "Artwork";
    titleEl.textContent = title || "";
    metaEl.textContent = meta || "";

    const hasNotes = (notes || "").trim().length > 0;
    notesWrap.hidden = !hasNotes;
    if (hasNotes) notesEl.textContent = notes;

    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.setAttribute("aria-hidden", "true");
    imgEl.src = "";
    document.body.style.overflow = "";
  }

  // Open from any .gallery-thumb button
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-thumb");
    if (!btn) return;

    openLightbox({
      full: btn.dataset.full,
      title: btn.dataset.title,
      meta: btn.dataset.meta,
      notes: btn.dataset.notes,
      alt: btn.querySelector("img")?.alt
    });
  });

  // Close handlers
  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
      closeLightbox();
    }
  });
})();

(() => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const imgEl = lightbox.querySelector(".lightbox__img");
  const closeBtn = lightbox.querySelector(".lightbox__close");

  function open(src, alt = "") {
    imgEl.src = src;
    imgEl.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    imgEl.src = "";
    document.body.style.overflow = "";
  }

  // Click any image with data-zoom (or class "zoomable")
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-zoom], img.zoomable");
    if (!t) return;

    // If it's an <a>, prevent navigation
    if (t.tagName === "A") e.preventDefault();

    const src = t.dataset.zoom || t.src;
    const alt = t.alt || t.getAttribute("aria-label") || "";
    if (src) open(src, alt);
  });

  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
