document.addEventListener('DOMContentLoaded', function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(function (link) {
    const page = link.getAttribute('href');
    if (page === currentPage || (currentPage === '' && page === 'index.html')) {
      link.classList.add('active');
    }
  });

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
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(contactForm));
      statusBox.textContent = 'Sending…';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          statusBox.textContent = 'Sent. I’ll reply within 48 hours.';
          contactForm.reset();
        })
        .catch(function () {
          statusBox.textContent = 'Couldn’t reach the server. Run the backend or message @heisgbaby on Instagram.';
        });
    });
  }
});
