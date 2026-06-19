function initMoviePlayer(videoId, source, coverId) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var hls = null;
  var ready = false;

  if (!video || !source) {
    return;
  }

  function attachSource() {
    if (ready) {
      return;
    }
    ready = true;
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          if (cover) {
            cover.classList.remove('is-hidden');
            cover.querySelector('strong').textContent = '当前视频暂时无法播放';
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (cover) {
      cover.querySelector('strong').textContent = '当前视频暂时无法播放';
    }
  }

  function playVideo() {
    attachSource();
    video.controls = true;
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (cover && video.currentTime === 0) {
      cover.classList.remove('is-hidden');
    }
  });

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
