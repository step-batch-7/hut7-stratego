const { Piece } = require('./piece');
const { areArraysEqual } = require('./utils');
class Player {
  constructor(name, unit) {
    this.name = name;
    this.unit = unit;
    this.army = [];
  }

  getStatus() {
    return {
      name: this.name,
      unit: this.unit,
      army: this.getAlivePieces().slice()
    };
  }

  getAlivePieces() {
    return this.army.filter(piece => piece.isAlive);
  }

  killPiece(position) {
    const lostPiece = this.army.find(piece => {
      return areArraysEqual(piece.getStatus().position, position);
    });
    lostPiece.kill();
    return true;
  }

  addPiece(piece) {
    piece instanceof Piece && this.army.push(piece);
    return this.army.length;
  }
  movePiece(from, to) {
    const piece = this.army.find(piece => {
      const { position } = piece.getStatus();
      return areArraysEqual(position, from);
    });
    if (piece && piece.isMovable()) {
      piece.move(to);
      return true;
    }
    return false;
  }
}
module.exports = { Player };
