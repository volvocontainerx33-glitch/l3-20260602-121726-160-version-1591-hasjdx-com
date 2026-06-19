function startMoviePlayer(url) {
  var video = document.getElementById('movie-video');
  var layer = document.getElementById('play-layer');
  var attached = false;
  var hlsInstance = null;

  if (!video) {
    return;
  }

  function attachSource() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = url;
  }

  function playVideo() {
    attachSource();
    video.controls = true;

    if (layer) {
      layer.classList.add('is-hidden');
    }

    var playRequest = video.play();

    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(function () {
        if (layer) {
          layer.classList.remove('is-hidden');
        }
      });
    }
  }

  if (layer) {
    layer.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}