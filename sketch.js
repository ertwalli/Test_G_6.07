// P_3_2_4_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Drawing tool for creating moire effect compositions using
 * smooth path of any length, width, smoothness and colour.
 *
 * MOUSE
 * position x          : path simplification
 * position y          : ribbon width
 *
 * KEYS
 * arrow right         : increase path density
 * arrow left          : decrease path density
 * arrow up            : increase font size
 * arrow down          : decrease font size
 * control             : save png
 *
 * CONTRIBUTED BY
 * [Niels Poldervaart](http://NielsPoldervaart.nl)
 */
'use strict';

var letters = [];
var density = 2.5;
var ribbonWidth = 70;
var shapeColor;
var fontSize = 130;
var pathSimplification = 0;
var pathSampleFactor = 0.1;

var textTyped = ' EMERGE 2021';
var spacing = 1.15;

var font;
var ribbon = 0.01;
var ribbonMouse = 1;
var ribbonLFO = 1;

var path = 0.001;
var pathMouse = 1;
var pathLFO = 1;

var r = 255;
var g = 92;
var b = 28;

var greenMin = 92;
var greenMax = 163;
var blueMin = 28;
var blueMax = 65;

function preload() {
  font = loadFont('data/FreeSans.ttf');
}

function setup() {
  createCanvas(1250, 470);
  noFill();
  strokeWeight(1);
  shapeColor = color(r, g, b);

  createLetters();
  autoPathRibbon(ribbon, path);
}

function draw() {
  background(0);

  translate(width*0.1, height * 0.6);
  
  
  pathMouse = map(mouseX, 0, width, 0, 200);
  pathSampleFactor = 0.1 * pow(0.02, (pathLFO + pathMouse) / width);
  // ribbonWidth = map(mouseY, 0, height, 1, 100);

  for (var i = 0; i < letters.length; i++) {
    letters[i].draw();
  }

  ribbon = ribbon + 0.05;
  path = path + .01;
  autoPathRibbon(ribbon, path);

  print("green =");
  print("blue = ");
}

function createLetters() {
  letters = [];
  var chars = textTyped.split('');

  var x = 0;
  for (var i = 0; i < chars.length; i++) {
    if (i > 0) {
      var charsBefore = textTyped.substring(0, i);
      x = font.textBounds(charsBefore, 0, 0, fontSize).w * spacing;
    }
    var newLetter = new Letter(chars[i], x, 0);
    letters.push(newLetter);
  }
}

function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;

  Letter.prototype.draw = function() {
    var path = font.textToPoints(this.char, this.x, this.y, fontSize, {sampleFactor: pathSampleFactor});

    g = map(mouseX, 0, width, greenMin, greenMax);
    b = map(mouseY, 0, height, blueMin, blueMax);
    stroke(r, g, b);
    // stroke(shapeColor);

    for (var d = 0; d < ribbonWidth; d += density) {
      beginShape();

      for (var i = 0; i < path.length; i++) {
        var pos = path[i];
        var nextPos = path[i + 1];

        if (nextPos) {
          var p0 = createVector(pos.x, pos.y);
          var p1 = createVector(nextPos.x, nextPos.y);
          var v = p5.Vector.sub(p1, p0);
          v.normalize();
          v.rotate(HALF_PI);
          v.mult(d);
          var pneu = p5.Vector.add(p0, v);
          curveVertex(pneu.x, pneu.y);
        }
      }

      endShape(CLOSE);
    }
  };
}

function autoPathRibbon(ribbon, path) {
  var lfoRibbon = sin(ribbon);
  var lfoPath = sin(path);

  ribbonMouse = map(mouseX, 0, width, 1, 10);
  ribbonLFO = map(lfoRibbon, -1, 1, 1, 60);
  ribbonWidth = ribbonMouse + ribbonLFO;
  pathLFO = map(lfoPath, -1, 1, 0.0, 200);

}

// function keyReleased() {
//   if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');

//   if (keyCode == LEFT_ARROW) density *= 1.25;
//   if (keyCode == RIGHT_ARROW) density /= 1.25;

//   if (keyCode == UP_ARROW) {
//     fontSize *= 1.1;
//     createLetters();
//   }
//   if (keyCode == DOWN_ARROW) {
//     fontSize /= 1.1;
//     createLetters();
//   }

//   if (keyCode == ENTER) createLetters();
// }

// function keyPressed() {
//   if (keyCode == DELETE || keyCode == BACKSPACE) {
//     if (textTyped.length > 0) {
//       textTyped = textTyped.substring(0, textTyped.length - 1);
//       createLetters();
//     }
//   }
// }

// function keyTyped() {
//   if (keyCode >= 32) {
//     textTyped += key;
//     createLetters();
//   }
// }
