const $app = document.getElementById('dots-3-app');
$app.innerHTML = `<canvas id="Canvas"></canvas>`

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("Canvas"));
let ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

canvas.width = Math.max(window.innerWidth, window.innerHeight);
canvas.height = Math.max(window.innerWidth, window.innerHeight);

ctx.fillStyle = "#BB0055";

let mouseX = 0;
let mouseY = 0;
canvas.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})

let time = 0.9;
let yoff = 0.00;

window.addEventListener("resize", ()=>{
    canvas.width = Math.max(window.innerWidth, window.innerHeight);
    canvas.height = Math.max(window.innerWidth, window.innerHeight);
})

class RenderingContext {
    RenderingContext(canvas) {

    }

    draw(){

    }

    initGrid(){

    }

    clear() {
        ctx.clearRect(0, 0, )
    }
}

class Dot {
    constructor(x, y) {
        this.x = x
        this.y = y;
        this.defaultRadius = 10;
        this.radius = this.defaultRadius;
        this.color = {r: 0, g: 0, b: 0, a: 1};
    }
}

let maxRowsCols = 29;
let canvasRatio = Math.min(canvas.width / canvas.height, canvas.height / canvas.width)


    

let dots = [];
for(let i = 0; i < maxRowsCols; i++){
    for(let j = 0; j < maxRowsCols; j++){
        // todo: (calculate maxrowscols)
        dots.push(new Dot(i*50, j*50))
    }
}
console.log(dots)

function draw() {
    
    // RESET
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight)
    gradient.addColorStop(0, "black")
    gradient.addColorStop(1, "black")
    ctx.fillStyle = gradient;
    // ctx.fillStyle = "crimson";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    for (let i = 0; i < (Math.floor(maxRowsCols*canvasRatio)); i++) {
        for (let j = 0; j < Math.floor(maxRowsCols*canvasRatio); j++) {
            const radius = (canvas.width/maxRowsCols) / 2;
            let diameter = radius * 2;
            // let x = 20 * i + radius;
            // let y = 20 * j + radius;
            let x = radius + diameter * i;
            let y = radius + diameter * j
            const maxDistance = 156 * Math.max(canvas.height / canvas.width, canvas.width / canvas.height);
            // let distance = Math.sqrt(
            //     Math.pow(Math.abs(mouseX - x - (radius * Math.sign(mouseX - x))), 2) +
            //     Math.pow(Math.abs(mouseY - y - (radius * Math.sign(mouseY - y))), 2)
            // );

            // square
            let distance = Math.max(
                Math.abs(mouseX - x - (radius * Math.sign(mouseX - x))),
                Math.abs(mouseY - y - (radius * Math.sign(mouseY - y)))
                )

            // circle
            distance = Math.sqrt(
                Math.pow(Math.abs(mouseX - x), 2) +
                Math.pow(Math.abs(mouseY - y), 2)
            )

            var offmod = (1 / time);
            let distanceRatioUncapped = distance / maxDistance;
            let distanceRatio = Math.min(distance, maxDistance) / maxDistance;

            class Maths {
                cosrad = (A) => Math.cos(Math.PI * A / 180);
                sinrad = (A) => Math.sin(Math.PI * A / 180);
                sin = (A) => Math.sin(A)
                cos = (A) => Math.cos(A)
                clamp0 = (A, M) => Math.min(Math.max(0, A), M)
                pow2 = (B) => B * B
                sqrt = (B) => Math.sqrt(B)
            }

            let m = new Maths();

            let applyVfx = !(distanceRatioUncapped > 1);
            if (applyVfx) {
                ctx.beginPath();
                let hue = parseInt(distanceRatio * 360);
                let sat = parseInt(distanceRatio * 50+50);
                let val = parseInt(m.sin(distanceRatio) * 20 + 80);
                // ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, " + val + "%)"; // colorful
                // let broj = clamp0((-1 / i) + (sinrad(Math.pow(i+1, 2))) - 1 - 
                // (   Math.pow(cos(x) + cos(time/10), 2) - 1 + 
                //     Math.pow(sin(y) + sin(time/10), 2) - 1), 1)
                ctx.fillStyle = `hsl(${hue + 180*m.sinrad(time*x)}, ${sat}%, ${val}%)`;
                // ctx.fillStyle = "white"
                // ctx.strokeStyle = "white"
                // let _radius = 2.5 * radius / 3 + radius / 6 * (Math.sin(time * 2 * Math.PI / 360))
                // _radius = radius + (cosrad(i)+sinrad(j)-2) * distanceRatioUncapped;

                // _radius = 
                //     clamp0(radius + broj, radius)

                let _radius = Math.max(radius * ( .5 + .5*distanceRatio ), radius * 3/5)
                ctx.ellipse(
                    (x + m.cosrad(x) * 3 - 3 + m.cosrad(y) - 1),
                    (y + m.sinrad(y) * 3 - 3 + m.sinrad(y) - 1),
                    _radius,
                    _radius,
                    0, 0, Math.PI * 2);

                
            } else {
                ctx.beginPath();
                ctx.fillStyle = "white"

                let size = radius;
                ctx.ellipse(
                    x + m.cosrad(x) * 3 - 3 + 1 * m.cosrad(y) - 1,
                    y + m.sinrad(y) * 3 - 3 + 1 * m.sinrad(y) - 1,
                    size, size,
                    0, 0, Math.PI * 2);
            }

            ctx.fill();
        }
    }


    ctx.fillStyle = ("rgb(0, 162, 255)")
    ctx.fillRect(250, 180, 540, 180)
    ctx.strokeStyle = ("white")
    ctx.lineWidth = 3
    ctx.strokeRect(260, 190, 520, 160)
    ctx.fillStyle = "white"
    ctx.fillText("Hello, tasks for today:", 290, 235)

    time += .01;
    yoff += .1;
    return;
}

setInterval(draw, 1000 / 60)