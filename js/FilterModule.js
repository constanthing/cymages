/*
FILTER EVENT LISTENERS
*/
filter.addEventListener("mouseenter", e => {
    // hides eye makes pupil background see through
    eye.setOpacity(0)
    pupil.setBackground("none")
})
filter.addEventListener("mouseleave", e => {
    // removes modifications to style done in mouseenter event 
    eye.setOpacity()
    pupil.setBackground()
})

/*
FILTER BUTTON
*/
const filterButton = body.querySelector("#filter-button");
// TEMPORARY solution to adjusting dimmer height
let rotating = true;
filterButton.addEventListener("click", () => {
    if (rotating) {
        stopRotateBorderColors();
        rotating = false;
        galleryScroll.negative.style.zIndex = 0;
    } else {
        rotateBorderColors();
        rotating = true;
        galleryScroll.negative.style.zIndex = "";
    }
    galleryDimmer.classList.toggle("hidden")
    filter.classList.toggle("hidden")

    filterOutputScroll.revealScroll()
    // revealScroll(left, right, filterOutput)
})
let rotateAbortController = new AbortController();
let rotateSignal = rotateAbortController.signal;
let rotateAbort = null;
let rotateTimeout = null;
// if changing color order in css -- change this
let colors = ["feeling", "location", "gang", "time"];
async function rotateBorderColors() {
    while (true) {
        // maybe just use an index and go from there instead of making
        // a whole new array ?
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
function stopRotateBorderColors() {
    rotateAbortController.abort();
    // resetting variables
    rotateAbortController = new AbortController();
    rotateSignal = rotateAbortController.signal;
    rotateAbort = null;
}
rotateBorderColors()


/*
FILTER OUTPUT
*/
const filterOutput = body.querySelector("#filter-output");
/*
mousemove, click for mouse only interaction
pointer events for touch and mouse interaction!
*/



// SCROLL 
const filterOutputScroll = new Scroll(false, filterOutput, document.querySelector("#filter-scroll"));


/*
FILTER OPTIONS
*/
let options = { "feeling": null, "location": null, "gang": null, "time": null };
// 1. creating an object out of each filter option
// 2. assigning object to relative key in options dict.
filter.querySelectorAll(".filter-option").forEach((option) => {
    let optionObj = new Option(option);
    options[optionObj.type] = optionObj;
})

/*
FILTER GANGS
*/
/*
FILTER ACTION/RESET BUTTONS
*/
// const filterApply = filter.querySelector("#filter-apply");
const filterReset = filter.querySelector("#filter-reset");

// filterApply.addEventListener("click", e=>{
//     // add filters of currently selected option to localStorage
//     // empty = null
//     // let optionFilters = JSON.parse(localStorage.getItem(`${Option.type}Filters`));
//     localStorage.setItem(`${Option.selected.type}Filters`, JSON.stringify(Option.selected.filters))
// })
let resetting = false;
filterReset.addEventListener("click", e => {
    Option.selected.reset()
})




const click = new MouseEvent("click");
options.gang.option.dispatchEvent(click)
// options.gang.select()






// revealScroll(up, down, gallery, false)