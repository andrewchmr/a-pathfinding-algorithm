import React from "react";
import {d, height, width} from "../PathfindingAlgorithm";


const moveX = width > height ? -d / 2 : 0;
const moveY = width > height ? 0 : -d / 4;

export const SvgWrapper = (props: any) => {
    const viewBox = `${-width / 2 + moveX} ${-height / 2 + moveY} ${width * 2} ${height * 2}`;
    return <svg viewBox={viewBox}>{props.children}</svg>
};