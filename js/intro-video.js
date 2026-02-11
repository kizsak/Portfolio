(() => {
  const video = document.getElementById("introVideo");
  const tapBtn = document.getElementById("tapToPlay");
  const tapWrap = document.querySelector(".tap-to-play");

  if (!video) {
    console.warn("introVideo not found");
    return;
  }

  async function playVideo(source) {
    try {
      await video.play();
      if (tapWrap) tapWrap.style.display = "none";
      console.log("✅ video playing via", source);
    } catch (err) {
      console.warn("⚠️ play blocked via", source, err);
      if (tapWrap) tapWrap.style.display = "flex";
    }
  }

  // Try autoplay when enough data is available
  video.addEventListener("canplay", () => playVideo("canplay"), { once: true });

  // Tap fallback
  tapBtn?.addEventListener("click", () => playVideo("tap button"));

  // If the user clicks the video itself, play
  video.addEventListener("click", () => playVideo("video click"));
})();

const video = document.getElementById("introVideo");
const enterBtn = document.getElementById("enterBtn");

video.addEventListener("ended", () => {
  enterBtn.classList.add("show");
});
