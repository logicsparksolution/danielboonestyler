/* ==========================================================================
   DANIEL BOONE'S GRILL & TAVERN - INTERACTIVE JAVASCRIPT
   Features: Carousel Slider, Sticky Header, Mobile Drawer,
             Image Fallback, Menu Lightbox, Scroll Effects
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  
  /* --- 1. Sticky Navbar Transition --- */
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* --- 2. Mobile Drawer Navigation --- */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinksList');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileBtn.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars-staggered"></i>';
    });

    document.addEventListener('click', function (e) {
      if (!mobileBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
      }
    });
  }

  /* --- 3. Hero Carousel Slider Engine --- */
  const slides = document.querySelectorAll('.slider-item');
  const indicators = document.querySelectorAll('.indicator-pill');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const carouselWrap = document.getElementById('heroCarousel');
  let currentIndex = 0;
  let timer = null;
  const count = slides.length;

  function renderSlide(index) {
    if (count === 0) return;
    currentIndex = (index + count) % count;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    indicators.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function slideNext() {
    renderSlide(currentIndex + 1);
  }

  function slidePrev() {
    renderSlide(currentIndex - 1);
  }

  function startSliderTimer() {
    stopSliderTimer();
    if (count > 1) {
      timer = setInterval(slideNext, 5500);
    }
  }

  function stopSliderTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slidePrev();
      startSliderTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slideNext();
      startSliderTimer();
    });
  }

  indicators.forEach(pill => {
    pill.addEventListener('click', function () {
      const target = parseInt(this.getAttribute('data-slide-target'), 10);
      renderSlide(target);
      startSliderTimer();
    });
  });

  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', stopSliderTimer);
    carouselWrap.addEventListener('mouseleave', startSliderTimer);

    // Touch Swipe for mobile devices
    let touchStart = 0;
    let touchEnd = 0;

    carouselWrap.addEventListener('touchstart', e => {
      touchStart = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselWrap.addEventListener('touchend', e => {
      touchEnd = e.changedTouches[0].screenX;
      if (touchEnd < touchStart - 40) {
        slideNext();
        startSliderTimer();
      } else if (touchEnd > touchStart + 40) {
        slidePrev();
        startSliderTimer();
      }
    }, { passive: true });
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      slidePrev();
      startSliderTimer();
    } else if (e.key === 'ArrowRight') {
      slideNext();
      startSliderTimer();
    }
  });

  startSliderTimer();

  /* --- 4. Back to Top Button --- */
  const backTop = document.getElementById('backTopBtn');
  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- 5. Lightbox Modal for Menu sheets --- */
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const zoomTriggers = document.querySelectorAll('.menu-sheet-frame');

  if (lightbox && lightboxImg && zoomTriggers.length > 0) {
    zoomTriggers.forEach(frame => {
      frame.addEventListener('click', function () {
        const img = this.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('open');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () {
        lightbox.classList.remove('open');
      });
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
      }
    });
  }

  /* --- 6. Robust Image Fallback Handler --- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      if (!this.dataset.fallback && this.getAttribute('src') && this.getAttribute('src').startsWith('images/')) {
        this.dataset.fallback = 'true';
        this.src = 'https://danielboonestyler.com/' + this.getAttribute('src');
      }
    });
  });

  /* --- 7. Initialize AOS Animation Library if available --- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

});
