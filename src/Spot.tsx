import React from 'react';

const width = 700;
const height = 700;
const cols = 50;
const rows = 50;
const w = width / cols;
const h = height / rows;

export interface SpotProps {
    i: number,
    j: number,
    wall: boolean,
    f: number,
    g: number,
    h: number,
    inOpenSet: boolean,
    inClosedSet: boolean,
    neighbors: any,
    previous: any
}

const Spot = ({i, j, wall, inOpenSet, inClosedSet}: { i: number, j: number, wall: boolean, inOpenSet: boolean, inClosedSet: boolean }) => {
    if (wall) {
        return <ellipse fill={"white"} cx={i * w + w / 2} cy={j * h + h / 2} rx={w / 4} ry={h / 4}/>
    } else {
        let color;
        if (inOpenSet) {
            color = 'yellow';
        } else if (inClosedSet) {
            color = 'pink';
        } else {
            color = 'black'
        }
        return <rect x={i * w} y={j * h} width={w} height={h} fill={color}/>
    }
};

export default Spot;