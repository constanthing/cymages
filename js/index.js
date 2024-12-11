const body = document.querySelector("body");
const galleryDimmer = body.querySelector("#gallery-dimmer");
const filter = body.querySelector("#filter");


// getting html elements
let eye = body.querySelector("#eye");
let pupil = body.querySelector("#pupil");
// creating objects out of html elements
pupil = new CursorElement(pupil);
eye = new CursorElement(eye);
// instructing html elements to follow cursor movement
pupil.follow()
eye.follow()

/* 
DOCUMENT EVENT LISTENERS
*/
// document.addEventListener("mousedown", e=>{...)
document.addEventListener("click", (e) => {
    pupil.blink()
})
document.addEventListener("pointerup", e => {
    if (dragging) {
        pupil.setBackground()
        // pupil.style.background = "";
        dragging = false;
    }
})
