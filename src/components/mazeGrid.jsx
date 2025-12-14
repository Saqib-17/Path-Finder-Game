import React, { useRef, useEffect } from 'react';
import './MazeGrid.css';

const MazeGrid = ({ 
  maze, 
  currentStep, 
  onCellClick, 
  start, 
  end, 
  isDrawing,
  cellSize = 30 
}) => {
  const canvasRef = useRef(null);
  const isMouseDown = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw walls
    drawWalls(ctx);
    
    // Draw start and end
    drawStartEnd(ctx);
    
    // Draw algorithm visualization
    if (currentStep) {
      drawAlgorithmSteps(ctx, currentStep);
    }
    
  }, [maze, currentStep, start, end]);
 //show loading if maze is undefined or null
  if (!maze || !Array.isArray(maze) || maze.length === 0) {
    return (
      <div className="maze-loading">
        <div className="loading-spinner-small"></div>
        <p>Loading maze grid...</p>
      </div>
    );
  }

  const rows = maze.length;
  const cols = maze[0] ? maze[0].length : 0;

  // Additional check for valid dimensions
  if (rows === 0 || cols === 0) {
    return (
      <div className="maze-error">
        <p>Invalid maze dimensions</p>
      </div>
    );
  }



  const drawGrid = (ctx) => {
    // Draw grid lines
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(cols * cellSize, i * cellSize);
      ctx.stroke();
    }
    
    for (let j = 0; j <= cols; j++) {
      ctx.beginPath();
      ctx.moveTo(j * cellSize, 0);
      ctx.lineTo(j * cellSize, rows * cellSize);
      ctx.stroke();
    }
  };

  const drawWalls = (ctx) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (maze[i][j] === 1) { 
          ctx.fillStyle = '#2c3e50';
          ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
          
          ctx.fillStyle = '#34495e';
          ctx.fillRect(j * cellSize + 2, i * cellSize + 2, cellSize - 4, cellSize - 4);
        } else { // Path
          ctx.fillStyle = '#ecf0f1';
          ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  const drawStartEnd = (ctx) => {
    // Draw start cell
    ctx.fillStyle = '#00b894';
    ctx.beginPath();
    ctx.arc(
      start.col * cellSize + cellSize/2,
      start.row * cellSize + cellSize/2,
      cellSize/3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw end cell
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
      end.col * cellSize + cellSize/2,
      end.row * cellSize + cellSize/2,
      cellSize/3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Add labels
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('S', start.col * cellSize + cellSize/2, start.row * cellSize + cellSize/2);
    ctx.fillText('E', end.col * cellSize + cellSize/2, end.row * cellSize + cellSize/2);
  };

  const drawAlgorithmSteps = (ctx, step) => {
    // Draw visited cells - Fixed to handle array format
    if (step.visited && Array.isArray(step.visited)) {
      step.visited.forEach(cell => {
        let row, col;
        
        if (Array.isArray(cell)) {
          [row, col] = cell;
        } else if (cell.row !== undefined && cell.col !== undefined) {
          row = cell.row;
          col = cell.col;
        } else {
          return; 
        }
        
        ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      });
    }
    
    // Draw current path
    if (step.path && Array.isArray(step.path)) {
      step.path.forEach((pos, index) => {
        if (!pos || pos.row === undefined || pos.col === undefined) return;
        
        const alpha = index === step.path.length - 1 ? 1 : 0.5 + (index / step.path.length) * 0.5;
        
        // Draw path circle
        ctx.fillStyle = `rgba(231, 76, 60, ${alpha})`;
        ctx.beginPath();
        ctx.arc(
          pos.col * cellSize + cellSize/2,
          pos.row * cellSize + cellSize/2,
          cellSize/4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Draw path lines between consecutive points
        if (index > 0 && step.path[index - 1]) {
          const prev = step.path[index - 1];
          ctx.strokeStyle = `rgba(231, 76, 60, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(
            prev.col * cellSize + cellSize/2,
            prev.row * cellSize + cellSize/2
          );
          ctx.lineTo(
            pos.col * cellSize + cellSize/2,
            pos.row * cellSize + cellSize/2
          );
          ctx.stroke();
        }
      });
    }
    
    // Highlight current cell
    if (step.current && step.current.row !== undefined && step.current.col !== undefined) {
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(
        step.current.col * cellSize + cellSize/2,
        step.current.row * cellSize + cellSize/2,
        cellSize/3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Add "current" label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'C',
        step.current.col * cellSize + cellSize/2,
        step.current.row * cellSize + cellSize/2
      );
    }
    
    // Show completion indicator
    if (step.isComplete) {
      ctx.fillStyle = '#00b894';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', end.col * cellSize + cellSize/2, end.row * cellSize + cellSize/2);
    }
    
    // Show no path indicator
    if (step.noPath) {
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✗', end.col * cellSize + cellSize/2, end.row * cellSize + cellSize/2);
    }
  };

  const handleMouseDown = (e) => {
    isMouseDown.current = true;
    handleCellClick(e);
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (isMouseDown.current && isDrawing) {
      handleCellClick(e);
    }
  };

  const handleCellClick = (e) => {
    if (!onCellClick) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onCellClick(row, col);
    }
  };

  return (
    <div className="maze-container">
      <canvas
        ref={canvasRef}
        width={cols * cellSize}
        height={rows * cellSize}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        className="maze-canvas"
      />
      <div className="maze-info">
        <div className="legend">
          <div className="legend-item">
            <div className="color-box start"></div>
            <span>Start Point</span>
          </div>
          <div className="legend-item">
            <div className="color-box end"></div>
            <span>End Point</span>
          </div>
          <div className="legend-item">
            <div className="color-box visited"></div>
            <span>Visited Cells (Blue)</span>
          </div>
          <div className="legend-item">
            <div className="color-box path"></div>
            <span>Current Path (Red)</span>
          </div>
          <div className="legend-item">
            <div className="color-box wall"></div>
            <span>Walls/Obstacles</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ background: '#f1c40f' }}></div>
            <span>Current Cell</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGrid;