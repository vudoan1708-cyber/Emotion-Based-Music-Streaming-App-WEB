/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
// DOM
// const top_left = document.getElementById('top_left');
// const top_right = document.getElementById('top_right');
// const bottom_left = document.getElementById('bottom_left');
// const bottom_right = document.getElementById('bottom_right');

export default function changeMap(num, showMap, top_left, top_right, bottom_left, bottom_right) {
  showMap = num;
  if (showMap === 1 && top_left.style.opacity === '1') {
    top_left.style.opacity = '0';
    top_right.style.opacity = '1';
    bottom_left.style.opacity = '1';
    bottom_right.style.opacity = '1';
  } else if (showMap === 2 && top_right.style.opacity === '1') {
    top_left.style.opacity = '1';
    top_right.style.opacity = '0';
    bottom_left.style.opacity = '1';
    bottom_right.style.opacity = '1';
  } else if (showMap === 3 && bottom_left.style.opacity === '1') {
    top_left.style.opacity = '1';
    top_right.style.opacity = '1';
    bottom_left.style.opacity = '0';
    bottom_right.style.opacity = '1';
  } else if (showMap === 4 && bottom_right.style.opacity === '1') {
    top_left.style.opacity = '1';
    top_right.style.opacity = '1';
    bottom_left.style.opacity = '1';
    bottom_right.style.opacity = '0';
  }

  return showMap;
}
