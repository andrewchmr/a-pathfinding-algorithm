import {Cell} from "./types";

export function getLinePath(path: Cell[], w: number, h: number): string {
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
}