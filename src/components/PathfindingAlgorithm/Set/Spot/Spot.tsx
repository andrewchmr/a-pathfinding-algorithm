import React from "react";
import {h, w} from "../../PathfindingAlgorithm";

interface SpotProps {
    i: number,
    j: number,
    color: string
}

export const Spot = ({i, j, color}: SpotProps) => {
    return <rect x={i * w}
                 y={j * h}
                 width={w}
                 height={h}
                 fill={color}/>
};