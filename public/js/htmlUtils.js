const createImage = (name, className, unit) => {
  const imagesUrl = {
    red: {
      scout: './images/redScout.png',
      bomb: './images/redBomb.png',
      captain: './images/redCaptain.png',
      colonel: './images/redColonel.png',
      flag: './images/redFlag.png',
      general: './images/redGeneral.png',
      lieutenant: './images/redLieutenant.png',
      major: './images/redMajor.png',
      marshal: './images/redMarshal.png',
      miner: './images/redMiner.png',
      sergeant: './images/redSergeant.png',
      spy: './images/redSpy.png',
      opponent: './images/opponent.png'
    },
    blue: {
      scout: './images/blueScout.png',
      bomb: './images/blueBomb.png',
      captain: './images/blueCaptain.png',
      colonel: './images/blueColonel.png',
      flag: './images/blueFlag.png',
      general: './images/blueGeneral.png',
      lieutenant: './images/blueLieutenant.png',
      major: './images/blueMajor.png',
      marshal: './images/blueMarshal.png',
      miner: './images/blueMiner.png',
      sergeant: './images/blueSergeant.png',
      spy: './images/blueSpy.png',
      opponent: './images/opponent.png'
    }
  };
  if (!imagesUrl[unit][name]) {
    return;
  }
  const htmlImgElement = document.createElement('img');
  htmlImgElement.src = imagesUrl[unit][name];
  htmlImgElement.id = name;
  htmlImgElement.classList.add(className);
  return htmlImgElement;
};

const lakePositions = ['2_4', '3_4', '2_5', '3_5', '6_4', '7_4', '6_5', '7_5'];
const pieceInfo = [
  {
    Rank: '0',
    Piece: 'Bomb',
    ability: 'Immovable; defeats any attacking piece except Miner'
  },
  {
    Rank: '10',
    Piece: 'Marshal',
    ability:
      'Can capture all other pieces except the bomb, can be captured by the Spy if the Spy attacks first.'
  },
  {
    Rank: '9',
    Piece: 'General',
    ability: 'Can capture all lower ranked pieces'
  },
  {
    Rank: '8',
    Piece: 'Colonel',
    ability: 'Can capture all lower ranked pieces'
  },
  {
    Rank: '7',
    Piece: 'Major',
    ability: 'Can capture all lower ranked pieces'
  },
  {
    Rank: '6',
    Piece: 'Captain',
    ability: 'Can capture all lower ranked pieces'
  },
  {
    Rank: '5',
    Piece: 'Lieutenant',
    ability: 'Can capture all lower ranked pieces'
  },
  {
    Rank: '4',
    Piece: 'Sergeant',
    ability: 'Can capture all lower ranked pieces'
  },
  {
    Rank: '3',
    Piece: 'Miner',
    ability: 'Can defuse bombs; can capture all lower ranked pieces'
  },
  {
    Rank: '2',
    Piece: 'Scout',
    ability:
      'Can move any distance in a straight line, without leaping over pieces / lakes; can capture the Spy.'
  },
  {
    Rank: '1',
    Piece: 'Spy',
    ability: 'Can defeat the Marshal, but only if the Spy makes the attack'
  },
  {
    Rank: '0',
    Piece: 'Flag',
    ability: 'Immovable; its capture ends the game'
  }
];
