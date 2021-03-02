import { stat } from "fs";
import { parse } from "path";
import { Card, Deck } from "./deck";
import { InvalidStateError, MalformedCallError } from './errors'
import { logger } from "./logger";

export type Columns = [Card[], Card[], Card[], Card[]];

export class AceSolitaire {
    
    private deck: Deck;
    private cols: Columns;
    private started: boolean;
    
    constructor(deck?: Deck) {
        this.deck = deck ?? new Deck(true);
        this.cols= [[], [], [], []];
        this.started = false;
    }

    start() {
        if (this.started) {
            throw new InvalidStateError('Game is already started');
        }

        this.started = true;
        this.draw();
    }

    end() {
        const status = this.status();

        if (status.some(col => col.length !== 1)) {
            return false;
        }

        if (status.some(col => col[0].value !== 'A')) {
            return false;
        }
        
        return true;
    }

    status(): Columns {
        return this.cols.map(col => Object.assign([], col) as Card[]) as Columns
    }

    logShortStatus(): void {
        const status = this.status();
        const parsed = status.map((col, i) => `${i}: ` + col.map(card => `${this.suitCharToUnicode(card.suit)}${card.value}`).join(', ')).join('\n')
        logger(parsed)
    }

    suitCharToUnicode(suitString: string) {
        switch (suitString) {
            case 'C': {
                return '\u2663'
                break;
            }
            case 'H': {
                return '\u2665'
                break;
            }
            case 'S': {
                return '\u2660'
                break;
            }
            case 'D': {
                return '\u2666'
                break;
            }
        }
    }

    move(from: number, to: number) {

        if (!this.started) {
            throw new InvalidStateError('Game is not started');
        }

        if (from > 3 || to > 3 || from < 0 || to < 0) {
            throw new MalformedCallError('Invalid "from" or "to"')
        }

        if (this.cols[from].length === 0) {
            throw new InvalidStateError('Cannot move card from empty column');
        }

        if (this.cols[to].length !== 0) {
            throw new InvalidStateError('Cannot move card to non-empty column');
        }

        const card = this.cols[from].pop() as Card;
        this.cols[to].push(card);
    }

    remove(from: number) {

        if (!this.started) {
            throw new InvalidStateError('Game is not started');
        }

        if (from > 3 || from < 0) {
            throw new MalformedCallError('Invalid "from"')
        }

        if (this.cols[from].length === 0) {
            throw new InvalidStateError('Cannot remove card from empty column');
        }

        const topCards = this.status().map(col => col.pop())
        const cardToRemove = this.cols[from][this.cols[from].length - 1];        
        const canRemove = topCards.some(topCard => topCard?.isHigher(cardToRemove))

        if (!canRemove) {
            throw new InvalidStateError('No higher card available');
        }

        this.cols[from].pop();
    }

    draw() {

        if (!this.started) {
            throw new InvalidStateError('Game is not started');
        }

        this.cols.forEach(col => {
            const nextCard = this.deck.next();

            if (nextCard === undefined) {
                throw new InvalidStateError('Could not draw new cards: Deck is empty');
            }

            col.push(nextCard);
        })
    }

}