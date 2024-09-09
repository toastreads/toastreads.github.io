

const audioContext = new AudioContext();

const audioElement = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audioElement);

const gainNode = audioContext.createGain();

const pannerOptions = { pan: 0};
const panner = new StereoPannerNode(audioContext, pannerOptions);


track.connect(gainNode).connect(panner).connect(audioContext.destination);



const playButton = document.querySelector("button");

playButton.addEventListener("click", ()=>{
    //check if context is suspended
    if (audioContext.state === "suspended"){
        audioContext.resume();
    }

    //check button stuff

    if (playButton.dataset.playing === "false"){
        audioElement.play();
        playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true"){
        audioElement.pause();
        playButton.dataset.playing = "false";
    }

}, false,);

audioElement.addEventListener("ended", () => {
    playButton.dataset.playing = "false";
}, false,);


const volumeControl = document.querySelector("#volume");
volumeControl.addEventListener("input", ()=> {
    gainNode.gain.value = volumeControl.value;

}, false,);

const pannerControl = document.querySelector("#panner");
pannerControl.addEventListener("input", ()=>{
    panner.pan.value = pannerControl.value;
}, false,)




