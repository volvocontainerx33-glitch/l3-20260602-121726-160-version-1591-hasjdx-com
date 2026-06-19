(function () {
  var input = document.getElementById('global-search-input');
  var clear = document.getElementById('global-search-clear');
  var grid = document.getElementById('search-result-grid');
  var title = document.getElementById('search-result-title');
  var data = window.SEARCH_MOVIES || [];

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function render(items, keyword) {
    if (!grid) {
      return;
    }
    if (title) {
      title.textContent = keyword ? '搜索结果' : '精选内容';
    }
    if (!items.length) {
      grid.innerHTML = '<div class="no-result">没有找到匹配的影片</div>';
      return;
    }
    grid.innerHTML = items.slice(0, 160).map(function (movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return '<article class="movie-card">' +
        '<a class="card-cover" href="' + escapeHtml(movie.url) + '">' +
          '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<span class="card-gradient"></span>' +
          '<span class="card-category">' + escapeHtml(movie.category) + '</span>' +
          '<span class="card-duration">' + escapeHtml(movie.type) + '</span>' +
        '</a>' +
        '<div class="card-body">' +
          '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
          '<p>' + escapeHtml(movie.description) + '</p>' +
          '<div class="card-meta"><span class="score">★ ' + escapeHtml(movie.score) + '</span><span>' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + '</span></div>' +
          '<div class="tag-list">' + tags + '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function search() {
    var keyword = input ? input.value.trim().toLowerCase() : '';
    if (!keyword) {
      render(data.slice(0, 24), '');
      return;
    }
    var words = keyword.split(/\s+/).filter(Boolean);
    var result = data.filter(function (movie) {
      var haystack = [movie.title, movie.description, movie.year, movie.region, movie.type, movie.category, (movie.tags || []).join(' ')].join(' ').toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    });
    render(result, keyword);
  }

  if (input) {
    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      input.value = params.get('q');
    }
    input.addEventListener('input', search);
  }

  if (clear) {
    clear.addEventListener('click', function () {
      input.value = '';
      input.focus();
      search();
    });
  }

  search();
})();
