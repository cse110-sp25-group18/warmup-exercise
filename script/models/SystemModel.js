/**
 * SystemModel - Responsible for managing game rules, state and logic
 */
class SystemModel {
    constructor() {
        // Game state
        this.gameInProgress = false;
        this.currentTurn = null; // 'player' or 'dealer'
        this.gameResult = null; // 'player', 'dealer', 'tie'
        
        // Deck of cards
        this.deckCards = [];
    }
    
    /**
     * Calculate the value of a hand
     * @param {Array} cards - Array of cards
     * @returns {number} - Hand value
     */
    calculateHandValue(cards) {
        let sum = 0;
        let aceCount = 0;
        
        // Calculate all card values
        cards.forEach(card => {
            const rank = card.controller?.getRank();
            let value = 0;
            
            if (rank === "A") {
                value = 11;  // Ace initially counts as 11
                aceCount++;
            } else if (["K", "Q", "J"].includes(rank)) {
                value = 10;
            } else {
                value = parseInt(rank);
            }
            
            sum += value;
        });
        
        // Adjust for aces if needed (change from 11 to 1)
        while (sum > 21 && aceCount > 0) {
            sum -= 10;
            aceCount--;
        }
        
        return sum;
    }
    
    /**
     * Evaluate a hand's state (blackjack, bust, or regular value)
     * @param {Array} cards - Array of cards
     * @returns {Object} - Hand state with value, isBlackjack, and isBust properties
     */
    evaluateHand(cards) {
        const value = this.calculateHandValue(cards);
        return {
            value,
            isBlackjack: cards.length === 2 && value === 21,
            isBust: value > 21
        };
    }
    
    /**
     * Check if a hand has blackjack
     * @param {Array} cards - Array of cards
     * @returns {boolean} - Whether the hand has blackjack
     */
    checkBlackjack(cards) {
        return this.evaluateHand(cards).isBlackjack;
    }
    
    /**
     * Check if a hand is bust
     * @param {Array} cards - Array of cards
     * @returns {boolean} - Whether the hand is bust
     */
    checkBust(cards) {
        return this.evaluateHand(cards).isBust;
    }
    
    /**
     * Start a new game
     */
    startNewGame() {
        this.gameInProgress = true;
        this.currentTurn = 'player';
        this.gameResult = null;
    }
    
    /**
     * Set the deck cards
     * @param {Array} cards - Array of cards
     */
    setDeckCards(cards) {
        this.deckCards = [...cards];
    }
    
    /**
     * Get the number of cards in the deck
     * @returns {number} - Number of cards in the deck
     */
    getDeckCount() {
        return this.deckCards.length;
    }
    
    /**
     * Draw a card from the deck
     * @returns {Object} - The drawn card
     */
    drawCardFromDeck() {
        if (this.deckCards.length === 0) return null;
        return this.deckCards.shift();
    }
    
    /**
     * Shuffle the deck
     */
    shuffleDeck() {
        for (let i = this.deckCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deckCards[i], this.deckCards[j]] = [this.deckCards[j], this.deckCards[i]];
        }
    }
    
    /**
     * Determine the winner
     * @param {Array} playerCards - Player's cards
     * @param {Array} dealerCards - Dealer's cards
     * @returns {string} - Winner ('dealer', 'player', 'tie')
     */
    determineWinner(playerCards, dealerCards) {
        const player = this.evaluateHand(playerCards);
        const dealer = this.evaluateHand(dealerCards);
        
        // Check for busts
        if (player.isBust) {
            this.gameResult = 'dealer';
            return this.gameResult;
        }
        
        if (dealer.isBust) {
            this.gameResult = 'player';
            return this.gameResult;
        }
        
        // Check for blackjacks
        if (player.isBlackjack && !dealer.isBlackjack) {
            this.gameResult = 'player';
            return this.gameResult;
        }
        
        if (!player.isBlackjack && dealer.isBlackjack) {
            this.gameResult = 'dealer';
            return this.gameResult;
        }
        
        if (player.isBlackjack && dealer.isBlackjack) {
            this.gameResult = 'tie';
            return this.gameResult;
        }
        
        // Compare values (use a more concise comparison)
        if (player.value > dealer.value) {
            this.gameResult = 'player';
        } else if (dealer.value > player.value) {
            this.gameResult = 'dealer';
        } else {
            this.gameResult = 'tie';
        }
        
        return this.gameResult;
    }
    
    /**
     * Check if the dealer should hit (less than 17)
     * @param {Array} dealerCards - Dealer's cards
     * @returns {boolean} - Whether the dealer should hit
     */
    shouldDealerHit(dealerCards) {
        return this.calculateHandValue(dealerCards) < 17;
    }
    
    /**
     * End the game
     * @param {string} result - Game result ('player', 'dealer', 'tie')
     */
    endGame(result) {
        this.gameInProgress = false;
        this.currentTurn = null;
        this.gameResult = result;
    }
}

export default SystemModel; 