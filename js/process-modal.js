document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("process-modal");
  const bodyEl = document.getElementById("process-body");
  const closeBtn = document.querySelector(".process-close");
  const buttons = document.querySelectorAll(".process-btn[data-process]");

  if (!modal || !bodyEl) return;

  function openModal(id) {
    const source = document.getElementById(id);
    bodyEl.innerHTML = source ? source.innerHTML : "<p>No process notes found.</p>";
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  buttons.forEach(btn => {
    btn.type = "button";
    btn.addEventListener("click", () => {
      openModal(btn.dataset.process);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {
    if (!e.target.closest(".process-content")) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});
