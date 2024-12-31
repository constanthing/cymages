window.addEventListener("load", () => {
    // default files: loading.js, loading.css -> loaded

    console.log("loaded")
    const styles = ["index", "gallery", "filter", "export", "cursor", "media"];
    for (const style of styles) {
        // dynamically adding styles to load site faster 
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `./css/${style}.css`;
        document.querySelector("head").appendChild(link)

        //  fires when stylesheet downloaded and applied
        link.onload = ()=>{
            console.log(`${style}.css finished downloading`)
        }
    }

    const imgs = document.querySelectorAll("#gallery img");
    for (const img of imgs) {
        img.onload = ()=> {
            console.log(img + " loaded")
        };
    }
    console.log(imgs)


    const loading = document.querySelector("#loading");
    loading.addEventListener("animationend", () => {
        document.querySelector("main").classList.remove("hidden")
    })

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
})