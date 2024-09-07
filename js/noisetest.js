







//






const noiseAudioContext = new AudioContext();




var bufferSize = 4096;
var whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
whiteNoise.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
}
whiteNoise.connect(noiseAudioContext.destination);



const playButton = document.querySelector("button");

playButton.addEventListener("click", ()=>{
    //check if context is suspended
    if (noiseAudioContext.state === "suspended"){
        noiseAudioContext.resume();
    }

    //check button stuff

    if (playButton.dataset.playing === "false"){
        whiteNoise.play();
        playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true"){
        whiteNoise.pause();
        playButton.dataset.playing = "false";
    }

}, false,);

whiteNoise.addEventListener("ended", () => {
    playButton.dataset.playing = "false";
}, false,);
