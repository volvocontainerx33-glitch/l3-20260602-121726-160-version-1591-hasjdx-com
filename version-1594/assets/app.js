(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mainNav = document.getElementById('mainNav');
  if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.hero-thumb'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });
    thumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle('active', thumbIndex === activeIndex);
    });
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    var input = filterRoot.querySelector('[data-filter-input]');
    var yearSelect = filterRoot.querySelector('[data-filter-year]');
    var typeSelect = filterRoot.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('.movie-card'));
    var empty = filterRoot.querySelector('[data-empty-result]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function matches(card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type'),
        card.textContent
      ].join(' ').toLowerCase();
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var yearValue = yearSelect ? yearSelect.value : '';
      var typeValue = typeSelect ? typeSelect.value : '';
      var yearMatch = !yearValue || card.getAttribute('data-year') === yearValue;
      var typeMatch = !typeValue || card.getAttribute('data-type') === typeValue;
      var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
      return yearMatch && typeMatch && keywordMatch;
    }

    function applyFilter() {
      var visible = 0;
      cards.forEach(function (card) {
        var ok = matches(card);
        card.classList.toggle('hidden-by-filter', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [input, yearSelect, typeSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilter);
        element.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();
