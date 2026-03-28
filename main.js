document.addEventListener('DOMContentLoaded', () => {

  // ===== Rotating words — Neople-style slide up =====
  const track = document.getElementById('rotating-track');
  if (track) {
    const words = track.querySelectorAll('.rotating-word');
    const total = words.length;
    let current = 0;
    const interval = 2500; // ms between switches

    // Wrap each word's text in a highlight span
    words.forEach(word => {
      const text = word.textContent;
      word.innerHTML = '<span class="highlight-bg">' + text + '</span>';
    });

    // Cache word height to avoid layout thrashing
    let wordHeight = words[0].offsetHeight;
    window.addEventListener('resize', () => {
      wordHeight = words[0].offsetHeight;
    });

    function rotateWord() {
      words[current].classList.remove('active');
      current = (current + 1) % total;
      words[current].classList.add('active');
      track.style.transform = 'translateY(-' + (current * wordHeight) + 'px)';
    }

    setInterval(rotateWord, interval);
  }

  // ===== Scroll-triggered fade-in (Intersection Observer) =====
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger siblings in same section
        const parent = entry.target.closest('section, .social-proof, .footer');
        const siblings = parent ? parent.querySelectorAll('.fade-in') : [entry.target];
        const index = Array.from(siblings).indexOf(entry.target);
        const delay = index * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  // ===== Sticky nav =====
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Trigger on load
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // ===== Hamburger menu =====
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Feature tabs (ecosystem) =====
  const featureTabs = document.querySelectorAll('.feature-tab');
  const featurePanels = document.querySelectorAll('.feature-visual-panel');

  if (featureTabs.length && featurePanels.length) {
    featureTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = tab.getAttribute('data-tab');

        featureTabs.forEach(t => t.classList.remove('active'));
        featurePanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = document.querySelector('.feature-visual-panel[data-panel="' + idx + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ===== Count-up animation for stats =====
  const statNumbers = document.querySelectorAll('.problem-stat-number[data-target]');
  if (statNumbers.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const useComma = el.getAttribute('data-comma') === 'true';
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            let formatted = current.toFixed(decimals);
            if (useComma) formatted = formatted.replace('.', ',');
            el.textContent = prefix + formatted + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => countObserver.observe(el));
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== Article modals =====
  document.querySelectorAll('.news-card[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = card.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.article-modal-overlay').forEach(overlay => {
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close button
    const closeBtn = overlay.querySelector('.article-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.article-modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // ===== Form submission =====
  const form = document.getElementById('demo-form');
  const formContainer = document.getElementById('form-container');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  if (form) {
    // HubSpot IDs — replace with actual values
    const PORTAL_ID = 'JOUW_PORTAL_ID';
    const FORM_ID = 'JOUW_FORM_ID';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formError.classList.remove('show');

      const formData = new FormData(form);
      const firstname = formData.get('firstname').trim();
      const email = formData.get('email').trim();
      const phone = formData.get('phone').trim();
      const company = formData.get('company').trim();

      // Validation
      if (!firstname || !email || !phone || !company) {
        formError.textContent = 'Vul alle velden in.';
        formError.classList.add('show');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        formError.textContent = 'Vul een geldig e-mailadres in.';
        formError.classList.add('show');
        return;
      }

      // Disable button during submit
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verzenden...';

      const payload = {
        fields: [
          { name: 'firstname', value: firstname },
          { name: 'email', value: email },
          { name: 'phone', value: phone },
          { name: 'company', value: company }
        ],
        context: {
          pageUri: 'https://joe.plugz.dev',
          pageName: 'Joe - eMobility Voice Agent'
        }
      };

      try {
        const res = await fetch(
          'https://api.hsforms.com/submissions/v3/integration/submit/' + PORTAL_ID + '/' + FORM_ID,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (!res.ok) throw new Error('Submit failed');

        formContainer.style.display = 'none';
        formSuccess.classList.add('show');
      } catch {
        formError.textContent = 'Er ging iets mis. Probeer het opnieuw.';
        formError.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Demo aanvragen';
      }
    });
  }

});
