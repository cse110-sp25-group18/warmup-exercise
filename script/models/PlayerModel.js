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
        if (target === 'dealer') {
            this.dealerCards.push(card);
        } else if (target === 'player') {
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
     * Get the count of cards that are face up in a hand
     * @param {string} target - 'dealer' or 'player'
     * @returns {number} - Number of face up cards
     */
    getVisibleCardCount(target) {
        const cards = target === 'dealer' ? this.dealerCards : this.playerCards;
        return cards.filter(card => card.controller?.isFaceUp()).length;
    }
    
    /**
     * Get visible cards from a hand
     * @param {string} target - 'dealer' or 'player'
     * @returns {Array} - Visible cards
     */
    getVisibleCards(target) {
        const cards = target === 'dealer' ? this.dealerCards : this.playerCards;
        return cards.filter(card => card.controller?.isFaceUp());
    }
    
    /**
     * Toggle card visibility
     * @param {string} target - 'dealer' or 'player'
     * @param {number} cardIndex - Index of the card to toggle
     */
    toggleCardVisibility(target, cardIndex) {
        const cards = target === 'dealer' ? this.dealerCards : this.playerCards;
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
        const cards = target === 'dealer' ? this.dealerCards : this.playerCards;
        return cards.every(card => card.controller?.isFaceUp());
    }
}

export default PlayerModel; 