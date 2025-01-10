/*
GALLERY / IMAGEACTIONS
*/
const gallery = document.querySelector("#gallery");
const imageActions = document.querySelector("#image-actions");
let imageActionsOpen = false;
let currentImage = null;
galleryDimmer.style.height = gallery.scrollHeight + "px";

const highQualityImages = ["green", "grid", "dead", "dead-2", "carmox", "black", "mox", "vr", "pink"];
(async function () {
    for (const i of highQualityImages) {
        const image = new Image();
        image.onload = () => {
            // to make sure to get gallery loaded image
            // might not need this too tired to go in the code and check
            for (const im of document.querySelectorAll(`[src="/cymages/p/${i}.webp"]`)) {
                im.removeAttribute("loading")
                im.src = image.src;
            }
        }
        image.src = `/cymages/p/${i}-high.png`;
    }
})()

//
//
// PHOTO SET
//
//
function getType(photoState) {
    // 0 == play
    // 1 == pause
    return photoState.dataset.state == "0" ? "play" : "pause";
}

async function playSlideshow(photoSetLinks, signal) {
    let index = photoSetLinks.dataset.index;
    index = index == undefined ? 0 : parseInt(index);

    while (true) {
        // placed here in to make change to next image upon clicking
        // play instant
        index += 1;

        if (index == photoSetLinks.children.length) {
            index = 0;
        }
        console.log(index)
        photoSetLinks.children[index].click()
        try {
            await new Promise((r, rj) => {
                const abort = () => {
                    clearTimeout(timeout)
                    rj("playSlideshow() aborted")
                };

                signal.addEventListener("abort", abort)

                const timeout = setTimeout(() => {
                    signal.removeEventListener("abort", abort)
                    r()
                }, 750)
            })
        } catch (e) {
            console.log(e)
            break;
            // aborted
        }
    }
    photoSetLinks.dataset.index = index;
}

// play / pause elements
document.querySelectorAll(".photo-set-state").forEach(photoState => {
    let controller = new AbortController();
    let signal = controller.signal;

    photoState.addEventListener("mouseenter", () => {
        photoState.src = `/cymages/vectors/${getType(photoState)}-fill.svg`;
    })
    photoState.addEventListener("mouseleave", () => {
        photoState.src = `/cymages/vectors/${getType(photoState)}-hollow.svg`;
    })
    photoState.addEventListener("click", () => {
        const state = parseInt(photoState.dataset.state) == 1 ? 0 : 1;
        switch (state) {
            case 0:
                controller.abort()
                controller = new AbortController();
                signal = controller.signal;
                break;
            case 1:
                // .photo-set-links
                playSlideshow(photoState.nextElementSibling, signal)
                break;
        }
        photoState.dataset.state = state;
        photoState.src = `/cymages/vectors/${getType(photoState)}-fill.svg`;
        photoState.dataset.fill = "1";
    })
})

// forms 
document.querySelectorAll(".photo-set-links").forEach(photoSetLinks => {

    const photoSet = photoSetLinks.parentElement.parentElement;
    console.log(photoSet)
    const photos = photoSet.querySelectorAll("figure");

    // -1 to exclude .photo-set-state
    for (let i = 0; i < photos.length; i++) {
        const radio = document.createElement("input");
        radio.dataset.index = i;
        radio.setAttribute("type", "radio")
        radio.setAttribute("name", "photo-set-links")
        radio.classList.add("photo-set-link")
        photoSetLinks.appendChild(radio)
    }
    photoSetLinks.children[0].click()

    let active = 0;
    photoSetLinks.addEventListener("input", (e) => {
        photos[active].classList.add("hidden")
        const index = e.target.dataset.index;
        photos[index].classList.remove("hidden")
        active = index;
        photoSetLinks.dataset.index = active;
    })
})
// 
// END OF PHOTO SET
// 



// images not in photoset
// gallery.querySelectorAll("img:not(.photo-set-state)").forEach(image => {
gallery.querySelectorAll(".image-container").forEach(container => {
    let clicked = false;
    container.addEventListener("click", e => {

        if (Scroll.elementEndClicked != container) {

            container.classList.add("clicked-gallery-image")
            console.log(container.querySelector(".ic-metadata"))

        }
    })
    container.addEventListener("mouseleave", ()=> {
        container.classList.remove("clicked-gallery-image")
    })
    Scroll.elementEndClicked = null;
})

function removeSelectedImageStyle() {
    if (currentImage) {
        currentImage.style.border = "";
        currentImage = undefined;
    }

    imageActionsOpen = false;
    imageActions.classList.add("hidden")
}

const galleryScroll = new Scroll(true, gallery, document.querySelector("#gallery-scroll"));
galleryScroll.revealScroll()


gallery.addEventListener("scroll", () => {
    galleryScroll.revealScroll()
})