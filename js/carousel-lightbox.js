(function () {
  const images = document.querySelectorAll('.carousel-image');
  if (!images.length) return;

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const captionEl = document.getElementById('image-caption');
  const descriptionEl = document.getElementById('image-description');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  let current = 0;

  function updateTextFromImage(index) {
    const img = images[index];
    if (!img) return;
    if (captionEl) captionEl.innerHTML = img.dataset.caption || '';
    if (descriptionEl) descriptionEl.innerHTML = img.dataset.description || '';
  }

  function showSlide(index) {
    images[current].classList.remove('active');
    current = (index + images.length) % images.length;
    images[current].classList.add('active');
    updateTextFromImage(current);
  }

  images.forEach(img => img.classList.remove('active'));
  images[0].classList.add('active');
  updateTextFromImage(0);

  if (prevBtn) prevBtn.addEventListener('click', e => {
    e.preventDefault();
    showSlide(current - 1);
  });

  if (nextBtn) nextBtn.addEventListener('click', e => {
    e.preventDefault();
    showSlide(current + 1);
  });

  function openLightbox(img) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
  }

  images.forEach(img => {
    img.addEventListener('click', () => {
      if (img.classList.contains('active')) openLightbox(img);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
