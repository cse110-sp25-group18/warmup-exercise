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
        debugCard.style.transition = 'transform 0.5s';
        debugCard.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            debugCard.style.transition = '';
            debugCard.style.transform = '';
        }, 500);
    });
    
    console.log('script loaded');
});
