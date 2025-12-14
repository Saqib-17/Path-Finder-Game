import React, { useState, useEffect, useCallback } from 'react';
import MazeGrid from './components/mazeGrid';
import GameControls from './components/GameControls';
import { generateMaze, createEmptyMaze } from './game/MazeGenerator';
import { bfs } from './algorithms/bfs';
import './App.css';

function App() {
  // Game state - Initialize with empty maze structure
  const [maze, setMaze] = useState(() => createEmptyMaze(15, 15));
  const [start, setStart] = useState({ row: 1, col: 1 });
  const [end, setEnd] = useState({ row: 13, col: 13 });
  const [currentStep, setCurrentStep] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [gameMode, setGameMode] = useState('creative');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState('wall');
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize maze - FIXED VERSION
  useEffect(() => {
    const initializeMaze = () => {
      try {
        const initialMaze = generateMaze(15, 15);
        setMaze(initialMaze);
        setStart({ row: 1, col: 1 });
        setEnd({ row: 13, col: 13 });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to generate maze:', error);
        // Fallback to empty maze
        const emptyMaze = createEmptyMaze(15, 15);
        emptyMaze[1][1] = 0; // Start
        emptyMaze[13][13] = 0; // End
        setMaze(emptyMaze);
        setIsLoading(false);
      }
    };

    initializeMaze();
  }, []);

  // Handle algorithm animation
  useEffect(() => {
    let interval;
    
    if (isPlaying && algorithmSteps.length > 0) {
      interval = setInterval(() => {
        if (currentStepIndex < algorithmSteps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
          setCurrentStep(algorithmSteps[currentStepIndex + 1]);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, algorithmSteps, currentStepIndex, speed]);

  // Handle cell click for drawing
  const handleCellClick = useCallback((row, col) => {
    // Don't allow drawing on start or end points
    if ((row === start.row && col === start.col) || 
        (row === end.row && col === end.col)) {
      return;
    }

    setMaze(prev => {
      if (!prev || !prev[row]) return prev;
      
      const newMaze = prev.map(rowArr => [...rowArr]);
      
      switch (drawMode) {
        case 'wall':
          newMaze[row][col] = newMaze[row][col] === 0 ? 1 : 0;
          break;
        case 'start':
          setStart({ row, col });
          break;
        case 'end':
          setEnd({ row, col });
          break;
        case 'erase':
          newMaze[row][col] = 0;
          break;
        default:
          break;
      }
      
      return newMaze;
    });
  }, [drawMode, start, end]);

  // Start algorithm
  const handlePlayPause = () => {
    if (!isPlaying) {
      const steps = runAlgorithm();
      setAlgorithmSteps(steps);
      setCurrentStepIndex(0);
      if (steps.length > 0) {
        setCurrentStep(steps[0]);
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Step forward manually
  const handleStepForward = () => {
    if (algorithmSteps.length === 0) {
      const steps = runAlgorithm();
      setAlgorithmSteps(steps);
    }
    
    if (currentStepIndex < algorithmSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setCurrentStep(algorithmSteps[currentStepIndex + 1]);
    }
  };

  // Reset game
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(null);
    setAlgorithmSteps([]);
    setCurrentStepIndex(0);
  };

  // Run selected algorithm
  const runAlgorithm = () => {
    if (!maze || maze.length === 0) return [];
    
    switch (algorithm) {
      case 'bfs':
        return bfs(maze, start, end) || [];
      default:
        return [];
    }
  };

  // Generate new maze
  const handleGenerateMaze = () => {
    const newMaze = generateMaze(15, 15);
    setMaze(newMaze);
    setStart({ row: 1, col: 1 });
    setEnd({ row: 13, col: 13 });
    handleReset();
  };

  // Clear maze
  const handleClearMaze = () => {
    const emptyMaze = createEmptyMaze(15, 15);
    emptyMaze[1][1] = 0; // Clear start
    emptyMaze[13][13] = 0; // Clear end
    setMaze(emptyMaze);
    setStart({ row: 1, col: 1 });
    setEnd({ row: 13, col: 13 });
    handleReset();
  };

  // Change draw mode
  const handleDrawModeChange = (mode) => {
    setDrawMode(mode);
    setIsDrawing(mode !== 'none');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Generating Maze...</h2>
      </div>
    );
  }

  // Check if maze is valid
  if (!maze || maze.length === 0) {
    return (
      <div className="error-screen">
        <h2>Error: Maze not generated properly</h2>
        <button onClick={handleGenerateMaze} className="retry-btn">
          Generate New Maze
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>PathQuest 🎮</h1>
        <p className="subtitle">Maze Solving Algorithm Adventure Game</p>
      </header>

      <div className="game-layout">
        <main className="game-area">
          <div className="maze-section">
            <MazeGrid
              maze={maze}
              currentStep={currentStep}
              onCellClick={handleCellClick}
              start={start}
              end={end}
              isDrawing={isDrawing}
              cellSize={30}
            />
          </div>

          <div className="draw-tools">
            <h3>Drawing Tools</h3>
            <div className="tool-buttons">
              {['wall', 'start', 'end', 'erase'].map((tool) => (
                <button
                  key={tool}
                  className={`tool-btn ${drawMode === tool ? 'active' : ''}`}
                  onClick={() => handleDrawModeChange(tool)}
                >
                  {tool.charAt(0).toUpperCase() + tool.slice(1)}
                </button>
              ))}
            </div>
            <p className="tool-hint">
              {drawMode === 'wall' && 'Click cells to add/remove walls'}
              {drawMode === 'start' && 'Click to set start point'}
              {drawMode === 'end' && 'Click to set end point'}
              {drawMode === 'erase' && 'Click to clear cells'}
            </p>
          </div>
        </main>

        <aside className="control-panel">
          <GameControls
            isPlaying={isPlaying}
            speed={speed}
            algorithm={algorithm}
            gameMode={gameMode}
            onPlayPause={handlePlayPause}
            onStepForward={handleStepForward}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            onAlgorithmChange={setAlgorithm}
            onGameModeChange={setGameMode}
            onGenerateMaze={handleGenerateMaze}
            onClearMaze={handleClearMaze}
          />
        </aside>
      </div>

      <footer className="app-footer">
        <p>Pathfinding Algorithms Visualization Game | Made with ❤️ for Algorithm Course</p>
        <div className="footer-links">
          <span>Algorithms: BFS • DFS • Dijkstra • A*</span>
          <span> | </span>
          <span>Game Modes: Race • Time Trial • Puzzle • Creative</span>
        </div>
      </footer>
    </div>
  );
}

export default App;