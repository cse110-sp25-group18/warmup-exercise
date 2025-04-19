//script.js
import Card from "./card.js";

customElements.define('card-element', Card);

document.addEventListener('DOMContentLoaded', () => {
    const deckContainer = document.getElementById("deck-container");

    const flipButton = document.getElementById("flip-button");
    const shuffleButton = document.getElementById("shuffle-button");

    flipButton.addEventListener("click", function () {
        console.log("Flip button clicked");
        const cards = document.querySelectorAll('card-element');
        // Only flip the top card 
        if (cards.length > 0) {
            const topCard = cards[0]; 
            topCard.toggle();
        }
    });

    shuffleButton.addEventListener("click", function handleShuffle() {
        console.log("shuffle button clicked");
        
        // Disable button during animation
        shuffleButton.disabled = true;
        flipButton.disabled = true;
        
        // Get all cards
        const allCards = deckContainer.querySelectorAll('card-element');
        if (allCards.length < 1) {
            shuffleButton.disabled = false;
            return;
        }
        
        // Only get visible cards for animation (max 3)
        const visibleCards = Array.from(allCards).filter(card => card.style.display !== 'none');
        const cardsToAnimate = visibleCards.slice(0, 3);
        const topCardFlipped = false;
        cardsToAnimate.forEach(card => {
            if(card._isFaceUp){
                card.toggle();
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
                // Get all cards (both visible and hidden)
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
                    if (card._isFaceUp) {
                        card.toggle();
                    }
                });
                
                // Add shuffled cards back in reverse order
                for (let i = allCards.length - 1; i >= 0; i--) {
                    deckContainer.appendChild(allCards[i]);
                }
                
                // Debug: Log the order of cards after shuffle
                console.log('Cards after shuffle (top to bottom):');
                allCards.forEach((card, index) => {
                    console.log(`${index + 1}. ${card.rank} of ${card.suit}`);
                });
                
                // Re-arrange cards in the stack
                arrangeCardsInStack();
                
                // Re-enable buttons
                shuffleButton.disabled = false;
                flipButton.disabled = false;
            }, alignDuration);
        }, returnTime + animationDuration);

        
    });

    console.log("script loaded");

    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    
    // Add test cards - the last one added will be the top card (first in DOM)
    // Adding a total of 5 cards to demonstrate the hide/show functionality
    addCard("clubs", "Q");  // This will be hidden (4th card)
    addCard("spades", "J"); // This will be hidden (5th card)
    addCard("diamonds", "2"); // This will be visible (3rd card)
    addCard("hearts", "K"); // This will be visible (2nd card)
    addCard("spades", "A"); // This will be visible (1st/top card)

    
    // Function to arrange cards in a stacked layout
    function arrangeCardsInStack() {
        const cards = deckContainer.querySelectorAll('card-element');
        const offset = 5; // Offset in pixels between cards
        
        // Determine how many cards to show (max 3)
        const cardsToShow = Math.min(cards.length, 3);
        
        cards.forEach((card, index) => {
            // Reverse the z-index logic so the first card is on top
            card.style.zIndex = index === 0 ? 100 : (100 - index); // First card has highest z-index
            
            if (index < cardsToShow) {
                // Card is one of the first three, show it with offset
                card.style.display = 'block';
                card.style.left = `${index * offset}px`;
                card.style.top = `${index * offset}px`;
                
                // Only enable click events and hover effects on the first card (top card)
                if (index === 0) {
                    card.style.pointerEvents = 'auto';
                    card.classList.add('top-card'); // Add class for hover effect
                    card.isTopCard = true; // Set property on the card object
                } else {
                    card.style.pointerEvents = 'none';
                    card.classList.remove('top-card'); // Remove class from non-top cards
                    card.isTopCard = false; // Clear property on non-top cards
                }
            } else {
                // Card beyond the first three, hide it but keep in DOM
                card.style.display = 'none';
                card.style.pointerEvents = 'none';
                card.classList.remove('top-card');
                card.isTopCard = false;
            }
        });
    }
    
    function addCard(suit, rank) {
        const card = document.createElement('card-element');
        card.suit = suit;
        card.rank = rank;
        
        // Insert as the first child to make it the top card
        // Use insertBefore with the first child or null to prepend
        const firstCard = deckContainer.firstChild;
        deckContainer.insertBefore(card, firstCard);
        
        // Arrange cards in a stack after adding a new card
        arrangeCardsInStack();
    }
});

