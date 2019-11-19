import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {clearInterval, setInterval} from "timers";

const width = window.innerWidth;
const height = window.innerHeight;
const cols = 50;
const rows = 50;
const delay = 500;
const w = 700 / cols;
const h = 700 / rows;

interface Cell {
    i: number,
    j: number,
    wall: boolean,
    f: number,
    g: number,
    h: number,
    neighbors: any,
    previous: any
}

const App = () => {
    const [grid, setGrid] = useState<Cell[][]>(setInitialGrid());
    const [openSet, setOpenSet] = useState<any>([]);
    const [closedSet, setClosedSet] = useState<any>([]);
    const [isRunning, setRunnning] = useState(true);
    useEffect(() => setOpenSet([...openSet, grid[0][0]]), []);

    useInterval(() => draw(), isRunning ? delay : null);

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

    function addNeighbors(i: number, j: number, grid: Cell[][]) {
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

    function setInitialGrid() {
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
                grid[i][j].neighbors = addNeighbors(i, j, grid);
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

    function heuristic(a: any, b: any) {
        return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    }

    function restartWithTimeout() {
        setRunnning(false);
        setTimeout(() => {
            const initialGrid = setInitialGrid();
            setGrid(initialGrid);
            setClosedSet([]);
            setOpenSet([...[], initialGrid[0][0]]);
            setRunnning(true);
        }, 1000);
    }

    function doDirt() {
        const newOpenSet = [...openSet];
        const newClosedSet = [...closedSet];
        const end = grid[cols - 1][rows - 1];
        let winner = 0;
        for (let i = 0; i < newOpenSet.length; i++) {
            if (newOpenSet[i].f < newOpenSet[winner].f) {
                winner = i;
            }
        }
        let current = newOpenSet[winner];

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

    function draw() {
        if (grid && openSet.length > 0) {
            doDirt();
        } else {
            restartWithTimeout();
            return;
        }
    }

    const Wall = ({i, j}: { i: number, j: number }) => <ellipse fill={"white"} cx={i * w + w / 2} cy={j * h + h / 2}
                                                                rx={w / 4} ry={h / 4}/>;

    const Walls = () => {
        return <g>{grid.map((row) => row.reduce((filtered: any, cell: any) => {
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


    const OpenSet = () => <g>
        {openSet.map((openCell: any) =>
            <Spot i={openCell.i} j={openCell.j} color={'yellow'}
                  wall={openCell.wall}
                  key={`${openCell.i}-${openCell.j}`}/>)}</g>;

    const ClosedSet = () => <g>
        {closedSet.map((openCell: any) =>
            <Spot i={openCell.i} j={openCell.j} color={'pink'}
                  wall={openCell.wall}
                  key={`${openCell.i}-${openCell.j}`}/>)}</g>;


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
