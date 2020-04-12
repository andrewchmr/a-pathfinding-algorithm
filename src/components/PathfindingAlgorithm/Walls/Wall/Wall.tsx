import React from "react";
import {h, w} from "../../PathfindingAlgorithm";

export const Wall = ({i, j}: { i: number, j: number }) => {
    return <ellipse fill={"white"}
                    cx={i * w + w / 2}
                    cy={j * h + h / 2}
                    rx={w / 4}
                    ry={h / 4}/>
};