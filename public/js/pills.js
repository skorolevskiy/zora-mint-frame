var g, canvas; // canvas stuff
var visual, addmore; // intervals
var pills, words, recycle; // shape storage
var DRAWRATE = 16; // 60fps
var colorFields, color, BGCOLOR; // color options
var colorDef = [ // pretty colors
'#69D2E7',
'#1B676B',
'#BEF202',
'#EBE54D',
'#00CDAC',
'#1693A5',
'#F9D423',
'#FF4E50',
'#E7204E',
'#0CCABA',
'#FF006F'
];
var AMP, SPEED, SPIN, SIZE, SCALE, NUM, DELAY, ALPHA; // init var 
var GROW, DIRECTION, BOUNCE, TYPE; // selection choices
/* 
AMP: amplitude of cos, determines how much shapes move side to side: the spread
SPEED: how fast it moves 
SPIN: how fast it spins
SIZE: how long the shape is
SCALE: how big the shape is
NUM: number of shapes added per interval
DELAY: delay for adding new shapes
ALPHA: opacity levels: 0 - 1
GROW: show as growing lines or just the shapes
DIRECTION: shapes move up/down/random
BOUNCE: shapes bounce off top/bottom
TYPE: type of shape: pill/word
*/
var mouseX, mouseY; // mouse mode pos
var idx; // for words array

window.onload = function init() {
  document.getElementById('width').value = window.innerWidth;
  document.getElementById('height').value = window.innerHeight;
  document.getElementById('options').style.height = window.innerHeight - 50;
  colorFields = 0;
  defCond();
  start();
}

// display word text area on change
document.getElementById('shape').addEventListener('change', function () {
  document.getElementById('wordsOptions').style.display =
  this.value == "Words" ? 'block' : 'none';
});

document.getElementById('preset').addEventListener('change', function () {
  switch(this.value) {
    case "Floaty Snow":
    floatySnow();
    break;
    case "Rain":
    rain();
    break;
    default:
    defCond();
  }
})

// adds more color options
function addColor() {
  var newColorField = document.createElement('div');
  newColorField.innerHTML = 
  "<input type='color' value='#0000FF' id='color" + colorFields +
  "' /><input type='button' id='button" + colorFields +
  "' value='Remove' onClick='this.parentNode.parentNode.removeChild(this.parentNode);'/>";
  colorFields++;

  document.getElementById('colors').appendChild(newColorField);
}

// start animation
function start() {
  stop(); // stop previous animations so it doesn't mess up
  getCond();

  document.getElementById('canvas').style.background = BGCOLOR;

  // sets words for word shapes; default: butts
  if (TYPE == 'word') {
    words = document.getElementById('words').value != "" ?
    document.getElementById('words').value.split(" ") : ["butts"];
    idx = 0;
  }

  // mouse mode
  if (document.getElementById('mouse').checked) {
    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('mousedown', mouseDown, false);
  }

  // first run
  if (canvas == null) {
    var pill;
    
    pills = [];
    recycle = new Set(); // set of shape idxs to be recycled

    // init canvas
    canvas = document.getElementById('canvas')
    canvas.width = toNum(document.getElementById('width').value, window.innerWidth);
    canvas.height = toNum(document.getElementById('height').value, window.innerHeight);
    g = canvas.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
  } 
  
  if (!document.getElementById('mouse').checked) {
    moreP(); // adds more shapes
  }
  
  visual = window.setTimeout(draw, DRAWRATE); // start drawing
}

// adds shapes based on interval
function moreP() {
  var pill;
  // offsets starts for smooth entry
  var st = DIRECTION == -1 ? canvas.height + 20 : -20;

  for (var i = 0; i < NUM; i++) {
    pill = new Shape(round3(rand(0, canvas.width)), st);

    if (recycle.size != 0) {
      // firsts checks for shapes that are no longer used and recycles their idx
      var temp = recycle.keys().next().value; // gets first ele from set

      recycle.delete(temp);
      pills[temp] = pill;
    } else {
      // nothing to recycle, justs adds to arr
      pills.push(pill);
    }
  }

  addmore = window.setTimeout(moreP, DELAY * 1000);
}

// changes x,y pos with mouse movement
function mouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// adds shapes with mouse click
function mouseDown(e) {
  var pill;

  for (i = 0; i < NUM; i++) {
    pill = new Shape(mouseX, mouseY);
    
    if (recycle.size != 0) {
      // firsts checks for shapes that are no longer used and recycles their idx
      var temp = recycle.keys().next().value; // gets first ele from set

      recycle.delete(temp);
      pills[temp] = pill;
    } else { 
      pills.push(pill);
    }
  }
}

