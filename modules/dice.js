const dice = {
    img: document.getElementById('dice'),
    display: document.getElementById('display'),
    outcome: 1,
    queue: [],
    masterLock: true,
    angle: 0,

    /* 
        The definition of this requires values that have not been defined in this module and therefore
        the definition shown below is just there to acknowledge it's existence. It will be later overriden
        and properly defined inside the module where it will be used.
    */
    pass: () => {
        return
    },

    // TODO: Set the screen in a way that it shows the dice.queue array using images of the corresponding faces
    updateDisplay: ()=>{
        dice.display.innerHTML = '';
        dice.queue.forEach((outcome)=>{
            dice.display.innerHTML += `<img src="./images/${outcome}.jpg" class="step" alt="step">`;
        });
    },

    /*  
        The roll() function returns a promise. Inside the promise we call a setInterval to increment
        the angle of the dice by 10 degrees every ms inside the setInterval function we have an if block
        that checks if 2 whole rotations have been made and stops the setInterval function and then generates
        a random outcome between 1 and 6 and puts that number on the face of the dice and then resolves the promise
        so that any function waiting for the execution of roll() function can continue
    */
    roll: () => {
        return new Promise((resolve, reject) => {
            dice.angle = 10;
            let tick = setInterval(() => {
                if (dice.angle == 720) {
                    clearInterval(tick);
                    dice.angle = 0;
                    dice.outcome = Math.floor(1 * Math.random()) + 5;
                    dice.img.setAttribute('src', `./images/${dice.outcome}.jpg`)
                    resolve(0);
                }
                dice.img.style.transform = 'rotate(' + dice.angle + 'deg)';
                dice.angle += 10;
            }, 1)
        })
    },

    handleClick: async () => {
        if (dice.masterLock) {
            dice.masterLock = false;
            await dice.roll();
            dice.queue.push(dice.outcome);
            if(dice.outcome == 6){
                if(dice.queue.length == 3){
                    if(dice.queue[2] == 6){
                        dice.queue = [];
                    }
                }
                dice.masterLock = true;
            }
            else{
                dice.pass();
            }
            console.log(dice.queue);
        }
        dice.updateDisplay();
    }
}

// TO BE FIXED: Problem with dice queue system for 3 outcome storage

dice.img.addEventListener('click', dice.handleClick);

export default dice;