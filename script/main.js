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
        cards.forEach(card => {
            card.toggle();
        });
    });

    shuffleButton.addEventListener("click", function () {
        console.log("shuffle button clicked");
        deckContainer.style.transition = "transform 0.5s";
        deckContainer.style.transform = "rotate(360deg)";

        setTimeout(() => {
            deckContainer.style.transition = "";
            deckContainer.style.transform = "";
            
            const cards = Array.from(deckContainer.querySelectorAll('card-element'));
            cards.forEach(card => deckContainer.removeChild(card));
            
            cards.sort(() => Math.random() - 0.5);
            cards.forEach(card => deckContainer.appendChild(card));
        }, 500);
    });

    console.log("script loaded");

    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    
    addCard("spades", "2");
    
    function addCard(suit, rank) {
        const card = document.createElement('card-element');
        card.suit = suit;
        card.rank = rank;
        deckContainer.appendChild(card);
    }
});

