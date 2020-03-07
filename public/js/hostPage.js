const gotoWaiting = function(response) {
  window.location.href = 'waiting.html';
};

const showWaiting = function() {
  const playerName = document.querySelector('.placeholderColor').value;
  if (playerName.trim()) {
    sendReq('post', '/hostGame', gotoWaiting(), JSON.stringify({ playerName }));
    return;
  }
  document.querySelector('#message').style.visibility = 'visible';
};
