class Option {
    static selected = null;
    static selectedOutput = null;

    constructor(option) {
        this.option = option;
        this.selected = false;
        this.type = option.id.slice(0, option.id.indexOf("-"));

        // LOAD FILTERS
        this.filters = JSON.parse(localStorage.getItem(`${this.type}Filters`));

        this.loadingFilters = false;
        this.loadedFilters = false;

        this.trackHover()
        this.trackClick()
    }

    loadFilters() {
        this.loadingFilters = true;
        // this.filters = JSON.parse(localStorage.getItem(`${this.type}Filters`));
        // load filters
        if (this.filters.length) {
            console.log("loading filters", this.filters)
            const click = new MouseEvent("click");
            const mouseEnter = new MouseEvent("mouseenter");
            for (const filter of this.filters) {
                let filterElement =  document.querySelector(`.${this.type}[data-index="${filter}"]`);
                filterElement.dispatchEvent(click)
                filterElement.dispatchEvent(mouseEnter)
            }
            this.loadedFilters = true;
        } else {
            // nothing to load
            console.info("nothing to load")
        }

        this.loadingFilters = false;

        // document.querySelectorAll(`.${this.type}[dat]`)
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
                Option.selectedOutput = document.querySelector(`#filter-output-${this.type}`);

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