const cursor = document.querySelector("#eye");
const pupil = document.querySelector("#pupil");

cursor.style.left = document.clientX-16 + "px";
cursor.style.top = document.clientY-16 + "px";

let x = 0;
let y = 0;


// reveal cursor upon first moving mouse
// AND delete function call
let initialMouseMovement = null;
initialMouseMovement = () => {
    if (cursor.classList.contains("hidden")) {
        cursor.classList.remove("hidden");
    }
    document.removeEventListener("mousemove", initialMouseMovement);
    console.log("iniitalMouseMovement()")
}
document.addEventListener("mousemove", initialMouseMovement);

let move = false;

document.addEventListener("mousemove", (e)=>{
    x = e.clientX;
    y = e.clientY;

    const centerX = x - 16;
    const centerY = y - 8;
    cursor.style.left = centerX + "px";
    cursor.style.top = centerY + "px";

    pupil.style.left = x - 8 + "px";
    pupil.style.top = y + "px";

    // 32 px 
})


let blinked = null;

async function blink() {
    pupil.classList.add("blink")
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            console.log("ran")
            pupil.classList.remove("blink")
            blinked = null;
            resolve()
        }, 500)
    })
}

document.addEventListener("mousedown", (e)=>{
    if (!blinked) {
        blinked = blink();
    }
})