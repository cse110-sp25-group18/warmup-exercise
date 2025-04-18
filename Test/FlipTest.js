import Card from '../script/card.js';

// Register custom element if not already registered
try {
    customElements.define('card-element', Card);
} catch (error) {
    console.log('Card element already defined');
}

// Get or create results container
const resultsContainer = document.getElementById('results');

// Test utilities
function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
    return true;
}

function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
    return true;
}

function runTest(testName, testFunction) {
    try {
        if (testFunction()) {
            console.log(`✅ ${testName} - PASSED`);
            const resultElement = document.createElement('p');
            resultElement.className = 'pass';
            resultElement.innerHTML = `✅ ${testName} - PASSED`;
            resultsContainer.appendChild(resultElement);
            return true;
        } else {
            console.log(`❌ ${testName} - FAILED`);
            const resultElement = document.createElement('p');
            resultElement.className = 'fail';
            resultElement.innerHTML = `❌ ${testName} - FAILED`;
            resultsContainer.appendChild(resultElement);
            return false;
        }
    } catch (error) {
        console.error(`❌ ${testName} - ERROR:`, error);
        const resultElement = document.createElement('p');
        resultElement.className = 'fail';
        resultElement.innerHTML = `❌ ${testName} - ERROR: ${error.message}`;
        resultsContainer.appendChild(resultElement);
        return false;
    }
}

// Specific test for the flip button
function testFlipButton() {
    // Create a container to match the app's structure
    const testContainer = document.createElement('div');
    testContainer.id = 'deck-container';
    document.body.appendChild(testContainer);
    
    // Create a flip button
    const flipButton = document.createElement('button');
    flipButton.id = 'flip-button';
    flipButton.textContent = 'Flip';
    document.body.appendChild(flipButton);
    
    // Add the event listener (copied directly from main.js)
    flipButton.addEventListener("click", function() {
        const cards = document.querySelectorAll('card-element');
        if (cards.length > 0) {
            const topCard = cards[0];
            topCard.toggle();
        }
    });
    
    // Create cards in the deck (add 3 cards)
    const card1 = document.createElement('card-element');
    card1.suit = 'spades';
    card1.rank = 'A';
    testContainer.appendChild(card1);
    
    const card2 = document.createElement('card-element');
    card2.suit = 'hearts';
    card2.rank = 'K';
    testContainer.appendChild(card2);
    
    const card3 = document.createElement('card-element');
    card3.suit = 'diamonds';
    card3.rank = '2';
    testContainer.appendChild(card3);
    
    // Set up the cards properly (similar to arrangeCardsInStack)
    const cards = [card1, card2, card3];
    cards.forEach((card, index) => {
        card.style.zIndex = index === 0 ? 100 : (100 - index);
        if (index === 0) {
            card.isTopCard = true;
            card.classList.add('top-card');
        } else {
            card.isTopCard = false;
            card.classList.remove('top-card');
        }
    });
    
    // Check initial state
    assertEquals(card1._isFaceUp, false, 'Top card should start face down');
    
    // Test 1: Click the flip button
    console.log('Clicking flip button...');
    flipButton.click();
    
    // Verify the top card flipped
    assertEquals(card1._isFaceUp, true, 'Top card should be face up after button click');
    
    // Verify other cards did not flip
    assertEquals(card2._isFaceUp, false, 'Second card should remain face down');
    assertEquals(card3._isFaceUp, false, 'Third card should remain face down');
    
    // Test 2: Click the flip button again
    console.log('Clicking flip button second time...');
    flipButton.click();
    
    // Verify the top card flipped back
    assertEquals(card1._isFaceUp, false, 'Top card should be face down after second button click');
    
    // Clean up
    document.body.removeChild(testContainer);
    document.body.removeChild(flipButton);
    
    return true;
}

// Run all tests
function runAllTests() {
    console.log('Running Flip Button Tests...');
    resultsContainer.innerHTML = '<h2>Flip Button Test Results:</h2>';
    
    let passedTests = 0;
    if (runTest('Flip Button Test', testFlipButton)) passedTests++;
    
    const summary = document.createElement('p');
    summary.innerHTML = `<strong>Test Summary:</strong> ${passedTests}/1 tests passed`;
    summary.style.fontWeight = 'bold';
    summary.style.marginTop = '10px';
    resultsContainer.appendChild(summary);
    
    console.log(`Test Summary: ${passedTests}/1 tests passed`);
}

// Add visual demo section
function addVisualDemo() {
    // Create demo section
    const demoSection = document.createElement('div');
    demoSection.innerHTML = '<h2>Visual Demonstration</h2>';
    demoSection.style.marginTop = '30px';
    document.body.appendChild(demoSection);
    
    // Create a container for the cards
    const demoContainer = document.createElement('div');
    demoContainer.id = 'demo-deck';
    demoContainer.style.position = 'relative';
    demoContainer.style.width = '170px';
    demoContainer.style.height = '230px';
    demoContainer.style.margin = '20px auto';
    demoSection.appendChild(demoContainer);
    
    // Create demo cards
    const card1 = document.createElement('card-element');
    card1.suit = 'spades';
    card1.rank = 'A';
    card1.isTopCard = true;
    card1.classList.add('top-card');
    card1.style.zIndex = 100;
    card1.style.left = '0px';
    card1.style.top = '0px';
    demoContainer.appendChild(card1);
    
    const card2 = document.createElement('card-element');
    card2.suit = 'hearts';
    card2.rank = 'K';
    card2.style.zIndex = 99;
    card2.style.left = '5px';
    card2.style.top = '5px';
    demoContainer.appendChild(card2);
    
    const card3 = document.createElement('card-element');
    card3.suit = 'diamonds';
    card3.rank = '2';
    card3.style.zIndex = 98;
    card3.style.left = '10px';
    card3.style.top = '10px';
    demoContainer.appendChild(card3);
    
    // Create demo flip button
    const demoFlipButton = document.createElement('button');
    demoFlipButton.textContent = 'Flip Top Card';
    demoFlipButton.addEventListener('click', function() {
        if (demoContainer.querySelector('card-element')) {
            demoContainer.querySelector('card-element').toggle();
        }
    });
    demoSection.appendChild(demoFlipButton);
    
    // Add status indicator
    const statusDisplay = document.createElement('div');
    statusDisplay.innerHTML = '<p><strong>Current status:</strong> Top card is face down</p>';
    demoSection.appendChild(statusDisplay);
    
    // Update status when card flips
    card1.addEventListener('click', updateStatus);
    demoFlipButton.addEventListener('click', updateStatus);
    
    function updateStatus() {
        setTimeout(() => {
            statusDisplay.innerHTML = `<p><strong>Current status:</strong> Top card is ${card1._isFaceUp ? 'face up' : 'face down'}</p>`;
        }, 100);
    }
}

// Run tests when loaded
document.addEventListener('DOMContentLoaded', () => {
    runAllTests();
    addVisualDemo();
});