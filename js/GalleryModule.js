/*
GALLERY / IMAGEACTIONS
*/
const gallery = document.querySelector("#gallery");
const imageActions = document.querySelector("#image-actions");
let imageActionsOpen = false;
let currentImage = null;
galleryDimmer.style.height = gallery.scrollHeight + "px";

gallery.querySelectorAll("img").forEach(image => {
    let clicked = false;
    image.addEventListener("click", e => {
        console.log(e)
        // console.log(Scroll.dragging, Scroll.grabbing, Scroll.elementEndClicked)
        if (Scroll.elementEndClicked != image) {
            clicked = !clicked;
            currentImage = image;

            // setting border to make it clear what image was clicked 
            image.style.border = "1px solid white";


            // revealing imageActions
            imageActions.classList.remove("hidden")
            imageActionsOpen = true;
            console.log(e)
            imageActions.style.top = (e.pageY -(imageActions.clientHeight/2) + "px");
            // imageActions.style.top = (e.clientY - (eye.height / 2)) + "px";
            imageActions.style.left = (e.pageX - (imageActions.clientWidth / 2)) + "px";

            // pupil.setBackground("none")
            // eye.element.classList.add("hidden")
            // eye.setOpacity(0)
            // pupil.blink()
        }
    })
    Scroll.elementEndClicked = null;
})
/* IMAGE ACTIONS */
imageActions.addEventListener("pointerleave", e => {
    clicked = false;

    currentImage.style.border = "";

    imageActionsOpen = false;
    imageActions.classList.add("hidden")

    // eye.element.classList.remove("hidden")
    // eye.setOpacity()
    // pupil.setBackground()
})
let imageActionClicked = false;
const exportContainer = document.querySelector("#export");

imageActions.querySelectorAll(".image-action").forEach(action => {
    action.addEventListener("pointerenter", e => {
        action.innerText = "[" + action.innerText + "]";
    })
    action.addEventListener("pointerleave", e => {
        action.innerText = action.innerText.slice(1, action.innerText.length - 1);
    })

    action.addEventListener("pointerdown", e => {
        action.style.background = "var(--white)";
        // setting image 
        gallery.classList.add("hidden")
        exportContainer.querySelector("#export-image").setAttribute("src", currentImage.src)
        exportContainer.classList.remove("hidden")
        galleryScroll.negative.classList.add("hidden")
        galleryScroll.positive.classList.add("hidden")
        positionThumb()
        document.querySelectorAll(".slider-images img").forEach(image=>{
            image.setAttribute("src", currentImage.src)
        })

        action.style.background = "";

        const pointerleave = new PointerEvent("pointerleave");
        imageActions.dispatchEvent(pointerleave)
        // hide gallery scroller indicators
        // temporarily: add click to logo to exit export window
    })
})


const galleryScroll = new Scroll(true, gallery, document.querySelector("#gallery-scroll"));
galleryScroll.revealScroll()


gallery.addEventListener("scroll", () => {
    galleryScroll.revealScroll()
})


