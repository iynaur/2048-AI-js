// Wait till the browser is ready to render the game (avoids glitches)
var global_game = null;
window.requestAnimationFrame(function () {
  global_game = new GameManager(5, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});
