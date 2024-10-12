//Brown Noise ->

const brownNoiseAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        let brownNoiseSource;
        let brownNoiseGainNode;
        let brownNoiseFilter;
        let brownNoiseBassBoost;
        let brownNoiseReverb;

        // Generate brown noise
        function createBrownNoise() {
            const bufferSize = 2 * brownNoiseAudioContext.sampleRate;
            const buffer = brownNoiseAudioContext.createBuffer(2, bufferSize, brownNoiseAudioContext.sampleRate);
            const leftChannel = buffer.getChannelData(0);
            const rightChannel = buffer.getChannelData(1);

            let lastOutL = 0.0;
            let lastOutR = 0.0;

            for (let i = 0; i < bufferSize; i++) {
                const whiteL = Math.random() * 2 - 1;
                const whiteR = Math.random() * 2 - 1;

                leftChannel[i] = (lastOutL + (0.02 * whiteL)) / 1.02;
                lastOutL = leftChannel[i];
                leftChannel[i] *= 3.5;

                rightChannel[i] = (lastOutR + (0.02 * whiteR)) / 1.02;
                lastOutR = rightChannel[i];
                rightChannel[i] *= 3.5;
            }

            const brownNoise = brownNoiseAudioContext.createBufferSource();
            brownNoise.buffer = buffer;
            brownNoise.loop = true;
            return brownNoise;
        }

        // Gain node for volume control
        function createBrownNoiseGainNode() {
            const gainNode = brownNoiseAudioContext.createGain();
            gainNode.gain.value = 0;
            return gainNode;
        }

        // Low-pass filter to deepen the sound
        function createBrownNoiseFilter() {
            const filter = brownNoiseAudioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800; // Lower cutoff frequency for deeper sound
            return filter;
        }

        // Bass boost filter for heavy low-end
        function createBrownNoiseBassBoost() {
            const bassBoost = brownNoiseAudioContext.createBiquadFilter();
            bassBoost.type = 'lowshelf';
            bassBoost.frequency.value = 200; // Boost lower frequencies
            bassBoost.gain.value = 18; // Amplify bass frequencies
            return bassBoost;
        }

        // Reverb effect for depth
        function createBrownNoiseReverb() {
            const convolver = brownNoiseAudioContext.createConvolver();
            const reverbGain = brownNoiseAudioContext.createGain();
            reverbGain.gain.value = 0.9; // Deeper reverb

            // Impulse response with a longer decay for a heavier reverb
            const reverbBuffer = brownNoiseAudioContext.createBuffer(2, 3 * brownNoiseAudioContext.sampleRate, brownNoiseAudioContext.sampleRate);
            for (let channel = 0; channel < reverbBuffer.numberOfChannels; channel++) {
                const channelData = reverbBuffer.getChannelData(channel);
                for (let i = 0; i < reverbBuffer.length; i++) {
                    channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbBuffer.length, 2); // Exponential decay for heavy reverb
                }
            }
            convolver.buffer = reverbBuffer;
            return { convolver, reverbGain };
        }

        // Start brown noise with fade-in, bass boost, and reverb
        function startBrownNoiseWithFade() {
            if (!brownNoiseSource) {
                brownNoiseSource = createBrownNoise();
                brownNoiseGainNode = createBrownNoiseGainNode();
                brownNoiseFilter = createBrownNoiseFilter();
                brownNoiseBassBoost = createBrownNoiseBassBoost();
                const { convolver, reverbGain } = createBrownNoiseReverb();
                brownNoiseReverb = { convolver, reverbGain };

                brownNoiseSource.connect(brownNoiseFilter);
                brownNoiseFilter.connect(brownNoiseBassBoost); // Add bass boost after filter
                brownNoiseBassBoost.connect(brownNoiseGainNode);
                brownNoiseGainNode.connect(brownNoiseReverb.convolver);
                brownNoiseReverb.convolver.connect(brownNoiseReverb.reverbGain);
                brownNoiseReverb.reverbGain.connect(brownNoiseAudioContext.destination);

                brownNoiseSource.start(0);
                brownNoiseGainNode.gain.linearRampToValueAtTime(0.6, brownNoiseAudioContext.currentTime + 0.1);
            }
        }

        // Stop brown noise with fade-out
        function stopBrownNoiseWithFade() {
            if (brownNoiseSource) {
                brownNoiseGainNode.gain.linearRampToValueAtTime(0, brownNoiseAudioContext.currentTime + 2);
                setTimeout(() => {
                    brownNoiseSource.stop();
                    brownNoiseSource.disconnect();
                    brownNoiseFilter.disconnect();
                    brownNoiseBassBoost.disconnect();
                    brownNoiseGainNode.disconnect();
                    brownNoiseReverb.convolver.disconnect();
                    brownNoiseReverb.reverbGain.disconnect();
                    brownNoiseSource = null;
                }, 2000);
            }
        }

const noiseButton = document.querySelector("#noise-button");
const noiseButtonLed = document.querySelector("#noise-button-led")
noiseButton.addEventListener("click", () => {
  if (noiseButton.dataset.playing === "false") {
    // Start brown noise (head-centered) with a filter
    startBrownNoiseWithFade()
    noiseButton.dataset.playing = "true";
    noiseButton.classList.add("focus-buttons-active")
    noiseButtonLed.classList.add("focus-button-led-active")
  } else if (noiseButton.dataset.playing === "true") {
    //Stop brown noise
    stopBrownNoiseWithFade()
    noiseButton.dataset.playing = "false";
    noiseButton.classList.remove("focus-buttons-active")
    noiseButtonLed.classList.remove("focus-button-led-active")
  }
});




//noise should sound like this: https://www.youtube.com/watch?v=Q6MemVxEquE


//Binaural set up ->
const waveAudioContext = new AudioContext();
const oscVolume = waveAudioContext.createGain();
oscVolume.gain.value = 0;

var oscLeft, oscRight;
const pannerLeft = new StereoPannerNode(waveAudioContext, { pan: -1 });

const pannerRight = new StereoPannerNode(waveAudioContext, { pan: 1 });

function startOsc() {
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
  oscVolume.gain.linearRampToValueAtTime(1, 1)
}

function stopOsc() {
  oscVolume.gain.linearRampToValueAtTime(0, waveAudioContext.currentTime + 1);
  oscLeft.stop(waveAudioContext.currentTime + 1);
  oscRight.stop(waveAudioContext.currentTime + 1);
}

binauralButton = document.querySelector("#binaural-button");
binauralButtonLed = document.querySelector("#binaural-button-led");
binauralButton.addEventListener("click", () => {
  if (binauralButton.dataset.playing === "false") {
    startOsc();

    binauralButton.dataset.playing = "true";
    binauralButton.classList.add("focus-buttons-active")
    binauralButtonLed.classList.add("focus-button-led-active")
  } else if (binauralButton.dataset.playing === "true") {
    stopOsc();

    binauralButton.dataset.playing = "false";
    binauralButton.classList.remove("focus-buttons-active")
    binauralButtonLed.classList.remove("focus-button-led-active")
  }
});


//Rainfall ->
rainButton = document.querySelector("#rain-button");
rainButton.addEventListener("click", () => {
  snack("Coming Soon")
})



