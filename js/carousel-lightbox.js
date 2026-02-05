(() => {
  const carousels = document.querySelectorAll(".img-carousel");
  if (!carousels.length) return;

  carousels.forEach((root) => {
    const slides = Array.from(root.querySelectorAll(".img-slide"));
    const prevBtn = root.querySelector('[data-dir="prev"]');
    const nextBtn = root.querySelector('[data-dir="next"]');
    const dotsWrap = root.querySelector(".img-carousel__dots");

    let index = slides.findIndex(s => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    // Build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "img-carousel__dot" + (i === index ? " is-active" : "");
      b.ariaLabel = `Go to image ${i + 1}`;
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
      return b;
    });

     const video = document.getElementById("introVideo");
const skipBtn = document.getElementById("skipBtn");
const enterBtn = document.getElementById("enterBtn");
const statusText = document.getElementById("statusText");
const tapToPlay = document.getElementById("tapToPlay");

/* ADD THESE */
const centerEnter = document.getElementById("centerEnter");
const centerEnterLink = document.getElementById("centerEnterLink");

    
    function go(next) {
      slides[index].classList.remove("is-active");
      dots[index]?.classList.remove("is-active");

      index = (next + slides.length) % slides.length;

      slides[index].classList.add("is-active");
      dots[index]?.classList.add("is-active");
    }

    prevBtn?.addEventListener("click", () => go(index - 1));
    nextBtn?.addEventListener("click", () => go(index + 1));

    // Keyboard (optional)
    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });
  });
})();
