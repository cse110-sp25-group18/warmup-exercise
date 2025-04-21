class BettingView {
    constructor() {
        this.betInput = document.getElementById("bet-input");
        this.placeBetButton = document.getElementById("place-bet-button");
        this.bankrollDisplay = document.getElementById("bankroll-display");
        this.betStatusDisplay = document.getElementById("bet-status");
    }

    bindPlaceBet(handler) {
        this.placeBetButton.addEventListener("click", () => {
            const amount = parseInt(this.betInput.value, 10);
            handler(amount);
        });
    }

    updateBankrollDisplay(amount) {
        this.bankrollDisplay.textContent = `$${amount}`;
    }

    showBetStatus(message, isError = false) {
        this.betStatusDisplay.textContent = message;
        this.betStatusDisplay.style.color = isError ? "red" : "green";
    }
    setBetButtonState(disabled){
        console.log("Set Bet Button Disabled:", disabled);
        this.placeBetButton.disabled = disabled;
    }
}

export default BettingView;
