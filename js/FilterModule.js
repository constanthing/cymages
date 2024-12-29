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

/*
* SCROLL
*/
const filterOutputScroll = new Scroll(false, body.querySelector("#filter-output"), body.querySelector("#filter-scroll"));


/*
FILTER OPTIONS
*/
// 1. creating an object out of each filter option
// 2. assigning object to relative key in options dict.
const filterList = document.querySelector("#filter-list");
let previousFilterLabel = undefined;
let previousFilterOutput = undefined; 
filterList.addEventListener("input", (e)=>{
    const output = document.querySelector(`#filter-output-${e.target.id}`);
    output.classList.remove("hidden")

    // hide previous output/unclick label (style)
    if (previousFilterLabel) {
        previousFilterLabel.classList.remove("clicked")
        previousFilterLabel.classList.add("clickable")
        previousFilterOutput.classList.add("hidden")
        // document.querySelector(`#filter-output-${previousFilterLabel.getAttribute("for")}`).classList.add("hidden")
    }

    // click (style) selected label
    const label = e.target.nextElementSibling;
    label.classList.remove("clickable")
    label.classList.add("clicked")

    previousFilterLabel = label;
    previousFilterOutput = output;
})
document.querySelector("#gang").dispatchEvent(new MouseEvent("click"))


/*
FILTER GANGS
*/
/*
FILTER ACTION/RESET BUTTONS
*/
// const filterApply = filter.querySelector("#filter-apply");


// for filter output option css
function selectOutputOption(element) {
    element.classList.toggle("output-option-selected")
}