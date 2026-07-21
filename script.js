const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.top-nav a, .side-rail nav a');

navToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.top-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  });
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
