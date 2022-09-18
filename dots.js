let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("Canvas"));
let ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

canvas.width = 1920;
canvas.height = 1080;

ctx.fillStyle = "#BB0055";

let mouseX = 0;
let mouseY = 0;
canvas.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})

// pexels fetch wrapper
let pexelsAPIkey = "563492ad6f91700001000001b905f16850294380a98c90d2650c4e86";
function createFetchWrapperPexels(apiKey, type) {

    const _requestSettings = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Pexels/JavaScript",
            Authorization: apiKey,
        },
    };

    const pexelsBaseUrls = {
        photo: "https://api.pexels.com/v1/",
        video: "https://api.pexels.com/videos/",
        collections: "https://api.pexels.com/v1/collections/",
    };

    let baseUrl = pexelsBaseUrls[type]
    return (path, params) => {
        fetch(`${baseUrl}${path}?${stringifyParams(params || {})}`, _requestSettings).then(
            (response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            }
        );
    }

    function stringifyParams(params) {
        return Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join("&");
    }
}
createFetchWrapperPexels(pexelsAPIkey, "collections")

// end Pexels

let time = 0.9;
let yoff = 0.00;
function draw() {

    // RESET
    ctx.clearRect(0, 0, 1920, 1080);
    let gradient = ctx.createLinearGradient(0, 0, 640, 480)
    gradient.addColorStop(0, "blue")
    gradient.addColorStop(1, "black")
    ctx.fillStyle = gradient;
    // ctx.fillStyle = "crimson";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();



    // DRAW CIRCLES
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            const radius = 10;
            const maxDistance = 91;
            let x = 20 * i + radius;
            let y = 20 * j + radius;
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

            // ctx.fillStyle = i % 2 === 0 ? j % 2 === 0 ? "blue" : "red": "white";
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
                let val = parseInt(m.sin(distanceRatio) * 20 + 70);
                // ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, " + val + "%)"; // colorful
                // let broj = clamp0((-1 / i) + (sinrad(Math.pow(i+1, 2))) - 1 - 
                // (   Math.pow(cos(x) + cos(time/10), 2) - 1 + 
                //     Math.pow(sin(y) + sin(time/10), 2) - 1), 1)
                ctx.fillStyle = `hsl(${hue + 180*m.sinrad(time*x)}, ${sat}%, ${val}%)`;
                ctx.fillStyle = "white"
                // ctx.strokeStyle = "white"
                // let _radius = 2.5 * radius / 3 + radius / 6 * (Math.sin(time * 2 * Math.PI / 360))
                // _radius = radius + (cosrad(i)+sinrad(j)-2) * distanceRatioUncapped;

                // _radius = 
                //     clamp0(radius + broj, radius)

                let _radius = radius
                ctx.ellipse(
                    (x + m.cosrad(x) * 3 - 3 + m.cosrad(y) - 1),
                    (y + m.sinrad(y) * 3 - 3 + m.sinrad(y) - 1),
                    Math.max(_radius * distanceRatio, radius * 3 / 5),
                    Math.max(_radius * distanceRatio, radius * 3 / 5),
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
            // ctx.strokeStyle = "#FFF"
            // ctx.stroke();
        }
    }
    
    // Shadow
    time += .01;
    yoff += .1;
}

setInterval(draw, 1000 / 60)