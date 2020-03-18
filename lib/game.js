const { Player } = require('./player');
const { createPiece } = require('./piece');
const { areArraysEqual } = require('./utils');

const getXPositions = function(xAttacker, yAttacker, xDefender) {
  const possiblePositions = [];
  const min = Math.min(xAttacker, xDefender);
  const max = Math.max(xAttacker, xDefender);
  for (let xAxis = min + 1; xAxis < max; xAxis++) {
    possiblePositions.push(`${xAxis}_${yAttacker}`);
  }
  return possiblePositions;
};

const getYPositions = function(xAttacker, yAttacker, yDefender) {
  const possiblePositions = [];
  const min = Math.min(yAttacker, yDefender);
  const max = Math.max(yAttacker, yDefender);
  for (let yAxis = min + 1; yAxis < max; yAxis++) {
    possiblePositions.push(`${xAttacker}_${yAxis}`);
  }
  return possiblePositions;
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

const createBattleField = function(numberOfRows, numberOfColumns) {
  const lakePosition = ['2_4', '3_4', '2_5', '3_5', '6_4', '7_4', '6_5', '7_5'];
  const battleField = {};
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      const position = `${row}_${column}`;
      battleField[position] = undefined;
      if (lakePosition.includes(position)) {
        battleField[position] = { name: 'lake' };
      }
    }
  }
  return battleField;
};

const countPieces = function(container, piece) {
  const { individualPieceInfo } = container;
  ++container.totalPieceCount;
  if (Object.keys(individualPieceInfo).includes(piece.name)) {
    ++individualPieceInfo[piece.name];
  } else {
    container.individualPieceInfo[piece.name] = 1;
  }
  return container;
};

const validatePiecesCount = function(actualSetup, expectedSetup) {
  const expectedPieces = Object.keys(expectedSetup);
  const actualPieces = Object.keys(actualSetup);
  return actualPieces.every(piece => {
    return (
      expectedPieces.includes(piece) &&
      actualSetup[piece] === expectedSetup[piece]
    );
  });
};

const getPiecesCount = function(pieceInfo) {
  return pieceInfo.reduce(countPieces, {
    totalPieceCount: 0,
    individualPieceInfo: {}
  });
};

const validateSetup = function(pieceInfo, expectedSetup) {
  const { individualPieceInfo, totalPieceCount } = getPiecesCount(pieceInfo);
  if (totalPieceCount !== 10) {
    return false;
  }
  return validatePiecesCount(individualPieceInfo, expectedSetup);
};

class Game {
  constructor(gameId, player) {
    this.id = gameId;
    this.players = [player];
    this.setupDone = false;
    this.gamePieces = {
      flag: 1,
      bomb: 2,
      marshal: 1,
      miner: 2,
      scout: 2,
      general: 1,
      spy: 1
    };
  }

  initBattleField(rows = 10, columns = 10) {
    this.battleField = createBattleField(rows, columns);
  }

