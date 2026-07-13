const modal = document.getElementById("settings_modal");

document.getElementById("settings_btn").onclick = () => {
    modal.classList.add("show");
};

document.getElementById("close_settings").onclick = () => {
    modal.classList.remove("show");
};


modal.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
};


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

function makeResizable(panel) {

    const handle = panel.querySelector(".resize-handle");

    let startY;
    let startHeight;

    handle.addEventListener("pointerdown", e => {

        e.preventDefault();

        startY = e.clientY;
        startHeight = panel.offsetHeight;

        function move(ev) {

            panel.style.height =
                Math.max(30, startHeight + ev.clientY - startY) + "px";

        }

        function up() {

            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);

        }

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);

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

let page = 0; 


const btn_lngi = document.getElementById("btn_lngi");

btn_lngi.addEventListener("click", () => {
    page = 0;
    update_page()
});

const btn_progress = document.getElementById("btn_progress");

btn_progress.addEventListener("click", () => {
    page = 1;
    update_page()
});

const btn_search = document.getElementById("btn_search");

btn_search.addEventListener("click", () => {
    page = 2;
    update_page()
});

const btn_mountain = document.getElementById("mountain_btn");

btn_mountain.addEventListener("click", () => {
    page = 3;
    update_page()
});

const btn_milestone = document.getElementById("btn_milestone");

btn_milestone.addEventListener("click", () => {
    page = 4;
    update_page()
});

function update_page() {
    document.getElementById("analysis_container").style.display = page == 0 ? "flex" : "none"
    document.getElementById("analysis_toolbar").style.display = page == 0 ? "flex" : "none"
    document.getElementById("milestone_header").style.display = page == 1 ? "flex" : "none"
    document.getElementById("scratch_bars").hidden = (page != 1)
    document.getElementById("future-milestone").hidden = (page != 2)
    document.getElementById("future-milestone").style.display = page == 2 ? "flex" : "none"
    document.getElementById("mountain").hidden = (page != 3)
}

const analysisPanels = [
    {
        notation: "DBMS",
        width: 100,
        hue: 120
    },

    {
        notation: "2-shifted OCF",
        width: 100,
        hue: 220
    },

];

function updatefontsize() {

    const font_size = document.getElementById("font_size").value;

    document.documentElement.style.setProperty(
        "--font-size",
        font_size + "px"
    );

    localStorage.setItem("font-size", font_size);

}

function updatefontfamily() {

    const font_family =
        document.getElementById("font_family").value;

    document.documentElement.style.setProperty(
        "--font-family",
        font_family
    );

    localStorage.setItem(
        "font-family",
        font_family
    );

}


function saveAllSettings() {
    const settings = {
        
        font_family: document.getElementById("font_family").value,
        font_size: Number(document.getElementById("font_size").value),

        
        compress_bms: document.getElementById("compress_bms").checked,
        format_cOCF: document.getElementById("format_cOCF").checked,

        
        Y_Terms: Number(document.getElementById("Y_Terms").value),
        BMS_Terms: Number(document.getElementById("BMS_Terms").value),

        
        Scratch_bar_height: Number(document.getElementById("Scratch_bar_height").value),

        
        ROWHEIGHT: Number(document.getElementById("ROWHEIGHT").value),
        COLUMNWIDTH: Number(document.getElementById("COLUMNWIDTH").value),
        LINETHICKNESS: Number(document.getElementById("LINETHICKNESS").value),
        NUMBERSIZE: Number(document.getElementById("NUMBERSIZE").value),
        NUMBERTHICKNESS: Number(document.getElementById("NUMBERTHICKNESS").value),

        
        MAXDIMENSIONS: Number(document.getElementById("MAXDIMENSIONS").value),
        MaxTerms: Number(document.getElementById("MaxTerms").value),

        
        STACKMODE: document.getElementById("STACKMODE").checked,
        HIGHLIGHT: document.getElementById("HIGHLIGHT").checked,
        EXTRADIVIDER: document.getElementById("EXTRADIVIDER").checked,
        _UPDATEMODE: document.getElementById("_UPDATEMODE").checked
    };

    localStorage.setItem("lngi_app_settings", JSON.stringify(settings));
}


function loadAllSettings() {
    const savedData = localStorage.getItem("lngi_app_settings");
    if (!savedData) return;

    try {
        const settings = JSON.parse(savedData);

        
        const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const setCheck = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.checked = val; };

        
        setVal("font_family", settings.font_family);
        setVal("font_size", settings.font_size);
        setCheck("compress_bms", settings.compress_bms);
        setCheck("format_cOCF", settings.format_cOCF);
        setVal("Y_Terms", settings.Y_Terms);
        setVal("BMS_Terms", settings.BMS_Terms);
        setVal("Scratch_bar_height", settings.Scratch_bar_height);
        setVal("ROWHEIGHT", settings.ROWHEIGHT);
        setVal("COLUMNWIDTH", settings.COLUMNWIDTH);
        setVal("LINETHICKNESS", settings.LINETHICKNESS);
        setVal("NUMBERSIZE", settings.NUMBERSIZE);
        setVal("NUMBERTHICKNESS", settings.NUMBERTHICKNESS);
        setVal("MAXDIMENSIONS", settings.MAXDIMENSIONS);
        setVal("MaxTerms", settings.MaxTerms);
        setCheck("STACKMODE", settings.STACKMODE);
        setCheck("HIGHLIGHT", settings.HIGHLIGHT);
        setCheck("EXTRADIVIDER", settings.EXTRADIVIDER);
        setCheck("_UPDATEMODE", settings._UPDATEMODE);

        
        if (typeof updatefontfamily === "function") updatefontfamily();
        if (typeof updatefontsize === "function") updatefontsize();
        if (document.getElementById("Scratch_bar_height")) {
            document.documentElement.style.setProperty("--scratch-bar-height", settings.Scratch_bar_height + "px");
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage:", e);
    }
}
