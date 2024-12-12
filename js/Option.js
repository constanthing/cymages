class Option {
    static selected = null;

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

        this.before = option.querySelector(".before");
        this.after = option.querySelector(".after");
        this.background = option.querySelector(".background");

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

    addBackground() {
        this.background.classList.remove("hidden")
    }
    removeBackground() {
        this.background.classList.add("hidden")
    }

    addBrackets() {
        this.before.classList.remove("hidden")
        this.after.classList.remove("hidden")
    }
    removeBrackets() {
        this.before.classList.add("hidden")
        this.after.classList.add("hidden")
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
                Option.selected.removeBrackets()
                Option.selected.removeBackground()

                if (Option.selectedOutput) {
                    Option.selectedOutput.classList.toggle("hidden")
                }

                // removes unselects the selected option
                Option.selected.deselect()
                Option.selected = false;
            }

            // select current option
            if (!this.selected && !Option.selected) {
                console.log("running")
                this.selected = true;
                Option.selected = this;
                this.addBackground()
                if (this.before.classList.contains("hidden")) {
                    this.addBrackets()
                }
                Option.selectedOutput = document.querySelector(`#filter-output-${this.type}`);

                // debugging purposes
                if (Option.selectedOutput) {
                    // reveal respective output to currently selected option 
                    Option.selectedOutput.classList.toggle("hidden")
                }

                this.select()
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

        // only loads once when selected 
        if (!this.loadedFilters) {
            this.loadFilters()
            this.loadedFilters = true;
        }

        // IMPORTANT: RUN reveal SCROLL after data has been loaded in scrollable content
        // - ex: outputs loaded into filter-output 
        revealScroll()
    }

    trackHover() {
        this.option.addEventListener("mouseenter", () => {
            if (!this.selected) {
                this.addBrackets()
            }
        })
        this.option.addEventListener("mouseleave", () => {
            if (!this.selected) {
                this.removeBrackets()
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