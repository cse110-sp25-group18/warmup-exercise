/**
 * CardView - Handles the rendering and display of a card
 */
class CardView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    // Connect the view to its model
    connectedCallback() {
        // If the card was clicked and it's the top card, notify the controller
        this.addEventListener("click", () => {
            if (this.isTopCard || this.classList.contains('top-card')) {
                // Dispatch a custom event that the controller can listen for
                this.dispatchEvent(new CustomEvent('card-click', {
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }

    // Observe changes to the class attribute
    static get observedAttributes() {
        return ['class'];
    }

    // Re-render when observed attributes change
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    // Update the display based on the model
    render() {
        if (!this.model) return;
        
        this.shadowRoot.innerHTML = "";
        
        // Add stylesheet
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "style/card.css");
        this.shadowRoot.appendChild(linkElem);

        // Create card container
        const card = document.createElement("div");
        card.className = "card initial-load";
        if (this.model.isFaceUp) {
            card.classList.add("face-up");
        }

        // Remove initial-load class after a short delay to allow transitions
        setTimeout(() => {
            card.classList.remove("initial-load");
        }, 50);

        // Create card front
        const cardFront = document.createElement("div");
        cardFront.className = "card-front";

        const suitSymbol = this.model.getSuitSymbol();
        const suitClass = this.model.getSuitClass();

        // Create top corner
        const topCorner = document.createElement("div");
        topCorner.className = "corner";

        const topValue = document.createElement("div");
        topValue.className = `rank ${suitClass}`;
        topValue.textContent = this.model.rank;

        const topSuit = document.createElement("div");
        topSuit.className = `suit ${suitClass}`;
        topSuit.textContent = suitSymbol;

        topCorner.appendChild(topValue);
        topCorner.appendChild(topSuit);

        // Create center
        const center = document.createElement("div");
        center.className = `center ${suitClass}`;
        center.textContent = suitSymbol;

        // Create bottom corner
        const bottomCorner = document.createElement("div");
        bottomCorner.className = "corner bottom";

        const bottomValue = document.createElement("div");
        bottomValue.className = `rank ${suitClass}`;
        bottomValue.textContent = this.model.rank;

        const bottomSuit = document.createElement("div");
        bottomSuit.className = `suit ${suitClass}`;
        bottomSuit.textContent = suitSymbol;

        bottomCorner.appendChild(bottomValue);
        bottomCorner.appendChild(bottomSuit);

        // Assemble card front
        cardFront.appendChild(topCorner);
        cardFront.appendChild(center);
        cardFront.appendChild(bottomCorner);

        // Create card back
        const cardBack = document.createElement("div");
        cardBack.className = "card-back";
        
        const backPattern = document.createElement("div");
        backPattern.className = "back-pattern";
        cardBack.appendChild(backPattern);

        // Assemble card
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        this.shadowRoot.appendChild(card);
    }

    // Visual updates when a card becomes the top card
    setAsTopCard(isTop) {
        if (isTop) {
            this.classList.add('top-card');
            this.style.pointerEvents = 'auto';
        } else {
            this.classList.remove('top-card');
            this.style.pointerEvents = 'none';
        }
    }

    // Update the positioning based on stack index
    updatePosition(index, offset = 5, maxVisible = 3) {
        if (index < maxVisible) {
            this.style.display = 'block';
            this.style.left = `${index * offset}px`;
            this.style.top = `${index * offset}px`;
            this.style.zIndex = 100 - index;
        } else {
            this.style.display = 'none';
        }
    }

    // Toggle the card face
    toggleFace() {
        const card = this.shadowRoot.querySelector('.card');
        if (card) {
            card.classList.toggle('face-up');
        }
    }
} 

export default CardView;