import { log } from ".."

export function logger(...args: any[]) {
    if (log) {
        console.log(...args);
    }
}