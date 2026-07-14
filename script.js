/* ==========================================
   Bawany Traders - Premium JavaScript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader Controller ---
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloaderPercent');
  const statusEl = document.querySelector('.preloader-loading-text');
  
  if (preloader && percentEl) {
    let progress = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 25; // Update every 25ms
    const step = 100 / (duration / intervalTime);
    
    // Matrix Scrambler variables
    const titleEl = document.getElementById('preloaderTitle');
    const finalWord = "BAWANY";
    const chars = "$%#@&XZ9*?!=+{}[]<>";

    const scrambleWord = (progressPercent) => {
      if (!titleEl) return;
      const resolvedCount = Math.floor((progressPercent / 100) * (finalWord.length + 1));
      let displayWord = "";
      
      for (let i = 0; i < finalWord.length; i++) {
        if (i < resolvedCount) {
          displayWord += finalWord[i];
        } else {
          displayWord += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      titleEl.textContent = displayWord;
    };

    // Cursor spotlight coordinate tracking
    preloader.addEventListener('mousemove', (e) => {
      preloader.style.setProperty('--mx', `${e.clientX}px`);
      preloader.style.setProperty('--my', `${e.clientY}px`);
    });

    const statuses = [
      { limit: 30, text: 'Connecting to Server...' },
      { limit: 65, text: 'Loading Premium Catalog...' },
      { limit: 90, text: 'Polishing Interface...' },
      { limit: 100, text: 'Welcome to Bawany Traders' }
    ];

    const timer = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
      }
      
      const currentPercent = Math.floor(progress);
      percentEl.textContent = `${currentPercent}%`;
      
      // Scramble title text dynamically in sync with progress
      scrambleWord(currentPercent);
      
      // Update status text dynamically based on percentage
      const currentStatus = statuses.find(s => currentPercent <= s.limit);
      if (currentStatus && statusEl) {
        statusEl.textContent = currentStatus.text;
      }
    }, intervalTime);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('preloader-active');
    }, duration);
  }
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

  // ==========================================
  // 15. Dynamic Product Detail Page Logic
  // ==========================================
  
  const productsDatabase = {
    "galaxywatch": {
      id: "galaxywatch",
      name: "Samsung Galaxy Watch 6 Classic 47mm",
      category: "Smart Watches",
      brand: "Samsung",
      price: 50999,
      oldPrice: 60000,
      image: "images/prod-galaxywatch.png",
      thumbnails: ["images/prod-galaxywatch.png", "images/cat-watches.png", "images/logo.png"],
      badge: "-15%",
      sku: "BT-SG6C47",
      tags: "Smartwatch, Samsung, Wearable",
      colors: ["#0B1325", "#E2E8F0"],
      brief: "Experience the timeless styling of a rotating bezel paired with Samsung's most advanced health monitoring features, long battery life, and vibrant AMOLED display.",
      description: "<p>The Samsung Galaxy Watch 6 Classic features a sleek, iconic rotating bezel that makes navigation intuitive and fast. Its premium stainless steel body housing is designed to withstand daily wear while looking professional.</p><p>With advanced sleep tracking, personalized heart rate zones, and body composition analysis, it is more than just a watch—it's a comprehensive wellness companion. Enjoy seamless connectivity with your Galaxy smartphone, custom watch faces, and days of power on a single charge.</p>",
      specs: {
        "Display": "1.5-inch Super AMOLED (480x480)",
        "Battery Life": "Up to 40 hours (WOD)",
        "Water Resistance": "5ATM + IP68 / MIL-STD-810H",
        "Operating System": "Wear OS powered by Samsung",
        "Sensors": "BioActive Sensor, Temperature, Accelerometer, Barometer, Gyro, Light",
        "Connectivity": "Bluetooth 5.3, Wi-Fi 2.4+5GHz, GPS"
      },
      rating: 4.8,
      reviews: [
        { author: "Zain Ahmed", date: "June 14, 2026", rating: 5, body: "Absolutely love the rotating bezel! Battery lasts me a full day and a half with heavy usage. Health tracking is incredibly accurate.", verified: true },
        { author: "Ayesha Khan", date: "May 28, 2026", rating: 4, body: "Watch looks beautiful and premium on the wrist. The only downside is it takes a bit of time to charge, but otherwise perfect.", verified: true }
      ]
    },
    "airpods": {
      id: "airpods",
      name: "Apple AirPods Pro 2nd Generation (USB-C)",
      category: "Audio / Earbuds",
      brand: "Apple",
      price: 39999,
      oldPrice: 49999,
      image: "images/prod-airpods.png",
      thumbnails: ["images/prod-airpods.png", "images/cat-audio.png", "images/logo.png"],
      badge: "-20%",
      sku: "BT-AP2USBC",
      tags: "AirPods, Apple, Earbuds, ANC",
      colors: ["#FFFFFF"],
      brief: "Re-engineered for richer audio, next-level Active Noise Cancellation, and Adaptive Audio. Equipped with the H2 chip and a USB-C charging MagSafe case.",
      description: "<p>Apple AirPods Pro 2nd Gen features double the noise cancellation of their predecessor, allowing you to focus on your music or podcasts in noisy environments. The H2 chip delivers advanced audio performance, custom-engineered drivers, and low-distortion sound.</p><p>Equipped with touch control, you can adjust volume with a swipe, play/pause music, or switch between noise cancellation modes. Includes four sizes of silicone tips for a perfect acoustic seal and customizable comfort.</p>",
      specs: {
        "Audio Technology": "Apple H2 Chip, Custom High-Excursion Driver, ANC",
        "Noise Control": "Active Noise Cancellation, Transparency, Adaptive Audio",
        "Battery Life": "Up to 6 hours listening (30 hours with case)",
        "Charging Case": "MagSafe with Speaker and Lanyard Loop (USB-C)",
        "Connectivity": "Bluetooth 5.3, Apple U1 Chip in case",
        "Sensors": "Dual beamforming microphones, Skin-detect, Motion-detecting accelerometer"
      },
      rating: 4.9,
      reviews: [
        { author: "Bilal Malik", date: "July 02, 2026", rating: 5, body: "The ANC is unmatched. I use them on my daily commute and it completely blocks out the traffic noise. Worth every rupee.", verified: true },
        { author: "Sana Fatima", date: "June 20, 2026", rating: 5, body: "Excellent sound stage, deep bass, and crystal clear vocals. The MagSafe case with the speaker makes it easy to locate.", verified: true }
      ]
    },
    "sony": {
      id: "sony",
      name: "Sony WF-1000XM5 Wireless Earbuds",
      category: "Audio / Earbuds",
      brand: "Sony",
      price: 36999,
      oldPrice: 44999,
      image: "images/prod-sony.png",
      thumbnails: ["images/prod-sony.png", "images/cat-audio.png", "images/logo.png"],
      badge: "-18%",
      sku: "BT-WF1000XM5",
      tags: "Sony, Earbuds, Wireless, Audio",
      colors: ["#0F0F0F", "#F5F5DC"],
      brief: "Sony's best-ever noise cancelling earbuds, featuring three microphones on each earbud, dynamic sound quality, and ultra-clear call clarity.",
      description: "<p>The WF-1000XM5 earbuds reduce external noise over a wide bandwidth, from low to high frequencies. They contain two proprietary processors, the Integrated Processor V2 and High-Definition Noise Cancelling Processor QN2e, for exceptional performance.</p><p>With support for High-Resolution Audio Wireless and LDAC, you can listen to premium sound quality. The ergonomic design ensures a secure, comfortable fit for hours of continuous listening.</p>",
      specs: {
        "Driver Unit": "8.4 mm Dynamic Driver X",
        "Noise Cancelling": "Dual Processor ANC (V2 + QN2e)",
        "Audio Formats": "SBC, AAC, LDAC, LC3",
        "Bluetooth Version": "5.3 (LE Audio ready)",
        "Battery Life": "Up to 8 hours (24 hours total with case)",
        "Waterproof": "IPX4 equivalent protection"
      },
      rating: 4.7,
      reviews: [
        { author: "Usman Raza", date: "July 05, 2026", rating: 5, body: "Sound quality is superb, especially if you enable LDAC. The earbuds are smaller and much more comfortable than the XM4s.", verified: true },
        { author: "Hina Jamil", date: "June 11, 2026", rating: 4, body: "Excellent sound and noise cancellation. The foam tips take a bit of getting used to, but they create a great seal.", verified: true }
      ]
    },
    "anker": {
      id: "anker",
      name: "Anker 737 Power Bank (PowerCore 24K)",
      category: "Charging & Cables",
      brand: "Anker",
      price: 23499,
      oldPrice: 29999,
      image: "images/prod-anker.png",
      thumbnails: ["images/prod-anker.png", "images/cat-charging.png", "images/logo.png"],
      badge: "-22%",
      sku: "BT-A73724K",
      tags: "Anker, Powerbank, Charger, PowerCore",
      colors: ["#1C2833"],
      brief: "Ultra-high capacity 24,000mAh portable charger with 140W fast-charging capabilities, dynamic smart display, and active protection.",
      description: "<p>Equipped with Power Delivery 3.1 and bi-directional technology, the Anker 737 lets you charge your devices or recharge the power bank at a blazing fast 140W speed. It features a digital screen that displays input/output power, estimated recharge time, and battery health.</p><p>The massive 24,000mAh capacity provides multiple charges for smartphones, tablets, and even laptops, making it the perfect travel accessory.</p>",
      specs: {
        "Capacity": "24,000 mAh",
        "Max Output": "140W Power Delivery 3.1",
        "Ports": "2x USB-C (In/Out), 1x USB-A (Out)",
        "Digital Display": "Yes (Real-time wattage, temperature & battery health)",
        "Recharge Time": "Saves hours (Charges to 52% in 52 mins)",
        "Weight": "630g"
      },
      rating: 4.8,
      reviews: [
        { author: "Tariq Mahmood", date: "June 30, 2026", rating: 5, body: "This power bank is a beast! Charges my MacBook Pro at full speed. The smart display is incredibly helpful.", verified: true },
        { author: "Mariam Ali", date: "June 15, 2026", rating: 4, body: "A bit heavy to carry around in a pocket, but the charging speed and capacity are unmatched. Highly recommend for trips.", verified: true }
      ]
    },
    "baseuscable": {
      id: "baseuscable",
      name: "Baseus 100W USB-C to Lightning Cable (1m)",
      category: "Charging & Cables",
      brand: "Baseus",
      price: 1999,
      oldPrice: 2499,
      image: "images/cat-charging.png",
      thumbnails: ["images/cat-charging.png", "images/logo.png"],
      badge: "-17%",
      sku: "BT-B100W1M",
      tags: "Cable, Baseus, Fast Charge, Type-C",
      colors: ["#000000", "#FFFFFF", "#1B4F72"],
      brief: "Ultra-durable, premium nylon braided 100W high-speed charging and sync cable with a smart power display chip.",
      description: "<p>The Baseus 100W cable provides safe high-speed power delivery for your laptops, tablets, and flagship smartphones. Its durable nylon braid construction prevents tangles and offers tested resistance to over 10,000 bends.</p><p>Built-in smart chips dynamically monitor charging power and adjust current to protect your device battery health.</p>",
      specs: {
        "Connector Type": "USB Type-C to Lightning / Type-C",
        "Power Capacity": "100W max (20V/5A)",
        "Data Transfer Speed": "480 Mbps",
        "Material": "Aluminum Alloy + High-density Braided Nylon",
        "Cable Length": "1 meter / 3.3 feet"
      },
      rating: 4.6,
      reviews: [
        { author: "Sarmad Malik", date: "May 10, 2026", rating: 5, body: "Excellent cable, thick and sturdy. The digital display is cool to check if my phone is actually fast charging.", verified: true }
      ]
    },
    "jblspeaker": {
      id: "jblspeaker",
      name: "JBL Flip 6 Portable Bluetooth Speaker",
      category: "Audio / Earbuds",
      brand: "JBL",
      price: 20999,
      oldPrice: 24999,
      image: "images/cat-audio.png",
      thumbnails: ["images/cat-audio.png", "images/logo.png"],
      badge: "-16%",
      sku: "BT-JBLF6",
      tags: "Speaker, JBL, Bluetooth, Portable",
      colors: ["#1B2631", "#922B21", "#1E8449"],
      brief: "Powerful, loud sound with deep bass. IP67 waterproof and dustproof design, with up to 12 hours of playtime.",
      description: "<p>The JBL Flip 6 is engineered to deliver loud, crystal clear, powerful sound. Its 2-way speaker system features an optimized racetrack-shaped driver, a separate tweeter, and dual pumping bass radiators.</p><p>Easily link multiple speakers using PartyBoost, and stream wirelessly from your phone or tablet. Its rugged design ensures it is ready for pool parties, beach trips, and outdoor adventures.</p>",
      specs: {
        "Output Power": "20W RMS for woofer, 10W RMS for tweeter",
        "Frequency Response": "63 Hz - 20 kHz",
        "Bluetooth Version": "5.1",
        "Water & Dust Resistance": "IP67 waterproof and dustproof",
        "Battery Playtime": "Up to 12 hours (depending on volume)"
      },
      rating: 4.8,
      reviews: [
        { author: "Faisal Qureshi", date: "April 22, 2026", rating: 5, body: "Amazing sound for such a small speaker. Bass is punchy and deep. Battery easily lasts a full beach afternoon.", verified: true }
      ]
    },
    "xiaomicamera": {
      id: "xiaomicamera",
      name: "Xiaomi Smart Camera C300 1080p",
      category: "Smart Home",
      brand: "Xiaomi",
      price: 5699,
      oldPrice: 6999,
      image: "images/cat-smarthome.png",
      thumbnails: ["images/cat-smarthome.png", "images/logo.png"],
      badge: "-19%",
      sku: "BT-XSC300",
      tags: "Camera, Xiaomi, Security, Smart Home",
      colors: ["#FFFFFF"],
      brief: "360-degree pan-tilt-zoom home security camera with 1296p 2K resolution, AI human detection, and enhanced night vision.",
      description: "<p>The Xiaomi Smart Camera C300 uses ultra-clear HD technology to capture detailed images. Enjoy an upgraded visual experience with fully upgraded 2K ultra-clear HD technology.</p><p>It features a dual-motor pan-tilt-zoom design, with a 360° horizontal viewing angle and 108.5° vertical viewing angle, leaving zero blind spots. Support two-way voice calls in real time so you can chat with family whenever you want.</p>",
      specs: {
        "Resolution": "2304 x 1296 (2K HD)",
        "Lens Aperture": "F1.4 large aperture",
        "Video Encoding": "H.265",
        "Storage": "MicroSD card (up to 256 GB) & Cloud Storage",
        "Wireless Connectivity": "Wi-Fi IEEE 802.11 b/g/n 2.4GHz",
        "Compatible OS": "Android 8.0 or iOS 12.0 and above"
      },
      rating: 4.5,
      reviews: [
        { author: "Noman Shah", date: "July 01, 2026", rating: 4, body: "Great picture quality even in pitch dark. App setup was quick. Motion tracking works flawlessly.", verified: true }
      ]
    },
    "sonyheadphones": {
      id: "sonyheadphones",
      name: "Sony WH-CH720N Wireless Headphones",
      category: "Audio / Earbuds",
      brand: "Sony",
      price: 19799,
      oldPrice: 24999,
      image: "images/cat-audio.png",
      thumbnails: ["images/cat-audio.png", "images/logo.png"],
      badge: "-21%",
      sku: "BT-WHCH720N",
      tags: "Headphones, Sony, Noise Cancelling",
      colors: ["#0F0F0F", "#1F3A60"],
      brief: "Lightweight wireless over-ear noise cancelling headphones, featuring dual noise sensor technology and up to 35 hours battery life.",
      description: "<p>Enjoy comfort all day without the noise. With Dual Noise Sensor technology and the Integrated Processor V1, the WH-CH720N delivers Sony's lightweight ANC experience.</p><p>Its ergonomic design weighs only 192g, making it comfortable to wear for long listening sessions. Features precise voice pickup technology and wind noise reduction for crystal clear calls.</p>",
      specs: {
        "Headphone Type": "Closed, Dynamic Over-Ear",
        "Processor": "Integrated Processor V1",
        "Battery Life (ANC ON)": "Up to 35 hours",
        "Battery Charge Time": "Approx. 3.5 hours (Quick charge: 10m for 4.5h)",
        "Bluetooth Version": "5.2"
      },
      rating: 4.7,
      reviews: [
        { author: "Zeeshan Butt", date: "June 25, 2026", rating: 5, body: "Extremely comfortable and light. ANC is fantastic for office work, and the sound profile is very balanced.", verified: true }
      ]
    },
    "ugreenstand": {
      id: "ugreenstand",
      name: "UGREEN Adjustable Phone Stand",
      category: "Smart Home",
      brand: "UGREEN",
      price: 1549,
      oldPrice: 1759,
      image: "images/cat-smarthome.png",
      thumbnails: ["images/cat-smarthome.png", "images/logo.png"],
      badge: "-14%",
      sku: "BT-UGAPS",
      tags: "Stand, UGREEN, Holder, Metal",
      colors: ["#2C3E50", "#7F8C8D"],
      brief: "Multi-angle adjustable aluminum desktop stand for smartphones and mini tablets, featuring a fully foldable design.",
      description: "<p>This premium aluminum alloy phone stand provides stable support for your mobile devices while you watch videos, make video calls, or study. Non-slip silicone pads on the cradle and bottom protect your phone and table from scratches.</p><p>Foldable and compact, it fits easily into a pocket or bag, making it a perfect desk accessory on the go.</p>",
      specs: {
        "Material": "Premium Aluminum Alloy + Silicone Pads",
        "Adjustable Angle": "0 to 100 degrees",
        "Compatibility": "4 to 7.9 inch smartphones and e-readers",
        "Folded Size": "120mm x 100mm x 20mm",
        "Weight": "160g"
      },
      rating: 4.6,
      reviews: [
        { author: "Kamil Khan", date: "June 08, 2026", rating: 5, body: "Heavy metal stand, doesn't tip over. Ideal for placing my phone next to my monitor.", verified: true }
      ]
    },
    "ankercarcharger": {
      id: "ankercarcharger",
      name: "Anker PowerDrive III Car Charger 36W",
      category: "Car Accessories",
      brand: "Anker",
      price: 1999,
      oldPrice: 2499,
      image: "images/cat-car.png",
      thumbnails: ["images/cat-car.png", "images/logo.png"],
      badge: "-13%",
      sku: "BT-APD336",
      tags: "Car Charger, Anker, PowerDrive, Dual Port",
      colors: ["#1B2631"],
      brief: "Dual-port USB-C fast car charger featuring PowerIQ 3.0 technology for rapid charging on road trips.",
      description: "<p>PowerDrive III features dual 18W USB-C ports to charge two devices at high speed simultaneously. Our exclusive PowerIQ 3.0 technology delivers optimized high-speed charging to almost any mobile device.</p><p>Built with our MultiProtect safety system, it ensures complete protection for you and your car's electrical systems.</p>",
      specs: {
        "Total Wattage": "36W Output (18W per port)",
        "Input": "12V / 24V DC",
        "Output Ports": "2x USB-C PowerIQ 3.0 ports",
        "Safety Systems": "Overvoltage, temperature control, current regulation",
        "Body Material": "Scratch-resistant alloy casing"
      },
      rating: 4.8,
      reviews: [
        { author: "Kamran Ali", date: "May 15, 2026", rating: 5, body: "Charges my phone extremely fast while driving. Looks sleek and fits snugly in the cigarette lighter socket.", verified: true }
      ]
    },
    "logitechmouse": {
      id: "logitechmouse",
      name: "Logitech M331 Silent Wireless Mouse",
      category: "Smart Home",
      brand: "Logitech",
      price: 2199,
      oldPrice: 2699,
      image: "images/cat-smarthome.png",
      thumbnails: ["images/cat-smarthome.png", "images/logo.png"],
      badge: "-12%",
      sku: "BT-LM331",
      tags: "Mouse, Logitech, Silent, Wireless",
      colors: ["#0F0F0F", "#922B21", "#1B4F72"],
      brief: "Enjoy the sound of silence. Comfortable contoured wireless mouse featuring over 90% noise reduction on clicks.",
      description: "<p>The Logitech M331 Silent Plus provides advanced clicking comfort with quiet clicks. It offers over 90% noise reduction on the click sound while maintaining the same click feel.</p><p>Features a 24-month battery life with auto-sleep power management, a reliable 10-meter wireless connection, and advanced optical tracking for precise movements on almost any surface.</p>",
      specs: {
        "Connection Type": "2.4 GHz wireless USB Nano Receiver",
        "Wireless Range": "10 meters",
        "Silent Clicks": "Yes (Over 90% noise reduction)",
        "Battery Life": "Up to 24 months (1x AA battery included)",
        "DPI (Min/Max)": "1000 DPI tracking"
      },
      rating: 4.6,
      reviews: [
        { author: "Mustafa Sheikh", date: "May 02, 2026", rating: 5, body: "Unbelievably quiet! No clicking sound at all. Fits my hand perfectly. Battery has been running for a year already.", verified: true }
      ]
    }
  };

  const detailTitle = document.getElementById('productDetailTitle');
  if (detailTitle) {
    // 1. Get Product key from URL parameters
    const params = new URLSearchParams(window.location.search);
    const productKey = params.get('product') || 'galaxywatch';
    const product = productsDatabase[productKey] || productsDatabase['galaxywatch'];

    // 2. Populate DOM elements
    document.title = `${product.name} | Bawany Traders`;
    document.getElementById('breadcrumbCategory').textContent = product.category;
    document.getElementById('breadcrumbTitle').textContent = product.name;
    detailTitle.textContent = product.name;
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productBriefDesc').textContent = product.brief;
    document.getElementById('detailSKU').textContent = product.sku;
    document.getElementById('detailCategory').textContent = product.category;
    document.getElementById('detailTags').textContent = product.tags;
    document.getElementById('detailLongDesc').innerHTML = product.description;

    // Pricing
    const currentPriceEl = document.getElementById('detailPriceCurrent');
    const oldPriceEl = document.getElementById('detailPriceOld');
    const saveBadgeEl = document.getElementById('detailSaveBadge');
    
    currentPriceEl.textContent = `Rs. ${product.price.toLocaleString()}`;
    if (product.oldPrice && product.oldPrice > product.price) {
      oldPriceEl.textContent = `Rs. ${product.oldPrice.toLocaleString()}`;
      oldPriceEl.style.display = 'inline';
      
      const saveAmount = product.oldPrice - product.price;
      saveBadgeEl.textContent = `Save Rs. ${saveAmount.toLocaleString()}`;
      saveBadgeEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
      saveBadgeEl.style.display = 'none';
    }

    // Main image badge (NEW or discount percent)
    const detailBadgeEl = document.getElementById('productDetailBadge');
    if (product.badge) {
      detailBadgeEl.textContent = product.badge;
      detailBadgeEl.style.display = 'inline-block';
    } else {
      detailBadgeEl.style.display = 'none';
    }

    // Gallery images
    const mainImgEl = document.getElementById('mainDetailImage');
    mainImgEl.src = product.image;
    mainImgEl.alt = product.name;

    const thumbnailListEl = document.getElementById('thumbnailList');
    thumbnailListEl.innerHTML = '';
    product.thumbnails.forEach((thumbSrc, index) => {
      const thumbItem = document.createElement('div');
      thumbItem.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
      thumbItem.innerHTML = `<img src="${thumbSrc}" alt="Thumbnail ${index + 1}">`;
      thumbnailListEl.appendChild(thumbItem);

      thumbItem.addEventListener('click', () => {
        // Swap main image
        mainImgEl.src = thumbSrc;
        // Swap active class
        thumbnailListEl.querySelectorAll('.thumbnail-item').forEach(item => item.classList.remove('active'));
        thumbItem.classList.add('active');
      });
    });

    // Colors Rendering
    const colorsListEl = document.getElementById('colorOptionsList');
    const colorsGroupEl = document.getElementById('colorOptionsGroup');
    colorsListEl.innerHTML = '';
    if (product.colors && product.colors.length > 0) {
      colorsGroupEl.style.display = 'block';
      product.colors.forEach((colorCode, index) => {
        const swatch = document.createElement('span');
        swatch.className = `color-swatch ${index === 0 ? 'active' : ''}`;
        swatch.style.backgroundColor = colorCode;
        swatch.setAttribute('title', colorCode);
        colorsListEl.appendChild(swatch);

        swatch.addEventListener('click', () => {
          colorsListEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
        });
      });
    } else {
      colorsGroupEl.style.display = 'none';
    }

    // Specs rendering
    const specsBodyEl = document.getElementById('specsTableBody');
    specsBodyEl.innerHTML = '';
    for (const [key, value] of Object.entries(product.specs)) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${key}</td>
        <td>${value}</td>
      `;
      specsBodyEl.appendChild(row);
    }

    // Helper functions for review rendering
    const renderReviews = (reviews) => {
      const listEl = document.getElementById('reviewsList');
      listEl.innerHTML = '';
      if (reviews.length === 0) {
        listEl.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review this product!</p>';
        return;
      }

      reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
          if (i <= review.rating) {
            starsHTML += '<i class="fas fa-star"></i>';
          } else {
            starsHTML += '<i class="far fa-star"></i>';
          }
        }

        card.innerHTML = `
          <div class="review-card-header">
            <span class="review-card-author">
              ${review.author}
              ${review.verified ? '<i class="fas fa-check-circle verified-badge" title="Verified Buyer"></i>' : ''}
            </span>
            <span class="review-card-date">${review.date}</span>
          </div>
          <div class="review-card-rating">
            ${starsHTML}
          </div>
          <p class="review-card-body">${review.body}</p>
        `;
        listEl.appendChild(card);
      });
    };

    const updateReviewSummaries = (prod) => {
      const count = prod.reviews.length;
      document.getElementById('reviewsCountBadge').textContent = count;
      document.getElementById('ratingBreakdownCount').textContent = count;
      document.getElementById('detailRatingLink').textContent = `(${count} Customer Review${count !== 1 ? 's' : ''})`;

      // Calculate average
      let avg = 0;
      if (count > 0) {
        const total = prod.reviews.reduce((sum, r) => sum + r.rating, 0);
        avg = Math.round((total / count) * 10) / 10;
      } else {
        avg = prod.rating || 0.0;
      }
      
      document.getElementById('averageRatingNum').textContent = avg.toFixed(1);

      // Render average stars
      const avgStarsContainer1 = document.getElementById('detailRatingStars');
      const avgStarsContainer2 = document.getElementById('averageRatingStars');
      
      const generateStarsHTML = (rating) => {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.4 && rating % 1 <= 0.8;
        
        for (let i = 1; i <= 5; i++) {
          if (i <= fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
          } else if (i === fullStars + 1 && halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
          } else {
            starsHTML += '<i class="far fa-star"></i>';
          }
        }
        return starsHTML;
      };

      avgStarsContainer1.innerHTML = generateStarsHTML(avg);
      avgStarsContainer2.innerHTML = generateStarsHTML(avg);
    };

    // Initial reviews load
    renderReviews(product.reviews);
    updateReviewSummaries(product);

    // Dynamic Related Products Injection
    const renderRelatedProducts = () => {
      const gridEl = document.getElementById('relatedProductsGrid');
      gridEl.innerHTML = '';
      
      // Filter database for products in same category (exclude current)
      let related = Object.values(productsDatabase).filter(p => p.category === product.category && p.id !== product.id);
      
      // Fallback: If not enough related in category, add other categories
      if (related.length < 4) {
        const others = Object.values(productsDatabase).filter(p => p.id !== product.id && !related.includes(p));
        related = related.concat(others).slice(0, 4);
      } else {
        related = related.slice(0, 4);
      }

      related.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card reveal-on-scroll reveal-visible';
        card.setAttribute('id', `prodDetailRelated-${item.id}`);

        let starsHTML = '';
        const fullStars = Math.floor(item.rating);
        for (let i = 1; i <= 5; i++) {
          starsHTML += i <= fullStars ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }

        const badgeHTML = item.badge ? `<span class="product-badge" style="background-color: #E74C3C;">${item.badge}</span>` : '';
        const priceOldHTML = item.oldPrice ? `<span class="price-old">Rs. ${item.oldPrice.toLocaleString()}</span>` : '';

        card.innerHTML = `
          ${badgeHTML}
          <div class="product-img-wrapper">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="product-info">
            <h3 class="product-title"><a href="product-detail.html?product=${item.id}">${item.name}</a></h3>
            <div class="product-rating" style="color: #F1C40F; font-size: 0.8rem; margin-bottom: 8px;">
              ${starsHTML}
              <span style="color: var(--text-muted); font-size: 0.75rem; margin-left: 5px;">(${item.reviews.length})</span>
            </div>
            <div class="product-price">
              ${priceOldHTML}
              <span class="price-current" style="font-weight: 700; color: var(--primary-teal); font-size: 1rem;">Rs. ${item.price.toLocaleString()}</span>
            </div>
            <button class="btn add-to-cart-btn" style="width: 100%; border: none; padding: 11px 0; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; background-color: #0B1325; color: var(--white); transition: all 0.3s;" onmouseover="this.style.backgroundColor='var(--primary-teal)'" onmouseout="this.style.backgroundColor='#0B1325'">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        `;
        gridEl.appendChild(card);

        // Bind click listener for Add to Cart
        const addBtn = card.querySelector('.add-to-cart-btn');
        if (addBtn) {
          bindAddToCartToButton(addBtn);
        }
      });

      // Inject corner hearts
      injectWishlistButtons();
    };

    renderRelatedProducts();

    // 3. Detail Page Tab controls
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });

    // 4. Quantity increment/decrement box
    const qtyInput = document.getElementById('detailQtyInput');
    const qtyMinus = document.getElementById('qtyMinusBtn');
    const qtyPlus = document.getElementById('qtyPlusBtn');

    if (qtyInput && qtyMinus && qtyPlus) {
      qtyMinus.addEventListener('click', () => {
        let currentQty = parseInt(qtyInput.value) || 1;
        if (currentQty > 1) {
          qtyInput.value = currentQty - 1;
        }
      });

      qtyPlus.addEventListener('click', () => {
        let currentQty = parseInt(qtyInput.value) || 1;
        if (currentQty < 10) {
          qtyInput.value = currentQty + 1;
        }
      });
    }

    // 5. Add to Cart integration
    const detailAddToCartBtn = document.getElementById('addToCartActionBtn');
    if (detailAddToCartBtn) {
      detailAddToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Trigger particles
        createParticleBurst(e);

        const qty = parseInt(qtyInput.value) || 1;
        cartCount += qty;

        if (cartBadge) {
          cartBadge.textContent = cartCount;
          cartBadge.style.display = 'flex';
          
          cartBadge.classList.add('cart-badge-bump');
          cartBadge.parentElement.classList.add('animate-bounce');
          setTimeout(() => {
            cartBadge.classList.remove('cart-badge-bump');
            cartBadge.parentElement.classList.remove('animate-bounce');
          }, 500);
        }

        showToast(`Added ${qty} x "${product.name}" to cart!`, 'fa-shopping-cart');
      });
    }

    // 6. Corner Heart Button on Main Image
    const wishlistHeartBtn = document.getElementById('wishlistHeartBtn');
    if (wishlistHeartBtn) {
      // Set initial status based on wishlist count or product title
      const isWishlisted = initialWishlistedItems.some(item => product.name.toLowerCase().includes(item));
      if (isWishlisted) {
        wishlistHeartBtn.classList.add('active');
        wishlistHeartBtn.querySelector('i').className = 'fas fa-heart';
      }

      wishlistHeartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = wishlistHeartBtn.classList.toggle('active');
        const icon = wishlistHeartBtn.querySelector('i');

        if (isActive) {
          icon.className = 'fas fa-heart';
          wishlistCount++;
          showToast(`Added "${product.name}" to wishlist!`, 'fa-heart');
        } else {
          icon.className = 'far fa-heart';
          wishlistCount = Math.max(0, wishlistCount - 1);
          showToast(`Removed "${product.name}" from wishlist.`, 'fa-heart');
        }

        if (wishlistBadge) {
          wishlistBadge.textContent = wishlistCount;
          wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
        }
      });
    }

    // 7. Review submission form logic
    const reviewForm = document.getElementById('newReviewForm');
    if (reviewForm) {
      const starSelectors = document.querySelectorAll('#starRatingSelector i');
      let selectedRating = 5;
      
      starSelectors.forEach(star => {
        // Highlight initial 5 stars
        star.classList.add('active');
        star.classList.replace('far', 'fas');

        star.addEventListener('click', () => {
          selectedRating = parseInt(star.getAttribute('data-rating'));
          starSelectors.forEach((s, idx) => {
            if (idx < selectedRating) {
              s.classList.add('active');
              s.classList.replace('far', 'fas');
            } else {
              s.classList.remove('active');
              s.classList.replace('fas', 'far');
            }
          });
        });
      });

      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewName').value.trim();
        const email = document.getElementById('reviewEmail').value.trim();
        const text = document.getElementById('reviewText').value.trim();

        if (!name || !email || !text) {
          showToast("Please fill in all required fields.", "fa-exclamation-circle");
          return;
        }

        // Add to reviews list
        const newReview = {
          author: name,
          date: "Today",
          rating: selectedRating,
          body: text,
          verified: true
        };
        
        product.reviews.push(newReview);
        
        // Re-render reviews
        renderReviews(product.reviews);
        
        // Update counts
        updateReviewSummaries(product);
        
        // Reset form
        reviewForm.reset();
        selectedRating = 5;
        starSelectors.forEach(s => {
          s.classList.add('active');
          s.classList.replace('far', 'fas');
        });

        showToast("Thank you! Your review has been submitted successfully.", "fa-check-circle");
      });
    }
  }

  // Helper function to bind click handlers for dynamically rendered related product Add to Carts
  function bindAddToCartToButton(btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      createParticleBurst(e);
      let productTitle = "Premium Item";
      const card = btn.closest('.product-card');
      
      if (card) {
        const titleEl = card.querySelector('.product-title, h5');
        if (titleEl) productTitle = titleEl.textContent.trim();
      }

      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = 'flex';
        cartBadge.classList.add('cart-badge-bump');
        cartBadge.parentElement.classList.add('animate-bounce');
        setTimeout(() => {
          cartBadge.classList.remove('cart-badge-bump');
          cartBadge.parentElement.classList.remove('animate-bounce');
        }, 500);
      }

      showToast(`Added "${productTitle}" to cart!`, 'fa-shopping-cart');
    });
  }

  // ==========================================
  // 16. Typewriter Search Placeholder Animation
  // ==========================================
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const phrases = [
      "Search for products, brands and more...",
      "Search for Smart Watches...",
      "Search for Noise Cancelling Earbuds...",
      "Search for Premium Power Banks...",
      "Search for fast chargers and cables...",
      "Search for smart home gadgets..."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    
    function typePlaceholder() {
      if (!searchInput) return;
      
      // Stop typing if input is focused or contains text
      if (document.activeElement === searchInput || searchInput.value.length > 0) {
        setTimeout(typePlaceholder, 1000);
        return;
      }
      
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        searchInput.setAttribute('placeholder', currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 30;
      } else {
        searchInput.setAttribute('placeholder', currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 80;
      }
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }
      
      setTimeout(typePlaceholder, typingSpeed);
    }
    
    // Reset/fallback placeholder when search is focused
    searchInput.addEventListener('focus', () => {
      searchInput.setAttribute('placeholder', 'Search for products, brands and more...');
    });
    
    // Start typewriter cycle
    setTimeout(typePlaceholder, 1000);
  }

  document.head.appendChild(style);
});

