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
        // console.log(Scroll.dragging, Scroll.grabbing, Scroll.elementEndClicked)
        if (Scroll.elementEndClicked != image) {
            clicked = !clicked;
            currentImage = image;

            // setting border to make it clear what image was clicked 
            image.style.border = "1px solid white";


            // revealing imageActions
            imageActions.classList.remove("hidden")
            imageActionsOpen = true;
            imageActions.style.top = (e.clientY - (eye.height / 2)) + "px";
            imageActions.style.left = (e.clientX - (imageActions.clientWidth / 2)) + "px";

            pupil.setBackground("none")
            eye.element.classList.add("hidden")
            // eye.setOpacity(0)
            pupil.blink()
        }
    })
    Scroll.elementEndClicked = null;
})
/* IMAGE ACTIONS */
imageActions.addEventListener("mouseleave", e => {
    clicked = false;

    currentImage.style.border = "";

    imageActionsOpen = false;
    imageActions.classList.add("hidden")

    eye.element.classList.remove("hidden")
    // eye.setOpacity()
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


const galleryScroll = new Scroll(true, gallery, document.querySelector("#gallery-scroll"));