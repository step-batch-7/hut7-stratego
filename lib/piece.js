class Piece {
  constructor(name, position, movable, rank) {
    this.name = name;
    this.position = position;
    this.movable = movable;
    this.isAlive = true;
    this.rank = rank;
  }
  getStatus() {
    return {
      name: this.name,
      position: this.position.slice()
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