  updateBattleField(from, to) {
    const previousPosition = from.join('_');
    const currentPosition = to.join('_');
    this.battleField[currentPosition] = this.battleField[previousPosition];
    this.battleField[previousPosition] = undefined;
    return currentPosition;
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

  arrangeBattleField(unit, setupData) {
    const setupValidation =
      ['red', 'blue'].includes(unit) &&
      validateSetup(setupData, this.gamePieces);

    if (setupValidation) {
      const player = this.getPlayer(unit);
      setupData.forEach(({ position, name }) => {
        const piecePosition = position.split('_').map(coords => +coords);
        const piece = createPiece(name, piecePosition);
        player.addPiece(piece);
        this.battleField[position] = piece.getStatus();
      });

      this.finishedSetup();
    }

    return setupValidation;
  }

  isValidMovePosition(currentPosition, targetPosition) {
    return (
      !this.isOccupiedByLake(currentPosition) &&
      this.isOccupiedByPiece(currentPosition) &&
      !this.isOccupiedByPiece(targetPosition) &&
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

  isValidMovement(currentPosition, targetPosition, unit) {
    const playerIndex = unit === 'red' ? 0 : 1;
    return (
      this.isValidMovePosition(currentPosition, targetPosition) &&
      !this.players[playerIndex].isMovable(currentPosition)
    );
  }

  isValidMove(currentPosition, targetPosition, unit) {
    const piece = this.battleField[currentPosition.join('_')];
    let pieceValidation = isTargetAdjacent(currentPosition, targetPosition);
    if (piece && piece.name === 'scout') {
      pieceValidation = this.isScoutMoveValid(currentPosition, targetPosition);
    }
    return (
      this.isValidMovement(currentPosition, targetPosition, unit) &&
      pieceValidation
    );
  }

  movePiece(unit, from, to) {
    if (this.isValidMove(from, to, unit)) {
      const player = this.getPlayer(unit);
      this.updateBattleField(from, to);
      return player.movePiece(from, to);
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

  isOccupiedByLake(coordinate) {
    const position = coordinate.join('_');
    if (this.battleField[position]) {
      return this.battleField[position].name === 'lake';
    }
    return false;
  }

  isPiecePathIsClear(from, to) {
    const yAxisEqual = from[1] === to[1];
    let requirePositions = '';
    if (yAxisEqual) {
      requirePositions = getXPositions(from[0], from[1], to[0]);
    } else {
      requirePositions = getYPositions(from[0], from[1], to[1]);
    }
    return !requirePositions.some(position => {
      return this.battleField[position] !== undefined;
    });
  }

  ableToKill(currentPosition, targetPosition, playerIndex) {
    const possibleMoves = this.players[playerIndex].possibleMoves(
      currentPosition
    );
    const isUnderRange = possibleMoves.some(position =>
      areArraysEqual(position, targetPosition)
    );
    return (
      isUnderRange && this.isPiecePathIsClear(currentPosition, targetPosition)
    );
  }

  isPositionsOccupiedByLake(currentPosition, targetPosition) {
    return (
      !this.isOccupiedByLake(currentPosition) &&
      !this.isOccupiedByLake(targetPosition)
    );
  }

  isValidAttackPosition(currentPosition, targetPosition, playerIndex) {
    return (
      this.isPositionsOccupiedByLake(currentPosition, targetPosition) &&
      this.isOccupiedByPiece(currentPosition) &&
      this.isOccupiedByPiece(targetPosition) &&
      this.ableToKill(currentPosition, targetPosition, playerIndex)
    );
  }

  killAttacker(playerIndex, position) {
    this.battleField[position.join('_')] = undefined;
    this.players[playerIndex].killPiece(position);
  }

  killDefender(playerIndex, position) {
    this.battleField[position.join('_')] = undefined;
    this.players[1 - playerIndex].killPiece(position);
  }

  doAttackOperation(currentPosition, targetPosition, playerIndex, status) {
    const { unit } = this.players[playerIndex].getStatus();
    if (status === 'draw') {
      this.killAttacker(playerIndex, currentPosition);
      this.killDefender(playerIndex, targetPosition);
      return status;
    }
    if (status === 'won') {
      this.killDefender(playerIndex, targetPosition);
      this.movePiece(unit, currentPosition, targetPosition);
    } else {
      this.killAttacker(playerIndex, currentPosition);
    }
  }

  attack(from, to, unit) {
    const playerIndexLookup = { red: 0, blue: 1 };
    if (!this.isValidAttackPosition(from, to, playerIndexLookup[unit])) {
      return 'unsuccessful';
    }
    const player = this.getPlayer(unit);
    const defenderPieceName = this.battleField[to.join('_')].name;
    const status = player.getAttackStatus(from, defenderPieceName);
    this.doAttackOperation(from, to, playerIndexLookup[unit], status);
    return status;
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
