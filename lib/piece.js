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

const isSpecialAttacks = function(defenderRank, attackerRank) {
  const spyMarshalAttack = defenderRank === 10 && attackerRank === 1;
  const minerBombAttack = defenderRank === 11 && attackerRank === 3;
  return spyMarshalAttack || minerBombAttack;
};

const isDeltaOne = function(start, target) {
  return start === target + 1 || start === target - 1;
};

const isTargetAdjacent = function([fromX, fromY], [toX, toY]) {
  const validCoords =
    fromX === toX ? [fromY, toY] : fromY === toY ? [fromX, toX] : false;
  return validCoords && isDeltaOne(...validCoords);
};

class Piece {
  constructor(name, position) {
    this.name = name;
    this.position = position;
    this.isAlive = true;
    this.rank = pieceRanks[name];
    this.isMobile = true;
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

  isMovePossible(target) {
    return this.isMobile && isTargetAdjacent(this.position, target);
  }

  getAttackStatus(defenderPieceName) {
    const attackerRank = this.rank;
    const defenderRank = pieceRanks[defenderPieceName];
    if (isSpecialAttacks(defenderRank, attackerRank)) {
      return 'won';
    }

    if (attackerRank === defenderRank) {
      return 'draw';
    }
    return defenderRank < attackerRank ? 'won' : 'lost';
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

  isMovePossible(target) {
    const [fromX, fromY] = this.position;
    const [toX, toY] = target;
    return this.isMobile && (fromX === toX || fromY === toY);
  }
}

class StablePiece extends Piece {
  constructor(name, position) {
    super(name, position);
    this.allowedMoves = [];
    this.isMobile = false;
  }

  possibleMoves() {
    return this.allowedMoves;
  }
}

const createPiece = function(name, position) {
  const inheritanceLookup = new Map([
    [['bomb', 'flag'], StablePiece],
    [['scout'], Scout],
    [['marshal', 'general', 'miner', 'spy'], Piece]
  ]);
  let pieceConstructor;

  inheritanceLookup.forEach((constructor, pieceGroup) => {
    if (pieceGroup.includes(name)) {
      pieceConstructor = constructor;
    }
  });

  return new pieceConstructor(name, position);
};

module.exports = { Piece, StablePiece, Scout, createPiece };
