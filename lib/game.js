class Game {
  constructor(gameId) {
    this.id = gameId;
    this.players = [];
    this.battleField = {};
    this.lakePositions = [
      [2, 4],
      [3, 4],
      [2, 5],
      [3, 5],
      [6, 4],
      [7, 4],
      [6, 5],
      [7, 5]
    ];
  }
  getStatus() {
    return {
      id: this.id,
      players: this.players.slice(),
      battleField: this.battleField,
      lakePositions: this.lakePositions.slice()
    };
  }
}
module.exports = { Game };
