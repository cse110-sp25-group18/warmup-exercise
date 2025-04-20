/**
 * CardController - Connects the card model and view
 */
class CardController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Connect the view to its model
        this.view.model = this.model;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.view.render();
    }
    
    // Set up event listeners for user interactions
    setupEventListeners() {
        // Handle card click events
        this.view.addEventListener('card-click', () => {
            // Card-click event only comes from top cards, so toggle it
            this.toggleCard();
        });
    }
    
    // Update model and view when toggling the card
    toggleCard() {
        // Update the model
        this.model.toggle();
        
        // Update the view
        this.view.toggleFace();
        
        console.log("Card toggled:", this.model.isFaceUp ? "face-up" : "face-down");
    }
    
    // Set this card as the top card in the stack
    setAsTopCard(isTop) {
        // Update the model
        this.model.isTopCard = isTop;
        
        // Update the view
        this.view.setAsTopCard(isTop);
    }
    
    // Update the card's position in the stack
    updatePosition(index, offset, maxVisible) {
        // Update the model
        this.model.index = index;
        
        // Update the view
        this.view.updatePosition(index, offset, maxVisible);
    }
    
    // Get the current rank of the card
    getRank() {
        return this.model.rank;
    }
    
    // Get the current suit of the card
    getSuit() {
        return this.model.suit;
    }
    
    // Update the card's rank
    setRank(rank) {
        this.model.rank = rank;
        this.view.render();
    }
    
    // Update the card's suit
    setSuit(suit) {
        this.model.suit = suit;
        this.view.render();
    }
    
    // Check if the card is face-up
    isFaceUp() {
        return this.model.isFaceUp;
    }
    
    // Get the DOM element of the view
    getElement() {
        return this.view;
    }
} 

export default CardController;