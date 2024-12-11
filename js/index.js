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

/*
GALLERY / IMAGEACTIONS
*/
const gallery = body.querySelector("#gallery");
const imageActions = body.querySelector("#image-actions");
let imageActionsOpen = false;
let currentImage = null;
galleryDimmer.style.height = gallery.scrollHeight + "px";

gallery.querySelectorAll("img").forEach(image => {
    let clicked = false;
    image.addEventListener("click", e => {
        clicked = !clicked;
        currentImage = image;

        // revealing imageActions
        imageActions.classList.remove("hidden")
        imageActionsOpen = true;
        imageActions.style.top = (e.clientY - (eye.height / 2)) + "px";
        imageActions.style.left = (e.clientX - (imageActions.clientWidth / 2)) + "px";

        pupil.setBackground("none")
        eye.setOpacity(0)
        pupil.blink()
    })
})
/* IMAGE ACTIONS */
imageActions.addEventListener("mouseleave", e => {
    clicked = false;

    imageActionsOpen = false;
    imageActions.classList.add("hidden")

    eye.setOpacity()
    pupil.setBackground()
})
imageActions.querySelectorAll(".image-action").forEach(action => {
    action.addEventListener("mouseenter", e => {
        action.innerText = "[" + action.innerText + "]";
    })
    action.addEventListener("mouseleave", e => {
        action.innerText = action.innerText.slice(1, action.innerText.length - 1);
    })

    action.addEventListener("click", e => {
        // TODO RESET BACKGROUND COLOR UPON LEAVING #IMAGE-ACTIONS
        action.style.background = "var(--white)";
    })
})


