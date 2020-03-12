/* eslint-disable max-statements */
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

const generatePositions = function(
  minimum,
  maximum,
  constantField,
  areRowsEqual
) {
  const positions = [];
  const start = minimum + 1;
  for (let index = start; index < maximum; index++) {
    let pattern = `${index}_${constantField}`;
    if (areRowsEqual) {
      pattern = `${constantField}_${index}`;
    }
    positions.push(pattern);
  }
  return positions;
};

const getPositions = function(from, to) {
  const [sourceRow, sourceColumn] = from;
  const [targetRow, targetColumn] = to;
  let min, max;
  if (sourceRow === targetRow) {
    min = Math.min(sourceColumn, targetColumn);
    max = Math.max(sourceColumn, targetColumn);
    return generatePositions(min, max, sourceRow, true);
  }
  min = Math.min(sourceRow, targetRow);
  max = Math.max(sourceRow, targetRow);
  return generatePositions(min, max, sourceColumn);
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

const getAllSoldiers = function(player) {
  const playerArmy = player.getStatus().army.map(piece => {
    const { name, position } = piece.getStatus();
    return { name, position };
  });
  return playerArmy;
};

class Game {
  constructor(gameId, player, battleField) {
    this.id = gameId;
    this.players = [player];
    this.battleField = battleField;
    this.immovablePieces = ['bomb', 'flag'];
    this.setupDone = false;
  }

  getId() {
    return this.id;
  }

  getStatus() {
    return {
      id: this.id,
      players: this.players.slice(),
      battleField: this.battleField
    };
  }

  getArmy(unit) {
    const opponents = { blue: 'red', red: 'blue' };
    const player = this.getPlayer(unit);
    const opponentPlayer = this.getPlayer(opponents[unit]);
    const playerArmy = getAllSoldiers(player);
    const opponentArmy = getAllSoldiers(opponentPlayer);
    if (unit === 'red') {
      return { redArmy: playerArmy, blueArmy: opponentArmy };
    }
    return { redArmy: opponentArmy, blueArmy: playerArmy };
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
    const validInfo = isValidInfo(unit, piecesInfo);
    if (validInfo) {
      const player = this.getPlayer(unit);
      piecesInfo.forEach(({ position, name }) => {
        let isMovable = true;
        if (this.immovablePieces.includes(name)) {
          isMovable = !isMovable;
        }
        const piece = new Piece(name, getCoordinate(position), isMovable);
        player.addPiece(piece);
        this.battleField[position] = piece.getStatus();
      });
    }
    return validInfo;
  }

  isOccupiedByLake(coordinate) {
    const position = coordinate.join('_');
    if (this.battleField[position]) {
      return this.battleField[position].name === 'lake';
    }
    return false;
  }

  isOccupiedByPiece(coordinate) {
    const position = coordinate.join('_');
    if (this.battleField[position]) {
      return this.battleField[position].name !== 'lake';
    }
    return false;
  }

  isValidMovePosition(currentPosition, targetPosition) {
    return (
      !this.isOccupiedByLake(currentPosition) &&
      this.isOccupiedByPiece(currentPosition) &&
      !this.isOccupiedByPiece(targetPosition) &&
      !this.isOccupiedByLake(targetPosition)
    );
  }

  isPieceMovable(currentPosition) {
    const position = currentPosition.join('_');
    const piece = this.battleField[position];
    const pieceMovable = this.immovablePieces.includes(piece.name);
    return !pieceMovable;
  }

  isValidAttackPosition(currentPosition, targetPosition) {
    return (
      !this.isOccupiedByLake(currentPosition) &&
      this.isOccupiedByPiece(currentPosition) &&
      this.isOccupiedByPiece(targetPosition) &&
      !this.isOccupiedByLake(targetPosition)
    );
  }

  isScoutMoveValid(from, to) {
    const isValidMove = from.some(
      (coordinate, index) => to[index] === coordinate
    );
    const inBetweenPosition = getPositions(from, to);
    const isObstaclePresent = inBetweenPosition.every(
      position => this.battleField[position] === undefined
    );
    return isValidMove && isObstaclePresent;
  }

  isValidMovement(currentPosition, targetPosition) {
    return (
      this.isValidMovePosition(currentPosition, targetPosition) &&
      this.isPieceMovable(currentPosition)
    );
  }

  isValidMove(currentPosition, targetPosition) {
    const position = currentPosition.join('_');
    const piece = this.battleField[position];
    let pieceValidation = isTargetAdjacent(currentPosition, targetPosition);
    if (piece && piece.name === 'scout') {
      pieceValidation = this.isScoutMoveValid(currentPosition, targetPosition);
    }
    return (
      this.isValidMovement(currentPosition, targetPosition) && pieceValidation
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

  getAttackStatus(from, to) {
    const defenderRank = this.battleField[to].rank;
    const attackerRank = this.battleField[from].rank;
    if (defenderRank === attackerRank) {
      return 'draw';
    }
    return defenderRank > attackerRank ? 'lost' : 'won';
  }

  killAttacker(playerIndex, position) {
    this.battleField[position.join('_')] = undefined;
    this.players[playerIndex].killPiece(position);
  }

  killDefender(playerIndex, position) {
    this.battleField[position.join('_')] = undefined;
    this.players[1 - playerIndex].killPiece(position);
  }

  attack(from, to, unit) {
    const [currentPosition, targetPosition, playerIndexLookup] = [
      getCoordinate(from),
      getCoordinate(to),
      { red: 0, blue: 1 }
    ];
    if (!this.isValidAttackPosition(currentPosition, targetPosition)) {
      return 'unsuccessful';
    }
    const status = this.getAttackStatus(from, to);
    if (status === 'draw') {
      this.killAttacker(playerIndexLookup[unit], currentPosition);
      this.killDefender(playerIndexLookup[unit], targetPosition);
      return status;
    }
    if (status === 'won') {
      this.killDefender(playerIndexLookup[unit], targetPosition);
      this.movePiece(unit, from, to);
    } else {
      this.killAttacker(playerIndexLookup[unit], currentPosition);
    }
    return status;
  }

  updateBattleField(from, to) {
    this.battleField[to] = this.battleField[from];
    this.battleField[from] = undefined;
    return to;
  }
  isFull() {
    return this.players.length === 2;
  }

  finishedSetup() {
    this.setupDone = true;
  }

  isSetupDone() {
    return this.setupDone;
  }
}

module.exports = { Game };
