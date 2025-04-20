/**
 * CardModel - Represents the data and business logic for a card
 */
class CardModel {
    constructor(suit = "", rank = "") {
        this._suit = suit;
        this._rank = rank;
        this._isFaceUp = false;
        this._index = 0;
        this._isTopCard = false;
    }

    // Getters and setters for card properties
    get suit() {
        return this._suit;
    }

    set suit(value) {
        this._suit = value;
    }

    get rank() {
        return this._rank;
    }

    set rank(value) {
        this._rank = value;
    }

    get isFaceUp() {
        return this._isFaceUp;
    }

    set isFaceUp(value) {
        this._isFaceUp = value;
    }

    get index() {
        return this._index;
    }

    set index(value) {
        this._index = value;
    }

    get isTopCard() {
        return this._isTopCard;
    }

    set isTopCard(value) {
        this._isTopCard = value;
    }

    // Toggle the card's face-up state
    toggle() {
        this._isFaceUp = !this._isFaceUp;
        return this._isFaceUp;
    }

    // Get the symbol for the card's suit
    getSuitSymbol() {
        switch (this._suit) {
            case "hearts": return "♥";
            case "diamonds": return "♦";
            case "spades": return "♠";
            case "clubs": return "♣";
            default: return "";
        }
    }

    // Get the CSS class for the card's suit
    getSuitClass() {
        switch (this._suit) {
            case "hearts": return "hearts";
            case "diamonds": return "diamonds";
            case "spades": return "spades";
            case "clubs": return "clubs";
            default: return "";
        }
    }
} 

export default CardModel;