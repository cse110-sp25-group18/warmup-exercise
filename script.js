document.addEventListener('DOMContentLoaded', function() {
    const debugCard = document.getElementById('debug-card');
    
    const flipButton = document.getElementById('flip-button');
    const shuffleButton = document.getElementById('shuffle-button');
    
    debugCard.addEventListener('click', function() {
        console.log('debug card clicked');
        this.classList.toggle('flipped');
    });

    flipButton.addEventListener('click', function() {
        console.log('flip button clicked');
        debugCard.classList.toggle('flipped');
    });
    
    shuffleButton.addEventListener('click', function() {
        console.log('shuffle button clicked');
        shuffleDeck(deck);
        debugCard.style.transition = 'transform 0.5s';
        debugCard.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            debugCard.style.transition = '';
            debugCard.style.transform = '';
        }, 500);

        document.getElementById('top-card').innerHTML = deck[0];

    });
    
    console.log('script loaded');

    /** Construct deck of cards and initially shuffle */
    const suits = ["♥︎", "♠", "♣", "♦"]
    const cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    const deck = [];
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 13; j++){
            deck.push((cardValues[j]+suits[i]));
        }
    }
    shuffleDeck(deck);
    document.getElementById('top-card').innerHTML = deck[0];

    /**
     * Shuffles an array by iterating through the array backwards and randomly 
     * selecting an index to swap with. 
     * @param {*} array - array to be shuffled
     */
    function shuffleDeck(array){
        let currentIndex = array.length;

        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }
});
