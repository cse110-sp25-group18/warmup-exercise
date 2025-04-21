class BettingModel {
  constructor() {
    this.bankrollKey = "bankroll";
    this.bet = 0;

    if (!sessionStorage.getItem(this.bankrollKey)) {
      sessionStorage.setItem(this.bankrollKey, "100");
    }
  }

  /**
   * Returns a number representation of how much is in the bankroll
   * @returns amount of money in bankroll
   */
  getBankroll() {
    return parseInt(sessionStorage.getItem(this.bankrollKey), 10);
  }

  /**
   * Sets new amount in bankroll
   * @param {number} amount - amount to be set
   */
  setBankroll(amount) {
    sessionStorage.setItem(this.bankrollKey, amount.toString());
  }

  /**
   * Places a bet and handles edge cases
   * @param {number} amount - amount placed as a bet
   * @returns true if successful, false if bad bet
   */
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

  /**
   * Return the number that was bet
   * @returns - the amount bet
   */
  getBet() {
    return this.bet;
  }

  /**
   * Updates bankroll based on outcome
   * @param {*} outcome - state of the end of the game
   * ('player', 'tie', or 'dealer')
   */
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
