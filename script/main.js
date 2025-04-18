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
        
        // Rotate the entire deck container
        deckContainer.style.transition = "transform 0.5s";
        deckContainer.style.transform = "rotate(360deg)";

        setTimeout(() => {
            // Reset the container rotation
            deckContainer.style.transition = "";
            deckContainer.style.transform = "";
            
            // Get all cards and temporarily hide them during shuffle
            const cards = Array.from(deckContainer.querySelectorAll('card-element'));
            cards.forEach(card => {
                card.style.transition = "none"; // Disable transitions during shuffle
                card.style.opacity = "0"; // Hide cards temporarily
            });
            
            // Remove all cards
            cards.forEach(card => deckContainer.removeChild(card));
            
            // Shuffle the array
            cards.sort(() => Math.random() - 0.5);
            
            // Important: Reverse the append order to maintain first-child-on-top behavior
            // We need to add cards in reverse shuffled order so the first card is on top
            // This ensures the first card in DOM is the top card
            for (let i = cards.length - 1; i >= 0; i--) {
                deckContainer.appendChild(cards[i]);
            }
            
            // Wait a bit to allow DOM to update
            setTimeout(() => {
                // Re-arrange cards in the stack
                arrangeCardsInStack();
                
                // Fade cards back in with proper positioning
                cards.forEach(card => {
                    card.style.transition = ""; // Re-enable transitions
                    card.style.opacity = "1"; // Show cards
                });
            }, 50);
        }, 500);
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

