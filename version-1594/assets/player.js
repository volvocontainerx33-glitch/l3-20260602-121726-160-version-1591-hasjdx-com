(function () {
  var video = document.querySelector('[data-stream-url]');
  var status = document.querySelector('[data-player-status]');

  if (!video) {
    return;
  }

  var streamUrl = video.getAttribute('data-stream-url');

  function setStatus(text) {
    if (status) {
      status.textContent = text;
    }
  }

  function attachNative() {
    video.src = streamUrl;
    video.addEventListener('loadedmetadata', function () {
      setStatus('');
    });
    video.addEventListener('error', function () {
      setStatus('播放加载遇到问题，请刷新页面或稍后再试。');
    });
  }

  if (!streamUrl) {
    setStatus('播放源暂不可用。');
    return;
  }

  if (window.Hls && window.Hls.isSupported()) {
    var hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
      setStatus('');
    });
    hls.on(window.Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        setStatus('播放加载遇到问题，请刷新页面或稍后再试。');
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    attachNative();
  } else {
    attachNative();
  }
})();
