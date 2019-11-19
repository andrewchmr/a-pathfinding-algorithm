import React, {useEffect, useRef, useState} from 'react';
import {clearInterval, setInterval} from "timers";

const width = window.innerWidth;
const height = window.innerHeight;
const cols = 50;
const rows = 50;
const delay = 1;
const w = 700 / cols;
const h = 700 / rows;

interface Cell {
    i: number,
    j: number,
    wall: boolean,
    f: number,
    g: number,
    h: number,
    neighbors: Cell[],
    previous: Cell | undefined
}

const App = () => {
    const [grid, setGrid] = useState<Cell[][]>(getInitialGrid());
    const [openSet, setOpenSet] = useState<Cell[]>([]);
    const [closedSet, setClosedSet] = useState<Cell[]>([]);
    const [isRunning, setRunning] = useState<boolean>(true);
    useEffect(() => setOpenSet([...openSet, grid[0][0]]), []);
    useInterval(() => run(), isRunning ? delay : null);

    function useInterval(callback: any, delay: any) {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                (savedCallback as any).current();
            }

            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

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

    function removeFromArray(arr: any, elt: any) {
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
        openSet.map((cell: Cell, i: number) => {
            if (cell.f < openSet[winner].f) {
                winner = i;
            }
        });
        return winner;
    }

    function exploreCells() {
        const newOpenSet = [...openSet];
        const newClosedSet = [...closedSet];
        const end = grid[cols - 1][rows - 1];
        const winnerIndex = findWinnerIndex();
        let current = newOpenSet[winnerIndex];

        if (current == end) {
            removeFromArray(newOpenSet, current);
            newClosedSet.push(current);
            setOpenSet(newOpenSet);
            setClosedSet(newClosedSet);
            restartWithTimeout();
            return;
        }

        removeFromArray(newOpenSet, current);
        newClosedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!newClosedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + heuristic(neighbor, current);

                let newPath = false;
                if (newOpenSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    newOpenSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }

        }
        setOpenSet(newOpenSet);
        setClosedSet(newClosedSet);
    }

    function run() {
        if (grid && openSet.length > 0) {
            exploreCells();
        } else {
            restartWithTimeout();
            return;
        }
    }

    const Wall = ({i, j}: { i: number, j: number }) =>
        <ellipse fill={"white"}
                 cx={i * w + w / 2}
                 cy={j * h + h / 2}
                 rx={w / 4}
                 ry={h / 4}/>;

    const Walls = () => {
        return <g>{grid.map((row) => row.reduce((filtered: JSX.Element[], cell: Cell) => {
            if (cell.wall) {
                filtered.push(<Wall i={cell.i} j={cell.j} key={`${cell.i}-${cell.j}`}/>);
            }
            return filtered;
        }, []))}</g>
    };

    const Spot = ({i, j, wall, color}: { i: number, j: number, wall: boolean, color: string }) =>
        <rect x={i * w}
              y={j * h}
              width={w}
              height={h}
              fill={color}/>;


    const OpenSet = () => <g>{openSet.map((cell: Cell) =>
        <Spot i={cell.i}
              j={cell.j}
              color={'yellow'}
              wall={cell.wall}
              key={`${cell.i}-${cell.j}`}/>)}</g>;

    const ClosedSet = () => <g>
        {closedSet.map((cell: Cell) =>
            <Spot i={cell.i}
                  j={cell.j}
                  color={'pink'}
                  wall={cell.wall}
                  key={`${cell.i}-${cell.j}`}/>)}</g>;


    const Wrapper = (props: any) => <svg viewBox={`0 0 ${width} ${height}`}>{props.children}</svg>;

    return (
        <Wrapper>
            <Walls/>
            <OpenSet/>
            <ClosedSet/>
        </Wrapper>
    );
};

export default App;
