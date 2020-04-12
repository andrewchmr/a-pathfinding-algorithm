import React from "react";
import {Cell} from "../../types";
import {config} from "../../config";
import {Path} from "./Path/Path";
import {SvgWrapper} from "./SvgWrapper/SvgWrapper";
import {Set} from "./Set/Set";
import {Walls} from "./Walls/Walls";

const cols = config.cols;
const rows = config.rows;
export const width = window.innerWidth;
export const height = window.innerHeight;
export const d = width > height ? height : width;
export const w = d / cols;
export const h = d / rows;

const PathfindingAlgorithm = ({grid, openSet, closedSet, path}: { grid: Cell[][], openSet: Cell[], closedSet: Cell[], path: Cell[] }) => {
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