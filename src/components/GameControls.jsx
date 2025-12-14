import React from 'react';
import { FaPlay, FaPause, FaStepForward, FaRedo, FaCog, FaQuestionCircle } from 'react-icons/fa';
import './GameControls.css';

const GameControls = ({
  isPlaying,
  speed,
  algorithm,
  gameMode,
  onPlayPause,
  onStepForward,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  onGameModeChange,
  onGenerateMaze,
  onClearMaze
}) => {
  const algorithms = [
    { id: 'bfs', name: 'Breadth-First Search (BFS)' },
    { id: 'dfs', name: 'Depth-First Search (DFS)' },
    { id: 'dijkstra', name: "Dijkstra's Algorithm" },
    { id: 'astar', name: 'A* Search Algorithm' }
  ];

  const gameModes = [
    { id: 'race', name: 'Algorithm Race' },
    { id: 'time-trial', name: 'Time Trial' },
    { id: 'puzzle', name: 'Puzzle Mode' },
    { id: 'creative', name: 'Creative Mode' }
  ];

  const speeds = [
    { value: 1000, label: 'Fast' },
    { value: 500, label: 'Normal' },
    { value: 200, label: 'Slow' },
    { value: 50, label: 'Super Slow' }
  ];

  return (
    <div className="game-controls">
      <div className="controls-section">
        <h3>Game Controls</h3>
        <div className="control-buttons">
          <button 
            className={`control-btn ${isPlaying ? 'pause' : 'play'}`}
            onClick={onPlayPause}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button 
            className="control-btn step"
            onClick={onStepForward}
            disabled={isPlaying}
          >
            <FaStepForward />
            Step
          </button>
          
          <button 
            className="control-btn reset"
            onClick={onReset}
          >
            <FaRedo />
            Reset
          </button>
        </div>
      </div>

      <div className="controls-section">
        <h3>Algorithm Selection</h3>
        <div className="algorithm-selector">
          {algorithms.map(algo => (
            <button
              key={algo.id}
              className={`algorithm-btn ${algorithm === algo.id ? 'active' : ''}`}
              onClick={() => onAlgorithmChange(algo.id)}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      <div className="controls-section">
        <h3>Game Mode</h3>
        <div className="mode-selector">
          {gameModes.map(mode => (
            <button
              key={mode.id}
              className={`mode-btn ${gameMode === mode.id ? 'active' : ''}`}
              onClick={() => onGameModeChange(mode.id)}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      <div className="controls-section">
        <h3>Speed Control</h3>
        <div className="speed-control">
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="speed-slider"
          />
          <div className="speed-labels">
            {speeds.map(s => (
              <span 
                key={s.value}
                className={`speed-label ${speed === s.value ? 'active' : ''}`}
                onClick={() => onSpeedChange(s.value)}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="controls-section">
        <h3>Maze Tools</h3>
        <div className="maze-tools">
          <button 
            className="tool-btn generate"
            onClick={onGenerateMaze}
          >
            Generate New Maze
          </button>
          
          <button 
            className="tool-btn clear"
            onClick={onClearMaze}
          >
            Clear Maze
          </button>
          
          <button className="tool-btn settings">
            <FaCog />
            Settings
          </button>
          
          <button className="tool-btn help">
            <FaQuestionCircle />
            Help
          </button>
        </div>
      </div>

      <div className="stats-preview">
        <div className="stat-item">
          <span className="stat-label">Visited Cells:</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Path Length:</span>
          <span className="stat-value">0</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time:</span>
          <span className="stat-value">0s</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;