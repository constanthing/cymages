class Output {
    static option = null;
    constructor(output) {
        this.output = output;
        this.logo = output.querySelector(".logo");
        this.dimmer = output.querySelector(".dimmer");
        this.background = output.querySelector(".background");
        this.index = output.dataset.index;

        this.selected = false;

        this.id = output.id;

        this.trackClick()
        this.trackHover()
    }

    trackClick() {
        this.output.addEventListener("click", e=>{
            if (!this.selected) {
                this.select()
                this.selectStyle()
            } else {
                this.deselect()
                this.deselectStyle()
            }

            // update local storage 
            localStorage.setItem("gangFilters", JSON.stringify(Option.selected.filters))
        })
    }
    select() {
        // add this gang to filter
        Option.selected.filters.push(this.index)

        this.selected = true;
    }
    deselect() {
        // remove this output from filter
        Option.selected.filters.splice(Option.selected.filters.findIndex(e => e == this.index), 1)

        this.selected = false;
    }
    selectStyle() {
        console.log("this ran")
        // add cool properties
        pupil.removeClass("indicate")

        // maelstrom gang only one with an id
        // maelstrom gang logo is a bit smaller than the rest
        // so we make it bigger than the rest
        if (!this.id) {
            this.logo.style.width = "4em";
        } else {
            this.logo.style.width = "5em";
        }
        this.dimmer.style.opacity = ".4";
    }
    deselectStyle() {
        // remove properties from select
        this.dimmer.style.opacity = "";
        this.logo.style.width = "";
    }


    trackHover() {
        this.output.addEventListener("mouseenter", e=>{
            if (!this.selected) {
                this.hoverStyle()
            }
        })
        this.output.addEventListener("mouseleave", e=>{
            if (!this.selected) {
                this.leaveStyle()
            }
        })
    }
    hoverStyle() {
        this.logo.style.filter = "grayscale(0) drop-shadow(0 0 .5em black)";
        this.background.style.filter = "grayscale(0)";
        pupil.addClass("indicate")
    }
    leaveStyle() {
        this.logo.style.filter = "";
        this.background.style.filter = "";
        pupil.removeClass("indicate")
    }

}

