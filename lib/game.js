const { Player } = require('./player');
const { Piece } = require('./piece');

const createBattleFieldTemplate = function(numberOfRows, numberOfColumns) {
  const battleField = {};
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      battleField[`${row}_${column}`] = undefined;
    }
  }
  return battleField;
};

const getCoordinate = function(position) {
  return position.split('_').map(coordinate => +coordinate);
};

const isValidInfo = function(unit, piecesInfo) {
  const playerUnits = ['red', 'blue'];
  const pieces = [
    'flag',
    'bomb',
    'scout',
    'marshal',
    'spy',
    'sergeant',
    'colonel',
    'general',
    'lieutenant',
    'captain',
    'major',
    'miner'
  ];
  return (
    playerUnits.includes(unit) &&
    piecesInfo.every(pieceInfo => pieces.includes(pieceInfo.name))
  );
};

class Game {
  constructor(gameId, battleField) {
    this.id = gameId;
    this.players = [];
    this.battleField = battleField;
    this.lakePositions = [
      [2, 4],
      [3, 4],
      [2, 5],
      [3, 5],
      [6, 4],
      [7, 4],
      [6, 5],
      [7, 5]
    ];
  }

  getStatus() {
    return {
      id: this.id,
      players: this.players.slice(),
      battleField: this.battleField,
      lakePositions: this.lakePositions.slice()
    };
  }

  addPlayer(player) {
    player instanceof Player && this.players.push(player);
    return this.players.length;
  }

  getPlayer(unit) {
    return this.players.find(player => player.getStatus().unit === unit);
  }

  arrangeBattleField({ unit, piecesInfo }) {
    if (isValidInfo(unit, piecesInfo)) {
      piecesInfo.forEach(({ position, name }) => {
        const piece = new Piece(name, getCoordinate(position));
        const player = this.getPlayer(unit);
        player.addPiece(piece);
        this.battleField[position] = piece;
      });
      return true;
    }
    return false;
  }
}
module.exports = { Game, createBattleFieldTemplate };

/*

const isvalidmov = (unit, from, to) => {
    if(this.lakePositions.includes(from)) return false;
    if(this.battleField[getCoordinate(from)] == undefined){
    const player = game.getPlayer(unit);
    player.movePiece(from, to);
    return true
    }
    return false
}
*/
