/**
 * BootWay UI/UX Enhancement Scripts
 * Performance Optimizations & Interactive Features
 */

(function () {
  'use strict';

  // ========================================
  // Progressive Enhancement - Remove no-js class
  // ========================================
  document.documentElement.classList.remove('no-js');

  // ========================================
  // Performance Optimizations
  // ========================================

  // Lazy Loading Images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // ========================================
  // Smooth Scroll Enhancement
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === 'javascript:void(0)') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // ========================================
  // Navigation Enhancement
  // ========================================

  const navbarToggler = document.getElementById('navbarToggler');
  const navbarCollapse = document.getElementById('navbarCollapse');

  if (navbarToggler && navbarCollapse) {
    // Update aria-expanded attribute
    navbarToggler.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
    });
  }

  // Active Menu Item Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.ud-menu-scroll');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // ========================================
  // Intersection Observer for Animations
  // ========================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Only unobserve if not using live mode
          if (!entry.target.classList.contains('wow-keep')) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe elements with wow class (backup for WOW.js)
    // Wait for DOM to be fully ready
    setTimeout(() => {
      document.querySelectorAll('.wow').forEach(el => {
        // Check if element has a valid className property
        if (el && typeof el.className === 'string') {
          observer.observe(el);
        }
      });
    }, 100);
  } else {
    // Fallback for browsers without Intersection Observer
    document.querySelectorAll('.wow').forEach(el => {
      if (el && typeof el.className === 'string') {
        el.classList.add('animated');
      }
    });
  }

  // ========================================
  // Preload Critical Resources
  // ========================================

  function preloadResource(url, type) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
  }

  // ========================================
  // Form Enhancement (if contact form exists)
  // ========================================

  const contactForm = document.querySelector('#contact form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Add loading state
      const submitBtn = this.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }
    });
  }

  // ========================================
  // WhatsApp Button Enhancement
  // ========================================

  const whatsappBtn = document.querySelector('a[href*="wa.me"]');
  
  if (whatsappBtn) {
    // Track WhatsApp clicks
    whatsappBtn.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'engagement',
          'event_label': 'WhatsApp Connect Button'
        });
      }
    });
  }

  // ========================================
  // Video Performance Enhancement
  // ========================================

  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    // Pause video when not in viewport
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Auto-play was prevented
          });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    videoObserver.observe(video);
  });

  // ========================================
  // Enhanced Scroll to Top Button
  // ========================================

  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_to_top', {
          'event_category': 'navigation'
        });
      }
    });

    // Add bounce effect on show
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 300) {
        backToTopBtn.style.display = 'flex';
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          backToTopBtn.classList.add('bounce-in');
          setTimeout(() => {
            backToTopBtn.classList.remove('bounce-in');
          }, 500);
        }
      } else {
        backToTopBtn.style.display = 'none';
      }
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }

  // ========================================
  // Add CSS for bounce effect
  // ========================================

  const style = document.createElement('style');
  style.textContent = `
    .bounce-in {
      animation: bounceIn 0.5s ease;
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .loading::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // Keyboard Navigation Enhancement
  // ========================================

  document.addEventListener('keydown', function(e) {
    // Alt + H for Home
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape' && navbarCollapse && !navbarCollapse.classList.contains('hidden')) {
      navbarToggler.click();
    }
  });

  // ========================================
  // Prefetch Links on Hover
  // ========================================

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('mouseenter', function() {
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const linkEl = document.createElement('link');
        linkEl.rel = 'prefetch';
        linkEl.href = href;
        document.head.appendChild(linkEl);
      }
    }, { once: true });
  });

  // ========================================
  // Feature Cards Click Tracking
  // ========================================

  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
      const cardTitle = this.querySelector('h3')?.textContent;
      if (typeof gtag !== 'undefined' && cardTitle) {
        gtag('event', 'feature_card_click', {
          'event_category': 'engagement',
          'event_label': cardTitle
        });
      }
    });
  });

  // ========================================
  // Pricing Card Tracking
  // ========================================

  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('click', function() {
      const planName = this.querySelector('h3')?.textContent;
      if (typeof gtag !== 'undefined' && planName) {
        gtag('event', 'pricing_view', {
          'event_category': 'conversion',
          'event_label': planName
        });
      }
    });
  });

  // ========================================
  // FAQ Tracking
  // ========================================

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const question = this.closest('.single-faq')?.querySelector('h4')?.textContent;
      if (typeof gtag !== 'undefined' && question) {
        gtag('event', 'faq_click', {
          'event_category': 'engagement',
          'event_label': question
        });
      }
    });
  });

  // ========================================
  // Performance Monitoring
  // ========================================

  // Report Web Vitals if available
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'LCP', {
            'event_category': 'Web Vitals',
            'value': Math.round(lastEntry.startTime),
            'non_interaction': true
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Observer not supported
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'FID', {
              'event_category': 'Web Vitals',
              'value': Math.round(entry.processingStart - entry.startTime),
              'non_interaction': true
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Observer not supported
    }
  }

  // ========================================
  // Console Branding (Easter Egg)
  // ========================================

  console.log(
    '%c🚀 BootWay - Indoor Navigation as a Service',
    'font-size: 16px; font-weight: bold; color: #3056D3;'
  );
  console.log(
    '%cIndia\'s First iNaaS Provider',
    'font-size: 12px; color: #6B7280;'
  );
  console.log(
    '%c💼 Interested in working with us? Contact: support@bootway.in',
    'font-size: 12px; color: #13C296;'
  );

  // ========================================
  // Initialization Complete
  // ========================================

  console.log('%c✓ UI Enhancements Loaded', 'color: #13C296; font-weight: bold;');

})();

