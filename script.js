/** ==========================================================
 *  HU TAO Collab — Premium Motion & Interaction Engine
 *  Cinematic animations, 3D tilt, custom cursor,
 *  magnetic buttons, scroll progress, loading sequence,
 *  micro interactions, and performance safeguards.
 * ========================================================== */

(function () {
  'use strict';

  // ==========================================================
  //  PERFORMANCE GUARDS
  // ==========================================================
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // ==========================================================
  //  LOADING SEQUENCE
  // ==========================================================
  const loader = document.getElementById('loader');
  let loaderFinished = false;

  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;
    loader?.classList.add('done');
    // Only reveal content with fade if loader was actually shown
    if (loader && loader.parentElement) {
      document.body.style.opacity = '0';
      requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
        setTimeout(() => {
          document.body.style.transition = '';
          document.body.style.opacity = '';
        }, 650);
      });
    }
  }

  // Trigger loader finish after assets and a short cinematic pause
  window.addEventListener('load', () => {
    setTimeout(finishLoader, 1600);
  });
  // Fallback in case load event fires late
  setTimeout(finishLoader, 3200);

  // Only play once per visit (optional session guard)
  try {
    if (sessionStorage.getItem('huTaoLoaded')) {
      loader?.remove();
    } else {
      sessionStorage.setItem('huTaoLoaded', '1');
    }
  } catch (e) {
    // Ignore storage errors
  }

  // ==========================================================
  //  NAV TOGGLE (original functionality preserved)
  // ==========================================================
  const navToggle = document.querySelector('.nav-toggle');
  const topNav = document.querySelector('.top-nav');

  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  };

  const openMenu = () => {
    document.body.classList.add('nav-open');
    navToggle?.setAttribute('aria-expanded', 'true');
    navToggle?.setAttribute('aria-label', 'Close menu');
  };

  navToggle?.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) closeMenu();
    else openMenu();
  });

  document.querySelectorAll('.top-nav a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (!e.target.closest('.top-nav') && !e.target.closest('.nav-toggle')) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) closeMenu();
    }, 150);
  });

  // ==========================================================
  //  ENTRANCE ANIMATIONS (staggered, trigger once)
  // ==========================================================
  const entranceEls = document.querySelectorAll('[data-entrance]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  entranceEls.forEach((el) => {
    // Apply stagger delay based on parent or index
    const parentStagger = el.closest('[data-stagger]');
    if (parentStagger) {
      const siblings = [...parentStagger.querySelectorAll('[data-entrance]')];
      const index = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(index * 90, 400)}ms`;
    } else {
      el.style.transitionDelay = '0ms';
    }
    observer.observe(el);
  });

  // ==========================================================
  //  CUSTOM CURSOR (desktop only, smooth interpolation)
  // ==========================================================
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');
  const label = document.getElementById('cursorLabel');
  const follower = document.getElementById('cursorFollower');

  if (!isTouchDevice && ring && dot) {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
    let activeLink = null;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
      const targetX = e.clientX;
      const targetY = e.clientY;

      // Dot moves instantly for precision
      dotX = targetX;
      dotY = targetY;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

      // Ring follows with smooth interpolation
      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      // Cursor follower (soft glow behind)
      if (follower) {
        follower.style.left = targetX + 'px';
        follower.style.top = targetY + 'px';
      }

      // Interactive spotlight tracking
      document.querySelectorAll('.interactive-spotlight').forEach((spot) => {
        const rect = spot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const relativeX = ((targetX - rect.left) / rect.width) * 100;
        const relativeY = ((targetY - rect.top) / rect.height) * 100;
        spot.style.setProperty('--spot-x', `${relativeX}%`);
        spot.style.setProperty('--spot-y', `${relativeY}%`);
      });

      // Check interactive elements for cursor state
      const interactive = e.target.closest('a, button, .btn, .drink-card, .feature-card, input, .gallery img');
      if (interactive) {
        ring.classList.remove('hover-btn', 'hover-card');
        if (interactive.closest('a') || interactive.closest('button') || interactive.closest('.btn')) {
          ring.classList.add('hover-btn');
          label.textContent = interactive.getAttribute('aria-label') || '';
          label.style.opacity = '0';
          label.style.transform = `translate(${targetX}px, ${targetY + 24}px) translate(-50%, -50%)`;
        } else if (interactive.closest('.drink-card') || interactive.closest('.feature-card')) {
          ring.classList.add('hover-card');
          label.textContent = '';
          label.style.opacity = '0';
        } else {
          ring.classList.remove('hover-btn', 'hover-card');
          label.style.opacity = '0';
        }
      } else {
        ring.classList.remove('hover-btn', 'hover-card');
        label.style.opacity = '0';
      }
    });

    // Show/hide cursor on enter/leave
    document.body.addEventListener('mouseenter', () => {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      if (follower) follower.classList.add('active');
    });
    document.body.addEventListener('mouseleave', () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
      if (follower) follower.classList.remove('active');
    });

    // Magnetic buttons
    document.querySelectorAll('.btn, .order-button').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;
        if (dist < maxDist) {
          const pull = (maxDist - dist) / maxDist;
          btn.style.transform = `translate(${dx * pull * 0.15}px, ${dy * pull * 0.15}px) scale(1.02)`;
        }
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  } else {
    // Hide custom cursor on touch devices
    if (ring) ring.style.display = 'none';
    if (dot) dot.style.display = 'none';
    if (label) label.style.display = 'none';
  }

  // ==========================================================
  //  3D TILT EFFECT (desktop, smooth, realistic)
  // ==========================================================
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    if (isTouchDevice) return; // Disable tilt on touch for simplicity
    const perspective = 1000;
    let rafId = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
      rafId = requestAnimationFrame(animate);
    };

    animate();

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const maxAngle = 8;
      targetX = (dx / rect.width) * maxAngle * 2;
      targetY = (dy / rect.height) * maxAngle * 2;
    });

    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });
  });

  // ==========================================================
  //  SCROLL PROGRESS & PARALLAX
  // ==========================================================
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  }, { passive: true });

  // Hero parallax (subtle depth shift on scroll)
  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.15;
      heroArt.style.transform = `translateY(${y}px) scale(1.02)`;
    }, { passive: true });
  }

  // ==========================================================
  //  MICRO INTERACTIONS
  // ==========================================================
  // Button ripple
  document.querySelectorAll('.btn-ripple, .btn, .order-button').forEach((btn) => {
    btn.classList.add('btn-ripple', 'btn-press');
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--ripple-x', x + '%');
      btn.style.setProperty('--ripple-y', y + '%');
      btn.classList.add('btn-press');
      setTimeout(() => btn.classList.remove('btn-press'), 180);
    });
  });

  // Like / Favorite buttons (demo on feature cards if any exist)
  document.querySelectorAll('.like-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // Form submit feedback
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn?.textContent || btn?.innerHTML;
      if (btn) {
        btn.innerHTML = '✓ Sent';
        btn.style.background = 'linear-gradient(180deg, #4a8a3e, #2d5e22)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
        }, 2200);
      }
    });
  });

  // Magnetic glow activation for interactive elements
  document.querySelectorAll('.magnetic-btn-wrap').forEach((wrap) => {
    wrap.addEventListener('mousemove', () => wrap.classList.add('magnetic-hover'));
    wrap.addEventListener('mouseleave', () => wrap.classList.remove('magnetic-hover'));
  });

  // ==========================================================
  //  SIDE RAIL ACTIVE STATE
  // ==========================================================
  const sections = [...document.querySelectorAll('main section[id]')];
  const railLinks = [...document.querySelectorAll('.side-rail nav a')];

  const setActiveRail = () => {
    if (!sections.length || !railLinks.length) return;
    const scrollY = window.scrollY + 200;
    let current = null;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].offsetTop <= scrollY) {
        current = sections[i];
        break;
      }
    }
    if (!current) current = sections[0];
    railLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  };

  window.addEventListener('scroll', setActiveRail, { passive: true });
  setActiveRail();

  // ==========================================================
  //  IMAGE LAZY LOADING SAFEGUARD
  // ==========================================================
  document.querySelectorAll('img').forEach((img) => {
    if (!img.getAttribute('loading')) img.loading = 'lazy';
    img.style.maxWidth = '100%';
  });
})();
