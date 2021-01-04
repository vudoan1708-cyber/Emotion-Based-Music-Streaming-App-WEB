export default function make2dArray(cols, rows) {
  const arr = new Array(cols);

  for (let i = 0; i < cols; i += 1) {
    arr[i] = new Array(rows);
  }
  return arr;
}
