const { Piece } = require('./piece');
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
}
module.exports = { Player };
