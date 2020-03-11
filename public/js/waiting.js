const areAllPlayerJoin = function(responseText) {
  if (responseText.responseURL.match('setup')) {
    window.location.href = 'setup';
  }
};

const main = function() {
  setInterval(() => {
    sendGetReq('/setup', areAllPlayerJoin);
  }, 2000);
};

window.onload = main;
