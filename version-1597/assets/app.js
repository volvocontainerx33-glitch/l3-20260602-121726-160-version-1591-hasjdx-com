(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var opened = mobileNav.hasAttribute('hidden');
      if (opened) {
        mobileNav.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = '×';
      } else {
        mobileNav.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var prev = carousel.querySelector('.hero-prev');
    var next = carousel.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  var filterInput = document.querySelector('.card-filter-input');
  var filterGrid = document.querySelector('.filterable-grid');
  var originalCards = filterGrid ? Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card')) : [];

  function applyFilter() {
    if (!filterInput || !filterGrid) {
      return;
    }
    var keyword = filterInput.value.trim().toLowerCase();
    var visible = 0;
    originalCards.forEach(function (card) {
      var haystack = card.getAttribute('data-search') || '';
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });
    var empty = filterGrid.querySelector('.no-result');
    if (!visible) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'no-result';
        empty.textContent = '没有找到匹配的影片';
        filterGrid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }

  document.querySelectorAll('[data-sort]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!filterGrid) {
        return;
      }
      var mode = button.getAttribute('data-sort');
      var cards = originalCards.slice();
      if (mode === 'year') {
        cards.sort(function (a, b) {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        });
      }
      if (mode === 'score') {
        cards.sort(function (a, b) {
          return Number(b.getAttribute('data-score')) - Number(a.getAttribute('data-score'));
        });
      }
      if (mode === 'default') {
        cards = originalCards.slice();
      }
      cards.forEach(function (card) {
        filterGrid.appendChild(card);
      });
      applyFilter();
    });
  });
})();
