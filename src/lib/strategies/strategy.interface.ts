import { Columns } from "../ace-solitaire";

export type Action = {
    type: 'move',
    cols: [number, number],
} | {
    type: 'remove',
    cols: [number],
} | {
    type: 'draw',
} | {
    type: 'done',
}

export interface Strategy {
    nextMove: (status: Columns) => Promise<Action>
}