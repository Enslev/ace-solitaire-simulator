import { AceSolitaire } from "./ace-solitaire";
import { logger } from "./logger";
import { Action, Strategy } from "./strategies/strategy.interface";

export class Simulator {
    private strategy: Strategy;
    private game: AceSolitaire;
    private running: boolean;

    constructor(game: AceSolitaire, strategy: Strategy) {
        this.strategy = strategy;
        this.game = game;
        this.running = false;
    }

    async run() {
        this.running = true;
        this.game.start();
        
        this.game.logShortStatus();
        
        while (this.running) {
            await this.tick();
        }

        return this.game.end();
    }

    private async tick() {
        const status = this.game.status();
        const nextAction = await this.strategy.nextMove(status);
        logger('nextAction', nextAction)

        try {
            
            this.actionHandler(nextAction);
        } catch (e) {
            if (e.message === 'Could not draw new cards: Deck is empty') {
                this.running = false;
            } else {
                throw e;
            }
        }

        this.game.logShortStatus();
        logger('--------')
    }

    private actionHandler(action: Action) {
        switch (action.type) {
            case 'move': {
                this.moveHandler(action);
                break;
            }
            case 'remove': {
                this.removeHandler(action);
                break;
            }
            case 'draw': {
                this.drawHandler(action);
                break;
            }
        }
    }

    private moveHandler(action: Action & { type: 'move' }) {
        const from = action.cols[0];
        const to = action.cols[1];
        this.game.move(from, to);
    }

    private removeHandler(action: Action & { type: 'remove' }) {
        const from = action.cols[0];
        this.game.remove(from);
    }

    private drawHandler(action: Action & { type: 'draw' }) {
        this.game.draw();
    }

}