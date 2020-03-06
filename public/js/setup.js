const createTerritory = function() {
  const territory = document.querySelector('.territory');
  for (let row = 3; row >= 0; row--) {
    for (let column = 0; column < 10; column++) {
      const tile = document.createElement('div');
      tile.id = `${row}_${column}`;
      tile.classList.add('tile');
      territory.appendChild(tile);
    }
  }
};

const main = function() {
  createTerritory();
};
window.onload = main;
