fidgetSpinner = document.querySelector("#fidget-spinner")
phenaSpinner = document.querySelector("#phena-spinner")
fidgetPhenaSwitchButton = document.querySelector("#fidget-phena-switch-button")

new Propeller(fidgetSpinner, {
    inertia: 0.9999, speed: 0,
    angle: 0
});

new Propeller(phenaSpinner, {
    inertia: 0.9999, speed: 0, step: 29,
    angle: 0
});

fidgetPhenaSwitchButton.addEventListener("click", () => {
    if (phenaSpinner.classList.contains("hideElement")) {
        phenaSpinner.classList.remove("hideElement")
        fidgetSpinner.classList.add("hideElement")
    } else {
        phenaSpinner.classList.add("hideElement")
        fidgetSpinner.classList.remove("hideElement")
    }
})