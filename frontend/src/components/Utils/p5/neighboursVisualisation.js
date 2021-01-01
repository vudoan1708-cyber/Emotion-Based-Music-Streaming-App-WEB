import Neighbours from '@/components/Utils/p5/classes/neighbours';

const neighbours = [];

export function createNewNeighbours(data, chosenPoints, width, height) {
  // here I compare new users locations to one that's connecting
  if (data.i > chosenPoints[0] - 10
    && data.i < chosenPoints[0] + 10
  && data.j > chosenPoints[1] - 10
    && data.j < chosenPoints[1] + 10) {
    const x = width / 5 + data.i * 15.4;
    const y = height / 5 + data.j * 15.4;

    // create a new neighbour instance everytime the condition is satisfied
    neighbours.push(new Neighbours(x, y, data.size));
  }
}

export function createHistoricalNeighbours(history, chosenPoints, width, height) {
  for (let h = 0; h < history.length; h += 1) {
    // here I compare old users locations to one that's connecting
    if (history[h].i > chosenPoints[0] - 10
      && history[h].i < chosenPoints[0] + 10
    && history[h].j > chosenPoints[1] - 10
      && history[h].j < chosenPoints[1] + 10) {
      const x = width / 5 + history[h].i * 15.4;
      const y = height / 5 + history[h].j * 15.4;

      // create a new neighbour instance everytime the condition is satisfied
      neighbours.push(new Neighbours(x, y, history[h].size));
    }
  }
}

export function drawNeighbours(p5) {
  if (neighbours.length > 0) {
    for (let i = 0; i < neighbours.length; i += 1) {
      neighbours[i].show(p5);
    }
  }
}
