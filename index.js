const body = document.querySelector("body");
const eye = body.querySelector("#eye");
const pupil = body.querySelector("#pupil");


eye.style.left = document.clientX - 16 + "px";
eye.style.top = document.clientY - 16 + "px";

let x = 0;
let y = 0;

// reveal cursor upon first moving mouse
// AND delete function call
let initialMouseMovement = null;
initialMouseMovement = () => {
    if (eye.classList.contains("hidden")) {
        pupil.classList.remove("hidden")
        eye.classList.remove("hidden");
    }
    document.removeEventListener("mousemove", initialMouseMovement);
    console.log("iniitalMouseMovement()")
}
document.addEventListener("mousemove", initialMouseMovement);

let move = false;

let inFilter = false;
let eyeTrack = true;

document.addEventListener("mousemove", (e) => {

    x = e.clientX;
    y = e.clientY;

    if (eyeTrack) {
        const centerX = x - 16;
        const centerY = y - 8;
        eye.style.left = centerX + "px";
        eye.style.top = centerY + "px";
    }
    pupil.style.left = x - 8 + "px";
    pupil.style.top = y + "px";

    // 32 px 
})


function selectOption(option) {

}

class Option {
    static selected = null;
    static selectedOutput = null;

    constructor(option) {
        this.option = option;
        this.selected = false;
        this.optionType = option.id.slice(0, option.id.indexOf("-"));
        this.trackHover()
        this.trackClick()
    }

    toggleBackground() {
        this.option.querySelector(".background").classList.toggle("hidden")
    }

    toggleBrackets() {
        const before = this.option.querySelector(".before");
        const after = this.option.querySelector(".after");
        before.classList.toggle("hidden")
        after.classList.toggle("hidden")
    }

    deselect() {
        console.log("deselect()")
        this.selected = false;
    }

    trackClick() {
        this.option.addEventListener("click", () => {
            if (!this.selected && Option.selected) {
                // another filter-option already selected
                // reset state of selected option
                Option.selected.toggleBackground()
                Option.selected.toggleBrackets()
                if (Option.selectedOutput) {
                    Option.selectedOutput.classList.toggle("hidden")
                }

                // removes unselects the selected option
                Option.selected.deselect()
                Option.selected = null;
            }

            // select current option
            if (!this.selected && !Option.selected) {
                // changed from isSelected = !isSelected;
                this.selected = true;
                Option.selected = this;
                this.toggleBackground()
                Option.selectedOutput = document.querySelector(`#filter-output-${this.optionType}`);

                // debugging purposes
                if (Option.selectedOutput) {
                    Option.selectedOutput.classList.toggle("hidden")
                }
            }
        })
    }

    select() {
        const click = new MouseEvent("click");
        const hover = new MouseEvent("mouseenter");
        this.option.dispatchEvent(hover)
        this.option.dispatchEvent(click)
    }


    trackHover() {
        this.option.addEventListener("mouseenter", () => {
            if (!this.selected) {
                this.toggleBrackets()
            }
        })
        this.option.addEventListener("mouseleave", () => {
            if (!this.selected) {
                this.toggleBrackets()
            }
        })
    }
}

let options = { "screen": null, "location": null, "gang": null, "time": null };
body.querySelectorAll(".filter-option").forEach((option) => {
    let temp = new Option(option);
    options[temp.optionType] = temp;
})

