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
    console.log(document.elementsFromPoint(e.clientX, e.clientY))
})

const sliderContainer = document.querySelector("#export-slider");
const slider = sliderContainer.querySelector("input");
const bar = document.querySelector(".bar");
const value = document.querySelector(".value");
let imageFilter = "contrast"; // defualt
const exportImage = document.querySelector("#export-image");
// contrast, exposure, vignette 
let contrast = 100; // 100 = default 
let vignette = 100;
let exposure = 100;

function positionThumb(sliderValue=slider.value) {
    const min = slider.min;
    const max = slider.max;
    const range = max - min;

    const number = sliderValue;

    const thumbWidth = bar.clientWidth;
    const percentage = (number - min) / range;
    const sliderWidth = slider.getBoundingClientRect().width;
    let leftPosition = percentage * (sliderWidth - thumbWidth);
    leftPosition = Math.max(0, Math.min(leftPosition, sliderWidth - thumbWidth));

    // console.log(leftPosition)

    bar.style.left = leftPosition + "px";
}
slider.addEventListener("input", e => {
    positionThumb()
    value.innerText = slider.value;
    switch (selectedAction.innerText) {
        case "contrast":
            contrast = slider.value;
            contrastMetadata.innerText = contrast;
            break;
        case "vignette":
            vignette = slider.value;
            break;
        case "exposure":
            exposure = slider.value;
            exposureMetadata.innerText = exposure;
            break;
    }
    console.log(`contrast(${contrast}%) brightness(${exposure}%)`)
    exportImage.style.filter = `contrast(${contrast}%) brightness(${exposure}%)`;
})

const sliderImages = document.querySelectorAll(".slider-images img");

let incrementation = (slider.max - slider.min) / sliderImages.length;
function applyFiltersToImages() {
    let start = 0;
    // 0, 100, 200
    sliderImages.forEach(image => {
        image.style.filter = `${imageFilter}(${start}%)`;
        start += incrementation;
    })
}

const exportActions = document.querySelectorAll(".export-action");
let selectedAction = null;
const exportFilters = document.querySelector("#export-filters");
const exportAspectRatio = document.querySelector("#export-aspect-ratio");

const contrastMetadata = document.querySelector("#metadata-contrast");
const exposureMetadata = document.querySelector("#metadata-exposure");

exportActions.forEach(action => {
    action.addEventListener("mouseenter", e => {
        action.classList.add("selected-export-action")
    })
    action.addEventListener("mouseleave", e => {
        if (action != selectedAction) {
            action.classList.remove("selected-export-action")
        }
    })
    action.addEventListener("click", () => {
        if (selectedAction && selectedAction != action) {
            // remove that action
            selectedAction.classList.remove("selected-export-action")
        }
        selectedAction = action;
        action.classList.add("selected-export-action")


        if (["contrast", "vignette", "exposure"].indexOf(action.innerText) != -1) {
            // clicked one of those ^

            sliderContainer.classList.remove("hidden")
            exportFilters.classList.add("hidden")
            exportAspectRatio.classList.add("hidden")
            switch (action.innerText) {
                case "contrast":
                    value.innerText = contrast;
                    contrastMetadata.innerText = contrast;
                    positionThumb(contrast)
                    imageFilter = "contrast";
                    applyFiltersToImages("contrast")
                    break;
                case "exposure":
                    value.innerText = exposure;
                    exposureMetadata.innerText = contrast;
                    positionThumb(exposure)
                    imageFilter = "brightness";
                    applyFiltersToImages("brightness")
                    break;
                default:
                    console.log("defaulted switch line 90 index.js")
                    break;
            }
        } else {
            sliderContainer.classList.add("hidden")
        }

        if (action.innerText == "filter") {
            exportFilters.classList.remove("hidden")
            sliderContainer.classList.add("hidden")
            exportAspectRatio.classList.add("hidden")
        } else {
            exportFilters.classList.add("hidden")
        }

        if (action.innerText == "aspect ratio") {
            exportAspectRatio.classList.remove("hidden")
            sliderContainer.classList.add("hidden")
            exportFilters.classList.add("hidden")

        } else {
            exportAspectRatio.classList.add("hidden")
        }
    })

})

const clickEvent = new MouseEvent("click");
exportActions[1].dispatchEvent(clickEvent)