// pauses animation
function stop() {
  window.clearTimeout(visual);
  window.clearTimeout(addmore);
  document.removeEventListener('mousemove', mouseMove, false);
  document.removeEventListener('mousedown', mouseDown, false);
}

// clears screen
function clearShapes() {
  clear();
  pills = [];
  recycle.clear();
}

// hides/shows option menu
function options() {
  document.getElementById("options").style.display =
  document.getElementById("options").style.display == 'none' ? 'block' : 'none';
}

// sets options
function setCond(cond) {
  document.getElementById('amp').value = cond.amp;
  document.getElementById('speedMin').value = cond.speedMin;
  document.getElementById('speedMax').value = cond.speedMax;
  document.getElementById('spinMin').value = cond.spinMin;
  document.getElementById('spinMax').value = cond.spinMax;
  document.getElementById('sizeMin').value = cond.sizeMin;
  document.getElementById('sizeMax').value = cond.sizeMax;
  document.getElementById('scaleMin').value = cond.scaleMin;
  document.getElementById('scaleMax').value = cond.scaleMax;
  document.getElementById('alphaMin').value = cond.alphaMin;
  document.getElementById('alphaMax').value = cond.alphaMax;
  document.getElementById('grow').checked = cond.grow;
  document.getElementById('mouse').checked = cond.mouse;
  document.getElementById('numShapes').value = cond.numShapes;
  document.getElementById('delay').value = cond.delay;
  document.getElementById('direction').value = cond.direction;
  document.getElementById('shape').value = cond.shape;
  document.getElementById('words').value = cond.words;
  document.getElementById('bounce').checked = cond.bounce;
  document.getElementById('wordsOptions').style.display = 'none';
  document.getElementById('bgColor').value = cond.bgColor;
  
  document.getElementById('width').value = window.innerWidth;
  document.getElementById('height').value = window.innerHeight;

  document.getElementById('colors').innerHTML = ''; // clears prev colors

  // adds default colors
  colorFields = 0;
  for (var i = 0; i < cond.colors.length; i++) {
    addColor();
    document.getElementById('color' + (colorFields - 1)).value = cond.colors[i];
  }
}

// default settings
function defCond() {
  setCond({
    amp: 250,
    speedMin: .2,
    speedMax: .5,
    spinMin: .001,
    spinMax: .005,
    sizeMin: .5,
    sizeMax: 2,
    scaleMin: 1,
    scaleMax: 10,
    alphaMin: .2,
    alphaMax: 1,
    grow: false,
    mouse: false,
    numShapes: 20,
    delay: 1,
    direction: "Up",
    shape: "Pill",
    words: "",
    bounce: false,
    bgColor: '#FFFFFF',
    colors: colorDef
  });
}

// floaty snow preset settings
function floatySnow() {
  setCond({
    amp: 250,
    speedMin: .1,
    speedMax: 1,
    spinMin: .001,
    spinMax: .005,
    sizeMin: .1,
    sizeMax: .2,
    scaleMin: 1,
    scaleMax: 10,
    alphaMin: .2,
    alphaMax: 1,
    grow: false,
    mouse: false,
    numShapes: 5,
    delay: .2,
    direction: "Down",
    shape: "Pill",
    words: "",
    bounce: false,
    bgColor: '#7CD3D8', // blue greyish sky
    colors: ['#FFFFFF'] // white snow
  });
}

// rain preset
function rain() {
  setCond({
    amp: 0,
    speedMin: 10,
    speedMax: 15,
    spinMin: 0,
    spinMax: 0,
    sizeMin: .1,
    sizeMax: .2,
    scaleMin: 1,
    scaleMax: 3,
    alphaMin: .2,
    alphaMax: 1,
    grow: false,
    mouse: false,
    numShapes: 20,
    delay: .1,
    direction: "Down",
    shape: "Pill",
    words: "",
    bounce: false,
    bgColor: '#000000', // black
    colors: ['#2B7BDD'] // white snow
  });
}

