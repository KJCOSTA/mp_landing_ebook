document.addEventListener('DOMContentLoaded', function () {

  // Scroll Reveal
  var targets = '.pain-card,.chapter-card,.chapter-detail,.testimonial-card,.bonus-card,.product-showcase,.pix-step,.transform-card,.guarantee-box,.price-box,.faq-item';
  document.querySelectorAll(targets).forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 0.08 + 's';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  // Copy Pix Key
  var copyBtn = document.getElementById('copyPixBtn');
  var pixKey = document.getElementById('pixKey');
  var btnText = document.getElementById('copyBtnText');

  if (copyBtn && pixKey) {
    copyBtn.addEventListener('click', function () {
      var key = pixKey.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(key).then(function () { showCopied(); }).catch(function () { fallback(key); });
      } else { fallback(key); }
    });
  }

  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showCopied(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function showCopied() {
    if (btnText) btnText.textContent = 'COPIADO!';
    if (copyBtn) copyBtn.classList.add('copied');
    setTimeout(function () {
      if (btnText) btnText.textContent = 'COPIAR';
      if (copyBtn) copyBtn.classList.remove('copied');
    }, 2500);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) { el.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

});
