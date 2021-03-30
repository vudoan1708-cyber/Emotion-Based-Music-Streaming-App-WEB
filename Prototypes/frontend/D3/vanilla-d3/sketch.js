const width = window.innerWidth;
const height = window.innerHeight;

const canvas = d3.select('canvas').attr('viewBox', [0, 0, width, height])

canvas
  .append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', 50)
  .attr('fill', 'green')

return canvas
