function ntl(m) {
    var ord = `1,${Math.max(1,Math.floor(m))}`
    var steps = 0
    var m = 1-m%1
    while (steps < 40 && ord.length < 500 && ord.split(",").at(-1)<1e8) {
        var ll = ord.length
        if (m <= 1e-10) {
            break
        }
        var exp = 0
        while (m <= 1) {
            m = m * 2
            exp = exp+1
        }
        var base = expand(ord, 8).split(",")
        var ordl = ord.split(",").length
        ord = base.slice(0, ordl + exp - 1).join(",")
        steps = steps + 1
        var lm = ord.length
        m = m - 1
        if (ord.split(",").at(-1) == 1) {
            ord = ord.split(",")
            ord.pop()
            ord = ord.join(",")
            break
        }
    }
    return ord
}

function num_to_lngi(m) {
    var m = m - m%1 + 0.5 + 0.5 * (m % 1)
    return ntl(m)
}

//Start time: 25/6 2026 utc+8
const st = 1782316800000

function num_time(t) {
    var t = Math.max(0, t - st)
    if (t == 0) {
        return `Not started yet. Wait for the clock to hit.<br>Time left: <span style="font-size: 150%">${((st-Date.now())/1000).toFixed(3)}s</span>`
    } else {
        var u = Math.log10(t / (86400000*3) + 1) * 0.5 + 3.5
        if (u > 4) {
            u = u**0.5 * 2 //massive softcap... right
        }
        return `Current ordinal: <br><span style="font-size: 150%">${num_to_lngi(u)}</span>`
    }
}

function update() {
    dg("main_lngi").innerHTML = `<i>${num_time(Date.now())}</i>`
}

setInterval(update,1,1)