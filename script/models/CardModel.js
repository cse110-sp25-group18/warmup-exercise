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

  // Get info for the card's suit
  getSuitInfo() {
    const suitMap = {
      hearts: { symbol: "♥", class: "hearts" },
      diamonds: { symbol: "♦", class: "diamonds" },
      spades: { symbol: "♠", class: "spades" },
      clubs: { symbol: "♣", class: "clubs" },
    };

    return suitMap[this._suit] || { symbol: "", class: "" };
  }

  // Get the symbol for the card's suit
  getSuitSymbol() {
    return this.getSuitInfo().symbol;
  }

  // Get the CSS class for the card's suit
  getSuitClass() {
    return this.getSuitInfo().class;
  }
}

export default CardModel;
