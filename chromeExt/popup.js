function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
};

var resourceData = {
  url: '',
  tags: [],
  title: '',
  imgUrl: '',
  summary: '',
  UserId: '',
  category: ''
};

function onSubmit() {
  resourceData.url = document.getElementById('urlInput').value;
  resourceData.title = document.getElementById('titleInput').value;
  resourceData.summary = document.getElementById('summaryInput').value;
  // resource.userId =
  resourceData.category = document.getElementById('categoryInput').value;
  var tags = document.getElementById('tagsInput').value;
  tags = tags.split(' ');
  if (tags.length > 0) {
    resourceData.tags = tags;
  }
  console.log('Resource Data: ', resourceData);
  $.post('http://localhost:3000/api/resources', resourceData);
};

function getCookies(domain, name)
  {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
      if (cookie) {
        ID = cookie.value;
        resourceData.UserId = ID;
      } else {
        console.log('Sorry, no cookie.');
      }
    });
  }

document.addEventListener('DOMContentLoaded', function() {
  //Production
  // getCookies("http://hack-source.herokuapp.com", "HSid");
  //Development
  getCookies("http://127.0.0.1:3000/", "HSid");
  getCurrentTabUrl(function(url) {
      $.get(url, function(data) {
          //Get metadata from current tab
          var defaultPhoto = 'https://i.stack.imgur.com/Mmww2.png';
          resourceData.imgUrl = $(data).filter('meta[property="og:image"]').attr('content') || defaultPhoto;
          var description = $(data).filter('meta[name=description]').attr('content') || '';
          var title = $(data).filter('title').text() || '';
          document.getElementById('urlInput').value = url;
          document.getElementById('summaryInput').value = description;
          document.getElementById('titleInput').value = title;
      });
    });
  //Post data when submit is clicked
  $("#submit").click(onSubmit);
});