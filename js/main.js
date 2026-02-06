document.addEventListener('DOMContentLoaded', function () {

  // ===== STARRY SKY (fewer on mobile for performance) =====
  var isMobile = window.innerWidth < 640;
  (function createStars() {
    var container = document.getElementById('stars');
    if (!container) return;
    var count = isMobile ? 45 : 100;
    for (var i = 0; i < count; i++) {
      var star = document.createElement('span');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      var size = Math.random() * 2.5 + 0.5;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.setProperty('--dur', (Math.random() * 5 + 2) + 's');
      star.style.animationDelay = (Math.random() * 6) + 's';
      container.appendChild(star);
    }
  })();

  // ===== COUNTDOWN TIMER (fake - always ~3h47m from first visit) =====
  (function initCountdown() {
    var KEY = 'mp_countdown_end';
    var stored = localStorage.getItem(KEY);
    var endTime;

    if (stored && parseInt(stored) > Date.now()) {
      endTime = parseInt(stored);
    } else {
      endTime = Date.now() + (3 * 3600000) + (47 * 60000);
      localStorage.setItem(KEY, endTime.toString());
    }

    function update() {
      var diff = endTime - Date.now();

      if (diff <= 0) {
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
  var targets = '.pain-card,.chapter-card,.chapter-detail,.testimonial-card,.bonus-card,.product-showcase,.pix-step,.transform-card,.guarantee-box,.price-box,.faq-item,.lifestyle-card,.lifestyle-highlight__card,.proof-bar__item,.countdown,.phone-mockup';
  document.querySelectorAll(targets).forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 0.1 + 's';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  // ===== SECTION SWEEP OBSERVER (visible class for light sweep) =====
  var sweepObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sweepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.section-sweep').forEach(function (el) { sweepObserver.observe(el); });

  // ===== CELESTIAL PARALLAX ON SCROLL (stars + moon + aurora) =====
  (function initCelestialParallax() {
    var aurora = document.querySelector('.aurora');
    var starsEl = document.getElementById('stars');
    var moonEl = document.querySelector('.moon');
    var waves = aurora ? aurora.querySelectorAll('.aurora__wave') : [];
    var ticking = false;

    // GPU hints for smooth compositing
    if (starsEl) starsEl.style.willChange = 'transform';
    if (moonEl) moonEl.style.willChange = 'transform, opacity';
    if (aurora) aurora.style.willChange = 'opacity';

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? scrollY / docHeight : 0;

          // Aurora shift (lighter on mobile — skip wave transforms)
          if (aurora) {
            aurora.style.opacity = 0.4 + progress * 0.4;
            if (!isMobile) {
              waves.forEach(function (wave, i) {
                var speed = (i + 1) * 8;
                wave.style.transform = 'translateY(' + (scrollY * speed / docHeight * -1) + 'px)';
              });
            }
          }

          // Stars parallax — slow drift upward for depth
          if (starsEl) {
            starsEl.style.transform = 'translate3d(0,' + (scrollY * -0.12) + 'px,0)';
          }

          // Moon parallax — faster drift to disappear as you scroll down
          if (moonEl) {
            var moonOpacity = Math.max(0, 1 - progress * 2.5);
            moonEl.style.transform = 'translate3d(0,' + (scrollY * -0.3) + 'px,0)';
            moonEl.style.opacity = moonOpacity * 0.7;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

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
