import React from "react";
import {Cell} from "../../types";
import {config} from "../../config";
import {Path} from "./Path/Path";
import {SvgWrapper} from "./SvgWrapper/SvgWrapper";
import {Set} from "./Set/Set";
import {Walls} from "./Walls/Walls";

const {cols, rows, height, width} = config;
export const d = width > height ? height : width;
export const w = d / cols;
export const h = d / rows;
export const moveX = width > height ? -d / 2 : 0;
export const moveY = width > height ? 0 : -d / 4;

interface PathfindingAlgorithmProps {
    grid: Cell[][],
    openSet: Cell[],
    closedSet: Cell[],
    path: Cell[]
}

const PathfindingAlgorithm = ({grid, openSet, closedSet, path}: PathfindingAlgorithmProps) => {
    return (
        <SvgWrapper>
            <Walls grid={grid}/>
            <Set cells={openSet} color={'yellow'}/>
            <Set cells={closedSet} color={'lightgrey'}/>
            <Path path={path}/>
        </SvgWrapper>
    );
};

export default PathfindingAlgorithm;