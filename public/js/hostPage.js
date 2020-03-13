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
  const errorMsg = document.querySelector('.errorMsg');
  errorMsg.style.visibility = 'hidden';
};

const attachListeners = function() {
  const inputs = document.querySelectorAll('[type=text]');
  inputs.forEach(input => {
    input.onkeyup = removeErrorMessage;
  });
};

const manageInputLabel = function(labelClass, inputClass, errorId) {
  const label = document.querySelector(`span.${labelClass}`);
  label.style.top = '-2rem';
  const input = document.querySelector(`.${inputClass}`);
  input.addEventListener('input', () => {
    label.style.top = '-2rem';
    if (input.value) {
      label.style.top = '0';
      const errElement = document.querySelector(`#${errorId}`);
      errElement.style.visibility = 'hidden';
    }
  });
};

const main = function() {
  attachListeners();
  manageInputLabel('enterYourName', 'nameInput', 'nameValid');
  manageInputLabel('enterGameId', 'gameIdInput', 'gameIdValid');
};

window.onload = main;
