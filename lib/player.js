const { createPiece } = require('./piece');
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

  findPiece(position) {
    return this.army.find(piece => {
      return areArraysEqual(piece.getStatus().position, position);
    });
  }

  getAlivePieces() {
    return this.army.filter(piece => piece.isAlive);
  }

  killPiece(position) {
    const lostPiece = this.findPiece(position);
    lostPiece.kill();
    return true;
  }

  getAttackStatus(from, defenderPieceName) {
    const attackerPiece = this.findPiece(from);
    return attackerPiece.getAttackStatus(defenderPieceName);
  }

  possibleMoves(position) {
    const piece = this.findPiece(position);
    return piece.possibleMoves().slice();
  }

  addPiece(name, position) {
    const piece = createPiece(name, position);
    return this.army.push(piece);
  }

  getPieceStatus(position) {
    const pieceStatus = this.findPiece(position).getStatus();
    pieceStatus.unit = this.unit;
    return pieceStatus;
  }

  movePiece(from, to) {
    const piece = this.findPiece(from);
    if (piece && piece.isMovePossible(to)) {
      piece.move(to);
      return true;
    }
    return false;
  }
}
module.exports = { Player };
