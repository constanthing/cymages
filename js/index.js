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

const slider = document.querySelector("#contrast-slider");
const bar = document.querySelector(".bar");
const value = document.querySelector(".value");
function positionThumb() {
    const min = slider.min;
    const max = slider.max;
    const range = max - min;

    const number = slider.value;

    const thumbWidth = bar.clientWidth;
    const percentage = (number - min) / range;
    const sliderWidth = slider.getBoundingClientRect().width;
    let leftPosition = percentage * (sliderWidth - thumbWidth);
    leftPosition = Math.max(0, Math.min(leftPosition, sliderWidth - thumbWidth));

    console.log(leftPosition)

    bar.style.left = leftPosition + "px";
}
positionThumb()
slider.addEventListener("input", e => {
    positionThumb()
    value.innerText = slider.value;
    document.querySelector("#export-image").style.filter = `contrast(${slider.value}%)`;
})

const sliderImages = document.querySelectorAll(".slider-images img");

let incrementation = (slider.max-slider.min) / sliderImages.length;
console.log(incrementation)
let start = 0;
// 0, 100, 200
sliderImages.forEach(image => {
    image.style.filter = `contrast(${start}%)`;
    start += incrementation;
})