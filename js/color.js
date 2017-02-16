/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

var c, d, ctx, dtx, loop, sourceCanvas, sourceHSV = [], testHSV, width = window.innerWidth, height = window.innerHeight, sourceWidth = 50, sourceHeight = 50, img = new Image(sourceWidth, sourceHeight);
img.src = "images/01.jpg";
img.crossOrigin = "Anonymous";
	
function RGBtoHSV(r, g, b) {
    "use strict";
    if (arguments.length === 1) {
        g = r.g;
        b = r.b;
        r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
    case min:
        h = 0;
        break;
    case r:
        h = (g - b) + d * (g < b ? 6 : 0);
        h /= 6 * d;
        break;
    case g:
        h = (b - r) + d * 2;
        h /= 6 * d;
        break;
    case b:
        h = (r - g) + d * 4;
        h /= 6 * d;
        break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}
function storeColors() {
    "use strict";
    var count = 0, pixelRGB, pixelData, HSV, i;
    pixelRGB = sourceCanvas.getContext('2d').getImageData(0, 0, sourceWidth, sourceHeight);
    pixelData = pixelRGB.data;
    for (i = 0; i < pixelData.length; i += 4) {
        HSV = new RGBtoHSV(pixelData[i], pixelData[i + 1], pixelData[i + 2]);
        sourceHSV[count] = [];
        sourceHSV[count][0] = HSV.h;
        sourceHSV[count][1] = HSV.s;
        sourceHSV[count][2] = HSV.v;
        count += 1;
    }
    console.log(sourceHSV);
    testHSV = sourceHSV;
}

function getColors() {
    "use strict";
}
function testSimilarColors() {
    "use strict";
}
function sortFunction(a, b) {
    "use strict";
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}
function sortArray() {
    "use strict";
    sourceHSV.sort(sortFunction);
}
function drawRings() {
    "use strict";
}
function status() {
    "use strict";
}
function draw() {
    "use strict";
    sortArray();
    drawRings();
    status();
    loop = setTimeout(draw, 1000 / 50);
}
function initialize() {
    "use strict";
    c = document.getElementById("colorWheel");
    ctx = c.getContext("2d");
    ctx.width = width;
    ctx.height = height;
    sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = sourceWidth;
    sourceCanvas.height = sourceHeight;
    sourceCanvas.getContext('2d').drawImage(img, 0, 0, sourceWidth, sourceHeight);
    storeColors();
    draw();
}
	
window.onload = initialize;