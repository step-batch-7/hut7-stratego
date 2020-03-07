const showWaiting = function() {
  const input = document.querySelector('.placeholderColor').value;
  if (input.trim()) {
    document.querySelector('#hostDisplay').innerHTML = waitingTemplate();
    return;
  }
  document.querySelector('#message').style.visibility = 'visible';
};

const hostTemplate = function() {
  return `
 <a href="index.html"><i class="far fa-arrow-alt-circle-left" id="back"></i></a>
    <div id="hostGame" class="center">
      <div class="title">Stratego</div>
      <div class="inputFields">
        <label for="username">Name:</label>
        <input
          name="username"
          class="placeholderColor"
          placeholder="enter name"
          type="text"
          autocomplete="off"
        />
        <p id="message">please enter your name</p>
      </div>
      <div class="host" onclick="showWaiting()">
        Host
      </div>
    </div>`;
};

const waitingTemplate = function() {
  return `
  <div id="waitingBlock" class="center">
      <div class="title">Stratego</div>
      <div class="gameIdMsg">Your GameID</div>
      <div class="gameId">25314</div>
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw" id="loadingGif"></i>
      <div class="waitingMsg">Waiting for other player to join</div>
    </div>`;
};

const main = function() {
  document.querySelector('#hostDisplay').innerHTML = hostTemplate();
};
