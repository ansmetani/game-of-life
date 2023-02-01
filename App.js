import React from "react";
import './App.css';

const WIDTH = 600;
const HEIGHT = 600;
const CELL_SIZE = 10;

class Cell extends React.Component {
    render() {
        const { x, y } = this.props;
        return (
            <div className="Cell" style={{
                left: `${CELL_SIZE * x}px`,
                top: `${CELL_SIZE * y}px`,
                width: CELL_SIZE,
                height: CELL_SIZE
            }}></div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.rows = HEIGHT / CELL_SIZE;
        this.cols = WIDTH / CELL_SIZE;

        this.grid = this.generateEmptyGrid();
        this.gridBuffer = this.generateEmptyGrid();
    }

    state = {
        cells: []
    }

    generateEmptyGrid() {
        let grid = [];
        for (let y = 0; y < this.rows; y++) {
            grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                grid[y][x] = false;
            }
        }

        return grid;
    }

    generateCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    runIteration() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.gridBuffer[y][x] = this.grid[y][x];
            }
        }

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbours = 0;
                for (let yy = y - 1; yy <= y + 1; yy++) {
                    for (let xx = x - 1; xx <= x + 1; xx++) {
                        if (((xx >= 0) && (xx < this.cols)) && ((yy >= 0) && (yy < this.rows))) {
                            if (!((xx === x) && (yy === y)) && this.gridBuffer[yy][xx]) {
                                neighbours++;
                            }
                        }
                    }
                }
                if (this.gridBuffer[y][x]) {
                    if (neighbours < 2 || neighbours > 3) {
                        this.grid[y][x] = false;
                    }
                } else {
                    if (neighbours === 3){
                        this.grid[y][x] = true;
                    }
                }
            }
        }

        this.setState({ cells: this.generateCells() });

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, 100);
    }

    randomizeGrid() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.grid[y][x] = (Math.random() >= 0.5);
            }
        }

        this.setState({ cells: this.generateCells() });
    }

    handleGridRestart = () => {
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
        this.randomizeGrid();
        this.runIteration();
    }
    
    render() {
        const { cells } = this.state;
        return (
            <div>
                <div className="Grid" onClick={this.handleGridRestart} style={{
                    width: WIDTH,
                    height: HEIGHT,
                }}>
                    {cells.map(cell => (<Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>))}
                </div>
            </div>
            
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h1>conway's game of life</h1>
                <Game />
                <h3>click to start</h3>
            </div>
        );
    }
}

export default App;