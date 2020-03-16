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
  constructor(name, position) {
    this.name = name;
    this.position = position;
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

  getSpyMarshalAttack(defenderRank, attackerRank) {
    return defenderRank === 10 && attackerRank === 1;
  }

  getAttackStatus(defenderPieceName) {
    const attackerRank = this.rank;
    const defenderRank = pieceRanks[defenderPieceName];
    if (attackerRank === defenderRank) {
      return 'draw';
    }
    const pieceAttack = defenderRank < attackerRank ? 'won' : 'lost';
    return this.getSpyMarshalAttack(defenderRank, attackerRank) || pieceAttack;
  }
}

class Scout extends Piece {
  constructor(name, position) {
    super(name, position);
  }

  possibleMoves() {
    const [xAxis, yAxis] = this.position;
    const xAxisPossibleMoves = getXCoordinates(xAxis, yAxis);
    const yAxisPossibleMoves = getYCoordinates(xAxis, yAxis);
    return [...xAxisPossibleMoves, ...yAxisPossibleMoves];
  }
}

class StablePiece extends Piece {
  constructor(name, position) {
    super(name, position);
  }

  getAttackStatus(defenderPieceName) {
    const attackerRank = this.rank;
    const defenderRank = pieceRanks[defenderPieceName];
    const minerBombAttack = defenderRank === 3 && attackerRank === 11;
    return minerBombAttack ? 'won' : 'lost';
  }

  possibleMoves() {
    return [];
  }
}

module.exports = { Piece, StablePiece, Scout };
