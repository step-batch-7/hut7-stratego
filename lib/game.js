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
    this.immovablePieces = ['bomb', 'flag'];
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

  getArmy(unit) {
    const player = this.getPlayer(unit);
    const playerArmy = player.getStatus().army;
    const opponents = { blue: 'red', red: 'blue' };
    const opponentPlayer = this.getPlayer(opponents[unit]);
    const opponentArmy = opponentPlayer.getStatus().army.map(soldier => {
      return {
        name: 'opponent',
        position: soldier.position
      };
    });
    return { redArmy: playerArmy, blueArmy: opponentArmy };
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

  arrangeLakes() {
    this.lakePositions.forEach(position => {
      const lakePosition = position.join('_');
      this.battleField[lakePosition] = { name: 'lake' };
    });
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
        this.battleField[position] = piece;
      });
      this.arrangeLakes();
    }
    return validInfo;
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

  isValidSourceAndTarget(currentPosition, targetPosition) {
    return (
      this.isOccupied(currentPosition) &&
      !this.isTargetOnLake(targetPosition) &&
      !this.isOccupied(targetPosition)
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

  isValidMove(from, to) {
    const position = from.join('_');
    const piece = this.battleField[position];
    let pieceValidation = isTargetAdjacent(from, to);
    if (piece && piece.name === 'scout') {
      pieceValidation = this.isScoutMoveValid(from, to);
    }
    return this.isValidSourceAndTarget(from, to) && pieceValidation;
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
  isFull() {
    return this.players.length === 2;
  }
}
module.exports = { Game };
