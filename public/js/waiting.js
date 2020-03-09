const showId = function(gameId) {
  document.querySelector('#gameId').innerText = gameId;
};

const parseCookie = function(cookies) {
  const cookieKeyValues = cookies.split('; ');
  return cookieKeyValues.reduce((cookies, pair) => {
    const [key, value] = pair.split('=');
    cookies[key] = value;
    return cookies;
  }, {});
};

const getId = function() {
  const cookies = parseCookie(document.cookie);
  return cookies.gameId;
};

const areAllPlayerJoin = function(responseText) {
  if (responseText.responseURL.match('setup.html')) {
    window.location.href = 'setup.html';
  }
};

const main = function() {
  const gameId = getId();
  showId(gameId);
  setInterval(() => {
    sendGetReq('/setup', areAllPlayerJoin);
  }, 2000);
};

window.onload = main;
