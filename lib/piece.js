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
}

module.exports = { Piece };
