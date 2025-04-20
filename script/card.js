import CardModel from './models/CardModel.js';
import CardView from './views/CardView.js';
import CardController from './controllers/CardController.js';

/**
 * CardFactory - Factory class for creating card components in MVC pattern
 */
class CardFactory {
    /**
     * Register the card custom element
     */
    static registerCardElement() {
        if (!customElements.get('card-element')) {
            customElements.define('card-element', CardView);
        }
    }
    
    /**
     * Create a complete card with model, view, and controller
     * @param {string} suit - The card's suit (hearts, diamonds, clubs, spades)
     * @param {string} rank - The card's rank (A, 2-10, J, Q, K)
     * @returns {Object} - The card controller
     */
    static createCard(suit, rank) {
        // Create the model
        const model = new CardModel(suit, rank);
        
        // Create the view (custom element)
        const view = document.createElement('card-element');
        
        // Create the controller connecting model and view
        const controller = new CardController(model, view);
        
        return controller;
    }
    
    /**
     * Create a card element directly (simplified usage for backwards compatibility)
     * @param {string} suit - The card's suit
     * @param {string} rank - The card's rank
     * @returns {HTMLElement} - The card element
     */
    static createElement(suit, rank) {
        const controller = this.createCard(suit, rank);
        return controller.getElement();
    }
}

// Register the card element when this module is imported
CardFactory.registerCardElement();

export default CardFactory;