let myShader;
let img;
let freq = 0;
let amp = 0;
let xpos = 0;
let p5parent = document.querySelector('.waves-container');
let p5canvas;

function preload() {
  myShader = loadShader("shader/shader.vert", "shader/shader.frag");
  img = loadImage('assets/Immagini/IMG_3304-Modifica.jpg');
}

function setup() {
  p5canvas = createCanvas(p5parent.getBoundingClientRect().width, p5parent.getBoundingClientRect().height, WEBGL);
  p5canvas.parent(p5parent);
  p5canvas.style("z-index", "-1");
  p5canvas.style("position", "absolute");
  p5canvas.style("top", "0");

  shader(myShader);

  myShader.setUniform("tex", img);
  myShader.setUniform("screenWidth", width);
  myShader.setUniform("screenHeight", height);

  noStroke();
}

function draw() {

      //console.log(frameRate())
      freq = 1.5 * sin(frameCount * 0.001) + 3

      /* targetamp = map(mouseY, 0, height, -0.2, 0.2)
      amp += (targetamp-amp) * 0.01 */
      amp = 0.5 * cos(frameCount * 0.001)

      targetxpos = map(mouseX, 0, width, -2, 2)
      xpos += (targetxpos-xpos) * 0.01

      myShader.setUniform("frequency", freq);
      myShader.setUniform("amplitude", amp);
      myShader.setUniform("xpos", xpos);

  rect(0, 0, p5parent.getBoundingClientRect().width, p5parent.getBoundingClientRect().height);
}

function windowResized() {
  resizeCanvas(p5parent.getBoundingClientRect().width, p5parent.getBoundingClientRect().height);
}
