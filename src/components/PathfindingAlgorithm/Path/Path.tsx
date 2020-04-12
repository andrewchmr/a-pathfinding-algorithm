import React from "react";
import {Cell} from "../../../types";
import {h, w} from "../PathfindingAlgorithm";

interface PathProps {
    path: Cell[]
}

export const Path = ({path}: PathProps) => {

    const getLinePath = (path: Cell[], w: number, h: number): string => {
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
    };

    return <path strokeWidth={w / 2}
                 strokeLinecap="round"
                 d={getLinePath(path, w, h)}
                 fill={'none'}
                 stroke={'purple'}/>
};