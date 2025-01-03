const galleryDimmer = document.querySelector("#gallery-dimmer");
const filter = document.querySelector("#filter");


// getting html elements
let eye = document.querySelector("#eye");
let pupil = document.querySelector("#pupil");
// creating objects out of html elements
// pupil = new Cursor(pupil);
// eye = new Cursor(eye);
// instructing html elements to follow cursor movement
// pupil.follow()
// eye.follow()

/* 
DOCUMENT EVENT LISTENERS
*/
// document.addEventListener("mousedown", e=>{...)
document.addEventListener("click", (e) => {
    // pupil.blink()
    // console.log(document.elementsFromPoint(e.clientX, e.clientY))
})



// RADIO GROUP 
function radioGroupFunctionality(radiogroup) {
    let previousLabel = undefined;
    radiogroup.addEventListener("input", e => {
        // hide previous output/unclick label (style)
        if (previousLabel) {
            previousLabel.classList.remove("clicked")
            previousLabel.classList.add("clickable")
            // document.querySelector(`#filter-output-${previousFilterLabel.getAttribute("for")}`).classList.add("hidden")
        }

        // click (style) selected label
        const label = e.target.nextElementSibling;
        label.classList.remove("clickable")
        label.classList.add("clicked")

        previousLabel = label;
    })
}