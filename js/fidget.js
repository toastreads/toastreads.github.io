new Propeller(document.getElementById('fidget-spinner'), {
    inertia: 0.9999, speed: 0,
    angle: 0
});


// new Propeller(document.getElementById('fidget-spinner'), {
//     inertia: 0.9999, speed: 0, step:50,
//     angle: 0
// });

fidgetPhenaSwitchButton = document.querySelector("#fidget-phena-switch-button")
fidgetPhenaSwitchButton.addEventListener("click", () => {

    new Propeller(document.getElementById('phena-spinner'), {
        inertia: 0.9999, speed: 0, step: 29,
        angle: 0
    });
})