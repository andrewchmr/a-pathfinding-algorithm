import {Cell} from "../../../types";
import {Wall} from "./Wall/Wall";
import React from "react";

interface WallsProps {
    grid: Cell[][]
}

export const Walls = ({grid}: WallsProps) => {
    return <g>{grid.map((row: Cell[]) => {
        return row.filter(cell => cell.wall)
            .map(cell => <Wall i={cell.i}
                               j={cell.j}
                               key={`${cell.i}-${cell.j}`}/>)
    })}
    </g>
};