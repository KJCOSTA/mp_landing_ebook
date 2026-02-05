document.addEventListener('DOMContentLoaded', function () {

  // ===== COUNTDOWN TIMER (fake - always ~3h47m from first visit) =====
  (function initCountdown() {
    var KEY = 'mp_countdown_end';
    var stored = localStorage.getItem(KEY);
    var endTime;

    if (stored && parseInt(stored) > Date.now()) {
      endTime = parseInt(stored);
    } else {
      // Set to 3h 47min from now
      endTime = Date.now() + (3 * 3600000) + (47 * 60000);
      localStorage.setItem(KEY, endTime.toString());
    }

    function update() {
      var diff = endTime - Date.now();

      if (diff <= 0) {
        // Reset when expired
        endTime = Date.now() + (3 * 3600000) + (47 * 60000);
        localStorage.setItem(KEY, endTime.toString());
        diff = endTime - Date.now();
      }

      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      var hStr = String(h).padStart(2, '0');
      var mStr = String(m).padStart(2, '0');
      var sStr = String(s).padStart(2, '0');

      document.querySelectorAll('[data-hours]').forEach(function (el) { el.textContent = hStr; });
      document.querySelectorAll('[data-minutes]').forEach(function (el) { el.textContent = mStr; });
      document.querySelectorAll('[data-seconds]').forEach(function (el) { el.textContent = sStr; });
    }

    update();
    setInterval(update, 1000);
  })();

  // ===== SCROLL REVEAL =====
  var targets = '.pain-card,.chapter-card,.chapter-detail,.testimonial-card,.bonus-card,.product-showcase,.pix-step,.transform-card,.guarantee-box,.price-box,.faq-item,.lifestyle-card,.lifestyle-highlight__card,.proof-bar__item,.countdown';
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

  // ===== COPY PIX KEY =====
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

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) { el.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // ===== SMOOTH SCROLL for #pix links =====
  document.querySelectorAll('a[href="#pix"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById('pix');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
