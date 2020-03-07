class Piece {
  constructor(name, position) {
    this.name = name;
    this.position = position;
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
}

module.exports = { Piece };
