document.addEventListener("DOMContentLoaded", async () => {

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
    }

    randomBorder()

    // default files: loading.js, loading.css -> loaded

    async function loadFiles(files, domManipulation) {
        return new Promise((resolve, reject) => {
            for (const index in files) {
                // saving name of file
                let name = files[index];
                // false = not loaded
                files[index] = false;

                elem = domManipulation(name);
                //  fires when stylesheet downloaded and applied
                elem.onload = () => {
                    // loaded
                    console.log(`${name} finished downloading`)
                    files[index] = true;

                    // all styles loaded so only true booleans in array
                    if (files.find(e => e == false) == undefined) {
                        // loaded
                        resolve()
                    }
                }
            }
        })
    }

    let styleDom = (fileName) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        // link.href = `${path}${files[file]}.${extension}`;
        link.href = `./css/${fileName}.css`;
        document.querySelector("head").appendChild(link)
        return link;
    }
    const styles = ["index", "gallery", "filter", "export", "cursor", "media"];
    await loadFiles(styles, styleDom)
    console.log("STYLES LOADED")

    let scriptDom = (scriptName) => {
        // dynamically adding styles to load site faster 
        const script = document.createElement("script");
        script.src = `./js/${scriptName}.js`;
        document.querySelector("body").appendChild(script)
        return script;
    }
    const scripts = ["Classes/Cursor", "Classes/Scroll", "index", "GalleryModule", "FilterModule", "ExportModule"];
    await loadFiles(scripts, scriptDom)
    console.log("SCRIPTS LOADED")

    // hide the loadingFilter reveal the CONTENT
    loadingFilter.classList.add("animate-borderr");

    // const imgs = document.querySelectorAll("#gallery img");
    // for (const img of imgs) {
    //     img.onload = () => {
    //         console.log(img + " loaded")
    //     };
    // }
    // console.log(imgs)


})