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

    if (document.elementsFromPoint(x, y).findIndex((e)=>e==filter) != -1) {
        // move cursor, pupil into filter
        if (!inFilter) {
            cursor.style.display = "none";
            inFilter= true;
        }
    } else {
        if (inFilter) {
            cursor.style.display = "unset";
            inFilter = false;
        }
    }


    const centerX = x - 16;
    const centerY = y - 8;
    cursor.style.left = centerX + "px";
    cursor.style.top = centerY + "px";

    pupil.style.left = x - 8 + "px";
    pupil.style.top = y + "px";

    // 32 px 
})


const filterOptions = body.querySelectorAll(".filter-option");
function filterOptionBrackets(option) {
    const before = option.querySelector(".before");
    const after = option.querySelector(".after");
    before.classList.toggle("hidden");
    after.classList.toggle("hidden");
} 

filterOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
        filterOptionBrackets(option)
    })
    option.addEventListener("mouseleave", () => {
        filterOptionBrackets(option)

    })
    option.addEventListener("click", () => {
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
async function rotateBorderColors() {
    let colors = ["screen", "location", "gang", "time"];
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


document.addEventListener("click", (e) => {

    for (const element of document.elementsFromPoint(e.clientX, e.clientY)) {
        switch (element) {
            // could check for main element but idk too lazy ?
            case body:
                return;
            case filterButton:
                let buttonClick = new MouseEvent("click");
                filterButton.dispatchEvent(buttonClick)
                return;
            default:
                console.log(element)
                break;
        }
    }
})