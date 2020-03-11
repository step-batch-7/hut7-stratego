const areAllPlayersJoined = function(responseText) {
  const { playerJoined } = JSON.parse(responseText);
  if (playerJoined) {
    window.location.href = 'setup';
  }
};

const main = function() {
  setInterval(() => {
    sendGetReq('/areAllPlayersJoined', areAllPlayersJoined);
  }, 2000);
};

window.onload = main;
