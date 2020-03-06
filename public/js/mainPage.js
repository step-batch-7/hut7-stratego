const showHost = function() {
  document.querySelector('#homePage').style.display = 'none';
  document.querySelector('#hostGame').style.display = 'block';
};

const showWaiting = function() {
  const input = document.querySelector('.placeholderColor').value;
  if (input.trim()) {
    document.querySelector('#hostGame').style.display = 'none';
    document.querySelector('#waitingBlock').style.display = 'block';
    return;
  }
  document.querySelector('#message').style.display = 'block';
};
