const isValidName = function() {
  const playerName = document.querySelector('.placeholderColor').value;
  if (playerName.trim()) {
    return true;
  }
  document.querySelector('.placeholderColor').value = '';
  document.querySelector('#message').style.visibility = 'visible';
  return false;
};
