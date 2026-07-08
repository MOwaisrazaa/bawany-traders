/* ==========================================
   Bawany Traders - Premium JavaScript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const header = document.querySelector('header');
  const categoryBtn = document.getElementById('categoryBtn');
  const categoryMenu = document.getElementById('categoryMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const cartBadge = document.getElementById('cartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterInput = document.getElementById('newsletterInput');

  // Slider Elements
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000; // 6 seconds

  // State Variables
  let cartCount = 0;
  let wishlistCount = 0;

  // ==========================================
  // 1. Sticky Header & Shadow on Scroll
  // ==========================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-fixed');
    } else {
      header.classList.remove('header-fixed');
    }
  });

  // ==========================================
  // 2. Category Dropdown Toggle (Desktop)
  // ==========================================
  if (categoryBtn && categoryMenu) {
    categoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      categoryMenu.classList.toggle('active');
    });

    // Close category menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
        categoryMenu.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 3. Mobile Navigation Drawer
  // ==========================================
  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // ==========================================
  // 4. Hero Slider / Carousel Logic
  // ==========================================
  const showSlide = (index) => {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Set current active slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  };

  const nextSlide = () => {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  const prevSlide = () => {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  const startSlideShow = () => {
    stopSlideShow();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopSlideShow = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  // Dot Navigation Click Handler
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startSlideShow(); // Reset autoplay timer
    });
  });

  // Arrows Click Handlers
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startSlideShow(); // Reset autoplay timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startSlideShow(); // Reset autoplay timer
    });
  }

  // Start initial slideshow
  if (slides.length > 0) {
    startSlideShow();
  }

  // ==========================================
  // 5. Toast Notification System
  // ==========================================
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  const showToast = (message, iconClass = 'fa-check-circle') => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fas ${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Fade out and remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 2700);
  };

  // ==========================================
  // 6. "Add to Cart" Interaction
  // ==========================================
  const cartButtons = document.querySelectorAll('.add-to-cart-btn, .slide-cta');
  
  cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Determine product title
      let productTitle = "Premium Item";
      const card = btn.closest('.product-card');
      
      if (card) {
        const titleEl = card.querySelector('.product-title');
        if (titleEl) productTitle = titleEl.textContent.trim();
      } else if (btn.classList.contains('slide-cta')) {
        // Hero button product title
        productTitle = "Trending Smartwatch";
      }

      // Update cart count
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = 'flex';
        
        // Visual micro-animation feedback (bounce)
        cartBadge.parentElement.classList.add('animate-bounce');
        setTimeout(() => {
          cartBadge.parentElement.classList.remove('animate-bounce');
        }, 500);
      }

      // Show professional toast notification
      showToast(`Added "${productTitle}" to cart!`, 'fa-shopping-cart');
    });
  });

  // ==========================================
  // 7. "Wishlist" Toggle Logic
  // ==========================================
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');

  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isAdding = !btn.classList.contains('active');
      btn.classList.toggle('active');

      const card = btn.closest('.product-card');
      let productTitle = "Premium Gadget";
      if (card) {
        const titleEl = card.querySelector('.product-title');
        if (titleEl) productTitle = titleEl.textContent.trim();
      }

      if (isAdding) {
        wishlistCount++;
        showToast(`Saved "${productTitle}" to Wishlist!`, 'fa-heart');
      } else {
        wishlistCount = Math.max(0, wishlistCount - 1);
        showToast(`Removed "${productTitle}" from Wishlist.`, 'fa-heart-broken');
      }

      // Update wishlist badge
      if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
        wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
      }
    });
  });

  // ==========================================
  // 8. Newsletter Form Submission & Validation
  // ==========================================
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterInput.value.trim();

      if (!email) {
        showToast("Please enter your email address.", "fa-exclamation-circle");
        return;
      }

      // Simple regex for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address.", "fa-exclamation-triangle");
        return;
      }

      showToast("Thank you for subscribing to our newsletter!", "fa-paper-plane");
      newsletterInput.value = "";
    });
  }

  // ==========================================
  // 9. Extra UI Micro-animations Style Inject
  // ==========================================
  // Inject animation keyframes for cart badge bounce
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.25); }
    }
    .animate-bounce i {
      animation: bounce 0.4s ease;
    }
  `;
  document.head.appendChild(style);
});
