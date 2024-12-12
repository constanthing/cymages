class Output {
    constructor(output) {
        this.output = output;
        this.logo = output.querySelector(".logo");
        this.dimmer = output.querySelector(".dimmer");
        this.background = output.querySelector(".background");
        this.index = output.dataset.index;
        this.description = output.querySelector(".description");

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
            localStorage.setItem(`${Option.selected.type}Filters`, JSON.stringify(Option.selected.filters))
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
        // add cool properties
        pupil.removeClass("indicate")

        this.description.classList.add("hidden");

        // maelstrom gang only one with an id
        // maelstrom gang logo is a bit smaller than the rest
        // so we make it bigger than the rest
        if (Option.selected.type != "location") {
            if (!this.id) {
                this.logo.style.width = "4em";
            } else {
                this.logo.style.width = "5em";
            }
        } else {
            this.logo.style.scale = "1.1";
        }

        this.dimmer.style.opacity = ".4";
        
        if (Option.selected.type == "time") {
            this.logo.setAttribute("src", this.logo.src.substring(0, this.logo.src.length-4)+"-fill.svg")
        }
    }
    deselectStyle() {
        switch (Option.selected.type) {
            case "time":
                this.logo.setAttribute("src", this.logo.src.substring(0, this.logo.src.length-9)+'.svg');
                break;
            case "location":
                this.logo.style.scale = "";
                break;
        }

        this.description.classList.remove("hidden");

        // remove properties from select
        this.dimmer.style.opacity = "";
        this.logo.style.width = "";
    }


    trackHover() {
        this.output.addEventListener("mouseenter", e=>{
            if (!this.selected) {
                this.hoverStyle()
                pupil.addClass("indicate")
            }
        })
        this.output.addEventListener("mouseleave", e=>{
            if (!this.selected) {
                this.leaveStyle()
                pupil.removeClass("indicate")
            }
        })
    }
    hoverStyle() {
        if (Option.selected.type == "gang") {
            // gangs
            this.logo.style.filter = "grayscale(0) drop-shadow(0 0 .5em black)";
        } else {
            // all else 
            this.logo.style.filter = "invert(0) drop-shadow(0 0 .5em black)";
        }
        this.background.style.filter = "grayscale(0)";
    }

    leaveStyle() {
        this.logo.style.filter = "";
        this.background.style.filter = "";
    }

}

