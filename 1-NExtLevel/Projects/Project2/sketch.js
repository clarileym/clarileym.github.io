let scribbles = [];
let constitution;
let frameCounter = 0;
let revealSpeed = 50;
let clearSpeed = 100;
let fadeAmount = 255; // Start fully visible

let imgFile = "photos/signature2.png"; // Single image file
let img;

function preload() {
    constitution = loadImage('photos/USMap2.png');
    img = loadImage(imgFile); // Load a single image file
}

function setup() {
    createCanvas(800, 600);
    imageMode(CENTER);
    background('#fcf5e5');
    frameRate(20);
}

function draw() {
    background('#FFFFFF');

    // Adjust the fade effect over 1000 frames (~50 seconds for a full fade-in/fade-out cycle)
    let fadeSpeed = 1000; 
    fadeAmount = 255 * (0.5 + 0.5 * cos((TWO_PI * frameCounter) / fadeSpeed)); 

    tint(255, fadeAmount);
    image(constitution, width / 2, height / 2, width * 0.9, height * 0.8);
    noTint();

    let xPos = random(50, 550);
    let yPos = random(50, 450);

    if (scribbles.length < 10) {
        scribbles.push(new ScribbleReveal(img, xPos, yPos)); // Use the single image file
    } else {
        if (scribbles[0] && !scribbles[0].clear) {
            scribbles[0].clear = true;
        }
    }

    frameCounter++;

    drawScribbles();
}

function drawScribbles() {
    for (let i = scribbles.length - 1; i >= 0; i--) {
        let scribble = scribbles[i];
        scribble.update();
        scribble.show();

        if (scribble.revealedWidth <= 0) {
            scribbles.splice(i, 1);
        }
    }
}

class ScribbleReveal {
    constructor(img, x, y) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = this.img.width * 0.5;
        this.h = this.img.height * 0.5;
        this.maxWidth = this.w;
        this.revealedWidth = 0;
        this.clear = false;
    }

    update() {
        if (this.clear && this.revealedWidth > 0) {
            this.revealedWidth -= clearSpeed;
        } else if (this.revealedWidth < this.w) {
            this.revealedWidth += revealSpeed;
        }
    }

    show() {
        if (this.img) {
            push();
            translate(this.x, this.y);
            imageMode(CORNER);
            image(this.img, 0, 0, this.revealedWidth, this.h);
            pop();
        }
    }
}
