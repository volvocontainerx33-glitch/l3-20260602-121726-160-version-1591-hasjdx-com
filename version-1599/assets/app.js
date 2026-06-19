(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function bindMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function bindHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 6000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function bindFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var search = scope.querySelector("[data-search]");
      var year = scope.querySelector("[data-year-filter]");
      var type = scope.querySelector("[data-type-filter]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-item"));
      if (!cards.length) {
        return;
      }

      function apply() {
        var query = normalize(search && search.value);
        var yearValue = normalize(year && year.value);
        var typeValue = normalize(type && type.value);
        cards.forEach(function (card) {
          var content = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre"),
            card.textContent
          ].join(" "));
          var cardYear = normalize(card.getAttribute("data-year"));
          var cardType = normalize(card.getAttribute("data-type"));
          var matched = true;
          if (query && content.indexOf(query) === -1) {
            matched = false;
          }
          if (yearValue && cardYear.indexOf(yearValue) === -1) {
            matched = false;
          }
          if (typeValue && cardType.indexOf(typeValue) === -1) {
            matched = false;
          }
          card.classList.toggle("is-hidden-card", !matched);
        });
      }

      [search, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });
  }

  function bindPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector(".play-overlay");
      var stream = player.getAttribute("data-stream");
      var hls;
      var prepared = false;
      if (!video || !button || !stream) {
        return;
      }

      function prepare() {
        if (prepared) {
          return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function play() {
        prepare();
        video.controls = true;
        button.classList.add("is-hidden");
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      }

      button.addEventListener("click", function (event) {
        event.preventDefault();
        play();
      });

      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    bindMenu();
    bindHero();
    bindFilters();
    bindPlayers();
  });
})();
