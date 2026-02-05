/* ============================================
   MUNDO DA PRECE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Scroll Reveal Animation ----
  function initScrollReveal() {
    var revealElements = [
      '.content-card',
      '.testimonial',
      '.chapter',
      '.pix-step',
      '.trust-badge',
      '.bonus-badge',
      '.guarantee-card',
      '.price-card'
    ];

    revealElements.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Copy PIX Key ----
  function initPixCopy() {
    var copyBtn = document.getElementById('copyPixBtn');
    var pixKey = document.getElementById('pixKey');

    if (!copyBtn || !pixKey) return;

    copyBtn.addEventListener('click', function () {
      var keyText = pixKey.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(keyText).then(function () {
          showCopiedFeedback(copyBtn);
        }).catch(function () {
          fallbackCopy(keyText, copyBtn);
        });
      } else {
        fallbackCopy(keyText, copyBtn);
      }
    });
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      showCopiedFeedback(btn);
    } catch (err) {
      // Silent fail
    }

    document.body.removeChild(textarea);
  }

  function showCopiedFeedback(btn) {
    var textEl = btn.querySelector('.pix-key-box__copy-text');
    var originalText = textEl ? textEl.textContent : '';

    btn.classList.add('copied');
    if (textEl) textEl.textContent = 'Copiado!';

    setTimeout(function () {
      btn.classList.remove('copied');
      if (textEl) textEl.textContent = originalText;
    }, 2000);
  }

  // ---- Staggered Reveal for Grid Items ----
  function initStaggeredReveal() {
    var grids = document.querySelectorAll('.content-grid, .chapter-list, .testimonials, .pix-steps');

    grids.forEach(function (grid) {
      var children = grid.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.transitionDelay = (i * 0.08) + 's';
      }
    });
  }

  // ---- Init ----
  initScrollReveal();
  initPixCopy();
  initStaggeredReveal();

});
