class Card extends HTMLElement {
    constructor() {
        super();
        this._suit = "";
        this._rank = "";
        this._isFaceUp = true;

        this.attachShadow({ mode: "open" });

        this.render();
        
        this.addEventListener("click", () => {
            this.toggle();
        });
    }

    get suit() {
        return this._suit;
    }

    set suit(value) {
        this._suit = value;
        this.render();
    }

    get rank() {
        return this._rank;
    }

    set rank(newRank) {
        this._rank = newRank;
        this.render();
    }

    toggle() {
        this._isFaceUp = !this._isFaceUp;
        const card = this.shadowRoot.querySelector('.card');
        if (card) {
            if (this._isFaceUp) {
                card.classList.add('face-up');
            } else {
                card.classList.remove('face-up');
            }
        }
        console.log("toggle", this._isFaceUp ? "face-up" : "face-down");
    }

    static get observedAttributes() {
        return ['class'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = "";
        
        const style = document.createElement("style");
        style.textContent = `
            @import url("../style/card.css");
        `;
        this.shadowRoot.appendChild(style);

        const card = document.createElement("div");
        card.className = "card";
        if (this._isFaceUp) {
            card.classList.add("face-up");
        }

        const cardFront = document.createElement("div");
        cardFront.className = "card-front";

        let suitSymbol = "";
        let suitClass = "";

        switch (this._suit) {
            case "hearts":
                suitSymbol = "♥";
                suitClass = "hearts";
                break;
            case "diamonds":
                suitSymbol = "♦";
                suitClass = "diamonds";
                break;
            case "spades":
                suitSymbol = "♠";
                suitClass = "spades";
                break;
            case "clubs":
                suitSymbol = "♣";
                suitClass = "clubs";
                break;
            default:
                suitSymbol = "";
                suitClass = "";
        }

        const topCorner = document.createElement("div");
        topCorner.className = "corner";

        const topValue = document.createElement("div");
        topValue.className = `rank ${suitClass}`;
        topValue.textContent = this._rank;

        const topSuit = document.createElement("div");
        topSuit.className = `suit ${suitClass}`;
        topSuit.textContent = suitSymbol;

        topCorner.appendChild(topValue);
        topCorner.appendChild(topSuit);

        // 中心
        const center = document.createElement("div");
        center.className = `center ${suitClass}`;
        center.textContent = suitSymbol;

        // 右下角
        const bottomCorner = document.createElement("div");
        bottomCorner.className = "corner bottom";

        const bottomValue = document.createElement("div");
        bottomValue.className = `rank ${suitClass}`;
        bottomValue.textContent = this._rank;

        const bottomSuit = document.createElement("div");
        bottomSuit.className = `suit ${suitClass}`;
        bottomSuit.textContent = suitSymbol;

        bottomCorner.appendChild(bottomValue);
        bottomCorner.appendChild(bottomSuit);

        cardFront.appendChild(topCorner);
        cardFront.appendChild(center);
        cardFront.appendChild(bottomCorner);

        const cardBack = document.createElement("div");
        cardBack.className = "card-back";
        
        const backPattern = document.createElement("div");
        backPattern.className = "back-pattern";
        cardBack.appendChild(backPattern);

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        this.shadowRoot.appendChild(card);
    }

    connectedCallback() {
    }
}

export default Card;