const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const faqItems = document.querySelectorAll(".faq-item");
const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const prevButton = document.querySelector(".testimonial-nav.prev");
const nextButton = document.querySelector(".testimonial-nav.next");
const contactForm = document.querySelector("#contact-form");
let testimonialIndex = 0;

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  button.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

function showTestimonial(index) {
  testimonialSlides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === index);
  });
}

if (testimonialSlides.length) {
  showTestimonial(testimonialIndex);
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      testimonialIndex = (testimonialIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
      showTestimonial(testimonialIndex);
    });

    nextButton.addEventListener("click", () => {
      testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
      showTestimonial(testimonialIndex);
    });
  }

  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
    showTestimonial(testimonialIndex);
  }, 6000);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const phone = contactForm.querySelector('input[name="phone"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const service = contactForm.querySelector('input[name="service"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();

    const subject = encodeURIComponent(`New inquiry from ${name || "a client"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService Needed: ${service}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:newnesscaesar@gmail.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
}

