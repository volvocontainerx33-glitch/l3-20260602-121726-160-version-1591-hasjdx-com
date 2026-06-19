(function () {
    const menuButton = document.querySelector('.menu-toggle');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let index = 0;
        let timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('active', itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('active', itemIndex === index);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.dataset.heroDot || 0));
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                restart();
            });
        }

        restart();
    }

    const searchInput = document.getElementById('siteSearch');
    const cards = Array.from(document.querySelectorAll('[data-card]'));

    function applySearch(value) {
        const keyword = (value || '').trim().toLowerCase();
        if (!cards.length) {
            return;
        }

        cards.forEach(function (card) {
            const text = (card.dataset.search || '').toLowerCase();
            card.classList.toggle('hidden', Boolean(keyword) && !text.includes(keyword));
        });
    }

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';

    if (searchInput) {
        searchInput.value = query;
        searchInput.addEventListener('input', function () {
            applySearch(searchInput.value);
        });
    }

    if (query) {
        applySearch(query);
    }

    const playerBox = document.querySelector('[data-player]');

    if (playerBox) {
        const video = playerBox.querySelector('video');
        const button = playerBox.querySelector('[data-play-button]');
        const source = playerBox.dataset.videoUrl;
        let ready = false;

        function attachVideo() {
            if (!video || !source || ready) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            ready = true;
        }

        function playVideo() {
            attachVideo();
            if (button) {
                button.classList.add('hidden');
            }
            if (video) {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {
                        if (button) {
                            button.classList.remove('hidden');
                        }
                    });
                }
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (button) {
                    button.classList.remove('hidden');
                }
            });
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });
        }
    }
})();
