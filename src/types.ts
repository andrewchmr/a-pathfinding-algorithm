export interface Cell {
    i: number,
    j: number,
    wall: boolean,
    f: number,
    g: number,
    h: number,
    neighbors: Cell[],
    previous: Cell | undefined
}