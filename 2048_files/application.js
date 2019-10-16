// Wait till the browser is ready to render the game (avoids glitches)
var global_game = null;
window.requestAnimationFrame(function () {
  global_game = new GameManager(3);
});

function rerun(size) {
  var field = document.querySelector('#newitem');

                var text = field.value;
  global_game = new GameManager(parseInt(text));
}
