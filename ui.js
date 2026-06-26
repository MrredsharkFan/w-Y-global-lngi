// use to sync height between BMS_lngi and OCF_lngi
const bms = document.getElementById("BMS_lngi");
const ocf = document.getElementById("OCF_lngi");

function syncHeight(source, target) {
    const h = source.offsetHeight;
    target.style.height = h + "px";
}

new ResizeObserver(() => syncHeight(bms, ocf)).observe(bms);
new ResizeObserver(() => syncHeight(ocf, bms)).observe(ocf);