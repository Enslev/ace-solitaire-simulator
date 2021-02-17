import { Columns } from "../ace-solitaire";
import { InvalidStateError } from "../errors";
import { logger } from "../logger";
import { Action, Strategy } from "./strategy.interface";

enum States {
    emptyCol = 'emptyCol',
    allDifferent = 'allDifferent',
    removableCard = 'removableCard',
    movableCard = 'movableCard',
}

export class HigestDown implements Strategy {
    constructor() { }

    async nextMove(status: Columns): Promise<Action> {
        const states = this.parseStatus(status);
        logger('Current state:', states)
        if (states.has(States.allDifferent) && !states.has(States.movableCard)) {
            return {
                type: 'draw',
            }
        }

        if (states.has(States.removableCard)) {
            const colIndex = this.findFirstRemoveable(status);
            return {
                type: 'remove',
                cols: [colIndex],
            }
        }

        if (states.has(States.movableCard)) {
            
            return {
                type: 'move',
                cols: this.findCardToMove(status),
            }
        }

        return {
            type: 'done',
        };

    }

    parseStatus(status: Columns): Set<States> {
        const topCards = status.map(col => col[col.length - 1]);
        const states = new Set<States>();

        if (topCards.some(card => card === undefined)) {
            states.add(States.emptyCol);
        }

        if (states.has(States.emptyCol)) {
            if (status.some(col => col.length > 1)) {
                states.add(States.movableCard);
            }
        }

        for (let i = topCards.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                const cardA = topCards[i];
                const cardB = topCards[j];

                if (!cardA || !cardB) {
                    continue;
                }

                if (cardA.suit === cardB.suit) {
                    states.add(States.removableCard)
                }
            }
        }
        if (!states.has(States.removableCard)) {
            states.add(States.allDifferent);
        }

        return states;
    }

    findFirstRemoveable(status: Columns) {
        const topCards = status.map(col => col[col.length - 1]);
        for (let i = topCards.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                const cardA = topCards[i];
                const cardB = topCards[j];

                if (!cardA || !cardB) {
                    continue;
                }

                if (cardA.suit === cardB.suit) {
                    if (cardA.isHigher(cardB)) {
                        return j;
                    }
                    return i;
                }
            }
        }
        throw new InvalidStateError('No removeable Cards');
    }

    findCardToMove(status: Columns): [number, number] {
        const topCards = status.map(col => col[col.length - 1]);
        let emptyCol: number = -1;
        for (let i = 0; i < status.length; i++) {
            if (status[i].length === 0) {
                emptyCol = i;
            }
        }

        let top = -1;
        for (let i = 0; i < topCards.length; i++) {
            if (status[i].length < 2) {
                continue;
            }

            if (!topCards[i]) {
                continue;
            }

            if (!topCards[top]) {
                top = i;
                continue;
            }

            if (!topCards[top].isHigher(topCards[i])) {
                top = i;
            }
        }

        if (top === -1 || emptyCol === -1) {
            throw new InvalidStateError('No moveable cards')
        }

        return [top, emptyCol];
    }


}