messageBox = document.querySelector("#message-box");
messageBoxCloseButton = document.querySelector("#message-box-close-button");

bubbleButton = document.querySelector("#bubble-button")

messageBoxCloseButton.addEventListener("click", () => {
    messageBox.classList.add("hideElement")
})

bubbleButton.addEventListener("click", () => {
    messageBox.classList.remove("hideElement")
})