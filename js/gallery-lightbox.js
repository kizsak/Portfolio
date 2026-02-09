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
