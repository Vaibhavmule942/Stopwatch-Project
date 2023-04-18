const goButton = document.getElementById("go");
const pauseButton = document.getElementById("pause");
const flagButton = document.getElementById("flag");
const stopButton = document.getElementById("stop");

const printTimer = document.getElementById("timer");
const printFlag = document.getElementById("printFlag");

//while mili is the total count of miliseconds, only interrumped when the stop button is pressed, miliseconds will reset everytime mili gets to 100. Milisencods will be used to print the data, while mili will be used in the timer and flag logic of the app.
let mili = 0;
let miliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let count = 0;
let interval;
let flagedTimes = [];

const hideButton = (button) => {
    button.setAttribute("hidden", true);
}

const showButton = (button) => {
    button.removeAttribute("hidden");
}

printTimer.innerText = `0${minutes}:0${seconds}.0${miliseconds}`;

//this function will be used to facilitate showing the timer and part of the flagged times. This mostly helps in managing the zeroes, as they continuosly change whenever values are less than 10.
const cleanLook = (flag,count,tagId) => {
    if (hours > 0) {
        tagId.innerText = `${flag}${count} ${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}.${miliseconds > 9 ? miliseconds : "0" + miliseconds}`;
    } else {
        tagId.innerText = `${flag}${count} ${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}.${miliseconds > 9 ? miliseconds : "0" + miliseconds}`;
    }
}

//main logic for the timer
const timer = () => {
    interval = setInterval(() => {
        mili ++
        miliseconds ++
        if(mili % 100 === 0){
            miliseconds = 0;
            seconds ++
            if(mili % 6000 === 0){
                seconds = 0;
                minutes ++;
                if (minutes > 59){
                    minutes = 0;
                    hours ++;
                }
            }
        }
        cleanLook("","",printTimer);
    }, 10);
    
    hideButton(goButton);
    hideButton(stopButton);
    showButton(pauseButton);
    showButton(flagButton);
}

const pauseTimer = () => {
    clearInterval(interval);
    interval = null;
    
    hideButton(pauseButton);
    hideButton(flagButton);
    showButton(goButton);
    showButton(stopButton);
}

const stopTimer = () => {
    clearInterval(interval);
    interval = null;
    miliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    count = 0;
    printTimer.innerText = `0${minutes}:0${seconds}.0${miliseconds}`;
    printFlag.innerText = ``;
    flagedTimes = [];
    mili = 0;
    
    hideButton(stopButton);
}

//main logic for the flag option. It's comprised of two parts: The first part which shows the flag number and the time it was flagged; and the second part which shows the difference in time between the new flag and the previous one
const flag = () => {
    count ++;

    //flagedTimes will save the current time whenever a new flag is created
    flagedTimes.push(mili);

    //newParagraph is where the flagged times will be printed whenever a new flag is created
    const newParagraph = document.createElement("p");
    const newDiv = document.createElement("div");
    newDiv.className = "new-div";
    newParagraph.className = "new-input";
    newDiv.appendChild(newParagraph);
    printFlag.insertAdjacentElement('afterbegin',newDiv);
    cleanLook('🚩',count + ':',newParagraph);
    
    //newSpan is where the difference between flagedTimes and timer will be printed whenever a new flag is created
    const newSpan = document.createElement("span");
    newSpan.className = "new-input new-span";
    newDiv.appendChild(newSpan);
    
    //the logic behind calculating and showing the time difference between a new flag and a previous one. This was the hardest part to make, as there are many subtle changes to account for when calculating and showing flag differences.
    const timeDifference = () => {
        let x;
        let secondsDifference;
        let z;
        let minutesDifference;
        let hoursDifference = 0;

        const substract = flagedTimes[flagedTimes.length - 1] - flagedTimes[flagedTimes.length - 2];
        z = Number(Math.floor(substract)/100);

        if(flagedTimes.length > 1){
            newSpan.innerText = `+ 00:${z < 10 ? "0" + z : z}${Number.isInteger(z) ? ".0" : ""}${substract % 10 ? "" : "0"}`;
        }

        if (z > 60) {
            x = Math.floor(z/10)*10;
            secondsDifference = Number((z - x).toFixed(2));
            minutesDifference = Math.floor(x / 60);
            minutesDifference > 59 ? hoursDifference += minutesDifference : "";
            
            newSpan.innerText = `+ ${hoursDifference > 0 && hoursDifference < 10 ? "0" + hoursDifference : hoursDifference > 9 ? hoursDifference : ""}${minutesDifference < 10 ? "0" + minutesDifference : minutesDifference}:${secondsDifference < 10 ? "0" + secondsDifference : secondsDifference}${Number.isInteger(z) ? ".0" : ""}${substract % 10 ? "" : "0"}`;
            
            console.log(hoursDifference)
        }
    };
    timeDifference();
}

goButton.addEventListener("click", timer);
pauseButton.addEventListener("click", pauseTimer);
flagButton.addEventListener("click", flag);
stopButton.addEventListener("click", stopTimer);