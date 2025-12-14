export const dfs = (maze, start, end) => {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // Validation
  if (maze[start.row][start.col] === 1 || maze[end.row][end.col] === 1) {
    return [];
  }
  
  const visited = new Set();
  const stack = [{ 
    position: start, 
    path: [start], 
    distance: 0 
  }];
  
  visited.add(`${start.row},${start.col}`);
  
  const steps = [];
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    // Record step - Convert visited Set to array of [row, col] pairs
    const visitedArray = Array.from(visited).map(key => {
      const [r, c] = key.split(',').map(Number);
      return [r, c];
    });
    
    steps.push({
      visited: visitedArray,
      path: [...current.path],
      current: current.position,
      stack: stack.map(node => node.position)
    });
    
    // Check if reached destination
    if (current.position.row === end.row && 
        current.position.col === end.col) {
      steps.push({
        visited: visitedArray,
        path: [...current.path],
        current: current.position,
        stack: [],
        isComplete: true
      });
      return steps;
    }
    
    // Get valid neighbors (order: right, down, left, up for DFS)
    const directions = [
      { dr: 0, dc: 1 },   // Right
      { dr: 1, dc: 0 },   // Down
      { dr: 0, dc: -1 },  // Left
      { dr: -1, dc: 0 }   // Up
    ];
    
    for (const dir of directions) {
      const newRow = current.position.row + dir.dr;
      const newCol = current.position.col + dir.dc;
      
      if (newRow >= 0 && newRow < rows && 
          newCol >= 0 && newCol < cols &&
          maze[newRow][newCol] === 0) {
        
        const key = `${newRow},${newCol}`;
        if (!visited.has(key)) {
          visited.add(key);
          stack.push({
            position: { row: newRow, col: newCol },
            path: [...current.path, { row: newRow, col: newCol }],
            distance: current.distance + 1
          });
        }
      }
    }
  }
  
  // No path found
  if (steps.length > 0) {
    steps[steps.length - 1].noPath = true;
  }
  
  return steps;
};