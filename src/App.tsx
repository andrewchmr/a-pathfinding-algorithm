import React, {useEffect, useRef, useState} from 'react';
import {clearInterval, setInterval} from "timers";

const width = window.innerWidth;
const height = window.innerHeight;
const cols = 30;
const rows = 30;
const delay = 30;
const d = width > height ? height : width;
const w = d / cols;
const h = d / rows;
const moveX = width > height ? -d / 2 : 0;
const moveY = width > height ? 0 : -d / 4;

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
    const [path, setPath] = useState<Cell[]>([]);
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

    function getLinePath(path: Cell[]): string {
        if (path.length > 0) {
            const firstPoint = `M${path[0].i * w + w / 2},${path[0].j * h + h / 2}`;
            let buffer = ``;
            for (let i = 1; i < path.length; i++) {
                buffer += `L${path[i].i * w + w / 2},${path[i].j * h + h / 2}`;
            }
            return `${firstPoint}${buffer}`;
        } else {
            return '';
        }
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
                  color={'lightgrey'}
                  wall={cell.wall}
                  key={`${cell.i}-${cell.j}`}/>)}</g>;


    const Wrapper = (props: any) => <svg
        viewBox={`${-width / 2 + moveX} ${-height / 2 + moveY} ${width * 2} ${height * 2}`}>{props.children}</svg>;

    const Path = () => <path strokeWidth={w / 2} strokeLinecap="round" d={getLinePath(path)} fill={'none'}
                             stroke={'purple'}/>;

    return (
        <Wrapper>
            <Walls/>
            <OpenSet/>
            <ClosedSet/>
            <Path/>
        </Wrapper>
    );
};

export default App;
