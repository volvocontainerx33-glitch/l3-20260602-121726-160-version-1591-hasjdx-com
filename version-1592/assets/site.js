(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5600);
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

  filterForms.forEach(function (scope) {
    var input = scope.querySelector('[data-filter-keyword]');
    var year = scope.querySelector('[data-filter-year]');
    var region = scope.querySelector('[data-filter-region]');
    var type = scope.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var regionValue = region ? region.value : '';
      var typeValue = type ? type.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type')
        ].join(' ').toLowerCase();
        var passKeyword = !keyword || text.indexOf(keyword) > -1;
        var passYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var passRegion = !regionValue || card.getAttribute('data-region') === regionValue;
        var passType = !typeValue || card.getAttribute('data-type') === typeValue;

        card.classList.toggle('hidden-by-filter', !(passKeyword && passYear && passRegion && passType));
      });
    }

    [input, year, region, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });

  var video = document.querySelector('[data-hls-video]');
  var playButton = document.querySelector('[data-play-button]');
  var cover = document.querySelector('[data-player-cover]');
  var message = document.querySelector('[data-player-message]');

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  function startPlayer() {
    if (!video) {
      return;
    }

    var source = video.getAttribute('data-src');

    if (!source) {
      setMessage('当前影片正在加载');
      return;
    }

    if (cover) {
      cover.classList.add('hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().catch(function () {
        setMessage('点击视频区域继续播放');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {
          setMessage('点击视频区域继续播放');
        });
      });
      hls.on(window.Hls.Events.ERROR, function () {
        setMessage('播放源连接中');
      });
      return;
    }

    video.src = source;
    video.play().catch(function () {
      setMessage('点击视频区域继续播放');
    });
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayer);
  }

  if (cover) {
    cover.addEventListener('click', startPlayer);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayer();
      }
    });
  }
})();
