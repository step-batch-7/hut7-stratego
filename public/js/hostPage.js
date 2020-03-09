const isValidName = function() {
  const playerName = document.querySelector('.input').value;
  if (playerName.trim()) {
    return true;
  }
  document.querySelector('.input').value = '';
  document.querySelector('#message').style.visibility = 'visible';
  return false;
};

const isValidInput = function() {
  const playerName = document.querySelector('[name=playerName]').value;
  const gameId = document.querySelector('[name=gameId]').value;
  if (!playerName.trim()) {
    document.querySelector('#nameValid').style.visibility = 'visible';
    return false;
  }
  if (!gameId.trim()) {
    document.querySelector('#gameIdValid').style.visibility = 'visible';
    return false;
  }
  return true;
};
