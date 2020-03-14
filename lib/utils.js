const areArraysEqual = function(array1, array2) {
  return array1.every((element, index) => element === array2[index]);
};

module.exports = { areArraysEqual };
