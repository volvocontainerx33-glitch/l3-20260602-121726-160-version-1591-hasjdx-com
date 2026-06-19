(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");

    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      button.textContent = isOpen ? "×" : "☰";
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
        dot.setAttribute("aria-pressed", String(dotIndex === current));
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initSearch() {
    var page = document.querySelector("[data-search-page]");

    if (!page) {
      return;
    }

    var input = page.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(page.querySelectorAll("[data-search-card]"));
    var empty = page.querySelector("[data-search-empty]");
    var chips = Array.prototype.slice.call(page.querySelectorAll("[data-search-chip]"));
    var params = new URLSearchParams(window.location.search);
    var selectedCategory = "all";

    if (input && params.get("q")) {
      input.value = params.get("q");
    }

    function apply() {
      var query = normalize(input ? input.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute("data-search-card"));
        var category = card.getAttribute("data-category") || "";
        var matchedQuery = !query || haystack.indexOf(query) !== -1;
        var matchedCategory = selectedCategory === "all" || category === selectedCategory;
        var matched = matchedQuery && matchedCategory;

        card.classList.toggle("hidden-by-filter", !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        selectedCategory = chip.getAttribute("data-search-chip") || "all";
        chips.forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        apply();
      });
    });

    apply();
  }

  function initViewSwitch() {
    var wrappers = Array.prototype.slice.call(document.querySelectorAll("[data-view-wrapper]"));

    wrappers.forEach(function (wrapper) {
      var grid = wrapper.querySelector("[data-view-grid]");
      var buttons = Array.prototype.slice.call(wrapper.querySelectorAll("[data-view]"));

      if (!grid || !buttons.length) {
        return;
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var mode = button.getAttribute("data-view") || "grid";
          grid.classList.toggle("view-list", mode === "list");
          buttons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
        });
      });
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    players.forEach(function (player) {
      var video = player.querySelector("video");
      var trigger = player.querySelector("[data-play-trigger]");
      var message = player.querySelector("[data-player-message]");
      var stream = player.getAttribute("data-stream");
      var attached = false;
      var hlsInstance = null;

      if (!video || !trigger || !stream) {
        return;
      }

      function setMessage(value) {
        if (message) {
          message.textContent = value || "";
        }
      }

      function attachStream() {
        if (attached) {
          return Promise.resolve();
        }

        attached = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);

          return new Promise(function (resolve) {
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
              resolve();
            });
          });
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          return Promise.resolve();
        }

        video.src = stream;
        return Promise.resolve();
      }

      function play() {
        setMessage("正在载入");

        attachStream()
          .then(function () {
            video.controls = true;
            return video.play();
          })
          .then(function () {
            player.classList.add("is-playing");
            setMessage("");
          })
          .catch(function () {
            setMessage("播放暂不可用，请稍后再试");
            attached = false;
            if (hlsInstance && hlsInstance.destroy) {
              hlsInstance.destroy();
            }
            hlsInstance = null;
          });
      }

      trigger.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initViewSwitch();
    initPlayers();
  });
})();
