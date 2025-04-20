//script.js
import CardFactory from "./card.js";

document.addEventListener('DOMContentLoaded', () => {
    const deckContainer = document.getElementById("deck-container");
    const handContainerDealer = document.getElementById("hand-container-dealer");
    const handContainerPlayer = document.getElementById("hand-container-player");
    const dealerScoreElement = document.getElementById("dealer-score");
    const playerScoreElement = document.getElementById("player-score");
    const cardCounterElement = document.getElementById("card-counter");

    // Button elements
    const flipButton = document.getElementById("flip-button");
    const shuffleButton = document.getElementById("shuffle-button");
    const dealButtonDealer = document.getElementById("deal-button-dealer");
    const dealButtonPlayer = document.getElementById("deal-button-player");
    const resetButton = document.getElementById("reset-button");
    const rulesButton = document.getElementById("rules-button");
    
    
    // Blackjack game buttons
    const newGameButton = document.getElementById("new-game-button");
    const hitButton = document.getElementById("hit-button");
    const standButton = document.getElementById("stand-button");
    
    // Initialize game buttons as disabled
    hitButton.disabled = true;
    standButton.disabled = true;

    // Blackjack game functions
    function getCardValue(card) {
        if (card.controller?.getRank() === "A") return 11;  // Ace initially counts as 11
        if (["K", "Q", "J"].includes(card.controller?.getRank())) return 10;
        return parseInt(card.controller?.getRank());
    }

    function calculateHandValue(cards) {
        let sum = 0;
        let aceCount = 0;
        
        // Sum all card values
        cards.forEach(card => {
            const value = getCardValue(card);
            sum += value;
            
            // Count aces for later adjustment if needed
            if (card.controller?.getRank() === "A") {
                aceCount++;
            }
        });
        
        // Adjust for aces if needed (change from 11 to 1)
        while (sum > 21 && aceCount > 0) {
            sum -= 10;  // Convert one ace from 11 to 1
            aceCount--;
        }
        
        return sum;
    }

    function checkBlackjack(handContainer, onlyVisibleCards = false) {
        const cards = handContainer.querySelectorAll('card-element');
        let cardsToCheck = Array.from(cards);
        
        // For dealer with hidden cards, we need to consider if we're only checking visible cards
        if (onlyVisibleCards && handContainer === handContainerDealer) {
            cardsToCheck = cardsToCheck.filter(card => card.controller?.isFaceUp());
        }
        
        // Blackjack is 21 points with exactly 2 cards
        return cardsToCheck.length === 2 && calculateHandValue(cardsToCheck) === 21;
    }
    
    function checkBust(handContainer, onlyVisibleCards = false) {
        const cards = handContainer.querySelectorAll('card-element');
        let cardsToCheck = Array.from(cards);
        
        // For dealer with hidden cards, we need to consider if we're only checking visible cards
        if (onlyVisibleCards && handContainer === handContainerDealer) {
            cardsToCheck = cardsToCheck.filter(card => card.controller?.isFaceUp());
        }
        
        // Bust is over 21 points
        return calculateHandValue(cardsToCheck) > 21;
    }

    function updateHandValues() {
        // Calculate and update dealer's score
        const dealerCards = handContainerDealer.querySelectorAll('card-element');
        
        // For dealer, only count face-up cards for the displayed score
        const visibleDealerCards = Array.from(dealerCards).filter(card => card.controller?.isFaceUp());
        const dealerValue = calculateHandValue(visibleDealerCards);
        dealerScoreElement.textContent = dealerValue;
        
        // Add indicators for blackjack or bust only if all cards are visible
        const allDealerCardsVisible = visibleDealerCards.length === dealerCards.length;
        
        if (allDealerCardsVisible) {
            if (checkBlackjack(handContainerDealer)) {
                dealerScoreElement.textContent = dealerValue + " (Blackjack!)";
            } else if (checkBust(handContainerDealer)) {
                dealerScoreElement.textContent = dealerValue + " (Bust)";
            }
        }
        
        // For player, always count all cards (they're all face up)
        const playerCards = handContainerPlayer.querySelectorAll('card-element');
        const playerValue = calculateHandValue(Array.from(playerCards));
        playerScoreElement.textContent = playerValue;
        
        // Add indicators for blackjack or bust
        if (checkBlackjack(handContainerPlayer)) {
            playerScoreElement.textContent = playerValue + " (Blackjack!)";
        } else if (checkBust(handContainerPlayer)) {
            playerScoreElement.textContent = playerValue + " (Bust)";
        }
    }

    function updateCardCounter() {
        const deckCount = deckContainer.querySelectorAll('card-element').length;
        cardCounterElement.textContent = deckCount;
    }

    function buttonsOff(value){
        dealButtonDealer.disabled = value;
        dealButtonPlayer.disabled = value;
        flipButton.disabled = value;
        shuffleButton.disabled = value;
        resetButton.disabled = value;
        newGameButton.disabled = value;
        rulesButton.disabled = value;
    }

    rulesButton.addEventListener("click", function () {
        console.log("Rules button clicked");

        window.location.href = "rules.html";
    });

    flipButton.addEventListener("click", function () {
        console.log("Flip button clicked");
        const cards = deckContainer.querySelectorAll('card-element');
        // Only flip the top card 
        if (cards.length > 0) {
            const topCard = cards[0]; 
            topCard.controller?.toggleCard();
            // Update scores since flipping a dealer's card would change the visible score
            updateHandValues();
        }
    });

    shuffleButton.addEventListener("click", function handleShuffle(event, callback) {
        console.log("shuffle button clicked");
        
        // Disable button during animation
        buttonsOff(true);
        
        const allCards = deckContainer.querySelectorAll('card-element');
        if (allCards.length < 1) {
            shuffleButton.disabled = false;
            // Use the callback parameter first, fallback to the property if it exists
            if (callback) {
                callback();
            } else if (shuffleButton.shuffleCallback) {
                shuffleButton.shuffleCallback();
                shuffleButton.shuffleCallback = null; // Clear it after use
            }
            return;
        }
        
        // Only get visible cards for animation (max 3)
        const visibleCards = Array.from(allCards).filter(card => card.style.display !== 'none');
        const cardsToAnimate = visibleCards.slice(0, 3);
        let topCardFlipped = false;
        cardsToAnimate.forEach(card => {
            if(card.controller?.isFaceUp()){
                card.controller?.toggleCard();
                setTimeout(() => handleShuffle(event, callback), 700);
                topCardFlipped = true;
            }
        });
        if (topCardFlipped) return;
        
        // Define animation timing constants
        const alignDuration = 150;      // Time to align cards
        const animationDuration = 300;  // Time for each card to go up or down
        const cardDelay = 200;          // Delay between each card's animation
        const finalDelay = 150;         // Delay before returning to original positions
        
        // Save original transforms and positions for later
        const originalTransforms = cardsToAnimate.map(card => ({
            left: card.style.left || '0px',
            top: card.style.top || '0px',
            zIndex: card.style.zIndex || '0'
        }));
        
        // Step 1: Align all visible cards perfectly on top of each other
        cardsToAnimate.forEach(card => {
            card.style.transition = `all ${alignDuration}ms ease-in-out`;
            // Store original transform for use in animations
            card.dataset.originalTransform = card.style.transform || '';
            // Set left and top to 0 (remove offsets)
            card.style.left = '0px';
            card.style.top = '0px';
        });
        
        // Calculate timing for each animation step
        const startTime = alignDuration + 50; // Add a small buffer
        
        // Each card going up timing
        const upTimes = cardsToAnimate.map((_, index) => 
            startTime + (index * cardDelay));
        
        // Each card going down timing (after all cards are up)
        const lastCardUpTime = upTimes[upTimes.length - 1] + animationDuration;
        const downTimes = cardsToAnimate.map((_, index) => 
            lastCardUpTime + cardDelay + (index * cardDelay));
        
        // Time to return to original positions
        const lastCardDownTime = downTimes[downTimes.length - 1] + animationDuration;
        const returnTime = lastCardDownTime + finalDelay;
        
        // Step 2: Animate each card up in sequence
        cardsToAnimate.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = `transform ${animationDuration}ms ease-in-out`;
                // Save current transform and add translateY
                card.style.transform = `translateY(-30px)`;
            }, upTimes[index]);
        });
        
        // Step 3: Animate each card down in the same sequence
        cardsToAnimate.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = `transform ${animationDuration}ms ease-in-out`;
                // Return to flat position (no translateY)
                card.style.transform = '';
            }, downTimes[index]);
        });
        
        // Step 4: Complete the animation sequence
        setTimeout(() => {
            // Return all cards to their original positions
            cardsToAnimate.forEach((card, index) => {
                card.style.transition = `all ${alignDuration}ms ease-in-out`;
                card.style.left = originalTransforms[index].left;
                card.style.top = originalTransforms[index].top;
                card.style.zIndex = originalTransforms[index].zIndex;
            });

            // After animation completes, perform Fisher-Yates shuffle
            setTimeout(() => {
                // Get all cards (both visible and hidden) from deck only
                const allCards = Array.from(deckContainer.querySelectorAll('card-element'));
                
                // Fisher-Yates shuffle algorithm
                for (let i = allCards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
                }
                
                // Remove all cards from DOM
                allCards.forEach(card => deckContainer.removeChild(card));
                
                // Ensure all cards are face down before adding back
                allCards.forEach(card => {
                    if (card.controller?.isFaceUp()) {
                        card.controller?.toggleCard();
                    }
                });
                
                // Add shuffled cards back in reverse order
                for (let i = allCards.length - 1; i >= 0; i--) {
                    deckContainer.appendChild(allCards[i]);
                }
                
                // Debug: Log the order of cards after shuffle
                console.log('Cards after shuffle (top to bottom):');
                allCards.forEach((card, index) => {
                    const suit = card.controller?.getSuit();
                    const rank = card.controller?.getRank();
                    console.log(`${index + 1}. ${rank} of ${suit}`);
                });
                
                // Re-arrange cards in the stack
                arrangeCardsInStack();
                
                // Re-enable buttons
                buttonsOff(false);
                
                // Call the callback function if provided
                if (callback) {
                    callback();
                } else if (shuffleButton.shuffleCallback) {
                    shuffleButton.shuffleCallback();
                    shuffleButton.shuffleCallback = null; // Clear it after use
                }
            }, alignDuration);
        }, returnTime);
    });

    dealButtonDealer.addEventListener("click", function () {
        dealCardToHand(handContainerDealer);
    });

    dealButtonPlayer.addEventListener("click", function () {
        dealCardToHand(handContainerPlayer);
    });

    function dealCardToHand(targetHandContainer) {
        buttonsOff(true);

        //extract first card
        const allCards = deckContainer.querySelectorAll('card-element');
        if (allCards.length === 0) {
            buttonsOff(false);
            return;
        }
        
        const cardToDeal = allCards[0];
        
        cardToDeal.classList.add("fade-out");
        // fade out card from deck
        setTimeout(() => {
            slideCardIntoHand(cardToDeal, targetHandContainer);
            
            // For blackjack: 
            // - Player cards always face up
            // - Dealer's first card face up, others face down
            if (targetHandContainer === handContainerPlayer) {
                // For player, flip card face up if it's face down
                if (!cardToDeal.controller?.isFaceUp()) {
                    cardToDeal.controller?.toggleCard();
                }
            } else if (targetHandContainer === handContainerDealer) {
                // For dealer, first card face up, others face down
                const dealerCards = handContainerDealer.querySelectorAll('card-element');
                if (dealerCards.length === 1) { // This is the first card
                    if (!cardToDeal.controller?.isFaceUp()) {
                        cardToDeal.controller?.toggleCard();
                    }
                } else {
                    // Subsequent cards stay face down
                    if (cardToDeal.controller?.isFaceUp()) {
                        cardToDeal.controller?.toggleCard();
                    }
                }
            }
            
            arrangeCardsInStack();
            updateHandValues();
            updateCardCounter();
            buttonsOff(false);
        }, 600);
    }

    resetButton.addEventListener("click", function () {
        console.log("Reset button clicked");
        buttonsOff(true);
        
        // Get cards from both hands
        const cardsInHandDealer = handContainerDealer.querySelectorAll('card-element');
        const cardsInHandPlayer = handContainerPlayer.querySelectorAll('card-element');
        
        if (cardsInHandDealer.length === 0 && cardsInHandPlayer.length === 0) {
            buttonsOff(false);
            return;
        }
        
        // Process cards from dealer's hand
        cardsInHandDealer.forEach(card => {
            card.classList.remove("fade-in");
            card.classList.add("fade-out");
        });
        
        // Process cards from player's hand
        cardsInHandPlayer.forEach(card => {
            card.classList.remove("fade-in");
            card.classList.add("fade-out");
        });

        setTimeout(() => {
            // Return cards from dealer's hand
            cardsInHandDealer.forEach(card => {
                returnCardToDeck(card);
            });
            
            // Return cards from player's hand
            cardsInHandPlayer.forEach(card => {
                returnCardToDeck(card);
            });
            
            arrangeCardsInStack();
            updateHandValues();
            updateCardCounter();
            buttonsOff(false);
            shuffleButton.click();
        }, 600);
    });

    function returnCardToDeck(card) {
        card.classList.add("unrender");
        card.classList.remove("fade-out", "in-hand");
        
        // Ensure card is face down
        if (card.controller?.isFaceUp()) {
            card.controller?.toggleCard();
        }
        
        deckContainer.appendChild(card);
        card.classList.remove("unrender");
        
        const suit = card.controller?.getSuit();
        const rank = card.controller?.getRank();
        console.log("card moved back to deck:", rank, "of", suit);
    }
    
    function slideCardIntoHand(card, targetHandContainer) {
        card.classList.add("in-hand", "unrender");
        
        // Append card to the hand container
        targetHandContainer.appendChild(card);
        
        // Reset any inline styles that might interfere with hand layout
        card.style.left = "";
        card.style.top = "";
        card.style.display = "block";
        
        // Ensure proper z-index based on the card's position in the hand
        const cardsInHand = targetHandContainer.querySelectorAll('card-element');
        const cardIndex = Array.from(cardsInHand).indexOf(card);
        card.style.zIndex = cardsInHand.length - cardIndex;
        
        // Add fade-in animation
        card.classList.add("fade-in");
        card.classList.remove("unrender");
    }

    console.log("script loaded");

    // Function to arrange cards in a stacked layout
    function arrangeCardsInStack() {
        const cards = deckContainer.querySelectorAll('card-element');
        const offset = 5; // Offset in pixels between cards
        
        // Determine how many cards to show (max 3)
        const cardsToShow = Math.min(cards.length, 3);
        
        cards.forEach((card, index) => {
            // Set stack position using controller
            card.controller?.updatePosition(index, offset, cardsToShow);
            card.controller?.setAsTopCard(index === 0);
        });
    }
    
    function addCard(suit, rank) {
        // Use CardFactory to create a card with MVC
        const cardController = CardFactory.createCard(suit, rank);
        const cardElement = cardController?.getElement();
        
        // Store reference to controller in the element for easy access
        cardElement.controller = cardController;
        
        // Insert as the first child to make it the top card
        const firstCard = deckContainer.firstChild;
        deckContainer.insertBefore(cardElement, firstCard);
        
        // Arrange cards in a stack after adding a new card
        arrangeCardsInStack();
    }

    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    for (let suit of suits) {
        for (let rank of ranks) {
            addCard(suit, rank);
        }
    }

    // Initialize counters
    updateCardCounter();
    updateHandValues();
    
    shuffleButton.click();

    // Event listeners for the game buttons
    newGameButton.addEventListener("click", function() {
        console.log("New Game button clicked");
        startNewGame();
    });
    
    hitButton.addEventListener("click", function() {
        console.log("Hit button clicked");
        playerHit();
    });
    
    standButton.addEventListener("click", function() {
        console.log("Stand button clicked");
        playerStand();
    });
    
    // Function to start a new game of blackjack
    function startNewGame() {
        console.log("Starting new game...");
        
        // Disable admin buttons during gameplay
        dealButtonDealer.disabled = true;
        dealButtonPlayer.disabled = true;
        
        // Check if there are enough cards in the deck
        const deckCards = deckContainer.querySelectorAll('card-element');
        if (deckCards.length < 4) {
            alert("Not enough cards in the deck to start a new game!");
            return;
        }
        
        // Clear existing hands
        clearHands();
        
        // Set up the callback before triggering the shuffle
        shuffleButton.shuffleCallback = dealCardsForNewGame;
        
        // Then trigger the shuffle
        shuffleButton.click();
    }
    
    // Function to clear all cards from hands
    function clearHands() {
        // Return all cards from hands to the deck
        const cardsInHandDealer = handContainerDealer.querySelectorAll('card-element');
        const cardsInHandPlayer = handContainerPlayer.querySelectorAll('card-element');
        
        cardsInHandDealer.forEach(card => {
            returnCardToDeck(card);
        });
        
        cardsInHandPlayer.forEach(card => {
            returnCardToDeck(card);
        });
        
        shuffleButton.click(); // Shuffle the deck
        
        // Reset scores
        updateHandValues();
    }
    
    // Function to deal a card in the initial deal
    function dealInitialCard(targetHandContainer, faceUp) {
        const allCards = deckContainer.querySelectorAll('card-element');
        if (allCards.length === 0) {
            return;
        }
        
        const cardToDeal = allCards[0];
        
        cardToDeal.classList.add("fade-out");
        setTimeout(() => {
            slideCardIntoHand(cardToDeal, targetHandContainer);
            
            setTimeout(() => {
                if (faceUp && !cardToDeal.controller?.isFaceUp()) {
                    cardToDeal.controller?.toggleCard();
                } else if (!faceUp && cardToDeal.controller?.isFaceUp()) {
                    cardToDeal.controller?.toggleCard();
                }
                
                setTimeout(() => {
                    arrangeCardsInStack();
                    updateHandValues();
                    updateCardCounter();
                }, 300);
            }, 600);
        }, 600);
    }
    
    // Function to check for blackjack after initial deal
    function checkInitialBlackjack() {
        const playerHasBlackjack = checkBlackjack(handContainerPlayer);
        
        // Enable game buttons if no blackjack
        if (!playerHasBlackjack) {
            hitButton.disabled = false;
            standButton.disabled = false;
        } else {
            // Player has blackjack - game ends
            console.log("Player has blackjack!");
            
            // Check if dealer also has blackjack
            const dealerCards = handContainerDealer.querySelectorAll('card-element');
            const faceDownCard = dealerCards[1];
            
            // Flip dealer's face-down card to see if they also have blackjack
            if (!faceDownCard.controller?.isFaceUp()) {
                faceDownCard.controller?.toggleCard();
                updateHandValues();
            }
            
            // Determine the outcome
            if (checkBlackjack(handContainerDealer)) {
                console.log("Dealer also has blackjack! It's a tie.");
                endGame("tie");
            } else {
                console.log("Player wins with blackjack!");
                endGame("player");
            }
        }
    }

    // Function to handle the player's Hit action
    function playerHit() {
        console.log("Player hits.");
        // Disable buttons during card animation
        hitButton.disabled = true;
        standButton.disabled = true;
        
        // Deal one more card to player (always face up)
        dealCardToHand(handContainerPlayer);
        
        setTimeout(() => {
            if (checkBust(handContainerPlayer)) {
                console.log("Player busts!");
                endGame("dealer");
                return;
            }
            
            console.log("Player has " + calculateHandValue(Array.from(handContainerPlayer.querySelectorAll('card-element'))));
            
            // Enable buttons after dealing a card
            hitButton.disabled = false;
            standButton.disabled = false;
        }, 800);
    }
    
    
    // Function to handle the player's Stand action
    function playerStand() {
        console.log("Player stands. Dealer's turn.");
        // Disable player action buttons
        hitButton.disabled = true;
        standButton.disabled = true;
        
        // Start dealer's turn
        setTimeout(dealerPlay, 500);
    }
    
    // Function to handle dealer's automated play
    function dealerPlay() {
        // First, flip the dealer's face-down card
        const dealerCards = handContainerDealer.querySelectorAll('card-element');
        let dealerCardFlipped = false;
        
        // Check for any face-down cards and flip them
        for (let card of dealerCards) {
            if (!card.controller?.isFaceUp()) {
                card.controller?.toggleCard();
                dealerCardFlipped = true;
                break; // Only flip one card at a time for better animation
            }
        }
        
        // Update scores after flipping
        updateHandValues();
        
        // If we flipped a card, wait a moment before continuing
        if (dealerCardFlipped) {
            setTimeout(dealerPlay, 700);
            return;
        }
        
        // Calculate dealer's current hand value
        const dealerValue = calculateHandValue(Array.from(dealerCards));
        
        // Dealer must hit on 16 or less, stand on 17 or more
        if (dealerValue < 17) {
            console.log("Dealer hits.");
            dealCardToDealer();
        } else {
            console.log("Dealer stands with " + dealerValue);
            // Determine winner
            determineWinner();
        }
    }
    
    // Function to deal a card to the dealer
    function dealCardToDealer() {
        const allCards = deckContainer.querySelectorAll('card-element');
        if (allCards.length === 0) {
            alert("No more cards in the deck!");
            return;
        }
        
        const cardToDeal = allCards[0];
        cardToDeal.classList.add("fade-out");
        
        setTimeout(() => {
            slideCardIntoHand(cardToDeal, handContainerDealer);
            
            setTimeout(() => {
                if (!cardToDeal.controller?.isFaceUp()) {
                    cardToDeal.controller?.toggleCard();
                }
                
                setTimeout(() => {
                    arrangeCardsInStack();
                    updateHandValues();
                    updateCardCounter();
                    
                    if (checkBust(handContainerDealer)) {
                        console.log("Dealer busts!");
                        endGame("player");
                    } else {
                        setTimeout(dealerPlay, 700);
                    }
                }, 300);
            }, 600); 
        }, 600);
    }
    
    // Function to determine the winner
    function determineWinner() {
        const playerCards = handContainerPlayer.querySelectorAll('card-element');
        const dealerCards = handContainerDealer.querySelectorAll('card-element');
        
        const playerValue = calculateHandValue(Array.from(playerCards));
        const dealerValue = calculateHandValue(Array.from(dealerCards));
        
        // Compare hands and determine winner
        if (playerValue > dealerValue) {
            console.log("Player wins with " + playerValue + " vs dealer's " + dealerValue);
            endGame("player");
        } else if (dealerValue > playerValue) {
            console.log("Dealer wins with " + dealerValue + " vs player's " + playerValue);
            endGame("dealer");
        } else {
            console.log("It's a tie! Both have " + playerValue);
            endGame("tie");
        }
    }
    
    // Function to end the game and display result
    function endGame(winner) {
        // Disable game buttons
        hitButton.disabled = true;
        standButton.disabled = true;
        
        // Display result
        let resultMessage = "";
        
        switch(winner) {
            case "player":
                resultMessage = "Player wins!";
                playerScoreElement.textContent += " ✅ Winner!";
                break;
            case "dealer":
                resultMessage = "Dealer wins!";
                dealerScoreElement.textContent += " ✅ Winner!";
                break;
            case "tie":
                resultMessage = "It's a tie!";
                playerScoreElement.textContent += " (Tie)";
                dealerScoreElement.textContent += " (Tie)";
                break;
        }
        
        console.log(resultMessage);
        
        // Enable new game button
        newGameButton.disabled = false;
        hitButton.disabled = true;
        standButton.disabled = true;
    }

    // Function to deal cards for a new game (after shuffle completes)
    function dealCardsForNewGame() {
        // Deal cards in the proper order (alternating between player and dealer)
        setTimeout(() => {
            // First card to player (face up)
            dealInitialCard(handContainerPlayer, true);
            
            setTimeout(() => {
                // First card to dealer (face up)
                dealInitialCard(handContainerDealer, true);
                
                setTimeout(() => {
                    // Second card to player (face up)
                    dealInitialCard(handContainerPlayer, true);
                    
                    setTimeout(() => {
                        // Second card to dealer (face down)
                        dealInitialCard(handContainerDealer, false);
                        
                        // Check for blackjack
                        setTimeout(() => {
                            checkInitialBlackjack();
                        }, 700);
                    }, 700);
                }, 700);
            }, 700);
        }, 100);
    }

    // Function to trigger a shuffle programmatically with a callback
    function triggerShuffle(callback) {
        // Create a new event
        const event = new Event('click');
        // Call the event listener directly with the callback
        shuffleButton.dispatchEvent(event);
        // Store the callback to be used when animation completes
        shuffleButton.shuffleCallback = callback;
    }
});

