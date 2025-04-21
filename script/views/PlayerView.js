/**
 * PlayerView - Responsible for handling UI elements related to player and dealer hands
 */
class PlayerView {
  constructor() {
    // Hand containers
    this.handContainerDealer = document.getElementById("hand-container-dealer");
    this.handContainerPlayer = document.getElementById("hand-container-player");

    // Player action buttons
    this.dealButtonDealer = document.getElementById("deal-button-dealer");
    this.dealButtonPlayer = document.getElementById("deal-button-player");
    this.hitButton = document.getElementById("hit-button");
    this.standButton = document.getElementById("stand-button");
  }

  /**
   * Get hand container element for a target
   * @param {string} target - 'dealer' or 'player'
   * @returns {HTMLElement} - The hand container element
   */
  getHandContainer(target) {
    return target === "dealer"
      ? this.handContainerDealer
      : this.handContainerPlayer;
  }

  /**
   * Set button disabled state
   * @param {HTMLElement} button - The button element
   * @param {boolean} isDisabled - Whether the button should be disabled
   */
  setButtonState(button, isDisabled) {
    button.disabled = isDisabled;
  }

  /**
   * Control the enabled/disabled state of dealer buttons
   * @param {boolean} isDisabled - Whether buttons should be disabled
   */
  setDealerButtonsState(isDisabled) {
    this.setButtonState(this.dealButtonDealer, isDisabled);
  }

  /**
   * Control the enabled/disabled state of player buttons
   * @param {boolean} isDisabled - Whether buttons should be disabled
   */
  setPlayerButtonsState(isDisabled) {
    this.setButtonState(this.dealButtonPlayer, isDisabled);
  }

  /**
   * Set game action buttons state
   * @param {boolean} isHitDisabled - Whether hit button should be disabled
   * @param {boolean} isStandDisabled - Whether stand button should be disabled
   */
  setGameActionButtonsState(isHitDisabled, isStandDisabled) {
    this.setButtonState(this.hitButton, isHitDisabled);
    this.setButtonState(this.standButton, isStandDisabled);
  }

  /**
   * Get all cards from a hand
   * @param {string} target - 'dealer' or 'player'
   * @returns {Array} - Array of card elements
   */
  getHandCards(target) {
    const container = this.getHandContainer(target);
    return Array.from(container.querySelectorAll("card-element"));
  }

  /**
   * Animate card being dealt from deck to hand
   * @param {HTMLElement} card - The card element to deal
   * @param {string} target - 'dealer' or 'player'
   * @param {Function} callback - Function to call after animation completes
   */
  animateCardDeal(card, target, callback) {
    card.classList.add("fade-out");

    setTimeout(() => {
      const container = this.getHandContainer(target);
      this.slideCardIntoHand(card, container);

      if (callback) {
        setTimeout(callback, 600);
      }
    }, 600);
  }

  /**
   * Slide a card into a hand container
   * @param {HTMLElement} card - The card element
   * @param {HTMLElement} targetContainer - Container to slide card into
   */
  slideCardIntoHand(card, targetContainer) {
    card.classList.add("in-hand", "unrender");

    // Append card to the hand container
    targetContainer.appendChild(card);

    // Reset any inline styles that might interfere with hand layout
    card.style.left = "";
    card.style.top = "";
    card.style.display = "block";

    // Ensure proper z-index based on the card's position in the hand
    const cardsInHand = targetContainer.querySelectorAll("card-element");
    const cardIndex = Array.from(cardsInHand).indexOf(card);
    card.style.zIndex = cardsInHand.length - cardIndex;

    // Add fade-in animation
    card.classList.add("fade-in");
    card.classList.remove("unrender");
  }

  /**
   * Add fade-out effect to cards in hand
   * @param {string} target - 'dealer' or 'player'
   */
  fadeOutHandCards(target) {
    const cards = this.getHandCards(target);
    cards.forEach((card) => {
      card.classList.remove("fade-in");
      card.classList.add("fade-out");
    });
    return cards;
  }

  /**
   * Bind player event handlers
   * @param {Object} handlers - Object containing event handler functions
   */
  bindPlayerEvents(handlers) {
    this.dealButtonDealer.addEventListener("click", handlers.dealToDealer);
    this.dealButtonPlayer.addEventListener("click", handlers.dealToPlayer);
    this.hitButton.addEventListener("click", handlers.hit);
    this.standButton.addEventListener("click", handlers.stand);
  }
}

export default PlayerView;
