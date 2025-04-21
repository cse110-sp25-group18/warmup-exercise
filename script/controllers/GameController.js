import CardFactory from "../card.js";
import SystemModel from "../models/SystemModel.js";
import PlayerModel from "../models/PlayerModel.js";
import SystemView from "../views/SystemView.js";
import PlayerView from "../views/PlayerView.js";
import BettingModel from "../models/BettingModel.js";
import BettingView from "../views/BettingView.js";


const DISABLE = true;
const ENABLE = false;
/**
 * GameController - Coordinates the game using the system and player components
 */
class GameController {
    /**
     * Constructor for GameController
     */
    constructor() {
        // Create models
        this.systemModel = new SystemModel();
        this.playerModel = new PlayerModel();
        // Create views
        this.systemView = new SystemView();
        this.playerView = new PlayerView();

        this.bettingModel = new BettingModel();
        this.bettingView = new BettingView();

        // Initialize the user's starting bankroll
        if (!sessionStorage.getItem("bankroll")) {
            sessionStorage.setItem("bankroll", "100");
        }
        
        // Initialize the game
        this.initializeGame();
        
        // Bind event handlers
        this.bindEventHandlers();
        this.bettingView.updateBankrollDisplay(this.bettingModel.getBankroll());
        this.bettingView.bindPlaceBet((amount) => this.handleBet(amount));
    }
    
    /**
     * Set all button states at once
     * @param {boolean} adminDisabled - Whether admin buttons should be disabled
     * @param {boolean} dealerDisabled - Whether dealer buttons should be disabled
     * @param {boolean} playerDisabled - Whether player buttons should be disabled
     * @param {boolean} gameDisabled - Whether game buttons should be disabled
     * @param {boolean} hitDisabled - Whether hit button should be disabled
     * @param {boolean} standDisabled - Whether stand button should be disabled
     */
    setAllButtonStates(adminDisabled = false, dealerDisabled = false, playerDisabled = false, 
                      gameDisabled = false, hitDisabled = true, standDisabled = true, betDisabled=false) {
        this.systemView.setAdminButtonsState(adminDisabled);
        this.playerView.setDealerButtonsState(dealerDisabled);
        this.playerView.setPlayerButtonsState(playerDisabled);
        this.systemView.setNewGameButtonState(gameDisabled);
        this.playerView.setGameActionButtonsState(hitDisabled, standDisabled);
        this.bettingView.setBetButtonState(betDisabled);
    }
    
    /**
     * Initialize the game with a deck of cards
     */
    initializeGame() {
        // Create deck of cards
        this.createDeck();
        
        // Update UI counters
        this.updateCounters();
        
        // Shuffle the deck
        this.shuffleDeck();
    }
    
