(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
    var hero = document.querySelector(".hero");
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
      if (hero) {
        var image = slides[current].getAttribute("data-hero-image");
        if (image) {
          hero.style.setProperty("--hero-image", "url('" + image + "')");
        }
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });

    if (slides.length) {
      showSlide(0);
      setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    filterInputs.forEach(function (input) {
      var target = document.querySelector(input.getAttribute("data-filter-input"));
      if (!target) {
        return;
      }
      var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card"));
      var empty = document.querySelector(input.getAttribute("data-empty-target"));
      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year"),
            card.textContent
          ].join(" ").toLowerCase();
          var ok = !query || haystack.indexOf(query) !== -1;
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      });
    });

    Array.prototype.slice.call(document.querySelectorAll(".js-player")).forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("button");
      var source = box.getAttribute("data-stream");
      var fallback = box.getAttribute("data-fallback");
      var loaded = false;
      var hls = null;

      function useFallback() {
        if (fallback && video.getAttribute("src") !== fallback) {
          video.src = fallback;
          video.load();
        }
      }

      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (source && source.indexOf(".m3u8") !== -1) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                hls.destroy();
                useFallback();
              }
            });
          } else {
            useFallback();
          }
        } else if (source) {
          video.src = source;
        } else {
          useFallback();
        }
      }

      function play() {
        load();
        box.classList.add("playing");
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            video.setAttribute("controls", "controls");
          });
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }
      box.addEventListener("click", function (event) {
        if (event.target === video) {
          return;
        }
        play();
      });
      video.addEventListener("play", function () {
        box.classList.add("playing");
      });
    });
  });
})();
