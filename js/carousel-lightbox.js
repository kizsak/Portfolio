/* =========================================================
   Portfolio Site JavaScript
   - Card hover safety
   - Future-ready (lightbox / carousel hooks)
========================================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------
       Card click safety (entire card is clickable)
    --------------------------------------------- */
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const link = card.querySelector("a");

      if (!link) return;

      card.addEventListener("click", (e) => {
        // Prevent double navigation
        if (e.target.tagName.toLowerCase() !== "a") {
          link.click();
        }
      });

      card.style.cursor = "pointer";
    });

    /* ---------------------------------------------
       Console sanity check (remove later if desired)
    --------------------------------------------- */
    console.log("✔ site.js loaded successfully");
  });
})();
