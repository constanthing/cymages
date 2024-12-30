const exportActions = document.querySelector("#export-actions");

radioGroupFunctionality(exportActions)

exportActions.addEventListener("input", e => {
    switch (e.target.id) {
        case "contrast":
        case "brightness":
        case "vignette":
            // image modification (slider)
            document.querySelector("#export-slider").classList.remove("hidden")
            selectedAction = e.target.id;

            const metadata = parseInt(document.querySelector(`#metadata-${e.target.id}`).innerText);

            // text indicator of slider
            value.value = metadata;

            // apply thumb to correct location of selected filter
            positionThumb(metadata)

            applyFiltersToImages()
            break;
        default:
            console.log("not asking for slider")
            break;
    }
})
radioGroupFunctionality(document.querySelector("#export-actions"))

const sliderContainer = document.querySelector("#export-slider");
const slider = sliderContainer.querySelector("#slider-container input");
const bar = document.querySelector(".bar");
const value = document.querySelector(".value");
let imageFilter = "contrast"; // defualt
const exportImage = document.querySelector("#export-image");
// contrast, exposure, vignette 
let contrast = 100; // 100 = default 
let vignette = 100;
let brightness = 100;

value.addEventListener("keydown", e=>{
    // returns NaN if cannot parse
    let number = parseInt(e.key);
    if (!Number.isNaN(number) && value.value.length < 3) {
        console.log(number)
    } else {
        if (e.key == "Backspace" || e.metaKey || e.shiftKey || e.key.indexOf("Arrow") > -1) {
            return;
        }
        console.log("ERROR")
        e.preventDefault()
    }
})

function positionThumb(sliderValue = slider.value) {
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
    value.value = slider.value;
    switch (selectedAction) {
        case "contrast":
            contrast = slider.value;
            contrastMetadata.innerText = contrast;
            break;
        case "vignette":
            vignette = slider.value;
            break;
        case "brightness":
            brightness = slider.value;
            brightnessMetadata.innerText = brightness;
            break;
    }
    console.log(`contrast(${contrast}%) brightness(${brightness}%)`)
    exportImage.style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
})

const sliderImages = document.querySelectorAll(".slider-images img");

let incrementation = (slider.max - slider.min) / sliderImages.length;
function applyFiltersToImages() {
    let start = 0;
    // 0, 100, 200
    sliderImages.forEach(image => {
        console.log(selectedAction)
        image.style.filter = `${selectedAction}(${start}%)`;
        start += incrementation;
    })
}

// const exportActions = document.querySelectorAll(".export-action");
let selectedAction = null;

const contrastMetadata = document.querySelector("#metadata-contrast");
const brightnessMetadata = document.querySelector("#metadata-brightness");

const clickEvent = new MouseEvent("click");
// [0].dispatchEvent(clickEvent)
document.querySelector("#brightness").dispatchEvent(clickEvent)


const logo = document.querySelector("#logo");
logo.addEventListener("click", () => {
    exportContainer.classList.add("hidden")
    contrast = 100;
    contrastMetadata.innerText = 0;
    vignette = 100;
    brightness = 100;
    brightnessMetadata.innerText = brightness;
    slider.value = 100;
    positionThumb()
    // reset filter
    exportImage.style.filter = "";
    gallery.classList.remove("hidden")
})