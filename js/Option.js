class Option {
    static selected = null;
    static selectedOutput = null;

    constructor(option) {
        this.option = option;
        this.selected = false;
        this.optionType = option.id.slice(0, option.id.indexOf("-"));
        this.trackHover()
        this.trackClick()
    }

    toggleBackground() {
        this.option.querySelector(".background").classList.toggle("hidden")
    }

    toggleBrackets() {
        const before = this.option.querySelector(".before");
        const after = this.option.querySelector(".after");
        before.classList.toggle("hidden")
        after.classList.toggle("hidden")
    }

    deselect() {
        console.log("deselect()")
        this.selected = false;
    }

    trackClick() {
        this.option.addEventListener("click", () => {
            if (!this.selected && Option.selected) {
                // another filter-option already selected
                // reset state of selected option
                Option.selected.toggleBackground()
                Option.selected.toggleBrackets()
                if (Option.selectedOutput) {
                    Option.selectedOutput.classList.toggle("hidden")
                }

                // removes unselects the selected option
                Option.selected.deselect()
                Option.selected = null;
            }

            // select current option
            if (!this.selected && !Option.selected) {
                // changed from isSelected = !isSelected;
                this.selected = true;
                Option.selected = this;
                this.toggleBackground()
                Option.selectedOutput = document.querySelector(`#filter-output-${this.optionType}`);

                // debugging purposes
                if (Option.selectedOutput) {
                    Option.selectedOutput.classList.toggle("hidden")
                }
            }
        })
    }

    select() {
        const click = new MouseEvent("click");
        const hover = new MouseEvent("mouseenter");
        this.option.dispatchEvent(hover)
        this.option.dispatchEvent(click)
    }


    trackHover() {
        this.option.addEventListener("mouseenter", () => {
            if (!this.selected) {
                this.toggleBrackets()
            }
        })
        this.option.addEventListener("mouseleave", () => {
            if (!this.selected) {
                this.toggleBrackets()
            }
        })
    }
}