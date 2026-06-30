// use to sync height between BMS_lngi and OCF_lngi
const bms = document.getElementById("BMS_lngi");
const ocf = document.getElementById("OCF_lngi");

function syncHeight(source, target) {
    const h = source.offsetHeight;
    target.style.height = h + "px";
}

new ResizeObserver(() => syncHeight(bms, ocf)).observe(bms);
new ResizeObserver(() => syncHeight(ocf, bms)).observe(ocf);

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
    switch (scratch_bar_display_div.value) {
        case "wY": 
            scratch_bar_display = "wY"
            break;
        case "BMS":
            scratch_bar_display = "BMS"
            break;
        case "OCN":
            scratch_bar_display = "OCN"
            break;
        case "cOCF":
            scratch_bar_display = "cOCF"
            break;    
    }
});

let analysis_bar_display = 'OCN'
const analysis_bar_display_div = document.getElementById("Analysis_display_mode");

analysis_bar_display_div.addEventListener("change", () => {
    switch (analysis_bar_display_div.value) {
        case "OCN":
            analysis_bar_display = "OCN"
            break;
        case "cOCF":
            analysis_bar_display = "cOCF"
            break;    
    }
});

let compress_BMS = document.getElementById("compress_bms")
let format_cOCF = document.getElementById("format_cOCF")

document.querySelectorAll(".resizable").forEach(panel => {
    const handle = panel.querySelector(".resize-handle");

    let startY;
    let startHeight;

    handle.addEventListener("pointerdown", e => {
        e.preventDefault();

        startY = e.clientY;
        startHeight = panel.offsetHeight;

        function move(ev) {
            const h = Math.max(60, startHeight + ev.clientY - startY);
            panel.style.height = h + "px";
        }

        function up() {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        }

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    });
});