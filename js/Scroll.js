class Scroll {
    /*
    * document.addEventListener("pointerdown") related to this [in index.js]
    */
    static dragging = null;
    static grabbing = null;
    static elementStartClicked = null;
    static elementEndClicked = null;

    constructor(isVertical, element, scroll) {
        this.isVertical = isVertical;

        this.element = element;

        // vertical elements would have negative = up - positive = down
        let imgs = scroll.querySelectorAll("img");
        console.log(imgs)
        this.negative = imgs[0];
        this.positive = imgs[1];

        this.start = null;

        this.trackShortcutClicks()
        this.trackDrag()
        this.trackLeave()
    }

    trackShortcutClicks() {
        this.negative.addEventListener("click", () => {
            this.element.scrollTo(0, 0)
        })
        this.positive.addEventListener("click", () => {
            /*
            * consider making this responsive to the screen resize
            */
            this.positive.scrollTo(1000, 1000)
        })
    }
    trackShortcutHover() {
        this.negative.addEventListener("mouseenter", () => {
        })
        this.negative.addEventListener("mouseleave", () => {
        })
        this.positive.addEventListener("mouseenter", () => {
        })
        this.positive.addEventListener("mouseleave", () => {
        })
    }

    trackDrag() {
        this.element.addEventListener("pointerdown", e => {
            Scroll.elementStartClicked = document.elementFromPoint(e.clientX, e.clientY);

            // do you need this if?
            if (!Scroll.grabbing) {
                Scroll.grabbing = true;
                pupil.setBackground("var(--white)")
                if (this.isVertical) {
                    this.start = e.clientY;
                } else {
                    this.start = e.clientX;
                }
            }
        })

        this.element.addEventListener("scroll", () => {
            this.revealScroll(this.negative, this.positive, this.element, this.isVertical)
        })

        this.element.addEventListener("pointermove", e => {
            console.log("POINTER MOVE: ", Scroll.dragging, Scroll.grabbing)
            if (Scroll.grabbing) {
                Scroll.dragging = true;

                let move = null;
                let scroll = null;
                // scroll = Math.max(0, Math.min(scroll, filterOutput.scrollWidth - filterOutput.clientWidth));
                if (this.isVertical) {
                    move = (e.clientY - this.start);
                    scroll = this.element.scrollTop - move;
                    this.element.scrollTo(0, scroll)
                    // for smoother scrolling 
                    this.start = e.clientY;
                } else {
                    move = (e.clientX - this.start);
                    scroll = this.element.scrollLeft - move;
                    this.element.scrollTo(scroll, 0)
                    this.start = e.clientX;
                }
            }
        })
    }

    /*
    * When the pointer leaves or is lifted we want to stop grabbing regardless of dragging.
    */
    #recordDraggingStopped(e) {
        if (Scroll.dragging) {
            // records what element we stopped dragging on
            Scroll.elementEndClicked = document.elementFromPoint(e.clientX, e.clientY);
            // reset style
            pupil.setBackground()
            // records dragging status as false
            Scroll.dragging = false;
        } else {
            /*
            * IMPORTANT: without this line clicking on element that we ended dragging on won't work.
            * Because elementEndClicked will forever be that element it ended on until you drag again.
            * Therefore, we must set it to null if we weren't dragging but rather clicking(grabbing).
            */
            Scroll.elementEndClicked = null;
        }
        Scroll.grabbing = false;
    }
    trackLeave() {
        this.element.addEventListener("pointerleave", (e) => {
            // console.log("LEFT: ", Scroll.dragging, Scroll.grabbing)
            this.#recordDraggingStopped(e)
        })
        this.element.addEventListener("pointerup", (e) => {
            // console.log("pointer up")
            this.#recordDraggingStopped(e)
        })
    }

    // reveals scroll shortcuts (up, down - left, right)
    revealScroll() {
        let scroll = null;
        let scrolled = null;
        if (!this.isVertical) {
            // horizontal scroll
            scroll = this.element.scrollWidth - this.element.clientWidth;
            scrolled = this.element.scrollLeft;
        } else {
            // vertical scroll
            scroll = this.element.scrollHeight - this.element.clientHeight;
            scrolled = this.element.scrollTop;
        }

        const percent = 10; // percent of total scroll
        // getting percentage
        const firstMax = percent * scroll / 100;
        const secondMax = scroll - firstMax;

        if (scrolled > firstMax) {
            // show left scroll
            this.negative.classList.remove("hidden")
        } else {
            // hide left scroll
            this.negative.classList.add("hidden")
        }

        if (scrolled < secondMax) {
            // show right scroll
            this.positive.classList.remove("hidden")
        } else {
            this.positive.classList.add("hidden")
        }
    }

}


gallery.addEventListener("scroll", () => {
    galleryScroll.revealScroll()
})