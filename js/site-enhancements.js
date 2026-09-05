(() => {
  const recipient = 'fuggieprintsmedia@gmail.com';
  // Replace these two values when the Fuggie Prints app is published.
  const appStoreUrls = {
    googlePlay: 'app/',
    appleAppStore: 'app/'
  };
  window.FuggieAppStoreUrls = appStoreUrls;

  const currentScript = document.currentScript;
  const logoUrl = currentScript ? new URL('../images/fuggie-prints-logo.png', currentScript.src).href : 'images/fuggie-prints-logo.png';
  document.querySelectorAll('.brand img').forEach((logo) => {
    logo.src = logoUrl;
    logo.alt = 'Fuggie Prints logo';
  });
  if (!document.querySelector('link[rel~="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = logoUrl;
    document.head.append(favicon);
  }

  const whatsappIcon = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.1 17.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.3-.6-2.2-1.2-3.1-2.7-.2-.3.2-.3.6-1.1.1-.2.1-.4 0-.5-.1-.1-.6-1.3-.8-1.8-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.2-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.2-.2-.2-.5-.3zM16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.8 6.4L3 29l6.8-1.8A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 .9.9-3.9-.3-.4a10.6 10.6 0 1 1 9.4 5.1z"/></svg>';
  document.querySelectorAll('.social-links').forEach((links) => {
    links.innerHTML = '<a class="whatsapp-link" href="https://wa.me/256788962748" target="_blank" rel="noopener noreferrer" aria-label="Chat with Fuggie Prints on WhatsApp">' + whatsappIcon + '<span>WhatsApp</span></a>';
  });

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('main .section, main .page-hero, main .feature-card, main .service-card, main .gallery-card, main .team-card, main .about-card, main .stats-card, main .info-card, main .quote-card, main .contact-card, main .map-card');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    if (element.matches('.service-card, .gallery-card, .team-card') || element.querySelector('img')) {
      element.classList.add(index % 2 ? 'reveal-from-right' : 'reveal-from-left');
    }
  });
  if (motionReduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-revealed'));
  } else {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    revealTargets.forEach((element) => observer.observe(element));
  }

  if (document.querySelector('.hero-panel') && !document.querySelector('.app-download')) {
    const appDownload = document.createElement('section');
    appDownload.className = 'container app-download';
    appDownload.id = 'app-download-options';
    appDownload.setAttribute('aria-label', 'Fuggie Prints app download options');
    appDownload.innerHTML = '<h2 class="app-download__title">Fuggie Prints on the go</h2>' +
      '<p class="app-download__copy">Get ready to order and connect with us from our upcoming mobile app.</p>' +
      '<a class="app-download__button" href="app/">↓ Download our app</a>' +
      '<div class="store-badges">' +
      '<a class="store-badge" href="' + appStoreUrls.googlePlay + '" data-store="google-play" aria-label="Get the upcoming app on Google Play">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#6dd5ed" d="M3 2.5v19L13.4 12z"/><path fill="#a4e34d" d="M13.4 12 17 8.4 5.4 2.1z"/><path fill="#ffdb5c" d="M13.4 12 5.4 21.9 17 15.6z"/><path fill="#ff6b6b" d="m17 8.4 3.8 2.1c.9.5.9 1.5 0 2L17 15.6 13.4 12z"/></svg><span><small>GET IT ON</small><strong>Google Play</strong></span></a>' +
      '<a class="store-badge" href="' + appStoreUrls.appleAppStore + '" data-store="apple-app-store" aria-label="Download the upcoming app from the App Store">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.7 12.9c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8s-1.6-.8-2.7-.8c-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.6 2 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.3-.9-2.3-3.1zM14.6 6.8c.6-.7 1-1.6.9-2.6-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.5 1 .1 2-.5 2.6-1.2z"/></svg><span><small>Download on the</small><strong>App Store</strong></span></a></div>';
    document.querySelector('footer')?.before(appDownload);
  }

  if (!document.querySelector('.image-lightbox')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="image-lightbox" hidden role="dialog" aria-modal="true" aria-label="Full-size image viewer">
        <button class="image-lightbox__close" type="button" aria-label="Close image viewer">×</button>
        <img class="image-lightbox__image" alt="" />
      </div>`);
  }

  const openImage = (image) => {
    const lightbox = document.querySelector('.image-lightbox');
    const preview = lightbox?.querySelector('.image-lightbox__image');
    if (!lightbox || !preview) return;
    preview.src = image.currentSrc || image.src;
    preview.alt = image.alt || 'Full-size image';
    lightbox.hidden = false;
    document.body.classList.add('image-lightbox-open');
    lightbox.querySelector('.image-lightbox__close')?.focus();
  };

  const closeImage = () => {
    const lightbox = document.querySelector('.image-lightbox');
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('image-lightbox-open');
  };

  document.querySelectorAll('img').forEach((image) => {
    if (image.closest('.image-lightbox')) return;
    image.dataset.fullscreenImage = '';
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Open ${image.alt || 'image'} full screen`);
    image.addEventListener('click', () => openImage(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImage(image);
      }
    });
  });

  document.querySelector('.image-lightbox__close')?.addEventListener('click', closeImage);
  document.querySelector('.image-lightbox')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget || event.target.matches('.image-lightbox__image')) closeImage();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeImage();
  });

  document.querySelectorAll('.quote-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const body = [
        `Name: ${values.get('full-name') || ''}`,
        `Company: ${values.get('company-name') || ''}`,
        `Email: ${values.get('email') || ''}`,
        `Phone: ${values.get('phone') || ''}`,
        `Service: ${values.get('service') || ''}`,
        `Budget: ${values.get('budget') || ''}`,
        `Preferred deadline: ${values.get('deadline') || ''}`,
        '',
        'Project description:',
        values.get('project-description') || ''
      ].join('\n');
      const mailto = `mailto:${recipient}?subject=${encodeURIComponent('Quote request from ' + (values.get('full-name') || 'website visitor'))}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      const feedback = form.querySelector('.form-response');
      if (feedback) feedback.textContent = 'Your email app has been opened with your quote request ready to send.';
    }, true);
  });
})();
