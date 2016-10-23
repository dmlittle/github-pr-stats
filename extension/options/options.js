;(function() {
  var githubAccessToken = document.getElementById('github-access-token');
  var githubQuery       = document.getElementById('github-query');

  var elements = {};

  chrome.storage.sync.get(null, function(storage) {
    githubAccessToken.value = storage.githubAccessToken || '';
    githubQuery.value = storage.githubQuery || '';
  });

  document.getElementById('config').addEventListener('submit', function () {
    var options = {};

    options.githubAccessToken = githubAccessToken.value;
    options.githubQuery = githubQuery.value;

    chrome.storage.sync.set(options);
  }, false);

})();
