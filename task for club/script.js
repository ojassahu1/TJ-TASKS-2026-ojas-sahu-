document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const navToggle = document.getElementById('nav-toggle');
  const navBurger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const header = document.querySelector('.nav');

  function openMobileNav() {
    if (navToggle) navToggle.checked = true;
    if (navBurger) navBurger.classList.add('is-active');
    if (navOverlay) navOverlay.classList.add('is-active');
    document.body.classList.add('nav-locked');
  }

  function closeMobileNav() {
    if (navToggle) navToggle.checked = false;
    if (navBurger) navBurger.classList.remove('is-active');
    if (navOverlay) navOverlay.classList.remove('is-active');
    document.body.classList.remove('nav-locked');
  }

  if (navToggle) {
    navToggle.addEventListener('change', () => {
      if (navToggle.checked) {
        openMobileNav();
      } else {
        closeMobileNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 700) {
          closeMobileNav();
        }
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle && navToggle.checked) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700 && navToggle && navToggle.checked) {
      closeMobileNav();
    }
  });

  const handleNavScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  const sections = document.querySelectorAll('section[id]');
  const allNavAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allNavAnchors.forEach(a => {
            if (a.getAttribute('href') === `#${id}`) {
              a.classList.add('active');
            } else {
              a.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(sec => scrollSpyObserver.observe(sec));
  }

  const statNumbers = document.querySelectorAll('.stat-num');
  let hasAnimatedStats = false;

  function animateCounters() {
    if (hasAnimatedStats) return;
    hasAnimatedStats = true;

    statNumbers.forEach(stat => {
      const originalText = stat.textContent.trim();
      const hasPlus = originalText.includes('+');
      const targetValue = parseInt(originalText.replace(/\D/g, ''), 10);

      if (isNaN(targetValue)) return;

      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = Math.floor(easeOut * targetValue);

        stat.textContent = `${currentValue}${hasPlus ? '+' : ''}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = `${targetValue}${hasPlus ? '+' : ''}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  } else {
    animateCounters();
  }

  const pricingToggleBtn = document.getElementById('billing-toggle');
  const planCards = document.querySelectorAll('.pricing-grid .plan');

  const pricingData = {
    monthly: [
      { price: '₹1,000', period: '/month', cycle: 'Billed monthly' },
      { price: '₹5,500', period: '/month', cycle: 'Billed monthly' },
      { price: '₹10,000', period: '/month', cycle: 'Billed monthly' }
    ],
    yearly: [
      { price: '₹800', period: '/month', cycle: 'Billed annually (₹9,600/yr)' },
      { price: '₹4,400', period: '/month', cycle: 'Billed annually (₹52,800/yr)' },
      { price: '₹8,000', period: '/month', cycle: 'Billed annually (₹96,000/yr)' }
    ]
  };

  let isYearly = false;

  if (pricingToggleBtn) {
    pricingToggleBtn.addEventListener('click', () => {
      isYearly = !isYearly;
      pricingToggleBtn.setAttribute('aria-checked', String(isYearly));
      pricingToggleBtn.classList.toggle('active', isYearly);

      const labelMonthly = document.getElementById('label-monthly');
      const labelYearly = document.getElementById('label-yearly');
      if (labelMonthly) labelMonthly.classList.toggle('active', !isYearly);
      if (labelYearly) labelYearly.classList.toggle('active', isYearly);

      const currentTier = isYearly ? pricingData.yearly : pricingData.monthly;

      planCards.forEach((card, index) => {
        const priceEl = card.querySelector('.plan-price');
        const cycleEl = card.querySelector('.plan-cycle');
        if (priceEl && currentTier[index]) {
          priceEl.classList.add('price-fade');
          setTimeout(() => {
            priceEl.innerHTML = `${currentTier[index].price}<span>${currentTier[index].period}</span>`;
            if (cycleEl) cycleEl.textContent = currentTier[index].cycle;
            priceEl.classList.remove('price-fade');
          }, 150);
        }
      });
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-grid a');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryImagesList = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImagesList.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || 'Gym photograph'
      });
    }

    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  function showLightboxImage(idx) {
    if (!lightboxImg || galleryImagesList.length === 0) return;
    if (idx < 0) idx = galleryImagesList.length - 1;
    if (idx >= galleryImagesList.length) idx = 0;
    currentGalleryIndex = idx;

    const data = galleryImagesList[currentGalleryIndex];
    lightboxImg.classList.add('lightbox-fade');

    setTimeout(() => {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      if (lightboxCaption) lightboxCaption.textContent = data.alt;
      if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImagesList.length}`;
      lightboxImg.classList.remove('lightbox-fade');
    }, 120);
  }

  function openLightbox(index) {
    if (!lightboxModal) return;
    showLightboxImage(index);
    lightboxModal.classList.add('is-active');
    document.body.classList.add('modal-locked');
    lightboxModal.setAttribute('aria-hidden', 'false');
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-active');
    document.body.classList.remove('modal-locked');
    lightboxModal.setAttribute('aria-hidden', 'true');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(currentGalleryIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(currentGalleryIndex + 1));

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentGalleryIndex + 1);
  });

  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        showLightboxImage(currentGalleryIndex - 1);
      } else {
        showLightboxImage(currentGalleryIndex + 1);
      }
    }
  }

  const bookingModal = document.getElementById('booking-modal');
  const bookingModalClose = document.getElementById('booking-modal-close');
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  const planSelectInput = document.getElementById('booking-plan-select');
  const modalTitle = document.getElementById('booking-modal-title');
  const modalSuccessBtn = document.getElementById('booking-success-close');

  function openBookingModal(planName = 'Free Day Pass') {
    if (!bookingModal) return;

    if (modalTitle) {
      modalTitle.textContent = planName === 'Free Day Pass'
        ? 'Book Your Free Gym Session'
        : `Start Your ${planName} Plan`;
    }

    if (planSelectInput) {
      planSelectInput.value = planName;
    }

    if (bookingForm) bookingForm.style.display = 'block';
    if (bookingSuccess) bookingSuccess.style.display = 'none';

    bookingModal.classList.add('is-active');
    document.body.classList.add('modal-locked');
    bookingModal.setAttribute('aria-hidden', 'false');

    const firstInput = bookingModal.querySelector('input[type="text"], input[type="email"]');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('is-active');
    document.body.classList.remove('modal-locked');
    bookingModal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-open-modal') || 'Free Day Pass';
      openBookingModal(plan);
    });
  });

  if (bookingModalClose) bookingModalClose.addEventListener('click', closeBookingModal);
  if (modalSuccessBtn) modalSuccessBtn.addEventListener('click', closeBookingModal);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal || e.target.classList.contains('booking-backdrop')) {
        closeBookingModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('is-active')) {
      closeBookingModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('booking-name');
      const planVal = planSelectInput ? planSelectInput.value : 'Pass';
      const userName = nameInput && nameInput.value ? nameInput.value.trim() : 'Athlete';

      const successName = document.getElementById('success-user-name');
      const successPlan = document.getElementById('success-user-plan');

      if (successName) successName.textContent = userName;
      if (successPlan) successPlan.textContent = planVal;

      bookingForm.style.display = 'none';
      if (bookingSuccess) {
        bookingSuccess.style.display = 'block';
      }

      bookingForm.reset();
    });
  }

  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.program-card, .plan, .gallery-grid a, .section-head, .stat'
    );

    revealTargets.forEach(el => el.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealTargets.forEach(el => revealObserver.observe(el));
  }
});
