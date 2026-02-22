/* ==========================================================================
   KLAER Landing Page — script.js
   No dependencies. ~80 lines.
   ========================================================================== */

(function () {
  'use strict';

  // --- Sticky nav scroll behavior ---
  const nav = document.querySelector('.nav');
  const SCROLL_THRESHOLD = 80;

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = nav.offsetHeight + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // --- Form submission (Formspree AJAX) ---
  var form = document.getElementById('signup-form');
  var formWrapper = document.querySelector('.signup-form-wrapper');
  var thankyou = document.querySelector('.signup-thankyou');
  var errorMsg = document.querySelector('.form-error');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Wird gesendet\u2026';
      btn.disabled = true;

      var action = form.getAttribute('action');

      // If using placeholder endpoint, show success immediately
      if (!action || action.indexOf('formspree.io') === -1) {
        setTimeout(function () {
          showThankYou();
        }, 800);
        return;
      }

      fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
        .then(function (res) {
          if (res.ok) {
            showThankYou();
          } else {
            showError();
            btn.textContent = originalText;
            btn.disabled = false;
          }
        })
        .catch(function () {
          showError();
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });
  }

  function showThankYou() {
    formWrapper.classList.add('hidden');
    thankyou.classList.add('active');
  }

  function showError() {
    errorMsg.classList.add('active');
    setTimeout(function () {
      errorMsg.classList.remove('active');
    }, 5000);
  }
})();
