messageBox = document.querySelector("#message-box");
messageBoxCloseButton = document.querySelector("#message-box-close-button");

bubbleButton = document.querySelector("#bubble-button")

messageBoxCloseButton.addEventListener("click", () => {
    messageBox.classList.add("hide-element")
    bubbleButton.classList.remove("secondary-button-pressed")
})

bubbleButton.addEventListener("click", () => {
    if (messageBox.classList.contains("hide-element")) {
        messageBox.classList.remove("hide-element")
        // bubbleButton.classList.add("secondary-button-pressed")
    } else {
        messageBox.classList.add("hide-element")
        // bubbleButton.classList.remove("secondary-button-pressed")
    }
})



hideMemeButton = document.querySelector("#hide-meme-button")
memeContent = document.querySelector("#meme-content")
hideMemeButton.addEventListener("click", () => {
    
    if (memeContent.classList.contains("hide-element")) {
        memeContent.classList.remove("hide-element")
        hideMemeButton.classList.remove("secondary-button-pressed")
    } else {
        memeContent.classList.add("hide-element")
        hideMemeButton.classList.add("secondary-button-pressed")
    }
})
