(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }

      index = (next + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var filterSelects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));

  function applyFilters() {
    var query = searchInputs.map(function (input) {
      return input.value.trim().toLowerCase();
    }).filter(Boolean).join(' ');

    var activeFilters = {};

    filterSelects.forEach(function (select) {
      var key = select.getAttribute('data-filter-select');
      var value = select.value;

      if (key && value) {
        activeFilters[key] = value;
      }
    });

    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var matched = !query || text.indexOf(query) !== -1;

      Object.keys(activeFilters).forEach(function (key) {
        if (card.getAttribute('data-' + key) !== activeFilters[key]) {
          matched = false;
        }
      });

      card.classList.toggle('is-hidden', !matched);
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', applyFilters);
  });

  filterSelects.forEach(function (select) {
    select.addEventListener('change', applyFilters);
  });
})();