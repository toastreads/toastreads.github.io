

const eq = new Tone.EQ3(0,0,-20).toDestination()
const filter = new Tone.Filter(2000, "lowpass").toDestination();
const delay = new Tone.Delay(0.4).toDestination();
const chorus = new Tone.Chorus(4, 0.5, 0.5).toDestination();

const noise = new Tone.Noise().connect(delay).connect(chorus).connect(eq).connect(filter).toDestination()

noise.type = "brown";
noise.volume.value = -12
noise.fadeIn = 2
noise.fadeOut = 0.5

const noiseButton = document.querySelector("#noise-button");
noiseButton.addEventListener("click", () => {
  if (noiseButton.dataset.playing === "false") {
    noise.start();
    noiseButton.dataset.playing = "true";
    noiseButton.classList.add("focus-buttons-active")
  } else if (noiseButton.dataset.playing === "true") {
    noise.stop();
    noiseButton.dataset.playing = "false";
    noiseButton.classList.remove("focus-buttons-active")
  }
});




//noise should sound like this: https://www.youtube.com/watch?v=Q6MemVxEquE


//Binaural set up
const waveAudioContext = new AudioContext();
const oscVolume = waveAudioContext.createGain();
oscVolume.gain.value = 0;

var oscLeft, oscRight;
const pannerLeft = new StereoPannerNode(waveAudioContext, {pan:-1});

const pannerRight = new StereoPannerNode(waveAudioContext, {pan:1});

function startOsc(){
  oscLeft = new OscillatorNode(waveAudioContext, {
    type: "sine",
    frequency: 50,
  });
  oscRight = new OscillatorNode(waveAudioContext, {
    type: "sine",
    frequency: 58,
  });

  oscLeft.connect(pannerLeft).connect(oscVolume).connect(waveAudioContext.destination);
  oscRight.connect(pannerRight).connect(oscVolume).connect(waveAudioContext.destination);
  
  oscRight.start(waveAudioContext.currentTime)
  oscLeft.start(waveAudioContext.currentTime)
  oscVolume.gain.linearRampToValueAtTime(1,1)
}

function stopOsc() {
  oscVolume.gain.linearRampToValueAtTime(0,waveAudioContext.currentTime+1);
  oscLeft.stop(waveAudioContext.currentTime+1);
  oscRight.stop(waveAudioContext.currentTime+1);
}

binauralButton = document.querySelector("#binaural-button");
binauralButton.addEventListener("click", () => {
  if (binauralButton.dataset.playing === "false") {
    startOsc();
    
    binauralButton.dataset.playing = "true";
    binauralButton.classList.add("focus-buttons-active")
  } else if (binauralButton.dataset.playing === "true") {
    stopOsc();
    
    binauralButton.dataset.playing = "false";
    binauralButton.classList.remove("focus-buttons-active")
  }
});

//Rainfall
rainButton = document.querySelector("#rain-button");
rainButton.addEventListener("click", () => {
  snack("Rainfall-sounds is coming soon")
})