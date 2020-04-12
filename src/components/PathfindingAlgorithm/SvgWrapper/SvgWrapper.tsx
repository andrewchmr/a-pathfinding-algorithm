import React, {ReactNode} from "react";
import {moveX, moveY} from "../PathfindingAlgorithm";
import {config} from "../../../config";

const {width, height} = config;

interface SvgWrapperProps {
    children: ReactNode;
}

export const SvgWrapper = ({children}: SvgWrapperProps) => {
    const viewBox = `${-width / 2 + moveX} ${-height / 2 + moveY} ${width * 2} ${height * 2}`;
    return <svg viewBox={viewBox}>{children}</svg>
};