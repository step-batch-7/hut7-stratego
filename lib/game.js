const { Player } = require('./player');
const { Piece } = require('./piece');
const { areArraysEqual, getCoordinate } = require('./utils');

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

const isTargetAdjacent = function(currentPosition, targetPosition) {
  const [x, y] = currentPosition;
  const delta = 1;
  const adjacentTiles = [
    [x + delta, y],
    [x - delta, y],
    [x, y + delta],
    [x, y - delta]
  ];
  return adjacentTiles.some(adjacentTile =>
    areArraysEqual(adjacentTile, targetPosition)
  );
};

class Game {
  constructor(gameId, player, battleField) {
    this.id = gameId;
    this.players = [player];
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

  getId() {
    return this.id;
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
    if (player instanceof Player) {
      return this.players.push(player);
    }
    return this.players.length;
  }

  getPlayer(unit) {
    return this.players.find(player => player.getStatus().unit === unit);
  }

  arrangeBattleField({ unit, piecesInfo }) {
    if (isValidInfo(unit, piecesInfo)) {
      const player = this.getPlayer(unit);
      piecesInfo.forEach(({ position, name }) => {
        const piece = new Piece(name, getCoordinate(position));
        player.addPiece(piece);
        this.battleField[position] = piece;
      });
      return true;
    }
    return false;
  }

  isTargetOnLake(position) {
    return this.lakePositions.some(lakePosition =>
      areArraysEqual(position, lakePosition)
    );
  }

  isOccupied(coordinate) {
    const position = coordinate.join('_');
    return this.battleField[position] !== undefined;
  }

  isValidMove(currentPosition, targetPosition) {
    return (
      this.isOccupied(currentPosition) &&
      !this.isTargetOnLake(targetPosition) &&
      isTargetAdjacent(currentPosition, targetPosition) &&
      !this.isOccupied(targetPosition)
    );
  }

  movePiece(unit, from, to) {
    const currentPosition = getCoordinate(from);
    const targetPosition = getCoordinate(to);
    if (this.isValidMove(currentPosition, targetPosition)) {
      const player = this.getPlayer(unit);
      this.updateBattleField(from, to);
      return player.movePiece(currentPosition, targetPosition);
    }
    return false;
  }

  updateBattleField(from, to) {
    this.battleField[to] = this.battleField[from];
    this.battleField[from] = undefined;
    return to;
  }
}
module.exports = { Game };
