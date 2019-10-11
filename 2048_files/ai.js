var size;

var sqrsize;// = size * size;

function AI(gridsize) {
  this.size = gridsize;
  size = gridsize;
  sqrsize = size * size;
  this.best_operation = 0;
  this.grid = Array(this.sqrsize);
  this.node = 0;
  this.max_depth;
}

AI.prototype.MoveLeft = function(s) {
  var k = 0;
  var base = 0;
  var score = 0;
  var result = new Array(sqrsize);
  for (var i = size; i <= sqrsize; i += size) {
    while (k < i) {
      if (s[k] == 0) {
        ++k;
        continue;
      }        
      if (k + 1 < i && s[k] == s[k + 1]) {
        result[base++] = s[k] * 2;
        score += s[k] * 2;
        k += 2;
      } else {
        result[base++] = s[k++];
      }
    }
    while (base < i) {
      result[base++] = 0;
    }
  }
  return [result, score];
};
  
AI.prototype.Rotate = function(s) {
  var ns = new Array();
  for (var i = 0; i < size; ++i)
  {
    for (var j = 0; j < size; ++j)
    {
      ns.push(s[(size - j - 1) * size + i]);
    }
  }
  return ns;

  return new Array(s[12], s[8], s[4], s[0],
                   s[13], s[9], s[5], s[1],
                   s[14], s[10], s[6], s[2],
                   s[15], s[11], s[7], s[3]);    
};

AI.prototype.Estimate = function(s) {
  var diff = 0;
  var sum = 0;
  for (var i = 0; i < sqrsize; ++i) {
    sum += s[i];
    if (i % size != size - 1) {
      diff += Math.abs(s[i] - s[i + 1]);
    }
    if (i < sqrsize - size) {
      diff += Math.abs(s[i] - s[i + size]);
    }
  }
  return (sum * 4 - diff) * 2;
};

AI.prototype.Search = function(s, depth) {
  this.node++;
  if (depth >= this.max_depth) return this.Estimate(s);
  var best = -1;
  for (var i = 0; i < 4; ++i) {//4 direction
    var results = this.MoveLeft(s);
    var t = results[0];
    var same = true;
    for (var j = 0; j < sqrsize; ++j) {
      if (t[j] != s[j]) {
        same = false;
        break;
      }
    }
    if (!same) {
      var temp = 0;
      var empty_slots = 0;
      for (var j = 0; j < sqrsize; ++j) {
      	if (t[j] == 0) {
      	  t[j] = 2;
                ++empty_slots;
      	  temp += this.Search(t, depth + 1) * 0.9;	  
      	  t[j] = 4;
      	  temp += this.Search(t, depth + 1) * 0.1;
      	  t[j] = 0;
      	}
      }
      if (empty_slots != 0) {
      	temp /= empty_slots;
      } else {
        temp = -1e+20;
      }

      if (results[1] + temp > best) {
        best = results[1] + temp;
        if (depth == 0) {
          this.best_operation = i;
        }
      }
    }
    if (i != 3) {
      s = this.Rotate(s);
    }
  }    
  return best;
};

AI.prototype.SetTile = function(x, y, v) {
  this.grid[x + y * this.size] = v;
};

AI.prototype.StartSearch = function() {
  this.node = 0;
  this.max_depth = size < 5 ? 3 : 2;
  while (true) {
    this.node = 0;
    this.Search(this.grid, 0);
    if (this.node >= 10000 || this.max_depth >= 8) break;
    this.max_depth += 1;
  }
};


var continuous = false;
var time_out = null;
var interval = 500;
var after_win = false;
function ai_run() {
  var size = global_game.size;
  var ai = new AI(size);
  time_out = null;
  if (!global_game || global_game.over || (global_game.won && !after_win)) return;

  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < size; ++j) {
      var t = global_game.grid.cells[i][j];
      if (t) {
        ai.SetTile(i, j, t.value);
      } else {
        ai.SetTile(i, j, 0);
      }
    }
  }
  var dir = [3, 2, 1, 0]
  ai.StartSearch();
  console.log(ai.best_operation);
  global_game.move(dir[ai.best_operation]);
  if (continuous) {
    if (time_out == null) {
      time_out = window.setTimeout("ai_run()", interval);
    }
  }
}
function run(is_continuous, need_run, is_crazy) {
  continuous = is_continuous;
  document.getElementById("stop").disabled = !continuous;
  interval = is_crazy ? 0 : 500;
  if (need_run) {
    if (global_game && global_game.won) {
      after_win = true;
    }
    ai_run();
  }
}
