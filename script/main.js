//script.js
import CardFactory from "./card.js";

document.addEventListener('DOMContentLoaded', () => {
    const deckContainer = document.getElementById("deck-container");
    const handContainerDealer = document.getElementById("hand-container-dealer");
    const handContainerPlayer = document.getElementById("hand-container-player");

    const flipButton = document.getElementById("flip-button");
    const shuffleButton = document.getElementById("shuffle-button");
    const dealButtonDealer = document.getElementById("deal-button-dealer");
    const dealButtonPlayer = document.getElementById("deal-button-player");
    const resetButton = document.getElementById("reset-button");
    function buttonsOff(value){
        dealButtonDealer.disabled = value;
        dealButtonPlayer.disabled = value;
        flipButton.disabled = value;
        shuffleButton.disabled = value;
        resetButton.disabled = value;
    }

    flipButton.addEventListener("click", function () {
        console.log("Flip button clicked");
        const cards = deckContainer.querySelectorAll('card-element');
        // Only flip the top card 
        if (cards.length > 0) {
            const topCard = cards[0]; 
            topCard.controller.toggleCard();
        }
    });

    shuffleButton.addEventListener("click", function handleShuffle() {
        console.log("shuffle button clicked");
        
        // Disable button during animation
        buttonsOff(true);
        
        const allCards = deckContainer.querySelectorAll('card-element');
        if (allCards.length < 1) {
            shuffleButton.disabled = false;
            return;
        }
        
        // Only get visible cards for animation (max 3)
        const visibleCards = Array.from(allCards).filter(card => card.style.display !== 'none');
        const cardsToAnimate = visibleCards.slice(0, 3);
        let topCardFlipped = false;
        cardsToAnimate.forEach(card => {
            // Check if the card is face up using the controller if available
            const isFaceUp = card.controller ? card.controller.isFaceUp() : card._isFaceUp;
            if(isFaceUp){
                card.controller.toggleCard();
                setTimeout(handleShuffle, 700);
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
                    // Use controller if available, fallback to direct property
                    const isFaceUp = card.controller.isFaceUp();
                    if (isFaceUp) {
                        card.controller.toggleCard();
                    }
                });
                
                // Add shuffled cards back in reverse order
                for (let i = allCards.length - 1; i >= 0; i--) {
                    deckContainer.appendChild(allCards[i]);
                }
                
                // Debug: Log the order of cards after shuffle
                console.log('Cards after shuffle (top to bottom):');
                allCards.forEach((card, index) => {
                    const suit = card.controller.getSuit();
                    const rank = card.controller.getRank();
                    console.log(`${index + 1}. ${rank} of ${suit}`);
                });
                
                // Re-arrange cards in the stack
                arrangeCardsInStack();
                
                // Re-enable buttons
                buttonsOff(false);
            }, alignDuration);
        }, returnTime + animationDuration);
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
            // Ensure the card is face down (remove the auto-flip to face up)
            const isFaceUp = cardToDeal.controller.isFaceUp();
            if (isFaceUp) {
                cardToDeal.controller.toggleCard();
            }
            arrangeCardsInStack();
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
            buttonsOff(false);
            shuffleButton.click();
        }, 600);
    });

    function returnCardToDeck(card) {
        card.classList.add("unrender");
        card.classList.remove("fade-out", "in-hand");
        
        // Ensure card is face down
        const isFaceUp = card.controller.isFaceUp();
        if (isFaceUp) {
            card.controller.toggleCard();
        }
        
        deckContainer.appendChild(card);
        card.classList.remove("unrender");
        
        const suit = card.controller ? card.controller.getSuit() : card.suit;
        const rank = card.controller ? card.controller.getRank() : card.rank;
        console.log("card moved back to deck:", rank, "of", suit);
    }
    
    function slideCardIntoHand(card, targetHandContainer) {
        card.classList.add("in-hand", "unrender");
        targetHandContainer.appendChild(card);  // add to the DOM
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
            // Set stack position using controller if available
            card.controller.updatePosition(index, offset, cardsToShow);
            card.controller.setAsTopCard(index === 0);
        });
    }
    
    function addCard(suit, rank) {
        // Use CardFactory to create a card with MVC
        const cardController = CardFactory.createCard(suit, rank);
        const cardElement = cardController.getElement();
        
        // Store reference to controller in the element for easy access
        cardElement.controller = cardController;
        
        // Insert as the first child to make it the top card
        const firstCard = deckContainer.firstChild;
        deckContainer.insertBefore(cardElement, firstCard);
        
        // Arrange cards in a stack after adding a new card
        arrangeCardsInStack();
    }

    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const ranks = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];
    for (let suit of suits) {
        for (let rank of ranks) {
            addCard(suit, rank);
        }
    }

    shuffleButton.click();
});

