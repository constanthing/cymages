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
    } else {
        rotateBorderColors();
        rotating = true;
    }
    galleryDimmer.classList.toggle("hidden")
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
let dragging = false;
let startX = null;
filterOutput.addEventListener("pointerdown", e => {
    if (!dragging) {
        pupil.setBackground("var(--white)")
        // pupil.style.background = "white";
        dragging = true;
        startX = e.clientX;
    }
})
filterOutput.addEventListener("pointermove", e => {
    if (dragging) {
        let move = (e.clientX - startX);
        let scroll = filterOutput.scrollLeft - move;

        // scroll = Math.max(0, Math.min(scroll, filterOutput.scrollWidth - filterOutput.clientWidth));

        filterOutput.scrollTo(scroll, 0)

        // for smoother scrolling 
        startX = e.clientX;
    }
})

filterOutput.addEventListener("pointerleave", e => {
    console.log("left")
    if (dragging) {
        pupil.setBackground()
        // pupil.style.background = "";
        dragging = false;
    }
})



/*
FILTER OPTIONS
*/
let options = { "screen": null, "location": null, "gang": null, "time": null };
// 1. creating an object out of each filter option
// 2. assigning object to relative key in options dict.
filter.querySelectorAll(".filter-option").forEach((option) => {
    let optionObj = new Option(option);
    options[optionObj.type] = optionObj;
})
options.gang.select()

/*
FILTER GANGS
*/
const gangs = filterOutput.querySelectorAll(".gang");
gangs.forEach(gang => {
    const logo = gang.querySelector(".gang-logo");
    const dimmer = gang.querySelector(".gang-dimmer");
    const background = gang.querySelector(".gang-background");
    const gangIndex = gang.dataset.index;
    let clicked = false;

    gang.addEventListener("mouseenter", e => {
        if (!clicked || Option.selected.loadingFilters) {
            logo.style.filter = "grayscale(0) drop-shadow(0 0 .5em black)";
            background.style.filter = "grayscale(0)";
            pupil.addClass("indicate")
            // pupil.classList.add("indicate")
        }
    })
    gang.addEventListener("mouseleave", e => {
        if (!clicked) {
            logo.style.filter = "";
            background.style.filter = "";
        }
        pupil.removeClass("indicate")
        // pupil.classList.remove("indicate")
    })
    gang.addEventListener("click", e => {
        clicked = !clicked;

        if (clicked) {
            if (!Option.selected.loadingFilters) {
                // add this gang to filter
                Option.selected.filters.push(gangIndex)
            }

            pupil.removeClass("indicate")
            // pupil.classList.remove("indicate")
            if (!gang.id) {
                logo.style.width = "4em";
            } else {
                logo.style.width = "5em";
            }
            dimmer.style.opacity = ".4";
        } else {
            // remove this gang from filter 
            if (!resetting) {
                Option.selected.filters.splice(Option.selected.filters.findIndex(e=>e==gangIndex), 1)
            }

            dimmer.style.opacity = "";
            logo.style.width = "";
        }

        if (!resetting && !Option.selected.loadingFilters) {
            localStorage.setItem("gangFilters", JSON.stringify(Option.selected.filters))
            console.log(localStorage.getItem("gangFilters"))
        }
    })
})




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
    const click = new MouseEvent("click");
    const mouseLeave = new MouseEvent("mouseleave");
    resetting = true;
    for (const filter of Option.selected.filters) {
        let t = document.querySelector(`.${Option.selected.type}[data-index="${filter}"]`);
        t.dispatchEvent(click)
        t.dispatchEvent(mouseLeave)
    }
    Option.selected.filters = [];
    localStorage.setItem(`${Option.selected.type}Filters`, JSON.stringify([]))

    resetting = false;
})


// probably add document.onload

// selecting gang by default for testing purposes
options.gang.loadFilters()
