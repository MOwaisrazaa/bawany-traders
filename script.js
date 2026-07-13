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

  // Particle burst function for Add to Cart
  const createParticleBurst = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const colors = ['#00969A', '#00F2FE', '#2ECC71', '#0B1325', '#FFA500'];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('span');
      particle.className = 'cart-particle';
      document.body.appendChild(particle);

      // Random size
      const size = Math.random() * 8 + 4; // 4px to 12px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random colors
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Set start position
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Random target position (circle around click point)
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      // Start animation
      particle.style.animation = 'particleExplode 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards';

      // Remove particle after animation ends
      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    }
  };

  // ==========================================
  // 6. "Add to Cart" Interaction
  // ==========================================
  const cartButtons = document.querySelectorAll('.add-to-cart-btn, .slide-cta, .btn-rv-add-to-cart');
  
  cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Trigger particles burst
      createParticleBurst(e);
      
      // Determine product title
      let productTitle = "Premium Item";
      const card = btn.closest('.product-card, .recently-viewed-card, .wishlist-card');
      
      if (card) {
        const titleEl = card.querySelector('.product-title, h5');
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
        
        // Visual micro-animation feedback (bounce & pulse)
        cartBadge.classList.add('cart-badge-bump');
        cartBadge.parentElement.classList.add('animate-bounce');
        setTimeout(() => {
          cartBadge.classList.remove('cart-badge-bump');
          cartBadge.parentElement.classList.remove('animate-bounce');
        }, 500);
      }

      // Show professional toast notification
      showToast(`Added "${productTitle}" to cart!`, 'fa-shopping-cart');
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
  // ==========================================
  // 10. Upgraded Category Slider Logic
  // ==========================================
  const catSlider = document.getElementById('categorySlider');
  const catPrevBtn = document.getElementById('catPrevBtn');
  const catNextBtn = document.getElementById('catNextBtn');
  const catTrack = document.querySelector('.category-track');

  if (catSlider && catTrack) {
    let isHovered = false;
    let scrollSpeed = 0.8; // Scroll speed in pixels per frame
    let autoScrollActive = true;
    let autoScrollTimeout = null;

    // requestAnimationFrame scroll loop
    const scrollStep = () => {
      if (autoScrollActive && !isHovered) {
        catSlider.scrollLeft += scrollSpeed;
        
        // Loop back seamlessly when scrolling past the first group
        const halfWidth = catTrack.scrollWidth / 2;
        if (catSlider.scrollLeft >= halfWidth) {
          catSlider.scrollLeft = 0;
        }
      }
      requestAnimationFrame(scrollStep);
    };

    // Initialize auto-scrolling loop
    requestAnimationFrame(scrollStep);

    // Pause auto-scrolling on hover or mobile touches
    catSlider.addEventListener('mouseenter', () => { isHovered = true; });
    catSlider.addEventListener('mouseleave', () => { isHovered = false; });
    catSlider.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    catSlider.addEventListener('touchend', () => { isHovered = false; }, { passive: true });

    // Helper to temporarily pause auto-scroll after manual navigation clicks
    const pauseAutoScrollTemporarily = () => {
      autoScrollActive = false;
      if (autoScrollTimeout) clearTimeout(autoScrollTimeout);
      autoScrollTimeout = setTimeout(() => {
        autoScrollActive = true;
      }, 3000); // Resume auto-scrolling after 3 seconds of inactivity
    };

    // Prev Navigation Arrow Click
    if (catPrevBtn) {
      catPrevBtn.addEventListener('click', () => {
        pauseAutoScrollTemporarily();
        // If we are at the very beginning, wrap back to the midpoint seamlessly first
        if (catSlider.scrollLeft <= 5) {
          catSlider.scrollLeft = catTrack.scrollWidth / 2;
        }
        catSlider.scrollBy({ left: -220, behavior: 'smooth' });
      });
    }

    // Next Navigation Arrow Click
    if (catNextBtn) {
      catNextBtn.addEventListener('click', () => {
        pauseAutoScrollTemporarily();
        // If we scroll past the midpoint, wrap back to 0 seamlessly first
        const halfWidth = catTrack.scrollWidth / 2;
        if (catSlider.scrollLeft >= halfWidth - 5) {
          catSlider.scrollLeft = 0;
        }
        catSlider.scrollBy({ left: 220, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 11. Deals Page Countdown & Notify Logic
  // ==========================================
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const dealsNotifyForm = document.getElementById('dealsNotifyForm');

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    // Set target date to 2 days, 12 hours, 45 minutes, 30 seconds from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 45);
    targetDate.setSeconds(targetDate.getSeconds() + 30);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (dealsNotifyForm) {
    dealsNotifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = dealsNotifyForm.querySelector('.notify-input');
      const email = emailInput.value.trim();
      if (email) {
        showToast(`Thank you! We will notify you at ${email}.`, 'fa-bell');
        emailInput.value = '';
      }
    });
  }

  // ==========================================
  // 12. Cart Page Interaction & Calculations
  // ==========================================
  const cartItemsList = document.getElementById('cartItemsList');
  if (cartItemsList) {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const selectAllCount = document.getElementById('selectAllCount');
    const cartHeaderCount = document.getElementById('cartHeaderCount');
    const summaryItemsCount = document.getElementById('summaryItemsCount');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const summaryTotal = document.getElementById('summaryTotal');
    const summarySaveAmount = document.getElementById('summarySaveAmount');
    const removeSelectedBtn = document.getElementById('removeSelectedBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');

    // Format price helper
    const formatPrice = (num) => {
      return "Rs. " + num.toLocaleString();
    };

    // Calculate Summary Values
    const updateCartTotals = () => {
      let totalOriginal = 0;
      let totalDiscounted = 0;
      let checkedItemsCount = 0;
      let totalItemsCount = 0;

      const activeItems = cartItemsList.querySelectorAll('.cart-item');
      totalItemsCount = activeItems.length;

      activeItems.forEach(item => {
        const checkbox = item.querySelector('.cart-item-checkbox');
        const qtyVal = parseInt(item.querySelector('.cart-qty-val').value) || 1;
        const price = parseInt(item.getAttribute('data-price')) || 0;
        const originalPrice = parseInt(item.getAttribute('data-original-price')) || price;

        // Calculate Subtotal for this item
        const itemSubtotal = price * qtyVal;
        item.querySelector('.cart-item-subtotal').textContent = formatPrice(itemSubtotal);

        if (checkbox && checkbox.checked) {
          totalOriginal += originalPrice * qtyVal;
          totalDiscounted += price * qtyVal;
          checkedItemsCount++;
        }
      });

      // Update counters
      if (cartHeaderCount) cartHeaderCount.textContent = totalItemsCount;
      if (selectAllCount) selectAllCount.textContent = totalItemsCount;
      if (summaryItemsCount) summaryItemsCount.textContent = checkedItemsCount;

      // Update summary box
      const discountAmount = totalOriginal - totalDiscounted;
      if (summarySubtotal) summarySubtotal.textContent = formatPrice(totalOriginal);
      if (summaryDiscount) summaryDiscount.textContent = discountAmount > 0 ? "- " + formatPrice(discountAmount) : "Rs. 0";
      if (summaryTotal) summaryTotal.textContent = formatPrice(totalDiscounted);
      if (summarySaveAmount) summarySaveAmount.textContent = formatPrice(discountAmount);

      // Check / uncheck select all checkbox
      if (selectAllCheckbox) {
        const checkedCheckboxes = cartItemsList.querySelectorAll('.cart-item-checkbox:checked');
        selectAllCheckbox.checked = (checkedCheckboxes.length === totalItemsCount) && (totalItemsCount > 0);
      }

      // Update header nav badge
      const headerCartBadge = document.getElementById('cartBadge');
      if (headerCartBadge) {
        headerCartBadge.textContent = totalItemsCount;
        headerCartBadge.style.display = totalItemsCount > 0 ? 'flex' : 'none';
      }
    };

    // Listen to changes inside items
    cartItemsList.addEventListener('change', (e) => {
      if (e.target.classList.contains('cart-item-checkbox')) {
        updateCartTotals();
      }
    });

    // Handle Quantity selectors
    cartItemsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-qty-btn');
      if (btn) {
        const item = btn.closest('.cart-item');
        const qtyInput = item.querySelector('.cart-qty-val');
        let qty = parseInt(qtyInput.value) || 1;

        if (btn.classList.contains('plus')) {
          qty++;
        } else if (btn.classList.contains('minus') && qty > 1) {
          qty--;
        }

        qtyInput.value = qty;
        updateCartTotals();
      }

      // Handle Delete button click
      const deleteBtn = e.target.closest('.cart-item-delete');
      if (deleteBtn) {
        const item = deleteBtn.closest('.cart-item');
        if (item) {
          const title = item.querySelector('.cart-item-title').textContent.trim();
          item.remove();
          showToast(`Removed "${title}" from cart.`, 'fa-trash-alt');
          updateCartTotals();
        }
      }
    });

    // Handle Select All click
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = cartItemsList.querySelectorAll('.cart-item-checkbox');
        checkboxes.forEach(cb => {
          cb.checked = selectAllCheckbox.checked;
        });
        updateCartTotals();
      });
    }

    // Handle Remove Selected click
    if (removeSelectedBtn) {
      removeSelectedBtn.addEventListener('click', () => {
        const checkedItems = cartItemsList.querySelectorAll('.cart-item:has(.cart-item-checkbox:checked)');
        if (checkedItems.length === 0) {
          showToast("No items selected to remove.", "fa-info-circle");
          return;
        }
        checkedItems.forEach(item => item.remove());
        showToast("Removed selected items from cart.", "fa-trash-alt");
        updateCartTotals();
      });
    }

    // Handle Clear Cart click
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        const allItems = cartItemsList.querySelectorAll('.cart-item');
        if (allItems.length === 0) {
          showToast("Your cart is already empty.", "fa-info-circle");
          return;
        }
        allItems.forEach(item => item.remove());
        showToast("Cleared all items from cart.", "fa-trash");
        updateCartTotals();
      });
    }

    // Initial load totals
    updateCartTotals();
  }

  // ==========================================
  // 13. Track Order Page Form Submission & Copy Logic
  // ==========================================
  const orderTrackForm = document.getElementById('orderTrackForm');
  const trackingResultContainer = document.getElementById('trackingResultContainer');

  if (orderTrackForm && trackingResultContainer) {
    orderTrackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Smooth scroll to container
      trackingResultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      showToast("Order status loaded successfully!", "fa-check-circle");
    });
  }

  const copyBtn = document.querySelector('.copy-order-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = "BT-73489216";
      navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = copyBtn.querySelector('i');
        icon.className = "fas fa-check";
        copyBtn.style.color = "#137333";
        showToast("Order ID copied to clipboard!", "fa-copy");
        
        setTimeout(() => {
          icon.className = "far fa-copy";
          copyBtn.style.color = "";
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ==========================================
  // 14. Dynamic Wishlist Card Action Logic
  // ==========================================
  const wishlistBadge = document.getElementById('wishlistBadge');
  let wishlistCount = parseInt(wishlistBadge ? wishlistBadge.textContent : '4') || 4;

  const initialWishlistedItems = [
    "airpods",
    "galaxywatch",
    "galaxy watch",
    "anker",
    "sony wf"
  ];

  const injectWishlistButtons = () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      if (card.querySelector('.wishlist-btn-corner')) return;

      const titleEl = card.querySelector('.product-title');
      const titleText = titleEl ? titleEl.textContent.toLowerCase() : "";
      
      const isWishlisted = initialWishlistedItems.some(item => titleText.includes(item)) || card.id === "prodAirpods" || card.id === "prodGalaxyWatch" || card.id === "prodSony" || card.id === "prodAnker";

      const btn = document.createElement('button');
      btn.className = `wishlist-btn-corner ${isWishlisted ? 'active' : ''}`;
      btn.setAttribute('aria-label', isWishlisted ? 'Remove from wishlist' : 'Add to wishlist');
      btn.innerHTML = `<i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>`;

      card.insertBefore(btn, card.firstChild);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isActive = btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        
        let pTitle = "Item";
        if (titleEl) {
          pTitle = titleEl.textContent.replace(/<[^>]*>/g, '').trim();
        }

        if (isActive) {
          icon.className = "fas fa-heart";
          btn.setAttribute('aria-label', 'Remove from wishlist');
          wishlistCount++;
          showToast(`Added "${pTitle}" to wishlist!`, 'fa-heart');
        } else {
          icon.className = "far fa-heart";
          btn.setAttribute('aria-label', 'Add to wishlist');
          wishlistCount = Math.max(0, wishlistCount - 1);
          showToast(`Removed "${pTitle}" from wishlist.`, 'fa-heart');
        }

        if (wishlistBadge) {
          wishlistBadge.textContent = wishlistCount;
          wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
        }
      });
    });
  };

  injectWishlistButtons();

  // --- Scroll Reveal Animation ---
  const revealOnScrollElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealOnScrollElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealOnScrollElements.forEach(el => revealObserver.observe(el));

    // Stagger delay for elements with data-stagger
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    staggerContainers.forEach(container => {
      const children = container.querySelectorAll('.reveal-on-scroll');
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 80}ms`;
      });
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealOnScrollElements.forEach(el => el.classList.add('reveal-visible'));
  }

  document.head.appendChild(style);
});
