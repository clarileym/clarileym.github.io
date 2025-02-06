// Hilbert © 2024-02-11 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Space-filling algorithms 🍄 #WCCChallenge

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs";
import { mountControl } from "./Controls.js";
import { createNoise3D } from "https://cdn.skypack.dev/simplex-noise@4.0.0";
import { vert, TexFrag, BlurFrag, GrainFrag, MixFrag } from "./shader.js";

mountFlex(p5);
mountControl(p5);

new p5((p) => {
  const snoiseSeed = { x: p.random(), y: p.random() };
  const snoiseX3D = createNoise3D(() => snoiseSeed.x);
  const snoiseY3D = createNoise3D(() => snoiseSeed.y);

  const [WIDTH, HEIGHT] = [600, 600];
  const PIXEL_DENSITY = 1;
  const CANVAS_SIZE = [WIDTH, HEIGHT];
  const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)];

  let TexPass, BlurPass, GrainPass, MixPass;
  let tex, gfx;
  let t, color;
  let img;

  const palette = ["#560100", "#060626", "#151f05"];
  const NOISE_SCALE = 10;
  const PADDING = 50;
  const THICKNESS = 4;
  const IS_SMOOTH_CURVE = false;
  const NO_SHADER = false;
  const UNREAL = p.random([false, true]);
  const SCALE = 2;
  const SPEED = 0.2;

  p.preload = () => {
    // Load the image here
    img = p.loadImage("1-NExtLevel/NLPhotos/Constitution.jpeg"); // Replace with your image path
  };

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    p.flex({ container: { padding: "20px" } });
    p.containerBgColor(51);
    p.parentBgColor(51);
    p.pixelDensity(PIXEL_DENSITY);

    tex = p.createGraphics(WIDTH, HEIGHT, p.WEBGL);
    gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL);

    TexPass = p.createShader(vert, TexFrag);
    BlurPass = p.createShader(vert, BlurFrag);
    GrainPass = p.createShader(vert, GrainFrag);
    MixPass = p.createShader(vert, MixFrag);

    initTex();

    color = hex2rgb(p.random(palette));

    p.PressLoopToggle(" ");

    p.describe(`"Hilbert" by Zaron Chen, for Space-filling algorithms 🍄 #WCCChallenge`);
  };

  p.draw = () => {
    // Speed of destruction movement
    t = (p.frameCount / 80) * SPEED;

    p.background(0);
    gfx.background(0);

    mapImageToPixels();

    if (NO_SHADER) return;
    blur(p._renderer, [1, 0]);
    blur(gfx, [0, 1]);
    grain(gfx);
    mix(tex, gfx, color);
    p.image(gfx, 0, 0);

    if (!UNREAL) return;
    p.filter(p.DILATE);
    p.filter(p.POSTERIZE, 4);
  };

  const hex2rgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [
      ((bigint >> 16) & 255) / 255,
      ((bigint >> 8) & 255) / 255,
      (bigint & 255) / 255,
    ];
  };

  const commonUniform = (shader) => {
    shader.setUniform("canvasSize", CANVAS_SIZE);
    shader.setUniform("texelSize", TEXEL_SIZE);
    shader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT]);
    shader.setUniform("time", t);
    shader.setUniform("scale", SCALE);
  };

  const initTex = () => {
    tex.shader(TexPass);
    commonUniform(TexPass);
    tex.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  };

  const blur = (tex, direction) => {
    gfx.shader(BlurPass);
    commonUniform(BlurPass);
    BlurPass.setUniform("tex0", tex);
    BlurPass.setUniform("direction", direction);
    gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  };

  const grain = (tex) => {
    gfx.shader(GrainPass);
    commonUniform(GrainPass);
    GrainPass.setUniform("tex0", tex);
    gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  };

  const mix = (base, blend, color) => {
    gfx.shader(MixPass);
    commonUniform(MixPass);
    MixPass.setUniform("tex0", base);
    MixPass.setUniform("tex1", blend);
    MixPass.setUniform("color", color);
    gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  };

  const mapImageToPixels = () => {
    img.loadPixels();
    if (img.pixels.length === 0) return;
  
    p.beginShape();
    const step = 10;
  
    for (let y = 0; y < img.height; y += step) {
      for (let x = 0; x < img.width; x += step) {
        const index = (x + y * img.width) * 4;
  
        if (index + 3 >= img.pixels.length) continue;
  
        const r = img.pixels[index];
        const g = img.pixels[index + 1];
        const b = img.pixels[index + 2];
  
        p.stroke(r, g, b);
        p.point((x / img.width) * WIDTH, (y / img.height) * HEIGHT);
      }
    }
    p.endShape();
  };
});
