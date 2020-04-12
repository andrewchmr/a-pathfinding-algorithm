import {Cell} from "../../../types";
import {Spot} from "./Spot/Spot";
import React from "react";

interface SetProps {
    cells: Cell[],
    color: string
}

export const Set = ({cells, color}: SetProps) => {
    return <g>{cells.map((cell: Cell) =>
        <Spot i={cell.i}
              j={cell.j}
              color={color}
              key={`${cell.i}-${cell.j}`}/>)}</g>
};