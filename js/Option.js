class Option {
    static selected = null;
    static selectedOutput = null;

    constructor(option) {
        this.option = option;
        this.selected = false;
        this.type = option.id.slice(0, option.id.indexOf("-"));

        // LOAD FILTERS
        this.filters = JSON.parse(localStorage.getItem(`${this.type}Filters`));
        if (this.filters == null) {
            this.filters = [];
            localStorage.setItem(`${this.type}Filters`, JSON.stringify([]))
        }

        this.loadedFilters = false;

        this.outputs = null;

        this.trackHover()
        this.trackClick()
    }

    loadFilters() {
        // load filters
        if (this.filters.length) {
            for (const filter of this.filters) {
                let filterElement = this.outputs[filter];
                filterElement.selectStyle()
                filterElement.hoverStyle()
                filterElement.selected = true;
            }
        } else {
            // nothing to load
            console.info("nothing to load")
        }
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
            // unselects currently selected option
            if (!this.selected && Option.selected) {
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
                this.selected = true;
                Option.selected = this;
                this.toggleBackground()
                Option.selectedOutput = document.querySelector(`#filter-output-${this.type}`);
                this.select()

                // debugging purposes
                if (Option.selectedOutput) {
                    Option.selectedOutput.classList.toggle("hidden")
                }

            }
        })
    }

    select() {
        if (this.outputs == null) {
            this.outputs = []
            const t = document.querySelectorAll(`.${this.type}`);
            for (let output of t) {
                output = new Output(output);
                this.outputs.push(output)
            }
        }

        const click = new MouseEvent("click");
        const hover = new MouseEvent("mouseenter");
        this.option.dispatchEvent(hover)
        this.option.dispatchEvent(click)

        // only loads once when selected 
        if (!this.loadedFilters) {
            this.loadFilters()
            this.loadedFilters = true;
        }
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

    reset() {
        for (const filter of this.filters) {
            // filter is the index of the output
            let output = this.outputs[filter];
            // remove click style
            output.deselectStyle()
            output.leaveStyle()
            output.selected = false;
        }
        this.filters = [];
        localStorage.setItem(`${this.type}Filters`, JSON.stringify([]))
    }
}