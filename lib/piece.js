class Piece {
  constructor(name, position) {
    this.name = name;
    this.position = position;
  }
  getStatus() {
    return {
      name: this.name,
      position: this.position
    };
  }
  move(newPosition) {
    this.position = newPosition;
    return newPosition;
  }
}

module.exports = { Piece };
