class Cursor {
    constructor() {
        // eye & pupil 
        this.eye = {};
        this.pupil = {};

        this.x = null;
        this.y = null;
    }
    follow() {
        this.eye.follow()
        this.pupil.follow()
    }
}

class CursorElement {
    constructor(element) {
        this.element = element;
        this.x = null;
        this.y = null;
        this.element.classList.remove("hidden")
        this.element.classList.remove("hidden");
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
        
        this.blinked = false;

        this.followReference = null;
    }

    follow() {
        this.followReference = (e) => {
            this.x = e.clientX;
            this.y = e.clientY;

            // center horizontally on cursor
            this.element.style.left = this.x - (this.width / 2) + "px";
            this.element.style.top = this.y - (this.height / 2) + "px";
        }
        document.addEventListener("mousemove", this.followReference)
    }
    halt() {
        document.removeEventListener("mousemove", this.followReference)
    }


    async blink() {
        if (!this.blinked) {
            // console.log("blinking")
            this.blinked = true;
            this.addClass("blink")
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // console.log("removing .blink")
                    pupil.removeClass("blink")
                    // pupil.classList.remove("blink")
                    this.blinked = false;
                    resolve()
                }, 500)
            })
        } else {
            // console.log("hey toots! I'm blinking here!")
        }
    }


    addClass(value) {
        this.element.classList.add(value)
    }
    removeClass(value) {
        this.element.classList.remove(value)
    }


    /*
    default value for setters is "" which resets style to original in css
    */
    setOpacity(value = "") {
        this.element.style.opacity = value;
    }
    setBackground(value = "") {
        this.element.style.background = value;
    }
}

