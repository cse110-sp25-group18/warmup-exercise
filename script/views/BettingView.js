/**
 * BettingView - Responsible for handling UI of betting 
 */
class BettingView {
    constructor() {
        // text input area
        this.betInput = document.getElementById("bet-input");
        // place bet button
        this.placeBetButton = document.getElementById("place-bet-button");
        
        //amount in bankroll
        this.bankrollDisplay = document.getElementById("bankroll-display");

        // messages on the status of the bet
        this.betStatusDisplay = document.getElementById("bet-status");
    }

    /**
     * Bind betting event handlers
     * @param {Object} handler - Object containing event handler functions
     */
    bindPlaceBet(handler) {
        this.placeBetButton.addEventListener("click", () => {
            const amount = parseInt(this.betInput.value, 10);
            handler(amount);
        });
    }

    /**
     * Updates displayed amount in bankroll
     * @param {number} amount 
     */
    updateBankrollDisplay(amount) {
        this.bankrollDisplay.textContent = `$${amount}`;
    }

    /**
     * Displays status of bet
     * @param {string} message - what message will be displayed
     * @param {boolean} isError - determines what color the text will be
     */
    showBetStatus(message, isError = false) {
        this.betStatusDisplay.textContent = message;
        this.betStatusDisplay.style.color = isError ? "red" : "green";
    }

    /**
     * Set new bet button state
     * @param {boolean} disabled - Whether the button should be disabled
     */
    setBetButtonState(disabled){
        console.log("Set Bet Button Disabled:", disabled);
        this.placeBetButton.disabled = disabled;
    }
}

export default BettingView;
