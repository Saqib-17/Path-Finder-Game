// algorithms/dijkstra.js
export const dijkstra = (maze, start, end) => {
  const rows = maze.length;
  const cols = maze[0].length;

  if (maze[start.row][start.col] === 1 || maze[end.row][end.col] === 1) {
    return [];
  }

  const steps = [];
  const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const visited = new Set();
  const previous = Array.from({ length: rows }, () => Array(cols).fill(null));

  distances[start.row][start.col] = 0;

  const queue = [{ row: start.row, col: start.col, dist: 0 }];

  const directions = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 },  // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 }   // Right
  ];

  while (queue.length > 0) {
    // Get node with smallest distance
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift();
    const key = `${current.row},${current.col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    // Record step for visualization
    const visitedArray = Array.from(visited).map(k => k.split(',').map(Number));
    const path = [];
    let temp = current;
    while (temp) {
      path.unshift({ row: temp.row, col: temp.col });
      temp = previous[temp.row][temp.col];
    }

    steps.push({
      visited: visitedArray,
      path,
      current,
      queue: queue.map(n => ({ row: n.row, col: n.col }))
    });

    // Check if reached end
    if (current.row === end.row && current.col === end.col) {
      steps.push({ visited: visitedArray, path, current, queue: [], isComplete: true });
      return steps;
    }

    // Check neighbors
    for (const { dr, dc } of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        maze[newRow][newCol] === 0
      ) {
        const newDist = distances[current.row][current.col] + 1;
        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          previous[newRow][newCol] = current;
          queue.push({ row: newRow, col: newCol, dist: newDist });
        }
      }
    }
  }

  // No path found
  if (steps.length > 0) steps[steps.length - 1].noPath = true;
  return steps;
};
