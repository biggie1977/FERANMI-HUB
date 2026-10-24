document.addEventListener('DOMContentLoaded', function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  const nav = document.querySelector('nav');

  navLinks.forEach(function (link) {
    const page = link.getAttribute('href');
    if (page === currentPage || (currentPage === '' && page === 'index.html')) {
      link.classList.add('active');
    }
  });

  if (nav && !nav.querySelector('.nav-toggle')) {
    const navToggle = document.createElement('button');
    navToggle.type = 'button';
    navToggle.className = 'nav-toggle';
    navToggle.setAttribute('aria-label', 'Toggle navigation');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '<span></span><span></span><span></span>';

    nav.appendChild(navToggle);

    const navMenu = nav.querySelector('.nav-links');
    if (navMenu) {
      navToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('is-open');
        nav.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('is-open');
          nav.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  const filterButtons = document.querySelectorAll('.filters button');
  const looks = document.querySelectorAll('.look-card');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter;

      filterButtons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn === button));
      });

      looks.forEach(function (look) {
        const categories = look.dataset.tags || '';
        look.hidden = filter !== 'all' && categories.indexOf(filter) < 0;
      });
    });
  });

  const contactForm = document.getElementById('contact-form');
  const statusBox = document.getElementById('status');

  if (contactForm && statusBox) {
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const showStatus = function (message, type) {
      statusBox.textContent = message;
      statusBox.dataset.state = type;
    };

    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const formData = Object.fromEntries(new FormData(contactForm).entries());
      const name = String(formData.name || '').trim();
      const email = String(formData.email || '').trim();
      const message = String(formData.message || '').trim();

      if (!name || !email || !message || !/\S+@\S+\.\S+/.test(email)) {
        showStatus('Please enter your name, a valid email address, and a message.', 'error');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }

      showStatus('Sending your enquiry…', 'info');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const payload = await response.json().catch(function () {
          return {};
        });

        if (!response.ok) {
          throw new Error(payload.error || 'Could not send your message right now.');
        }

        showStatus('Sent successfully. I’ll reply within 48 hours.', 'success');
        contactForm.reset();
      } catch (error) {
        const errorMessage = error && error.message
          ? error.message
          : 'Couldn’t reach the server. Run the backend or message @heisgbaby on Instagram.';
        showStatus(errorMessage, 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send enquiry';
        }
      }
    });
  }
});
