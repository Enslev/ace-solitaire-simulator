import logUpdate from "log-update";
import { AceSolitaire } from "./lib/ace-solitaire";
import { Simulator } from "./lib/simulator";
import { HigestDown } from "./lib/strategies/highest-down";

export const log = false;
const numberOfSims = 10000;

(async function () {
    let result = false;
    let i = 1;
    let wins = 0;
    let loses = 0;
    while (i <= numberOfSims) {
        const game = new AceSolitaire();
        const strat = new HigestDown();

        const sim = new Simulator(game, strat);

        result = await sim.run();        

        if (result) {
            wins++;
        } else {
            loses++;
        }

        if (i % 1000 === 0) {
            logUpdate(`
Number of Sims: ${numberOfSims}
Test Progress:  ${+((i/numberOfSims) * 100).toFixed(2)}%
Wins:           ${wins}
Loses:          ${loses}
Wins/Loses:     ${+((wins/loses) * 100).toFixed(2)}%
            `)
        }

        i++;
    }
})()

