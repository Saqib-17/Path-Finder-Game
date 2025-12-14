export const bfs = (maze, start, end) => {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // Validation
  if (!isValidCell(start.row, start.col, rows, cols) || 
      !isValidCell(end.row, end.col, rows, cols) ||
      maze[start.row][start.col] === 1 ||
      maze[end.row][end.col] === 1) {
    return [];
  }
  
  const visited = new Set();
  const queue = [{ 
    position: start, 
    path: [start], 
    distance: 0 
  }];
  
  visited.add(`${start.row},${start.col}`);
  
  const steps = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    // Record step for visualization
    steps.push({
      visited: new Set(visited),
      path: [...current.path],
      current: current.position,
      queue: queue.map(node => node.position)
    });
    
    // Check if reached destination
    if (current.position.row === end.row && 
        current.position.col === end.col) {
      steps.push({
        visited: new Set(visited),
        path: [...current.path],
        current: current.position,
        queue: [],
        isComplete: true
      });
      return steps;
    }
    
    // Get valid neighbors
    const neighbors = getNeighbors(
      current.position.row, 
      current.position.col, 
      rows, 
      cols
    );
    
    for (const neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      
      // Check if neighbor is walkable and not visited
      if (!visited.has(key) && maze[neighbor.row][neighbor.col] === 0) {
        visited.add(key);
        queue.push({
          position: neighbor,
          path: [...current.path, neighbor],
          distance: current.distance + 1
        });
      }
    }
  }
  
  // No path found
  if (steps.length > 0) {
    steps[steps.length - 1].noPath = true;
  }
  
  return steps;
};

const isValidCell = (row, col, rows, cols) => {
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

const getNeighbors = (row, col, rows, cols) => {
  const directions = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 },  // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 }   // Right
  ];
  
  const neighbors = [];
  
  for (const dir of directions) {
    const newRow = row + dir.dr;
    const newCol = col + dir.dc;
    
    if (isValidCell(newRow, newCol, rows, cols)) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};