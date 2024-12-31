/*
FILTER EVENT LISTENERS
*/
filter.addEventListener("mouseenter", e => {
    // hides eye makes pupil background see through
})
filter.addEventListener("mouseleave", e => {
    // removes modifications to style done in mouseenter event 
})

/*
FILTER BUTTON
*/
const filterButton = document.querySelector("#filter-button");
// TEMPORARY solution to adjusting dimmer height
let rotating = true;
filterButton.addEventListener("click", () => {
    if (rotating) {
        stopRotateBorderColors();
        rotating = false;
        galleryScroll.negative.style.zIndex = 0;
        document.querySelector("header").style.paddingBottom = "0";
    } else {
        rotateBorderColors();
        rotating = true;
        galleryScroll.negative.style.zIndex = "";
        document.querySelector("header").style.paddingBottom = "";
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
const filterOutputScroll = new Scroll(false, document.querySelector("#filter-output"), document.querySelector("#filter-scroll"));


/*
FILTER OPTIONS
*/
// 1. creating an object out of each filter option
// 2. assigning object to relative key in options dict.
const filterList = document.querySelector("#filter-list");

let previousFilterOutput = undefined;
let filterCategory = undefined;

radioGroupFunctionality(filterList)
filterList.addEventListener("input", e=>{
    filterCategory = e.target.id;
    const output = document.querySelector(`#filter-output-${filterCategory}`);
    output.classList.remove("hidden")
    if (previousFilterOutput) {
        previousFilterOutput.classList.add("hidden")
    }
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
    // if selected deselect it
    let currentStorage = JSON.parse(window.localStorage.getItem(`${filterCategory}Filters`));
    if (element.classList.contains("output-option-selected")) {
        // remove it from local storage
        currentStorage.splice(currentStorage.findIndex(e => e == element.dataset.index), 1)
    } else {
        // add it to local storage
        currentStorage.push(element.dataset.index)
    }

    window.localStorage.setItem(`${filterCategory}Filters`, JSON.stringify(currentStorage))

    element.classList.toggle("output-option-selected")
}


// on document load ... load the local storage filters
document.querySelectorAll("#filter-list label").forEach(option => {
    let type = option.getAttribute("for");
    try {
        for (const item of JSON.parse(window.localStorage.getItem(`${type}Filters`))) {
            let el = document.querySelector(`.${type}[data-index="${item}"]`);
            el.classList.toggle("output-option-selected")
        }
    } catch (error) {
        window.localStorage.setItem(`${type}Filters`, JSON.stringify([]))
    }
})

function resetFilters(all = true) {
    // CAREFUL! Since same host name on 222dof... when user runs resetFilters()
    // it clears any data of the same origin! 
    // localStorage.clear()

    let filtersToReset = undefined;
    if (all) {
        // every filter
        filtersToReset = document.querySelectorAll("#filter-list label");
    } else {
        // current filter, get clicked radio button label (has filter type (for attr))
        filtersToReset = [document.querySelector("#filter-list .clicked")];
    }

    for (let label of filtersToReset) {
        const _for = label.getAttribute("for");
        label = _for + "Filters";
        let storage = JSON.parse(window.localStorage.getItem(label));
        console.log(storage)
        if (storage) {
            // updating styles on selected option outputs to deselected
            for (const filter of storage) {
                document.querySelector(`.${_for}[data-index="${filter}"]`).classList.remove("output-option-selected")
            }
            window.localStorage.setItem(label, JSON.stringify([]))
        }
    }
}