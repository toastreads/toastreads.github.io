messageBox = document.querySelector("#message-box");
messageBoxCloseButton = document.querySelector("#message-box-close-button");

bubbleButton = document.querySelector("#bubble-button")

messageBoxCloseButton.addEventListener("click", () => {
    messageBox.classList.add("hideElement")
    bubbleButton.classList.remove("secondary-button-pressed")
})

bubbleButton.addEventListener("click", () => {
    if (messageBox.classList.contains("hideElement")) {
        messageBox.classList.remove("hideElement")
        // bubbleButton.classList.add("secondary-button-pressed")
    } else {
        messageBox.classList.add("hideElement")
        // bubbleButton.classList.remove("secondary-button-pressed")
    }
})