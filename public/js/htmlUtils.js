const createImage = (name, className) => {
  const imagesUrl = {
    scout: './images/scout.png',
    bomb: './images/bomb.png',
    captain: './images/captain.png',
    colonel: './images/colonel.png',
    flag: './images/flag.png',
    general: './images/general.png',
    lieutenant: './images/lieutenant.png',
    major: './images/major.png',
    marshal: './images/marshal.png',
    miner: './images/miner.png',
    sergeant: './images/sergeant.png',
    spy: './images/spy.png'
  };
  if (!imagesUrl[name]) {
    return;
  }
  const htmlImgElement = document.createElement('img');
  htmlImgElement.src = imagesUrl[name];
  htmlImgElement.classList.add(className);
  return htmlImgElement;
};

const lakePositions = ['2_4', '3_4', '2_5', '3_5', '6_4', '7_4', '6_5', '7_5'];