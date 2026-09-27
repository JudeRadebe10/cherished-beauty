/* ==========================================================================
   CHERISHED BEAUTY — JAVASCRIPT INTERACTIONS & DYNAMIC TABS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.cb-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector('.cb-hamburger');
  const mobileMenu = document.querySelector('.cb-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Dynamic Tab Switching (For Pricing & Category sections)
  const tabButtons = document.querySelectorAll('.cb-tab-btn');
  const tabPanels = document.querySelectorAll('.cb-pricing-panel');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabPanels.forEach(panel => {
          if (panel.id === targetTab || panel.getAttribute('data-panel') === targetTab) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // 4. Interactive Booking Price Calculator
  const serviceSelect = document.getElementById('cb-service-select');
  const priceDisplay = document.getElementById('cb-calculated-price');
  const bookingForm = document.getElementById('cb-booking-form');
  const confirmationModal = document.getElementById('cb-booking-modal');
  const closeModalBtn = document.getElementById('cb-close-modal');
  const modalServiceDetail = document.getElementById('cb-modal-service-detail');

  if (serviceSelect && priceDisplay) {
    serviceSelect.addEventListener('change', () => {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const price = selectedOption.getAttribute('data-price');
      if (price) {
        priceDisplay.textContent = 'R' + price;
      } else {
        priceDisplay.textContent = 'R0';
      }
    });
  }

  if (bookingForm && confirmationModal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedOption = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex] : null;
      const serviceName = selectedOption ? selectedOption.textContent : 'Selected Ritual';
      const dateVal = document.getElementById('cb-booking-date')?.value || 'Upcoming Date';
      const timeVal = document.getElementById('cb-booking-time')?.value || '10:00 AM';

      if (modalServiceDetail) {
        modalServiceDetail.textContent = serviceName + " on " + dateVal + " at " + timeVal;
      }

      confirmationModal.classList.add('active');
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
        bookingForm.reset();
        if (priceDisplay) priceDisplay.textContent = 'R0';
      });
    }
  }

  // 5. Contact Form Simulation
  const contactForm = document.getElementById('cb-contact-form');
  const contactSuccessMsg = document.getElementById('cb-contact-success');
  if (contactForm && contactSuccessMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactSuccessMsg.style.display = 'block';
      contactForm.reset();
      setTimeout(() => {
        contactSuccessMsg.style.display = 'none';
      }, 6000);
    });
  }

  // 6. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.cb-reveal, .reveal, .cb-reveal-left, .reveal-left, .cb-reveal-right, .reveal-right');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  }
});
