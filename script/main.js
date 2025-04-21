// main.js - Entry point for the application
import GameController from "./controllers/GameController.js";

/**
 * Initialize the game when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing game with MVC architecture and System/Player separation...");
    
    // Create controller that will handle all game components
    const gameController = new GameController();

    if (!sessionStorage.getItem("bankroll")) {
        sessionStorage.setItem("bankroll", "100");
    }
    updateBankrollDisplay();
    
    // Game is now initialized by the controller
});