/**
 * SystemView - Responsible for handling UI elements not directly related to player/dealer hands
 */
class SystemView {
    constructor() {
        // Container for deck
        this.deckContainer = document.getElementById("deck-container");
        
        // Score elements
        this.dealerScoreElement = document.getElementById("dealer-score");
        this.playerScoreElement = document.getElementById("player-score");
        this.cardCounterElement = document.getElementById("card-counter");
        
        // Admin buttons
        this.flipButton = document.getElementById("flip-button");
        this.shuffleButton = document.getElementById("shuffle-button");
        this.resetButton = document.getElementById("reset-button");
        this.rulesButton = document.getElementById("rules-button");
        
        // Game buttons
        this.newGameButton = document.getElementById("new-game-button");
    }
    
    /**
     * Update the card counter in the UI
     * @param {number} deckCount - Number of cards left in the deck
     */
    updateCardCounter(deckCount) {
        this.cardCounterElement.textContent = deckCount;
    }
    
    /**
     * Control the enabled/disabled state of admin buttons
     * @param {boolean} isDisabled - Whether buttons should be disabled
     */
    setAdminButtonsState(isDisabled) {
        this.flipButton.disabled = isDisabled;
        this.shuffleButton.disabled = isDisabled;
        this.resetButton.disabled = isDisabled;
        this.rulesButton.disabled = isDisabled;
    }
    
    /**
     * Set new game button state
     * @param {boolean} isDisabled - Whether the button should be disabled
     */
    setNewGameButtonState(isDisabled) {
        this.newGameButton.disabled = isDisabled;
    }
    
    /**
     * Arrange cards in a stacked layout in the deck
     * @param {NodeList} cards - All card elements in the deck
     */
    arrangeCardsInStack(cards) {
        const offset = 5; // Offset in pixels between cards
        const cardsToShow = Math.min(cards.length, 3);
        
        cards.forEach((card, index) => {
            card.controller?.updatePosition(index, offset, cardsToShow);
            card.controller?.setAsTopCard(index === 0);
        });
    }
    
    /**
     * Return a card to the deck
     * @param {HTMLElement} card - The card element to return
     */
    returnCardToDeck(card) {
        card.classList.add("unrender");
        card.classList.remove("fade-out", "in-hand");
        
        this.deckContainer.appendChild(card);
        card.classList.remove("unrender");
    }
    
    /**
     * Get the top card from the deck
     * @returns {HTMLElement} - The top card in the deck
     */
    getTopCard() {
        const cards = this.deckContainer.querySelectorAll('card-element');
        return cards.length > 0 ? cards[0] : null;
    }
    
    /**
     * Get all cards from the deck
     * @returns {Array} - Array of card elements
     */
    getDeckCards() {
        return Array.from(this.deckContainer.querySelectorAll('card-element'));
    }
    
    /**
     * Update scores display
     * @param {number} dealerValue - Dealer's score
     * @param {number} playerValue - Player's score
     * @param {boolean} dealerBlackjack - Whether dealer has blackjack
     * @param {boolean} dealerBust - Whether dealer is bust
     * @param {boolean} playerBlackjack - Whether player has blackjack
     * @param {boolean} playerBust - Whether player is bust
     * @param {boolean} allDealerCardsVisible - Whether all dealer cards are visible
     */
    updateScores(dealerValue, playerValue, dealerBlackjack, dealerBust, playerBlackjack, playerBust, allDealerCardsVisible) {
        // Update dealer score
        this.dealerScoreElement.textContent = dealerValue;
        if (allDealerCardsVisible) {
            if (dealerBlackjack) {
                this.dealerScoreElement.textContent = dealerValue + " (Blackjack!)";
            } else if (dealerBust) {
                this.dealerScoreElement.textContent = dealerValue + " (Bust)";
            }
        }
        
        // Update player score
        this.playerScoreElement.textContent = playerValue;
        if (playerBlackjack) {
            this.playerScoreElement.textContent = playerValue + " (Blackjack!)";
        } else if (playerBust) {
            this.playerScoreElement.textContent = playerValue + " (Bust)";
        }
    }
    
    /**
     * Display game result
     * @param {string} winner - The winner ('player', 'dealer', or 'tie')
     */
    displayGameResult(winner) {
        switch(winner) {
            case "player":
                this.playerScoreElement.textContent += " ✅ Winner!";
                break;
            case "dealer":
                this.dealerScoreElement.textContent += " ✅ Winner!";
                break;
            case "tie":
                this.playerScoreElement.textContent += " (Tie)";
                this.dealerScoreElement.textContent += " (Tie)";
                break;
        }
    }
    
    /**
     * Bind system event handlers
     * @param {Object} handlers - Object containing event handler functions
     */
    bindSystemEvents(handlers) {
        this.flipButton.addEventListener("click", handlers.flip);
        this.shuffleButton.addEventListener("click", handlers.shuffle);
        this.resetButton.addEventListener("click", handlers.reset);
        this.rulesButton.addEventListener("click", handlers.showRules);
        this.newGameButton.addEventListener("click", handlers.newGame);
    }
}

export default SystemView; 