const loading = document.querySelector("#loading");

const loadingFilter = loading.querySelector("#loading-filter");
loadingFilter.addEventListener("animationend", () => {
    loading.classList.add("animate-disappear")
})

function getRandomNumber(max) {
    return parseInt(Math.random() * max) + 1;
}
function getRandomColor() {
    return [getRandomNumber(255), getRandomNumber(255), getRandomNumber(255)];
}
async function randomBorder() {
    let index = 0;
    while (index < 10) {
        let r = getRandomColor()
        loadingFilter.style.borderTopColor = `rgb(${r[0]}, ${r[1]}, ${r[2]})`;

        r = getRandomColor();
        loadingFilter.style.borderRightColor = `rgb(${r[0]}, ${r[1]}, ${r[2]})`;

        r = getRandomColor();
        loadingFilter.style.borderBottomColor = `rgb(${r[0]}, ${r[1]}, ${r[2]})`;

        r = getRandomColor();
        loadingFilter.style.borderLeftColor = `rgb(${r[0]}, ${r[1]}, ${r[2]})`;
        await new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 100)
        })
        index += 1;
    }
    return new Promise((resolve, reject) => {
        resolve()
    })
}

async function animate() {
    await randomBorder()

    loadingFilter.classList.add("animate-borderr");

    // shouldn't this go to complete white as borders finish ?
}
animate()