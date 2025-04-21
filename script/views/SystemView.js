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
        this.adminButtons = {
            flip: document.getElementById("flip-button"),
            shuffle: document.getElementById("shuffle-button"),
            reset: document.getElementById("reset-button"),
            rules: document.getElementById("rules-button")
        };
        
        // Game buttons
        this.newGameButton = document.getElementById("new-game-button");
    }
    
    /**
     * Set button disabled state
     * @param {HTMLElement} button - The button element
     * @param {boolean} isDisabled - Whether the button should be disabled
     */
    setButtonState(button, isDisabled) {
        if (button) {
            button.disabled = isDisabled;
        }
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
        Object.values(this.adminButtons).forEach(button => 
            this.setButtonState(button, isDisabled)
        );
    }
    
    /**
     * Set new game button state
     * @param {boolean} isDisabled - Whether the button should be disabled
     */
    setNewGameButtonState(isDisabled) {
        this.setButtonState(this.newGameButton, isDisabled);
    }
    
    /**
     * Format hand status text
     * @param {number} value - Hand value
     * @param {boolean} isBlackjack - Whether hand has blackjack
     * @param {boolean} isBust - Whether hand is bust
     * @param {boolean} isWinner - Whether hand is winner
     * @param {boolean} isTie - Whether game is a tie
     * @returns {string} - Formatted status text
     */
    formatHandStatus(value, isBlackjack, isBust, isWinner, isTie) {
        let text = value.toString();
        
        if (isBlackjack) {
            text += " (Blackjack♣️♥️!)";
        } else if (isBust) {
            text += " (Bust💥)";
        }
        
        if (isWinner) {
            text += " ✅ Winner!";
        } else if (isTie) {
            text += " (Tie🤝)";
        }
        
        return text;
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
        // Update player score (always visible)
        this.playerScoreElement.textContent = this.formatHandStatus(
            playerValue, 
            playerBlackjack, 
            playerBust, 
            false, 
            false
        );
        
        // Update dealer score (may hide status if cards are not all visible)
        if (allDealerCardsVisible) {
            this.dealerScoreElement.textContent = this.formatHandStatus(
                dealerValue, 
                dealerBlackjack, 
                dealerBust, 
                false, 
                false
            );
        } else {
            this.dealerScoreElement.textContent = dealerValue;
        }
    }
    
    /**
     * Display game result
     * @param {string} winner - The winner ('player', 'dealer', or 'tie')
     */
    displayGameResult(winner) {
        const isTie = winner === "tie";
        
        this.playerScoreElement.textContent = this.formatHandStatus(
            parseInt(this.playerScoreElement.textContent), 
            this.playerScoreElement.textContent.includes("Blackjack"), 
            this.playerScoreElement.textContent.includes("Bust"), 
            winner === "player", 
            isTie
        );
        
        this.dealerScoreElement.textContent = this.formatHandStatus(
            parseInt(this.dealerScoreElement.textContent), 
            this.dealerScoreElement.textContent.includes("Blackjack"), 
            this.dealerScoreElement.textContent.includes("Bust"), 
            winner === "dealer", 
            isTie
        );
    }
    
    /**
     * Bind system event handlers
     * @param {Object} handlers - Object containing event handler functions
     */
    bindSystemEvents(handlers) {
        this.adminButtons.flip.addEventListener("click", handlers.flip);
        this.adminButtons.shuffle.addEventListener("click", handlers.shuffle);
        this.adminButtons.reset.addEventListener("click", handlers.reset);
        this.adminButtons.rules.addEventListener("click", handlers.showRules);
        this.newGameButton.addEventListener("click", handlers.newGame);
    }
}

export default SystemView;
