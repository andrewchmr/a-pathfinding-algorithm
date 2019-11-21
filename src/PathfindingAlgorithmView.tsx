import React from "react";
import {getLinePath} from "./utils";
import {Cell} from "./types";
import {config} from "./config";

const width = window.innerWidth;
const height = window.innerHeight;
const cols = config.cols;
const rows = config.rows;
const d = width > height ? height : width;
const w = d / cols;
const h = d / rows;
const moveX = width > height ? -d / 2 : 0;
const moveY = width > height ? 0 : -d / 4;

const PathfindingAlgorithmView = ({grid, openSet, closedSet, path}: { grid: Cell[][], openSet: Cell[], closedSet: Cell[], path: Cell[] }) => {
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


    const Wrapper = (props: any) => {
        const viewBox = `${-width / 2 + moveX} ${-height / 2 + moveY} ${width * 2} ${height * 2}`;
        return <svg viewBox={viewBox}>{props.children}</svg>
    };

    const Path = () => <path strokeWidth={w / 2}
                             strokeLinecap="round"
                             d={getLinePath(path, w, h)}
                             fill={'none'}
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

export default PathfindingAlgorithmView;