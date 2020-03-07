const showId = function(gameId) {
  document.querySelector('.gameId').innerText = gameId;
};

const getId = function() {
  sendReq('get', '/gameId', showId);
};
