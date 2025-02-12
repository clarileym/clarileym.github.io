const md = {
    // Paper
    paper: {
      notebook: {
        cantLines: 15,
        cantSeps: 28,
      },
      paper: {
        rugosity: 9000,
      }
    },
    // Dictionary
    mode: 'dictionary',
    dictData : {
      addUppercase: true,
      addSymbols: true,
    },
    // Glyphs
      typeGlyph: 'domain',
    glyph: {
      domain: {
        curvesPerGlyph: 2,
        cantCentroids: 20,
        repeatCentroid: true,
        chaos: 3,
      },
      simple : {
  
      }
    },
    isIntense: true,
    letter: 'My mother had a beautiful handwriting. A little gothic, at the same time a little hysterical. At the beginning of each line, on the left side, the writing was regular, strict, gothic, but as the line moved to the side of the page, she became more and more nervous, worried, almost hysterical.',
    rows: 15,
    cols: 28,
    factorGlyphSize: 2.2,
    strokeWeight: 2,
  };
  
  function getCentroid(data) {
      const size = data.size? data.size : 1;
      const region = Math.ceil(size / data.cantCentroids);
      const r = region * (data.i + Math.random());
      const x = 0.5 * r * Math.cos(Math.PI * (2 * Math.random() + 0.75));
      const y = r * Math.sin(2 * Math.PI * Math.random());
  
      return [x, y];
  }
  let glyphData, dictionary, modes;
  let spacingX, spacingY, marginX, marginY;
  let x, y;
  let isFinished = false;
  let seed = 1234;
  let paperData;
          
  function drawPaper(data) {
      const CANT_LINES = data.cantLines? data.cantLines : 20;
      const CANT_SEPARATIONS = data.cantSeps? data.cantSeps : 20;
      const BASE_H = 0;
      const BASE_S = 0;
      const BASE_B = 95;
      const spacingX = Math.floor(data.dimensions.width / CANT_SEPARATIONS);
      const spacingY = Math.floor(data.dimensions.height / CANT_LINES);
      const marginX = spacingX * 0.5;
      const marginY = Math.floor(data.dimensions.width / CANT_LINES);
  
      colorMode(HSB, 360, 100, 100, 100);
      background(color(BASE_H, BASE_S, BASE_B));
      for (let x = marginX; x < data.dimensions.width - marginX; x += spacingX) {
              for (let y = spacingY * 0.25; y < data.dimensions.height - marginY; y += spacingY) {
                      strokeWeight(2);
                      stroke(color(220, 80, 60, 95));
                      line(	x, y + spacingY,
                                  x + spacingX, y + spacingY
                      );
              }
      }
      stroke(color(220 - 5, 80 - 15, 60 + 15, 95));
  }
  
  function setup() {
      paperData = {
          cantLines: 15,
          cantSeps: 28,
          dimensions: {
              x: 0,
              y: 0,
              width: windowWidth,
              height: windowHeight,
          },
      };
      createCanvas(windowWidth, windowHeight);
      frameRate(20);
      randomSeed(seed);
      drawPaper(paperData);
      describe('A notebook-like background, containing incomprehensible text. Its characters\' strokes get progressively wider as they approach the edge.')
      
      spacingX = Math.floor(windowWidth / md.cols);
    spacingY = Math.floor(windowHeight / md.rows);
    marginX = spacingX * 0.5;
    marginY = Math.floor(windowWidth / md.rows);
      x = marginX;
      y = spacingY * 0.25;
  
    // Specify a domain and get the points where the curves will gravitate towards to
    const centroids = [];
    
    for (let i = 0; i < md.glyph.domain.cantCentroids; i++) {
      centroids.push(getCentroid({size: spacingX * md.factorGlyphSize, cantCentroids: md.glyph.domain.cantCentroids, i}));
    }
    glyphData = {...md.glyph[md.typeGlyph], spacingX, spacingY, centroids, idx: 0};
    
    // Create a dictionary
    dictionary = makeDictionary(md.typeGlyph, md.dictData, glyphData);
    modes = {
      default: ({x, y}, glyphData) => {
        const ran = Math.random();
        
        if (jumped || ran > 0.15) {
          glyphData.x = x;
          glyphData.y = y;
          glyphData.jumped = jumped;
          
          const glyph = getGlyph(md.typeGlyph, glyphData);
          drawGlyph(p, glyphData, glyph);
          glyphData.jumped = false;
        } else {
          glyphData.jumped = true;
        }
      },
      dictionary: ({x, y}, glyphData) => {
        const c = md.letter[glyphData.idx];
        
        glyphData.x = x;
        glyphData.y = y;
        if (dictionary[c]) {
          drawGlyph(glyphData, dictionary[c]);
        }
        glyphData.idx++;
      }
    }
  }
  
  function draw() {
      if (!isFinished) {
          push();
          if (md.isIntense) {
              strokeWeight(md.strokeWeight * Math.ceil(2 * x / (windowWidth - marginX)));
              md.factorGlyphSize += 0.4 * Math.ceil(2 * x / (windowWidth - marginX));
          }
          modes[md.mode]({x, y}, glyphData);
          pop();
          
          if (!md.letter[glyphData.idx] || md.letter[glyphData.idx] === '\n') {
              glyphData.idx++;
              isFinished = true;
          }
          if (x >= windowWidth - marginX) {
              x = marginX;
              y += spacingY;
          } else {
              x += spacingX;
          }
      }
      
    //overlay.draw({size: sizes[md.size], addWatermark: false});
  }
  
  function mouseClicked() {
      clear();
      drawPaper(paperData);
      x = marginX;
      y = spacingY * 0.25;
      glyphData.idx = 0;
  }