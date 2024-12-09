const body = document.querySelector("body");
const cursor = body.querySelector("#eye");
const pupil = body.querySelector("#pupil");


cursor.style.left = document.clientX - 16 + "px";
cursor.style.top = document.clientY - 16 + "px";

let x = 0;
let y = 0;

// reveal cursor upon first moving mouse
// AND delete function call
let initialMouseMovement = null;
initialMouseMovement = () => {
    if (cursor.classList.contains("hidden")) {
        pupil.classList.remove("hidden")
        cursor.classList.remove("hidden");
    }
    document.removeEventListener("mousemove", initialMouseMovement);
    console.log("iniitalMouseMovement()")
}
document.addEventListener("mousemove", initialMouseMovement);

let move = false;

let inFilter = false;


document.addEventListener("mousemove", (e) => {

    x = e.clientX;
    y = e.clientY;

    const centerX = x - 16;
    const centerY = y - 8;
    cursor.style.left = centerX + "px";
    cursor.style.top = centerY + "px";

    pupil.style.left = x - 8 + "px";
    pupil.style.top = y + "px";

    // 32 px 
})


function selectOption(option) {

}


let selectedOption = null;
let selectedOptionOutput = null;
function toggleOptionBrackets(option) {
    const before = option.querySelector(".before");
    const after = option.querySelector(".after");
    before.classList.toggle("hidden");
    after.classList.toggle("hidden");
}
function toggleOptionBackground(option) {
    option.querySelector(".background").classList.toggle("hidden")
}

let unselectOption = null;

const filterOptions = body.querySelectorAll(".filter-option");
filterOptions.forEach((option) => {
    let isSelected = false;
    const optionType = option.id.slice(0, option.id.indexOf("-"));

    function t() {
        isSelected = false;
    }

    option.addEventListener("mouseenter", () => {
        // show brackets
        if (!isSelected) {
            toggleOptionBrackets(option)
        }


        // modify filter-button border colors
    })
    option.addEventListener("mouseleave", () => {
        // remove brackets
        if (!isSelected) {
            toggleOptionBrackets(option)
        }

    })
    option.addEventListener("click", () => {
        if (!isSelected && selectedOption) {
            // another filter-option already selected
            // make this one the selected one
            toggleOptionBrackets(selectedOption)
            toggleOptionBackground(selectedOption)
            if (selectedOptionOutput) {
                selectedOptionOutput.classList.toggle("hidden")
            }

            // removes unselects the selected option
            unselectOption()
            selectedOption = null;
        }

        // select current option
        if (!isSelected && !selectedOption) {
            // changed from isSelected = !isSelected;
            isSelected = true;
            selectedOption = option;
            unselectOption = t;
            toggleOptionBackground(option)
            selectedOptionOutput = document.querySelector(`#filter-output-${optionType}`);

            // debugging purposes
            if (selectedOptionOutput) {
                selectedOptionOutput.classList.toggle("hidden")
            }
        }
    })
})


let blinked = null;

async function blink() {
    pupil.classList.add("blink")
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("removing .blink")
            pupil.classList.remove("blink")
            blinked = null;
            resolve()
        }, 500)
    })
}

document.addEventListener("mousedown", (e) => {
    if (!blinked) {
        blinked = blink();
    }
})


const filterButton = body.querySelector("#filter-button");
const filter = body.querySelector("#filter");

filter.addEventListener("mouseenter", e => {
    if (!inFilter) {
        cursor.style.opacity = 0;
        pupil.style.background = "unset";
        // cursor.classList.toggle("hidden")
        inFilter = true;
    }
})
filter.addEventListener("mouseleave", e => {
    if (inFilter) {
        cursor.style.opacity = 1;
        pupil.style.background = "";
        // cursor.classList.toggle("hidden")
        inFilter = false;
    }
})

function stopRotateBorderColors() {
    rotateAbortController.abort();
    // resetting variables
    rotateAbortController = new AbortController();
    rotateSignal = rotateAbortController.signal;
    rotateAbort = null;
}

let rotating = true;
filterButton.addEventListener("click", () => {
    if (rotating) {
        stopRotateBorderColors();
        rotating = false;
    } else {
        rotateBorderColors();
        rotating = true;
    }
    filter.classList.toggle("hidden")
})

let rotateAbortController = new AbortController();
let rotateSignal = rotateAbortController.signal;
let rotateAbort = null;

let rotateTimeout = null;
// if changing color order in css -- change this
let colors = ["screen", "location", "gang", "time"];
async function rotateBorderColors() {
    while (true) {
        let newColors = [];
        for (let colorIndex = 0; colorIndex < 4; colorIndex++) {
            let previousColorIndex = colorIndex - 1;
            if (previousColorIndex < 0) {
                previousColorIndex = 3;
            }

            newColors.push(colors[previousColorIndex])
        }

        filterButton.style.borderTopColor = `var(--${newColors[0]})`;
        filterButton.style.borderRightColor = `var(--${newColors[1]})`;
        filterButton.style.borderBottomColor = `var(--${newColors[2]})`;
        filterButton.style.borderLeftColor = `var(--${newColors[3]})`;

        colors = newColors;

        try {
            await new Promise((resolve, reject) => {
                rotateAbort = () => {
                    reject("aborted")
                }

                rotateSignal.addEventListener("abort", rotateAbort)

                rotateTimeout = setTimeout(() => {
                    rotateSignal.removeEventListener("abort", rotateAbort)
                    resolve()
                }, 500)
            })
        } catch (error) {
            clearTimeout(rotateTimeout)
            if (error == "aborted") {
                console.log("ABORTED")
                // end function
                return;
            } else {
                console.error(error)
                return;
            }
        } finally {
            rotateSignal.removeEventListener("abort", rotateAbort)
        }
    }
}

rotateBorderColors()


const filterOutput = document.querySelector("#filter-output");

const gangs = filterOutput.querySelectorAll(".gang");
gangs.forEach(gang => {
    const ribbon = gang.querySelector(".gang-selected");
    const dimmer = gang.querySelector(".gang-dimmer");
    let selected = false;
    gang.addEventListener("click", e => {
        if (selected) {
            ribbon.style.top = "-15%";
            dimmer.style.background = "";
            pupil.classList.add("indicate")
        } else {
            ribbon.style.top = "0";
            pupil.classList.remove("indicate")
            dimmer.style.background = "rgba(0, 0, 0, .48)";
        }
        selected = !selected;
    })
    gang.addEventListener("mouseenter", e => {
        if (!selected) {
            ribbon.style.top = "-15%";
            pupil.classList.add("indicate")
        }
    })
    gang.addEventListener("mouseleave", e => {
        if (!selected) {
            ribbon.style.top = "";
        }
        pupil.classList.remove("indicate")
    })
})