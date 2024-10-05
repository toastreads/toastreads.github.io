let maxConfettis = 150;
let particleSize = 0.5


fidgetSpinner = document.querySelector("#fidget-spinner")
phenaSpinner = document.querySelector("#phena-spinner")
fidgetPhenaSwitchButton = document.querySelector("#fidget-phena-switch-button")

new Propeller(fidgetSpinner, {
    inertia: 0.9999, speed: 0,
    angle: 0, onRotate: function(){ 
        //console.log(this.speed)
        if(Math.abs(this.speed)>20){
            document.querySelector("#canvas").classList.remove("hideElement")
            maxConfettis = Math.min(Math.abs(this.speed), 150)
            particleSize = Math.abs(this.speed/30)
        } else {
            document.querySelector("#canvas").classList.add("hideElement")
            
        }
        
    }
});

new Propeller(phenaSpinner, {
    inertia: 0.9999, speed: 0, step: 29,
    angle: 0
});

fidgetPhenaSwitchButton.addEventListener("click", () => {
    if (phenaSpinner.classList.contains("hideElement")) {
        phenaSpinner.classList.remove("hideElement")
        fidgetSpinner.classList.add("hideElement")
        document.querySelector("#canvas").classList.add("hideElement")
    } else {
        phenaSpinner.classList.add("hideElement")
        fidgetSpinner.classList.remove("hideElement")
        
    }
})





//confetti
let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const particles = [];

const possibleColors = [
  "DodgerBlue",
  "OliveDrab",
  "Gold",
  "Pink",
  "SlateBlue",
  "LightBlue",
  "Gold",
  "Violet",
  "PaleGreen",
  "SteelBlue",
  "SandyBrown",
  "Chocolate",
  "Crimson"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W; // x
  this.y = Math.random() * H - H; // y
  this.r = randomFromTo(11, 33); // radius
  this.d = Math.random() * maxConfettis + 11;
  this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function() {
    context.beginPath();
    context.lineWidth = this.r * particleSize;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return context.stroke();
  };
}

function Draw() {
  const results = [];

  // Magical recursive functional love
  requestAnimationFrame(Draw);

  context.clearRect(0, 0, W, window.innerHeight);

  for (var i = 0; i < maxConfettis; i++) {
    results.push(particles[i].draw());
  }

  let particle = {};
  let remainingFlakes = 0;
  for (var i = 0; i < maxConfettis; i++) {
    particle = particles[i];

    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

    if (particle.y <= H) remainingFlakes++;

    // If a confetti has fluttered out of view,
    // bring it back to above the viewport and let if re-fall.
    if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
      particle.x = Math.random() * W;
      particle.y = -30;
      particle.tilt = Math.floor(Math.random() * 10) - 20;
    }
  }

  return results;
}

window.addEventListener(
  "resize",
  function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle());
}

// Initialize
canvas.width = W;
canvas.height = H;
Draw();