    /**
     * Create a standard deck of 52 cards
     */
    createDeck() {
        const suits = ["hearts", "diamonds", "spades", "clubs"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        
        // Create each card and add to model and view
        for (let suit of suits) {
            for (let rank of ranks) {
                this.addCard(suit, rank);
            }
        }
    }
    
    /**
     * Add a card to the deck
     * @param {string} suit - Card suit
     * @param {string} rank - Card rank
     */
    addCard(suit, rank) {
        // Use CardFactory to create a card with MVC pattern
        const cardController = CardFactory.createCard(suit, rank);
        const cardElement = cardController?.getElement();
        
        // Store controller reference in element for easy access
        cardElement.controller = cardController;
        cardElement.controller?.disableClick();
        
        // Add to the view's deck container
        const firstCard = this.systemView.deckContainer.firstChild;
        this.systemView.deckContainer.insertBefore(cardElement, firstCard);
        
        // Add to model's deck
        this.systemModel.deckCards.unshift(cardElement);
        
        // Arrange cards in stack
        this.arrangeCardsInStack();
    }
    
    /**
     * Arrange cards in a stack in the deck
     */
    arrangeCardsInStack() {
        const deckCards = this.systemView.getDeckCards();
        this.systemView.arrangeCardsInStack(deckCards);
    }
    
    /**
     * Update hand values and card counter displays
     */
    updateCounters() {
        // Get dealer cards and visible status
        const dealerCards = this.playerModel.getDealerCards();
        const visibleDealerCards = this.playerModel.getVisibleCards('dealer');
        const allDealerCardsVisible = this.playerModel.areAllCardsFaceUp('dealer');
        
        // Get player cards
        const playerCards = this.playerModel.getPlayerCards();
        
        // Calculate values and states
        const dealerValue = this.systemModel.calculateHandValue(visibleDealerCards);
        const playerValue = this.systemModel.calculateHandValue(playerCards);
        
        const dealerBlackjack = this.systemModel.checkBlackjack(dealerCards);
        const dealerBust = this.systemModel.checkBust(dealerCards);
        const playerBlackjack = this.systemModel.checkBlackjack(playerCards);
        const playerBust = this.systemModel.checkBust(playerCards);
        
        // Update view
        this.systemView.updateScores(
            dealerValue, 
            playerValue, 
            dealerBlackjack, 
            dealerBust, 
            playerBlackjack, 
            playerBust, 
            allDealerCardsVisible
        );
        
        // Update card counter
        this.systemView.updateCardCounter(this.systemModel.getDeckCount());
    }
    
    /**
     * Bind event handlers to views
     */
    bindEventHandlers() {
        // System event handlers
        const systemHandlers = {
            flip: () => this.handleFlip(),
            shuffle: (event) => this.handleShuffle(event),
            reset: () => this.handleReset(),
            newGame: () => this.startNewGame(),
            showRules: () => this.showRules()
        };
        
        // Player event handlers
        const playerHandlers = {
            dealToDealer: () => this.dealCardToHand('dealer'),
            dealToPlayer: () => this.dealCardToHand('player'),
            hit: () => this.playerHit(),
            stand: () => this.playerStand()
        };
        
        // Bind events to views
        this.systemView.bindSystemEvents(systemHandlers);
        this.playerView.bindPlayerEvents(playerHandlers);
    }
    
    /**
     * Handle flipping the top card
     */
    handleFlip() {
        console.log("Flip button clicked");
        const topCard = this.systemView.getTopCard();
        
        if (topCard) {
            topCard.controller?.toggleCard();
            this.updateCounters();
        }
    }
    
    /**
     * Check and execute callback if provided
     * @param {Function} callback - Optional callback to execute
     */
    executeCallback(callback) {
        if (callback) {
            callback();
        } else if (this.systemView.adminButtons.shuffle.shuffleCallback) {
            this.systemView.adminButtons.shuffle.shuffleCallback();
            this.systemView.adminButtons.shuffle.shuffleCallback = null;
        }
    }
    
    /**
     * Handle shuffling the deck
     * @param {Event} event - Click event
     * @param {Function} callback - Optional callback after shuffle
     */
    handleShuffle(event, callback) {
        console.log("Shuffle button clicked");
        
        // Disable buttons during animation
        this.setAllButtonStates(DISABLE, DISABLE, DISABLE, DISABLE, DISABLE, DISABLE, DISABLE);
        
        const allCards = this.systemView.getDeckCards();
        if (allCards.length < 1) {
            this.setAllButtonStates(ENABLE, ENABLE, ENABLE, ENABLE);
            this.executeCallback(callback);
            return;
        }
        
        // Animation logic for shuffling
        this.animateShuffle(allCards, event, callback);
    }
    
    /**
     * Animate the shuffle process
     * @param {Array} allCards - All cards in the deck
     * @param {Event} event - Click event
     * @param {Function} callback - Optional callback after shuffle
     */
    animateShuffle(allCards, event, callback) {
        // Only get visible cards for animation (max 3)
        const visibleCards = allCards.filter(card => card.style.display !== 'none');
        const cardsToAnimate = visibleCards.slice(0, 3);
        let topCardFlipped = false;
        
        // First flip any face-up cards
        cardsToAnimate.forEach(card => {
            if(card.controller?.isFaceUp()){
                card.controller?.disableClick();
                card.controller?.toggleCard();
                setTimeout(() => this.handleShuffle(event, callback), 700);
                topCardFlipped = true;
            }
        });
        
        if (topCardFlipped) return;
        
        // Animation timing constants
        const alignDuration = 150;
        const animationDuration = 300;
        const cardDelay = 200;
        const finalDelay = 150;
        
        // Save original positions
        const originalTransforms = cardsToAnimate.map(card => ({
            left: card.style.left || '0px',
            top: card.style.top || '0px',
            zIndex: card.style.zIndex || '0'
        }));
        
        // Step 1: Align cards
        cardsToAnimate.forEach(card => {
            card.style.transition = `all ${alignDuration}ms ease-in-out`;
            card.dataset.originalTransform = card.style.transform || '';
            card.style.left = '0px';
            card.style.top = '0px';
        });
        
        // Calculate animation timings
        const startTime = alignDuration + 50;
        const upTimes = cardsToAnimate.map((_, index) => startTime + (index * cardDelay));
        const lastCardUpTime = upTimes[upTimes.length - 1] + animationDuration;
        const downTimes = cardsToAnimate.map((_, index) => lastCardUpTime + cardDelay + (index * cardDelay));
        const lastCardDownTime = downTimes[downTimes.length - 1] + animationDuration;
        const returnTime = lastCardDownTime + finalDelay;
        
        // Step 2: Animate cards up
        cardsToAnimate.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = `transform ${animationDuration}ms ease-in-out`;
                card.style.transform = `translateY(-30px)`;
            }, upTimes[index]);
        });
        
        // Step 3: Animate cards down
        cardsToAnimate.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = `transform ${animationDuration}ms ease-in-out`;
                card.style.transform = '';
            }, downTimes[index]);
        });
        
        // Step 4: Complete animation and perform actual shuffle
        setTimeout(() => {
            // Return cards to original positions
            cardsToAnimate.forEach((card, index) => {
                card.style.transition = `all ${alignDuration}ms ease-in-out`;
                card.style.left = originalTransforms[index].left;
                card.style.top = originalTransforms[index].top;
                card.style.zIndex = originalTransforms[index].zIndex;
            });
            
            // After animation, shuffle the deck
            setTimeout(() => {
                this.performShuffle(callback);
            }, alignDuration);
        }, returnTime);
        
    }
    
    /**
     * Perform the actual shuffle operation
     * @param {Function} callback - Optional callback after shuffle
     */
    performShuffle(callback) {
        // Get all cards from deck
        const allCards = this.systemView.getDeckCards();
        
        // Update model with current deck
        this.systemModel.setDeckCards(allCards);
        
        // Shuffle the deck in the model
        this.systemModel.shuffleDeck();
        
        // Remove all cards from DOM
        allCards.forEach(card => this.systemView.deckContainer.removeChild(card));
        
        // Ensure all cards are face down
        allCards.forEach(card => {
            if (card.controller?.isFaceUp()) {
                card.controller?.toggleCard();
            }
        });
        
        // Add shuffled cards back in reverse order
        for (let i = this.systemModel.deckCards.length - 1; i >= 0; i--) {
            this.systemView.deckContainer.appendChild(this.systemModel.deckCards[i]);
        }
        
        // Debug log
        console.log('Cards after shuffle (top to bottom):');
        this.systemModel.deckCards.forEach((card, index) => {
            const suit = card.controller?.getSuit();
            const rank = card.controller?.getRank();
            // console.log(`${index + 1}. ${rank} of ${suit}`);
        });
        
        // Re-arrange cards in stack
        this.arrangeCardsInStack();
                
        // Call callback if provided
        this.executeCallback(callback);
    }
    
    /**
     * Deal a card from deck to a hand
     * @param {string} target - 'dealer' or 'player'
     */
    dealCardToHand(target) {
        // Disable buttons during animation
        this.setAllButtonStates(true, true, true, true, true, true, true);
        
        // Get the top card from deck
        const cardToDeal = this.systemView.getTopCard();
        if (!cardToDeal) {
            // 4
            this.setAllButtonStates(false, false, false, false, false, false, false);
            return;
        }
        
        // Remove card from model's deck
        this.systemModel.deckCards.shift();
        
        // Animate dealing card
        this.playerView.animateCardDeal(cardToDeal, target, () => {
            // Add card to appropriate hand in model
            this.playerModel.addCardToHand(target, cardToDeal);
            
            // Configure card based on destination
            if (target === 'player') {
                // For player, flip card face up
                cardToDeal.controller?.enableClick();
                if (!cardToDeal.controller?.isFaceUp()) {
                    cardToDeal.controller?.toggleCard();
                }
            } else if (target === 'dealer') {
                const dealerCards = this.playerModel.getDealerCards();
                cardToDeal.controller?.disableClick();
                
                // First dealer card face up, others face down
                if (dealerCards.length === 1) {
                    if (!cardToDeal.controller?.isFaceUp()) {
                        cardToDeal.controller?.toggleCard();
                    }
                } else {
                    if (cardToDeal.controller?.isFaceUp()) {
                        cardToDeal.controller?.toggleCard();
                    }
                }
            }
            
            this.arrangeCardsInStack();
            this.updateCounters();
            
            // Re-enable buttons
            //4
            this.setAllButtonStates(false, false, false, false, false, false, false);
            
            if (target === 'player') {
                setTimeout(() => {
                    const playerCards = this.playerModel.getPlayerCards();
                    if (this.systemModel.checkBust(playerCards)) {
                        console.log("Player busts!");
                        this.endGame("dealer");
                        return;
                    }
                    
                    const playerValue = this.systemModel.calculateHandValue(playerCards);
                    console.log("Player has " + playerValue);
                    
                    // Re-enable buttons only if player hasn't busted
                    this.playerView.setGameActionButtonsState(ENABLE, ENABLE);
                }, 300);
            }
        });
    }
    
    /**
     * Handle reset button click
     */
    handleReset() {
        console.log("Reset button clicked");
        
        // Disable buttons during operation
        // 4
        this.setAllButtonStates(true, true, true, true, true, true, true);
        
        // Get cards from both hands
        const dealerCards = this.playerView.getHandCards('dealer');
        const playerCards = this.playerView.getHandCards('player');
        
        // If no cards in hands, nothing to reset
        if (dealerCards.length === 0 && playerCards.length === 0) {
            // 4
            this.setAllButtonStates(false, false, false, false, false, false, false);
            return;
        }
        
        // Add fade-out animation to cards
        this.playerView.fadeOutHandCards('dealer');
        this.playerView.fadeOutHandCards('player');
        
        // Return cards to deck after animation
        setTimeout(() => {
            // Return all cards to system model
            const allHandCards = this.playerModel.getAllCardsFromHands();
            this.systemModel.deckCards = [...this.systemModel.deckCards, ...allHandCards];
            
            // Clear player model hands
            this.playerModel.clearHands();
            
            // Return cards in view
            [...dealerCards, ...playerCards].forEach(card => {
                this.systemView.returnCardToDeck(card);
            });
            
            this.arrangeCardsInStack();
            this.updateCounters();
            
            // Re-enable buttons
            // 4
            this.setAllButtonStates(false, false, false, false, false, false, false);
            
            // Shuffle the deck
            this.shuffleDeck();
        }, 600);
    }
    
    /**
     * Trigger shuffle with a callback
     * @param {Function} callback - Function to call after shuffle
     */
    shuffleDeck(callback) {
        this.systemView.adminButtons.shuffle.shuffleCallback = callback;
        this.systemView.adminButtons.shuffle.click();
    }
    
    /**
     * Start a new blackjack game
     */
    startNewGame() {
        console.log("Starting new game...");
        
        // Disable all game buttons during new game setup
        const bet = this.bettingModel.getBet();
            if (bet <= 0) {
            this.bettingView.showBetStatus("Place a valid bet before starting the game!", true);
            return;
        }
        this.setAllButtonStates(false, true, true, true, true, true, true);
        
        // Check if enough cards in deck
        if (this.systemModel.getDeckCount() < 4) {
            alert("Not enough cards in the deck to start a new game!");
            this.playerView.setDealerButtonsState(false);
            this.playerView.setPlayerButtonsState(false);
            return;
        }
        
        // Start new game in models
        this.systemModel.startNewGame();
        this.playerModel.setPlayerTurn(true);
        
        // Clear hands
        this.clearHands();
        
        // Shuffle and deal initial cards
        this.systemView.adminButtons.shuffle.shuffleCallback = () => this.dealInitialCards();
        this.systemView.adminButtons.shuffle.click();
    }
    
    /**
     * Clear all cards from hands
     */
    clearHands() {
        // Get all cards from hands in view
        const dealerCards = this.playerView.getHandCards('dealer');
        const playerCards = this.playerView.getHandCards('player');
        
        // Return cards to deck in view
        [...dealerCards, ...playerCards].forEach(card => {
            this.systemView.returnCardToDeck(card);
        });
        
        // Clear hands in model
        this.playerModel.clearHands();
        
        // Update scores
        this.updateCounters();
    }
    
    /**
     * Helper to handle card dealing animation with timing
     * @param {string} target - 'dealer' or 'player'
     * @param {boolean} faceUp - Whether card should be face up
     * @param {Function} callback - Optional callback after card is dealt
     */
    dealCard(target, faceUp, callback) {
        const cardToDeal = this.systemView.getTopCard();
        if (!cardToDeal) return;
        
        // Remove from model's deck
        this.systemModel.deckCards.shift();
        
        // Add to appropriate hand in model
        this.playerModel.addCardToHand(target, cardToDeal);
        
        // Animate card dealing
        cardToDeal.classList.add("fade-out");
        setTimeout(() => {
            const container = this.playerView.getHandContainer(target);
            this.playerView.slideCardIntoHand(cardToDeal, container);
            
            setTimeout(() => {
                cardToDeal.controller?.[target === 'player' ? 'enableClick' : 'disableClick']();
                
                // Set face up/down state
                if (faceUp !== cardToDeal.controller?.isFaceUp()) {
                    cardToDeal.controller?.toggleCard();
                }
                
                setTimeout(() => {
                    this.arrangeCardsInStack();
                    this.updateCounters();
                    if (callback) callback();
                }, 300);
            }, 600);
        }, 600);
    }
    
    /**
     * Deal initial cards for a new game
     */
    dealInitialCards() {
        const dealSequence = [
            {target: 'player', faceUp: true},
            {target: 'dealer', faceUp: true},
            {target: 'player', faceUp: true},
            {target: 'dealer', faceUp: false}
        ];
        
        const dealNext = (index) => {
            if (index >= dealSequence.length) {
                // All cards dealt, check for blackjack
                setTimeout(() => this.checkInitialBlackjack(), 700);
                return;
            }
            
            const {target, faceUp} = dealSequence[index];
            this.dealCard(target, faceUp, () => setTimeout(() => dealNext(index + 1), 700));
        };
        
        // Start dealing sequence
        setTimeout(() => dealNext(0), 100);
    }
    
    /**
     * Deal a card in the initial deal
     * @param {string} target - 'dealer' or 'player'
     * @param {boolean} faceUp - Whether card should be face up
     */
    dealInitialCard(target, faceUp) {
        this.dealCard(target, faceUp);
    }
    /**
     * Handles user placing a bet
     * @param {*} amount 
     */
    handleBet(amount) {
        if (this.bettingModel.placeBet(amount)) {
            this.bettingView.updateBankrollDisplay(this.bettingModel.getBankroll());
            this.bettingView.showBetStatus(`Bet of $${amount} placed.`);
            // Enable the New Game button or call startNewGame() if ready
        } else {
            this.bettingView.showBetStatus("Invalid bet!", true);
        }
    }
    
    /**
     * Check for blackjack after initial deal
     */
    checkInitialBlackjack() {
        const playerCards = this.playerModel.getPlayerCards();
        const playerHasBlackjack = this.systemModel.checkBlackjack(playerCards);
        
        // Enable game buttons if no blackjack
        if (!playerHasBlackjack) {
            this.playerView.setGameActionButtonsState(ENABLE, ENABLE);
        } else {
            // Player has blackjack
            console.log("Player has blackjack!");
            
            // Flip dealer's face-down card
            const dealerCards = this.playerModel.getDealerCards();
            if (dealerCards.length >= 2 && !dealerCards[1].controller?.isFaceUp()) {
                dealerCards[1].controller?.toggleCard();
                this.updateCounters();
            }
            
            // Determine outcome
            const dealerHasBlackjack = this.systemModel.checkBlackjack(dealerCards);
            if (dealerHasBlackjack) {
                console.log("Dealer also has blackjack! It's a tie.");
                this.endGame("tie");
            } else {
                console.log("Player wins with blackjack!");
                this.endGame("player");
            }
        }
    }
    
    /**
     * Handle player's hit action
     */
    playerHit() {
        console.log("Player hits.");
        // Disable buttons during animation
        this.playerView.setGameActionButtonsState(DISABLE, DISABLE);
        this.systemView.setNewGameButtonState(DISABLE);
        
        // Deal card to player
        this.dealCardToHand('player');
    }
    
    /**
     * Handle player's stand action
     */
    playerStand() {
        console.log("Player stands. Dealer's turn.");
        // Disable player action buttons
        this.playerView.setGameActionButtonsState(DISABLE, DISABLE);
        this.systemView.setNewGameButtonState(DISABLE);
        
        // Change turn in model
        this.playerModel.setPlayerTurn(false);
        this.systemModel.currentTurn = 'dealer';
        
        // Start dealer's turn
        setTimeout(() => this.dealerPlay(), 500);
    }
    
    /**
     * Handle dealer's automated play
     */
    dealerPlay() {
        // Flip dealer's face-down cards
        const dealerCards = this.playerModel.getDealerCards();
        let dealerCardFlipped = false;
        
        // Find and flip any face-down cards
        for (let i = 0; i < dealerCards.length; i++) {
            if (!dealerCards[i].controller?.isFaceUp()) {
                dealerCards[i].controller?.toggleCard();
                dealerCardFlipped = true;
                break; // Only flip one at a time
            }
        }
        
        // Update scores
        this.updateCounters();
        
        // If we flipped a card, wait before continuing
        if (dealerCardFlipped) {
            setTimeout(() => this.dealerPlay(), 700);
            return;
        }
        
        // Check if dealer should hit (less than 17)
        if (this.systemModel.shouldDealerHit(dealerCards)) {
            console.log("Dealer hits.");
            this.dealCardToDealer();
        } else {
            const dealerValue = this.systemModel.calculateHandValue(dealerCards);
            console.log("Dealer stands with " + dealerValue);
            // Determine winner
            this.determineWinner();
        }
    }
    
    /**
     * Deal a card to the dealer
     */
    dealCardToDealer() {
        const cardToDeal = this.systemView.getTopCard();
        if (!cardToDeal) {
            alert("No more cards in the deck!");
            return;
        }
        
        // Disable New Game button during dealer's action
        this.systemView.setNewGameButtonState(true);
        
        this.dealCard('dealer', true, () => {
            const dealerCards = this.playerModel.getDealerCards();
            if (this.systemModel.checkBust(dealerCards)) {
                console.log("Dealer busts!");
                this.endGame("player");
            } else {
                setTimeout(() => this.dealerPlay(), 700);
            }
        });
    }
    
    /**
     * Determine the winner of the game
     */
    determineWinner() {
        const playerCards = this.playerModel.getPlayerCards();
        const dealerCards = this.playerModel.getDealerCards();
        
        const winner = this.systemModel.determineWinner(playerCards, dealerCards);
        this.endGame(winner);
    }
    
    /**
     * End the game and display result
     * @param {string} winner - The winner ('player', 'dealer', or 'tie')
     */
    endGame(winner) {
        // End game in model
        this.systemModel.endGame(winner);
        
        // Set buttons to appropriate end-game state
        this.setAllButtonStates(false, true, true, false, true, true, false);
        
        // Update UI with result
        this.systemView.displayGameResult(winner);
        
        // Log result
        const resultMessages = {
            "player": "Player wins!",
            "dealer": "Dealer wins!",
            "tie": "It's a tie!"
        };
        this.bettingModel.resolveBet(winner);
        this.bettingView.updateBankrollDisplay(this.bettingModel.getBankroll());
        this.bettingView.betInput.value = "";
        this.bettingView.showBetStatus("Place your next bet.");

        console.log(resultMessages[winner] || "Game ended.");
    }
    
    /**
     * Show the rules page
     */
    showRules() {
        console.log("Rules button clicked");
        window.location.href = "rules.html";
    }
}

export default GameController; 