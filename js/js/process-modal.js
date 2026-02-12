(function () {
  "use strict";

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("process-modal");
    const closeEl = qs(".process-close", modal);
    const bodyEl = document.getElementById("process-body");
    const buttons = qsa(".process-btn[data-process]");

    if (!modal || !closeEl || !bodyEl) {
      console.warn("Process modal: required elements not found.");
      return;
    }

    function openModal(processId) {
      const source = document.getElementById(processId);

      if (!source) {
        bodyEl.innerHTML = `<p><em>No process notes found for:</em> <code>${processId}</code></p>`;
      } else {
        bodyEl.innerHTML = source.innerHTML;
      }

      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    buttons.forEach((btn) => {
      btn.setAttribute("type", "button"); // safety
      btn.addEventListener("click", () => openModal(btn.dataset.process));
    });

    closeEl.addEventListener("click", closeModal);

    // click outside the content closes
    modal.addEventListener("click", (e) => {
      const content = qs(".process-content", modal);
      if (content && !content.contains(e.target)) closeModal();
    });

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  });
})();
