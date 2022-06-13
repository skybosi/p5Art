(function () {
    const CODE_VALUE_KEY = "code_value_key";

    const defaultValue = {
        css: `html, body {
        margin: 0;
        padding: 0;
    }
    
    canvas {
        display: block;
    }`,
        js: `/*
      function setup() {
          createCanvas(windowWidth, windowHeight);
      }
      
      function draw() {
          background(0, 32, 0);
          ellipse(mouseX, mouseY, 40, 40);
      }
      */
      let boxSz = 250;
      let numSpheres = 300;
      let x = [];
      let y = [];
      let z = [];
      let t = 0.0;
      function setup() {
          createCanvas(windowWidth, windowHeight, WEBGL);
          colorMode(HSB, 360, 100, 100, 100);
          for (let i = 0; i < numSpheres; i++) {
              x[i] = random(-boxSz, boxSz);
              y[i] = random(-boxSz, boxSz);
              z[i] = random(-boxSz, boxSz);
          }
      }
      function draw() {
          background(300, 50, 20);
          translate(0, 0, -500);
          rotateX(frameCount * 0.01);
          rotateY(frameCount * 0.01);
          rotateZ(frameCount * 0.01);
          ambientLight(360, 10, 10);
          directionalLight(150, 90, 95, 0, 0, -1);
          directionalLight(300, 1, 1, 1, 0, 0);
          directionalLight(300, 2, 2, 0, 1, 0);
          directionalLight(20, 100, 95, 0, -1, 0);
          push();
          pointLight(100, 100, 100, 0, 0, 0);
          pop();
          for (let i = 0; i < numSpheres; i++) {
              push();
              translate(x[i], y[i], z[i]);
              specularMaterial(355, 10, 100);
              sphere((boxSz * noise(333) / i), 25);
              pop();
          }
      }
      `,
        html: `<!DOCTYPE html>
      <html>
        <head>
          <script src="js/p5/p5.min.js"></script>
          <script src="js/p5/p5.dom.min.js"></script>
          <script src="js/p5/p5.sound.min.js"></script>
        </head>
        <body>
        </body>
      </html>`,
    };

    const initialValue = getCode();

    function checkFormat (code_tb) {
        for (const key in code_tb) {
            let item = code_tb[key]
            if (typeof item == "string" ||
                !code_tb["type"] ||
                !code_tb["value"]) {
                return false
            }
        }
        return true;
    }

    function clearCode() {
        localStorage.clear();
    }

    function saveCode (fileName, type, value) {
        var code_tb = getCode();
        code_tb[fileName] = { type, value };
        localStorage.setItem(
            CODE_VALUE_KEY,
            JSON.stringify(code_tb)
        );
    }

    function getCode (fileName) {
        var code = localStorage.getItem(
            CODE_VALUE_KEY,
        );
        var code_tb = JSON.parse(code) || {};
        return code_tb[fileName] || code_tb;
    }

    function getCodeType (fileName) {
        return getCode(fileName)["type"] || "";
    }

    function getCodeValue (fileName) {
        return getCode(fileName)["value"] || "";
    }

    function saveEditorCode (fileName, edit) {
        saveCode(fileName, edit.getValue())
    }

    function loadInitialCode () {
        let code_tb = getCode();
        if (Object.keys(code_tb).length > 0) {
            if (checkFormat(code_tb)) {
                return
            } else {
                clearCode();
            }
        }
        const { css, js, js2, html } = defaultValue;
        console.log("code", css, js, html);
        saveCode("index.css", "css", css);
        saveCode("sketch.js", "javascript", js);
        saveCode("index.html", "html", html);
    }

    window.getCode = getCode;
    window.getCodeType = getCodeType;
    window.getCodeValue = getCodeValue;
    window.saveCode = saveCode;
    window.saveEditorCode = saveEditorCode;
    window.loadInitialCode = loadInitialCode;
})();
