export const generateMaze = (rows, cols) => {
  // Create empty grid
  const maze = Array(rows).fill().map(() => Array(cols).fill(0));
  
  // Add border walls
  for (let i = 0; i < rows; i++) {
    maze[i][0] = 1;
    maze[i][cols - 1] = 1;
  }
  
  for (let j = 0; j < cols; j++) {
    maze[0][j] = 1;
    maze[rows - 1][j] = 1;
  }
  
  // Add random interior walls (30% density)
  for (let i = 2; i < rows - 2; i += 2) {
    for (let j = 2; j < cols - 2; j += 2) {
      maze[i][j] = 1;
      
      // Add random extension
      const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: -1 }
      ];
      
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const newRow = i + dir.dy;
      const newCol = j + dir.dx;
      
      if (newRow > 0 && newRow < rows - 1 && newCol > 0 && newCol < cols - 1) {
        maze[newRow][newCol] = 1;
      }
    }
  }
  
  // Ensure start and end are clear
  maze[1][1] = 0;
  maze[1][2] = 0;
  maze[2][1] = 0;
  maze[rows - 2][cols - 2] = 0;
  maze[rows - 2][cols - 3] = 0;
  maze[rows - 3][cols - 2] = 0;
  
  return maze;
};

export const createEmptyMaze = (rows, cols) => {
  const maze = Array(rows).fill().map(() => Array(cols).fill(0));
  
  // Add border walls
  for (let i = 0; i < rows; i++) {
    maze[i][0] = 1;
    maze[i][cols - 1] = 1;
  }
  
  for (let j = 0; j < cols; j++) {
    maze[0][j] = 1;
    maze[rows - 1][j] = 1;
  }
  
  return maze;
};