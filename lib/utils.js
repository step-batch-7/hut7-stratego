const areArraysEqual = function(array1, array2) {
  return array1.every((element, index) => element === array2[index]);
};

const getCoordinate = function(position) {
  return position.split('_').map(coordinate => +coordinate);
};

module.exports = { areArraysEqual, getCoordinate };
