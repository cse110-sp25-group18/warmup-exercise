/**
 * PlayerModel - Responsible for managing player and dealer hands
 */
class PlayerModel {
  constructor() {
    // Player and dealer cards
    this.playerCards = [];
    this.dealerCards = [];

    // Player state
    this.isPlayerTurn = false;
  }

  /**
   * Add a card to a hand
   * @param {string} target - 'dealer' or 'player'
   * @param {Object} card - Card object
   */
  addCardToHand(target, card) {
    if (target === "dealer") {
      this.dealerCards.push(card);
    } else if (target === "player") {
      this.playerCards.push(card);
    }
  }

  /**
   * Get player cards
   * @returns {Array} - Player's cards
   */
  getPlayerCards() {
    return this.playerCards;
  }

  /**
   * Get dealer cards
   * @returns {Array} - Dealer's cards
   */
  getDealerCards() {
    return this.dealerCards;
  }

  /**
   * Get cards from a specific hand
   * @param {string} target - 'dealer' or 'player'
   * @returns {Array} - Cards from the specified hand
   */
  getCards(target) {
    return target === "dealer" ? this.dealerCards : this.playerCards;
  }

  /**
   * Clear all hands
   */
  clearHands() {
    this.playerCards = [];
    this.dealerCards = [];
  }

  /**
   * Get all cards from all hands
   * @returns {Array} - All cards from player and dealer
   */
  getAllCardsFromHands() {
    return [...this.playerCards, ...this.dealerCards];
  }

  /**
   * Set player turn
   * @param {boolean} isPlayerTurn - Whether it's player's turn
   */
  setPlayerTurn(isPlayerTurn) {
    this.isPlayerTurn = isPlayerTurn;
  }

  /**
   * Check if it's player's turn
   * @returns {boolean} - Whether it's player's turn
   */
  isPlayersTurn() {
    return this.isPlayerTurn;
  }

  /**
   * Get visible cards from a hand
   * @param {string} target - 'dealer' or 'player'
   * @param {boolean} countOnly - Whether to return just the count
   * @returns {Array|number} - Visible cards or count of visible cards
   */
  getVisibleCards(target, countOnly = false) {
    const cards = this.getCards(target);
    const visibleCards = cards.filter((card) => card.controller?.isFaceUp());
    return countOnly ? visibleCards.length : visibleCards;
  }

  /**
   * Get the count of cards that are face up in a hand
   * @param {string} target - 'dealer' or 'player'
   * @returns {number} - Number of face up cards
   */
  getVisibleCardCount(target) {
    return this.getVisibleCards(target, true);
  }

  /**
   * Toggle card visibility
   * @param {string} target - 'dealer' or 'player'
   * @param {number} cardIndex - Index of the card to toggle
   */
  toggleCardVisibility(target, cardIndex) {
    const cards = this.getCards(target);
    if (cardIndex >= 0 && cardIndex < cards.length) {
      cards[cardIndex].controller?.toggleCard();
    }
  }

  /**
   * Check if all cards in a hand are face up
   * @param {string} target - 'dealer' or 'player'
   * @returns {boolean} - Whether all cards are face up
   */
  areAllCardsFaceUp(target) {
    const cards = this.getCards(target);
    return cards.every((card) => card.controller?.isFaceUp());
  }
}

export default PlayerModel;
