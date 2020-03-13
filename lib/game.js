const { Player } = require('./player');
const { Piece, StablePiece, Scout } = require('./piece');
const { areArraysEqual, getCoordinate } = require('./utils');

const isValidInfo = function(unit, piecesInfo, pieces) {
  const playerUnits = ['red', 'blue'];
  return (
    playerUnits.includes(unit) &&
    piecesInfo.every(pieceInfo => pieces.includes(pieceInfo.name))
  );
};

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

const getPiecesClasses = function(pieces) {
  const pieceClasses = {};
  pieces.forEach(pieceName => {
    if (pieceName === 'flag' || pieceName === 'bomb') {
      pieceClasses[pieceName] = StablePiece;
      return;
    }
    pieceClasses[pieceName] = pieceName === 'scout' ? Scout : Piece;
  });
  return pieceClasses;
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
    this.setupDone = false;
    this.gamePieces = [
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
    const validInfo = isValidInfo(unit, piecesInfo, this.gamePieces);
    if (validInfo) {
      const classLookUp = getPiecesClasses(this.gamePieces);
      const player = this.getPlayer(unit);
      piecesInfo.forEach(({ position, name }) => {
        const pieceClass = classLookUp[name];
        const piece = new pieceClass(name, getCoordinate(position));
        player.addPiece(piece);
        this.battleField[position] = piece.getStatus();
      });
    }
    return validInfo;
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

  isValidMovement(currentPosition, targetPosition) {
    return this.isValidMovePosition(currentPosition, targetPosition);
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

  isScoutPathIsClear(from, to) {
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
    const pieceName = this.battleField[currentPosition.join('_')].name;
    const possibleMoves = this.players[playerIndex].possibleMoves(
      currentPosition
    );
    const isUnderRange = possibleMoves.some(position =>
      areArraysEqual(position, targetPosition)
    );
    if (pieceName === 'scout') {
      return this.isScoutPathIsClear(currentPosition, targetPosition);
    }
    return isUnderRange;
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

  doAttackOperation(currentPosition, targetPosition, playerIndex, status) {
    const { unit } = this.players[playerIndex].getStatus();
    if (status === 'draw') {
      this.killAttacker(playerIndex, currentPosition);
      this.killDefender(playerIndex, targetPosition);
      return status;
    }
    if (status === 'won') {
      this.killDefender(playerIndex, targetPosition);
      this.movePiece(unit, currentPosition.join('_'), targetPosition.join('_'));
    } else {
      this.killAttacker(playerIndex, currentPosition);
    }
  }

  attack(from, to, unit) {
    const [currentPosition, targetPosition, playerIndexLookup] = [
      getCoordinate(from),
      getCoordinate(to),
      { red: 0, blue: 1 }
    ];
    if (
      !this.isValidAttackPosition(
        currentPosition,
        targetPosition,
        playerIndexLookup[unit]
      )
    ) {
      return 'unsuccessful';
    }
    const status = this.getAttackStatus(from, to);
    this.doAttackOperation(
      currentPosition,
      targetPosition,
      playerIndexLookup[unit],
      status
    );
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
