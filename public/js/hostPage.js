const isValidName = function() {
  const playerName = document.querySelector('.input').value;
  if (playerName.trim()) {
    return true;
  }
  document.querySelector('.input').value = '';
  document.querySelector('#message').style.visibility = 'visible';
  return false;
};

const toggleErrorMsgVisibility = function(errorMsgId1, errorMsgId2) {
  document.querySelector(errorMsgId1).style.visibility = 'hidden';
  document.querySelector(errorMsgId2).style.visibility = 'visible';
};

const isValidInput = function() {
  const playerName = document.querySelector('[name=playerName]').value;
  const gameId = document.querySelector('[name=gameId]').value;
  if (!playerName.trim()) {
    toggleErrorMsgVisibility('#gameIdValid', '#nameValid');
    return false;
  }
  if (!gameId.trim()) {
    toggleErrorMsgVisibility('#nameValid', '#gameIdValid');
    return false;
  }
  return true;
};

const removeErrorMessage = function() {
  const serverMsg = document.querySelector('.serverMsg');
  serverMsg.style.visibility = 'hidden';
};

const attachListeners = function() {
  const inputs = document.querySelectorAll('[type=text]');
  inputs.forEach(input => {
    input.onkeyup = removeErrorMessage;
  });
};

const main = function() {
  attachListeners();
};

window.onload = main;
