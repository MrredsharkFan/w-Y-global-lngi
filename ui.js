const modal = document.getElementById("settings_modal");

document.getElementById("settings_btn").onclick = () => {
    modal.classList.add("show");
};

document.getElementById("close_settings").onclick = () => {
    modal.classList.remove("show");
};

// Close when clicking outside the dialog
modal.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
};

// Optional: Close with Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.classList.remove("show");
    }
});

let scratch_bar_display = 'wY'
const scratch_bar_display_div = document.getElementById("scratch_bar_display_mode");

scratch_bar_display_div.addEventListener("change", () => {
    scratch_bar_display = scratch_bar_display_div.value
});


let compress_BMS = document.getElementById("compress_bms")
let format_cOCF = document.getElementById("format_cOCF")

function makeResizable(panel){

    const handle=panel.querySelector(".resize-handle");

    let startY;
    let startHeight;

    handle.addEventListener("pointerdown",e=>{

        e.preventDefault();

        startY=e.clientY;
        startHeight=panel.offsetHeight;

        function move(ev){

            panel.style.height=
                Math.max(60,startHeight+ev.clientY-startY)+"px";

        }

        function up(){

            window.removeEventListener("pointermove",move);
            window.removeEventListener("pointerup",up);

        }

        window.addEventListener("pointermove",move);
        window.addEventListener("pointerup",up);

    });

}

document.querySelectorAll(".resizable").forEach(makeResizable);

const Scratch_bar_height = document.getElementById("Scratch_bar_height");

Scratch_bar_height.addEventListener("input", function () {
    document.documentElement.style.setProperty(
        "--scratch-bar-height",
        Scratch_bar_height.valueAsNumber + "px"
    );
});

/*
document.getElementById("top/row").hidden = false;
document.getElementById("bar/flexbox").hidden = false;
document.getElementById("main_lngi").hidden = false;
*/

let page = 0; // 0: main, 1: progress, 2: milestone
//purpose : preventing updating everything at once, which can cause lagging and freezing of the page
//only update the visible page, and update the other pages when they are visible
const btn_lngi = document.getElementById("btn_lngi");

btn_lngi.addEventListener("click", () => {
    page = 0;
    document.getElementById("analysis_toolbar").style.display = "flex";
    document.getElementById("analysis_container").style.display = "flex";
    document.getElementById("milestone_header").style.display = "none";
    document.getElementById("scratch_bars").hidden = true;
    document.getElementById("future-milestone").hidden = true;
});

const btn_progress = document.getElementById("btn_progress");

btn_progress.addEventListener("click", () => {
    page = 1;
    document.getElementById("analysis_container").style.display = "none";
    document.getElementById("analysis_toolbar").style.display = "none";
    document.getElementById("milestone_header").style.display = "flex";
    document.getElementById("scratch_bars").hidden = false;
    document.getElementById("future-milestone").hidden = true;
});

const btn_milestone = document.getElementById("btn_milestone");

btn_milestone.addEventListener("click", () => {
    page = 2;
    document.getElementById("analysis_container").style.display = "none";
    document.getElementById("analysis_toolbar").style.display = "none";
    document.getElementById("milestone_header").style.display = "none";
    document.getElementById("scratch_bars").hidden = true;
    document.getElementById("future-milestone").hidden = false;
});

const analysisPanels = [

    {
        notation: "BMS",
        width: 50,
        hue: 220
    },

    {
        notation: "OCN",
        width: 50,
        hue: 120
    }

];
