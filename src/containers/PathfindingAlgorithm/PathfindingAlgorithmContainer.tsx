import React, {useState} from 'react';
import PathfindingAlgorithm from "../../components/PathfindingAlgorithm/PathfindingAlgorithm";
import {Cell} from "../../types";
import {config} from "../../config";
import {useInterval} from "../../hooks/useInterval";

const cols = config.cols;
const rows = config.rows;

const PathfindingAlgorithmContainer = () => {
    const [grid, setGrid] = useState<Cell[][]>(getInitialGrid());
    const [openSet, setOpenSet] = useState<Cell[]>([grid[0][0]]);
    const [closedSet, setClosedSet] = useState<Cell[]>([]);
    const [path, setPath] = useState<Cell[]>([]);
    const [isRunning, setRunning] = useState<boolean>(true);
    useInterval(() => run(), isRunning ? 100 : null);

    function getNeighbors(i: number, j: number, grid: Cell[][]): Cell[] {
        const neighbors = [];
        if (i < cols - 1) {
            neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            neighbors.push(grid[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            neighbors.push(grid[i - 1][j - 1]);
        }
        if (i < cols - 1 && j > 0) {
            neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j < rows - 1) {
            neighbors.push(grid[i + 1][j + 1]);
        }
        return neighbors;
    }

    function getInitialGrid(): Cell[][] {
        let grid: Cell[][] = [];

        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows);
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = {
                    i: i,
                    j: j,
                    wall: Math.random() < 0.4,
                    f: 0,
                    g: 0,
                    h: 0,
                    neighbors: [],
                    previous: undefined
                }
            }
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].neighbors = getNeighbors(i, j, grid);
            }
        }

        grid[0][0].wall = false;
        grid[cols - 1][rows - 1].wall = false;
        return grid;
    }

    function removeFromArray(arr: Cell[], elt: Cell) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === elt) {
                arr.splice(i, 1);
            }
        }
    }

    function heuristic(a: Cell, b: Cell) {
        return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    }

    function restartWithTimeout() {
        setRunning(false);
        setTimeout(() => {
            const initialGrid = getInitialGrid();
            setGrid(initialGrid);
            setClosedSet([]);
            setOpenSet([...[], initialGrid[0][0]]);
            setRunning(true);
        }, 1000);
    }

    function findWinnerIndex(): number {
        let winner = 0;
        openSet.forEach((cell: Cell, i: number) => {
            if (cell.f < openSet[winner].f) {
                winner = i;
            }
        });
        return winner;
    }

    function cellsEqual(a: Cell, b: Cell): boolean {
        return a.i === b.i && a.j === b.j;
    }

    function handleEndSuccess(openSet: Cell[], closedSet: Cell[], current: Cell) {
        removeFromArray(openSet, current);
        setOpenSet(openSet);
        setClosedSet([...closedSet, current]);
        setPath(getCurrentPath(current));
        restartWithTimeout();
    }

    function getCurrentPath(current: Cell): Cell[] {
        const path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
        return path;
    }

    function exploreCells() {
        const newOpenSet = [...openSet];
        const newClosedSet = [...closedSet];
        const end = grid[cols - 1][rows - 1];
        const winnerIndex = findWinnerIndex();
        let current = newOpenSet[winnerIndex];

        if (cellsEqual(current, end)) {
            handleEndSuccess(newOpenSet, newClosedSet, current);
            return;
        }

        removeFromArray(newOpenSet, current);
        newClosedSet.push(current);
        checkNeighborsCells(newOpenSet, newClosedSet, current, end);
        setOpenSet(newOpenSet);
        setClosedSet(newClosedSet);
        setPath(getCurrentPath(current));
    }

    function checkNeighborsCells(openSet: Cell[], closedSet: Cell[], current: Cell, end: Cell) {
        current.neighbors.forEach((neighbor) => {
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + heuristic(neighbor, current);
                let newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        });
    }

    function run() {
        if (grid && openSet.length > 0) {
            exploreCells();
        } else {
            restartWithTimeout();
            return;
        }
    }

    return (
        <PathfindingAlgorithm grid={grid} openSet={openSet} closedSet={closedSet} path={path}/>
    );
};

export default PathfindingAlgorithmContainer;
