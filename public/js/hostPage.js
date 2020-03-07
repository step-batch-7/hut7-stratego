const showWaiting = function() {
  const input = document.querySelector('.placeholderColor').value;
  if (input.trim()) {
    window.location.href = 'waiting.html';
    return;
  }
  document.querySelector('#message').style.visibility = 'visible';
};
