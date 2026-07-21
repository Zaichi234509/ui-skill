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
  const isOpen = document.body.classList.contains('nav-open');
  if (isOpen) closeMenu();
  else openMenu();
});

document.querySelectorAll('.top-nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close when clicking outside nav on mobile
document.addEventListener('click', (e) => {
  if (!document.body.classList.contains('nav-open')) return;
  const isNav = e.target.closest('.top-nav');
  const isToggle = e.target.closest('.nav-toggle');
  if (!isNav && !isToggle) closeMenu();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Auto close when resizing to laptop+ where hamburger is hidden
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth >= 768) {
      // on tablet+ the nav is static; remove overlay state
      if (window.innerWidth >= 1024) closeMenu();
    }
  }, 150);
});

const animated = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: '0px 0px -40px 0px' },
);

animated.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
  observer.observe(element);
});

const sections = [...document.querySelectorAll('main section[id]')];
const railLinks = [...document.querySelectorAll('.side-rail nav a')];

const setActiveRail = () => {
  const current = sections
    .map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 180) }))
    .sort((a, b) => a.top - b.top)[0];

  if (!current) return;
  railLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
  });
};

window.addEventListener('scroll', setActiveRail, { passive: true });
setActiveRail();

// Responsive image handling safeguard
document.querySelectorAll('img').forEach((img) => {
  img.loading = img.loading || 'lazy';
  img.style.maxWidth = '100%';
});
