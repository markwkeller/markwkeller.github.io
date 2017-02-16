var c, d, ctx, dtx, rectWidth, mouseX, loop, width = window.innerWidth, height = window.innerHeight, age = 0, rMin = 1, rMax = 4.5, pops = [];

function update() {
    "use strict";
    var i;
    for (i = 0; i < width; i += 1) {
        pops[i] = (rMin + (i / width) * (rMax - rMin)) * pops[i] * (1 - pops[i]);
        ctx.fillRect(i, pops[i] * height, 0.3, 0.3);
    }
    if (age < 200) {
        age += 1;
    }
}

function draw() {
    "use strict";
    update();
    loop = setTimeout(draw, 1000 / (1 + (age)));
}

function mouseDown(event) {
    "use strict";
    var i, rMinOld = rMin, rMaxOld = rMax;
    ctx.clearRect(0, 0, width, height);
    if (event.which === 1) {
        rMin = ((mouseX / width) - 0.15) * (rMaxOld - rMinOld) + rMinOld;
        rMax = ((mouseX / width) + 0.15) * (rMaxOld - rMinOld) + rMinOld;
    } else {
        rMin = ((mouseX / width) - 1.67) * (rMaxOld - rMinOld) + rMinOld;
        rMax = ((mouseX / width) + 1.67) * (rMaxOld - rMinOld) + rMinOld;
    }
    for (i = 0; i < width; i += 1) {
        pops[i] = 0.0001;
    }
}

function mouseMove() {
    "use strict";
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event;
    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
    }
    mouseX = event.pageX;
    dtx.clearRect(0, 0, width, height);
    dtx.strokeRect(mouseX - Math.floor(0.5 * rectWidth) - 0.5, 4.5, rectWidth, height - 7);
}

function init() {
    "use strict";
    var i;
    c = document.getElementById("logistics");
    ctx = c.getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    d = document.getElementById("overlay");
    dtx = d.getContext("2d");
    dtx.canvas.width = width;
    dtx.canvas.height = height;
    dtx.setLineDash([12, 5]);
    dtx.lineWidth = 1;
    rectWidth = Math.floor(0.3 * width);

    for (i = 0; i < width; i += 1) {
        pops[i] = 0.0001;
    }
    draw();

    document.onmousemove = mouseMove;
    document.onmousedown = mouseDown;
    document.oncontextmenu = function () {return false; };
}


window.onload = init;