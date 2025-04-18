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

    shuffleButton.addEventListener("click", function () {
        console.log("shuffle button clicked");
        
        // Disable button during animation
        shuffleButton.disabled = true;
        
        // Get all cards
        const cards = deckContainer.querySelectorAll('card-element');
        if (cards.length < 1) {
            shuffleButton.disabled = false;
            return;
        }
        
        // Only animate up to 3 cards if there are more
        const cardsToAnimate = Array.from(cards).slice(0, 3);
        
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
        
        // Step 1: Align all cards perfectly on top of each other
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
        
        // Step 4: Shuffle and return to stacked layout
        setTimeout(() => {
            // Hide cards during shuffle
            cards.forEach(card => {
                card.style.transition = "none";
                card.style.opacity = "0";
            });
            
            // Remove all cards
            cards.forEach(card => deckContainer.removeChild(card));
            
            // Shuffle the array
            const shuffledCards = Array.from(cards).sort(() => Math.random() - 0.5);
            
            // Add cards back in reverse order
            for (let i = shuffledCards.length - 1; i >= 0; i--) {
                deckContainer.appendChild(shuffledCards[i]);
            }
            
            // Wait a bit to allow DOM to update
            setTimeout(() => {
                // Re-arrange cards in the stack
                arrangeCardsInStack();
                
                // Show cards again
                cards.forEach(card => {
                    card.style.transition = "";
                    card.style.opacity = "1";
                });
                
                // Re-enable shuffle button
                shuffleButton.disabled = false;
            }, 50);
        }, returnTime);
    });

    console.log("script loaded");

    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    
    // Add a few test cards - reversed order since we're prepending
    // The last one added will be the top card (first in DOM)
    addCard("clubs", "Q");
    addCard("hearts", "K");
    addCard("spades", "A");
    
    // Function to arrange cards in a stacked layout
    function arrangeCardsInStack() {
        const cards = deckContainer.querySelectorAll('card-element');
        const offset = 5; // Offset in pixels between cards
        
        cards.forEach((card, index) => {
            // Reverse the z-index logic so the first card is on top
            card.style.zIndex = index === 0 ? 100 : (100 - index); // First card has highest z-index
            
            // Still offset each card the same way
            card.style.left = `${index * offset}px`;
            card.style.top = `${index * offset}px`;
            
            // Only enable click events and hover effects on the first card (top card)
            if (index === 0) { // Changed from index === cards.length - 1
                card.style.pointerEvents = 'auto';
                card.classList.add('top-card'); // Add class for hover effect
                card.isTopCard = true; // Set property on the card object
            } else {
                card.style.pointerEvents = 'none';
                card.classList.remove('top-card'); // Remove class from non-top cards
                card.isTopCard = false; // Clear property on non-top cards
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

