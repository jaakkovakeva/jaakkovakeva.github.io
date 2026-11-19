// Keep the footer year current. All page content works without JavaScript.
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const mobileMenu = document.querySelector(".site-header .mobile-menu");

if (mobileMenu instanceof HTMLDetailsElement) {
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !mobileMenu.open) {
      return;
    }

    mobileMenu.open = false;
    mobileMenu.querySelector("summary")?.focus();
  });
}

const galleryBackLink = document.querySelector(".site-header .gallery-back-link");

if (galleryBackLink instanceof HTMLAnchorElement) {
  const updateGalleryBackLink = () => {
    const activeBackLink = document.querySelector(".photo-series-view:target > .photo-series-close");

    if (activeBackLink instanceof HTMLAnchorElement) {
      galleryBackLink.href = activeBackLink.href;
      galleryBackLink.setAttribute("aria-label", activeBackLink.textContent.trim());
      galleryBackLink.hidden = false;
      document.body.classList.add("gallery-back-link-in-header");
    } else {
      galleryBackLink.hidden = true;
      document.body.classList.remove("gallery-back-link-in-header");
    }
  };

  window.addEventListener("hashchange", updateGalleryBackLink);
  window.addEventListener("pageshow", updateGalleryBackLink);
  updateGalleryBackLink();
}

const photoLightbox = document.querySelector(".photo-lightbox");
const photoLightboxImage = photoLightbox?.querySelector(".photo-lightbox-image");
const photoLightboxClose = photoLightbox?.querySelector(".photo-lightbox-close");
const photoLightboxPrevious = photoLightbox?.querySelector(".photo-lightbox-previous");
const photoLightboxNext = photoLightbox?.querySelector(".photo-lightbox-next");

if (
  photoLightbox instanceof HTMLDialogElement &&
  photoLightboxImage instanceof HTMLImageElement &&
  photoLightboxClose instanceof HTMLButtonElement &&
  photoLightboxPrevious instanceof HTMLButtonElement &&
  photoLightboxNext instanceof HTMLButtonElement
) {
  let galleryImages = [];
  let currentImageIndex = 0;

  const showImage = (index) => {
    if (galleryImages.length === 0) {
      return;
    }

    currentImageIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentImageIndex];
    photoLightboxImage.src = image.src;
    photoLightboxImage.alt = image.alt;
  };

  document.querySelectorAll(".photo-lightbox-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const image = trigger.querySelector("img");
      const gallery = trigger.closest(".photo-series-view");

      if (!(image instanceof HTMLImageElement) || !gallery) {
        return;
      }

      galleryImages = Array.from(gallery.querySelectorAll(".photo-lightbox-trigger img"));
      currentImageIndex = galleryImages.indexOf(image);
      showImage(currentImageIndex);
      photoLightbox.showModal();
    });
  });

  photoLightboxPrevious.addEventListener("click", () => showImage(currentImageIndex - 1));
  photoLightboxNext.addEventListener("click", () => showImage(currentImageIndex + 1));
  photoLightboxImage.addEventListener("click", () => showImage(currentImageIndex + 1));

  document.addEventListener("keydown", (event) => {
    if (!photoLightbox.open) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      photoLightbox.close();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(currentImageIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentImageIndex + 1);
    }
  });

  photoLightboxClose.addEventListener("click", () => photoLightbox.close());
  photoLightbox.addEventListener("click", (event) => {
    if (event.target === photoLightbox) {
      photoLightbox.close();
    }
  });
}