options["gang"].select()


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
        eye.style.opacity = 0;
        pupil.style.background = "unset";
        // cursor.classList.toggle("hidden")
        inFilter = true;
    }
})
filter.addEventListener("mouseleave", e => {
    if (inFilter) {
        eye.style.opacity = 1;
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

const images = body.querySelector("#images");
const imagesDimmer = body.querySelector("#images-dimmer");
let currentImage = null;

const imageActions = body.querySelector("#image-actions");
let imageActionsOpen = false;

imageActions.addEventListener("mouseenter", e=>{
    console.log(imageActionsOpen)
    imageActionsOpen = true;
})
imageActions.addEventListener("mouseleave", e=>{
    imageActionsOpen = false;
    imageActions.classList.toggle("hidden")

    const click = new MouseEvent("click");
    currentImage.dispatchEvent(click)
})

images.querySelectorAll("img").forEach(image => {
    let clicked = false;
    image.addEventListener("click", e=>{
        clicked = !clicked;
        if (clicked) {
            currentImage = image;

            imageActions.classList.toggle("hidden")
            imageActionsOpen = true;
            imageActions.style.top = (e.clientY-16) + "px";
            // center of eye (horizontally) 
            imageActions.style.left = (e.clientX - (imageActions.clientWidth / 2)) + "px";

            pupil.style.background = "none";
            eyeTrack = false;
            eye.style.background = "black";

            if (!blinked) {
                blink()
            }
            // pupil.classList.remove("indicate")
        } else {
            currentImage = null;
            eyeTrack = true;
            eye.style.background = "";
            pupil.style.background = "";
            // pupil.classList.add("indicate")
        }
    })
    image.addEventListener("mouseenter", e=>{
        // pupil.classList.toggle("indicate")
    })
    image.addEventListener("mouseleave", e=>{
        if (!clicked) {
            // pupil.classList.toggle("indicate")
        }
        if (clicked && !imageActionsOpen) {
            console.log("left")
            eyeTrack = true;
            pupil.style.background = "";
            eye.style.background = "";
            // pupil.classList.add("indicate")

            imageActions.classList.toggle("hidden")
        }
    })
})
imageActions.querySelectorAll(".image-action").forEach(action=>{
    action.addEventListener("mouseenter", e=>{
        console.log(action.innerText)
        action.innerText = "[" + action.innerText + "]";
    })
    action.addEventListener("mouseleave", e=>{
        action.innerText = action.innerText.slice(1, action.innerText.length-1);
    })

    action.addEventListener("click", e=>{
        // TODO RESET BACKGROUND COLOR UPON LEAVING #IMAGE-ACTIONS
        action.style.background = "var(--white)";
    })
})

let rotating = true;
filterButton.addEventListener("click", () => {
    if (rotating) {
        stopRotateBorderColors();
        rotating = false;
    } else {
        rotateBorderColors();
        rotating = true;
    }
    imagesDimmer.classList.toggle("hidden")
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

/*
mousemove, click for mouse only interaction
pointer events for touch and mouse interaction!
*/

let dragging = false;
let startX = null;
filterOutput.addEventListener("pointerdown", e=>{
    if (!dragging) {
        pupil.style.background = "white";
        dragging = true;
        startX = e.clientX;
    }
})
filterOutput.addEventListener("pointermove", e=>{
    if (dragging) {
        let move = (e.clientX - startX);
        let scroll = filterOutput.scrollLeft - move;

        // scroll = Math.max(0, Math.min(scroll, filterOutput.scrollWidth - filterOutput.clientWidth));

        filterOutput.scrollTo(scroll, 0)

        // for smoother scrolling 
        startX = e.clientX;
    }
})
document.addEventListener("pointerup", e=>{
    if(dragging) {
        pupil.style.background = "";
        dragging = false;
    }
})
filterOutput.addEventListener("pointerleave", e=>{
    console.log("left")
    if (dragging) {
        pupil.style.background = "";
        dragging = false;
    }
})

const gangs = filterOutput.querySelectorAll(".gang");

gangs.forEach(gang => {
    const logo = gang.querySelector(".gang-logo");
    const dimmer = gang.querySelector(".gang-dimmer");
    const background = gang.querySelector(".gang-background");
    let clicked = false;

    gang.addEventListener("mouseenter", e=>{
        if (!clicked) {
            logo.style.filter = "grayscale(0) drop-shadow(0 0 .5em black)";
            background.style.filter = "grayscale(0)";
            pupil.classList.add("indicate")
        }
    })
    gang.addEventListener("mouseleave", e=>{
        if (!clicked) {
            logo.style.filter = "";
            background.style.filter = "";
        }
        pupil.classList.remove("indicate")
    })
    gang.addEventListener("click", e=>{
        clicked = !clicked;

        if (clicked) {
            pupil.classList.remove("indicate")
            if (!gang.id) {
                logo.style.width = "4em";
            } else {
                logo.style.width = "5em";
            }
            dimmer.style.opacity = ".4";
        } else {
            dimmer.style.opacity = "";
            logo.style.width = "";
        }
    })
})
