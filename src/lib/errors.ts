export class MalformedCallError extends Error {
    constructor(message: string) {
        super(message); 
        this.name = "MalformedCallError";
    }
}

export class InvalidStateError extends Error {
    constructor(message: string) {
        super(message); 
        this.name = "InvalidStateError";
    }
}
