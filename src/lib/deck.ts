
const suits = ['C', 'H', 'S', 'D'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valuesOrdered = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export class Deck {

    private deck: Card[];

    constructor(shuffled?: boolean) {
        this.deck = this.newDeck();

        if (shuffled) {
            this.shuffle();
        }
    }

    next(): Card | undefined {
        return this.deck.pop()
    }

    private newDeck() {
        const orderedDeck: Card[] = [];
        suits.forEach(suit => {
            values.forEach(value => {
                orderedDeck.unshift(new Card(suit, value));
            })            
        })

        return orderedDeck;
    }

    shuffle() {
        let currentIndex = this.deck.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {

          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          temporaryValue = this.deck[currentIndex];
          this.deck[currentIndex] = this.deck[randomIndex];
          this.deck[randomIndex] = temporaryValue;
        }
    }

}

export class Card {
    public suit: string;
    public value: string;

    constructor(suit: string, value: string) {
        this.suit = suit;
        this.value = value;
    }

    isHigher(other: Card | undefined): boolean {
        if (other === undefined) {
            return false;
        }

        if (this.suit !== other.suit) {
            return false;
        }

        const thisIndex = valuesOrdered.indexOf(this.value);
        const otherIndex = valuesOrdered.indexOf(other.value);

        return thisIndex > otherIndex;
    }
    

    isHigherByValue(other: Card | undefined): boolean {
        if (other === undefined) {
            return false;
        }

        const thisIndex = valuesOrdered.indexOf(this.value);
        const otherIndex = valuesOrdered.indexOf(other.value);

        return thisIndex > otherIndex;
    }
}

