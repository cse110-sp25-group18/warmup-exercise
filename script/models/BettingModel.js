class BettingModel {
    constructor() {
        this.bankrollKey = "bankroll";
        this.bet = 0;

        if (!sessionStorage.getItem(this.bankrollKey)) {
            sessionStorage.setItem(this.bankrollKey, "100");
        }
    }

    getBankroll() {
        return parseInt(sessionStorage.getItem(this.bankrollKey), 10);
    }

    setBankroll(amount) {
        sessionStorage.setItem(this.bankrollKey, amount.toString());
    }

    placeBet(amount) {
        const bankroll = this.getBankroll();
        
        // Refund the previous bet first
        this.setBankroll(bankroll + this.bet);
    
        // Re-check bankroll after refund
        const updatedBankroll = this.getBankroll();
        if (amount <= updatedBankroll && amount > 0) {
            this.bet = amount;
            this.setBankroll(updatedBankroll - amount);
            return true;
        }
    
        // If new bet is invalid, keep old bet at 0
        this.bet = 0;
        return false;
    }
    

    getBet() {
        return this.bet;
    }

    resolveBet(outcome) {
        let bankroll = this.getBankroll();
        if (outcome === "player") {
            bankroll += this.bet * 2;
        } else if (outcome === "tie") {
            bankroll += this.bet;
        }
        this.setBankroll(bankroll);
        this.bet = 0;
    }
}

export default BettingModel;
