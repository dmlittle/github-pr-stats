'use strict'

var GITHUB_TOKEN;
var GITHUB_QUERY;

var FORM_SELECTOR = 'form[action$="assignees"]';
var USER_SELECTOR = 'div [role="menuitem"]';

chrome.storage.sync.get(null, function (storage) {
  GITHUB_TOKEN = storage.githubAccessToken;
  GITHUB_QUERY = storage.githubQuery;
});

$(FORM_SELECTOR).find($('button')).click(function() {
  if (GITHUB_TOKEN && GITHUB_QUERY) {

    var userElements = $(FORM_SELECTOR).find($(USER_SELECTOR));

    userElements.each(function () {
      addLoadingIcon(this);
    })
    .promise()
    .done(function () {
      $.get('https://api.github.com/search/issues?access_token=' + GITHUB_TOKEN + '&q=' + GITHUB_QUERY).done(function(data) {
        var stats = countAsignees(data.items);

        userElements.each(function() {
          addUserDetails(this, stats);
        });
      });
    });
  }
});

function countAsignees (issues) {
  return issues.reduce(function (stats, issue) {
    if (issue.assignee) {
      if (!stats[issue.assignee.id]) {
        stats[issue.assignee.id] = 0;
      }

      stats[issue.assignee.id] += 1;
    }

    return stats;
  }, {});
}

function addLoadingIcon (element) {
  $(element).find($('span.description')).html(
    $('<div>').css('background', 'url(' + chrome.extension.getURL('./img/loading.svg') + ') center').css('display', 'inline-block').css('width', '14px').css('height', '14px')
  );
}

function addUserDetails (element, stats) {
  var userId = $(element).find('input').val();

  $(element).find($('span.description')).html(' - ' + (stats[userId] || 0));
}
