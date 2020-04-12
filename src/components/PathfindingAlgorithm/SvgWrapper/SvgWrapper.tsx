import React from "react";
import {height, moveX, moveY, width} from "../PathfindingAlgorithm";

export const SvgWrapper = (props: any) => {
    const viewBox = `${-width / 2 + moveX} ${-height / 2 + moveY} ${width * 2} ${height * 2}`;
    return <svg viewBox={viewBox}>{props.children}</svg>
};