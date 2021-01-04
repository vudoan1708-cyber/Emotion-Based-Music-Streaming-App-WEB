/* eslint-disable padded-blocks */
import Neighbours from '@/components/Utils/p5/classes/neighbours';
import { indicestoCoordinates } from '@/components/Utils/logic/algorithm';

const neighbours = [];

export function createNewNeighbours(data, chosenPoints, width, height) {
  // here I compare new users locations to one that's connecting
  if (data.i > chosenPoints[0] - 10
    && data.i < chosenPoints[0] + 10
  && data.j > chosenPoints[1] - 10
    && data.j < chosenPoints[1] + 10) {

    const coordinates = indicestoCoordinates(data.i, data.j, width, height);

    // create a new neighbour instance everytime the condition is satisfied
    neighbours.push(new Neighbours(coordinates.x, coordinates.y, data.size));
  }
}

export function createHistoricalNeighbours(history, chosenPoints, width, height) {
  for (let h = 0; h < history.length; h += 1) {
    // here I compare old users locations to one that's connecting
    if (history[h].i > chosenPoints[0] - 10
      && history[h].i < chosenPoints[0] + 10
    && history[h].j > chosenPoints[1] - 10
      && history[h].j < chosenPoints[1] + 10) {

      const coordinates = indicestoCoordinates(history[h].i, history[h].j, width, height);

      // create a new neighbour instance everytime the condition is satisfied
      neighbours.push(new Neighbours(coordinates.x, coordinates.y, history[h].size));
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
