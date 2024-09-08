

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
  noise.context.resume();
  if (noiseButton.dataset.playing === "false") {
    noise.start();
    noiseButton.dataset.playing = "true";
  } else if (noiseButton.dataset.playing === "true") {
    noise.stop(2);
    noiseButton.dataset.playing = "false";
  }
})




//noise should sound like this: https://www.youtube.com/watch?v=Q6MemVxEquE