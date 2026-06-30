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
    scratch_bar_display = scratch_bar_display_div.value
});

let analysis_bar_display = 'OCN'
const analysis_bar_display_div = document.getElementById("Analysis_display_mode");

analysis_bar_display_div.addEventListener("change", () => {
    analysis_bar_display = analysis_bar_display_div.value
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


scratch_bar_height = document.getElementById("Scratch_bar_height");
scratch_bar_height.addEventListener("change", () => {
    const val = scratch_bar_height.value
    let height = 24
    switch (val) {
        case 'Normal':
            height = 24;
            break;

        case 'High':
            height = 28;
            break;

        case 'Higher':
            height = 36;
            break;

        case 'Extra Higher':
            height = 44;
            break;

        case 'Extra Extra Higher':
            height = 50;
            break;

        case 'Extra Extra Extra Higher':
            height = 56;
            break;


    }
    document.documentElement.style.setProperty(
        "--scratch-bar-height",
        height + "px"
    );
});