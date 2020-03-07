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
      army: this.army
    };
  }
}
module.exports = { Player };