// init vars based on settings
function getCond() {
  TYPE = document.getElementById('shape').value == "Words" ? 'word' : 'pill';
  AMP = toNum(document.getElementById('amp').value, 250);
  SPEED = {
    MIN: toNum(document.getElementById('speedMin').value, .2),
    MAX: toNum(document.getElementById('speedMax').value, .5)
  };
  SPIN = {
    MIN: toNum(document.getElementById('spinMin').value, .001),
    MAX: toNum(document.getElementById('spinMax').value, .005)
  };
  SIZE = {
    MIN: toNum(document.getElementById('sizeMin').value, .5),
    MAX: toNum(document.getElementById('sizeMax').value, 2)
  };
  SCALE = {
    MIN: toNum(document.getElementById('scaleMin').value, 1),
    MAX: toNum(document.getElementById('scaleMax').value, 10)
  };
  ALPHA = {
    MIN: toNum(document.getElementById('alphaMin').value, .2),
    MAX: toNum(document.getElementById('alphaMax').value, 1)
  };
  GROW = document.getElementById('grow').checked;
  NUM = toNum(document.getElementById('numShapes').value, 10);
  DELAY = toNum(document.getElementById('delay').value, 1);
  BOUNCE = document.getElementById('bounce').checked;
  BGCOLOR = document.getElementById('bgColor').value;
  DIRECTION = document.getElementById('direction').value == "Up" ? -1 : 1;
  if (document.getElementById('direction').value == "Random") {
    DIRECTION = 0; // direction modifier doesn't matter for random
  }

  color = [];

  for (var i = 0; i < colorFields; i++) {
    if (document.getElementById('color' + i) != null) {
     color.push(document.getElementById('color' + i).value);
   }
 }
}

// parses s into a num if it contains one, otherwise returns def
function toNum(s, def) {
  return !isNaN(parseFloat(s)) ? parseFloat(s) : def;
}

// returns random number in between range
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// rounds n to 3 places
function round3(n) {
  return Math.round(n * 1000) / 1000;
}

function Shape(x, y) {
  // init vars
  this.x = x;
  this.y = y;
  this.scale = Math.floor(rand(SCALE.MIN, SCALE.MAX));
  this.speed = round3(rand(SPEED.MIN, SPEED.MAX));
  this.color = color[Math.floor(Math.random() * color.length)];
  this.size = round3(rand(SIZE.MIN, SIZE.MAX));
  this.spin = round3(rand(SPIN.MIN, SPIN.MAX));
  this.alpha = round3(rand(ALPHA.MIN, ALPHA.MAX));

  // sets each shape to different word
  if (TYPE == 'word') {
    this.idx = idx++%words.length;
  }
  if (Math.random() < 0.5) {
    this.spin *= -1;
  }
  this.rotation = round3(rand(0, 2 * Math.PI));
  this.direction = DIRECTION != 0 ? DIRECTION : 1;
  this.random = DIRECTION == 0 ? true : false;
  this.amp = AMP;

  // updates shape's pos
  this.move = function() {
    this.rotation += this.spin;
    this.y += round3(this.speed * this.scale * this.direction);
  }

  // draws shape
  this.draw = function() {
    g.save();
    g.beginPath();

    /* not really random just rotates first so the translation axis is different
    causes shapes to appear randomly, not starting at top/ bottom */  
    if (this.random) {
      g.rotate(this.rotation);
      g.translate(this.x + Math.cos(this.rotation * this.speed) * this.amp, this.y);
    } else {
      g.translate(this.x + Math.cos(this.rotation * this.speed) * this.amp, this.y);
      g.rotate(this.rotation);  
    }
    g.scale(this.scale, this.scale);
    g.globalAlpha = this.alpha;

    // drawing actual shape
    if (TYPE == 'pill') {
      g.moveTo(this.size, 0);
      g.lineTo(this.size * -1, 0);
      g.lineWidth = "5";
      g.lineCap = 'round';
      g.strokeStyle = this.color;
      g.stroke();
    } else if (TYPE == 'word') {
      g.font = '20pt Arial';
      g.fillStyle = this.color;
      g.fillText(words[this.idx], 0, 0);
    }

    g.restore();
  }
}

// clear canvas
function clear() {
  g.clearRect(0, 0, canvas.width, canvas.height);
}

// draws all shapes
function draw() {
  var p;
  if (!GROW) // clear screen between each drawing or not
    clear();
  
  for (var i = 0; i < pills.length; i++) {
    p = pills[i];
    
    if (p.y < 0 && p.direction == -1 || 
      p.y > canvas.height && p.direction == 1) {
      if (BOUNCE) {
        // checks direction so starting offset doesn't make it bounce
        // swaps direction, doesn't function properly with random direction
        p.direction *= -1; 
      } else {
        //pills.splice(i,1); // causes flickering
        // adds idx to be recycled
        recycle.add(i);
      }
    } 

    // updates and draws shape if still in canvas boundary
    if (p.y >= 0 || p.y <= canvas.height || BOUNCE) {
      p.move();
      p.draw();
    }
  }

  visual = window.setTimeout(draw, DRAWRATE); // set draw interval
}
