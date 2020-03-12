const pieceRanks = {
  flag: 0,
  bomb: 11,
  scout: 2,
  marshal: 10,
  spy: 1,
  sergeant: 4,
  colonel: 8,
  general: 9,
  lieutenant: 5,
  captain: 6,
  major: 7,
  miner: 3
};

const getXCoordinates = function(xAxis, yAxis) {
  const possibleMoves = [];
  for (let axis = 0; axis < 10; axis++) {
    if (axis !== xAxis) {
      possibleMoves.push([axis, yAxis]);
    }
  }
  return possibleMoves;
};
const getYCoordinates = function(xAxis, yAxis) {
  const possibleMoves = [];
  for (let axis = 0; axis < 10; axis++) {
    if (axis !== yAxis) {
      possibleMoves.push([xAxis, axis]);
    }
  }
  return possibleMoves;
};

class Piece {
  constructor(name, position, movable) {
    this.name = name;
    this.position = position;
    this.movable = movable;
    this.isAlive = true;
    this.rank = pieceRanks[name];
  }

  kill() {
    this.isAlive = false;
  }

  getStatus() {
    return {
      name: this.name,
      position: this.position.slice(),
      rank: this.rank
    };
  }
  move(newPosition) {
    this.position = newPosition;
    return this.position.slice();
  }
  isMovable() {
    return this.movable;
  }
  possibleMoves() {
    const [x, y] = this.position;
    const delta = 1;
    return [
      [x + delta, y],
      [x - delta, y],
      [x, y + delta],
      [x, y - delta]
    ];
  }
}

class Scout extends Piece {
  constructor(name, position, movable) {
    super(name, position, movable);
  }
  possibleMoves() {
    const [xAxis, yAxis] = this.position;
    const xAxisPossibleMoves = getXCoordinates(xAxis, yAxis);
    const yAxisPossibleMoves = getYCoordinates(xAxis, yAxis);
    return [...xAxisPossibleMoves, ...yAxisPossibleMoves];
  }
}

class StablePiece extends Piece {
  constructor(name, position, movable) {
    super(name, position, movable);
  }
  possibleMoves() {
    return [];
  }
}

module.exports = { Piece, StablePiece, Scout };
