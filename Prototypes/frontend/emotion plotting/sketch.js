import { user_emotion, song_emotion } from './spotify.js';
console.log(user_emotion, song_emotion)
const ctx = document.createElement('canvas').getContext('2d');

async function getEmotion() {

  const labels = [];
  const values = [];

}

function plotEmotion(json) {
  const myBubbleChart = new Chart(ctx, {
    type: 'bubble',
    data: data,
    options: options
  });
}