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
}

module.exports = { Piece };
