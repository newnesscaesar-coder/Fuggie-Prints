document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const backToTop = document.querySelector('.back-to-top');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html': 'home',
    'about.html': 'about',
    'services.html': 'services',
    'gallery.html': 'gallery',
    'quote.html': 'quote',
    'contact.html': 'contact'
  };
  const activePage = pageMap[currentPath] || 'home';

  document.querySelectorAll('.site-nav a').forEach((link) => {
    const linkPage = link.dataset.page;
    if (linkPage === activePage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.site-nav a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const handleScroll = () => {
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('.quote-form, .contact-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const feedback = form.querySelector('.form-response');
      if (feedback) {
        feedback.textContent = 'Thank you for reaching out. We will contact you shortly.';
      }
      form.reset();
    });
  });
});
