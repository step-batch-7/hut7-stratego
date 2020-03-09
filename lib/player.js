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
      army: this.army.slice()
    };
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
    if (piece) {
      return { done: true, sourceTileId: from, targetTileId: to };
    }
    return { done: false };
  }
}
module.exports = { Player };
