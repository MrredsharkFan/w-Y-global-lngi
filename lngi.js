function ntl(m) {
    var ord = `1,${Math.max(1, Math.floor(m))}`
    var steps = 0
    var m = 1 - m % 1
    while (steps < 40 && ord.length < 500 && ord.split(",").at(-1) < 1e8) {
        var ll = ord.length
        if (m <= 1e-10) {
            break
        }
        var exp = 0
        while (m <= 1) {
            m = m * 2
            exp = exp + 1
        }
        var base = Y_Sequence.fs(ord, 8).split(",")
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
    return [ord, m]
}

function num_to_lngi(m) {
    var m = m - m % 1 + 0.5 + 0.5 * (m % 1)
    return ntl(m)
}

//Start time: 25/6 2026 utc+8
const st = 1782316800000
let BMS_LNGI, OCF_LNGI;

function num_time(t) {
    var t = Math.max(0, t - st)
    if (t == 0) {
        return `Not started yet. Wait for the clock to hit.<br>Time left: <span style="font-size: 150%">${((st - Date.now()) / 1000).toFixed(3)}s</span>`
    } else {
        var u = Math.log10(t / (86400000 * 3) + 1) * 0.5 + 3.5
        if (u > 4) {
            u = u ** 0.5 * 2 //massive softcap... right
        }
        var j = num_to_lngi(u)

        if (Y_Sequence.cmp(j[0], '1,3') == -1) BMS_LNGI = Conv_Y_sequence(j[0]); else BMS_LNGI = ""//Lim(BMS)

        if (Y_Sequence.cmp(j[0], '1,2,4,8,13') == -1) OCF_LNGI = Conv_OCF(BMS_LNGI); else OCF_LNGI = ""  //SSO

        if (Array.isArray(BMS_LNGI)) BMS_LNGI = BMS_LNGI.map(p => `(${p.join(',')})`).join(''); // convert to string for display
      //     ^^^^^^ this is essential because when we end BMS, BMS_LNGI = '' is a string, but we still treat it as a array so there must be a block right here

        return `Current ordinal [<small>${((1 - j[1]) * 100).toFixed(3)}% to next</small>]<br><span style="font-size: 150%">${j[0]}</span>`
    }
}

function update() {
    document.getElementById("main_lngi").innerHTML = `<i>${num_time(Date.now())}</i>`
    document.getElementById("BMS_lngi").innerHTML = `<i>BMS<br><span style="font-size: 150%">${BMS_LNGI}</span></i>`
    document.getElementById("OCF_lngi").innerHTML = `<i>OCF<br><span style="font-size: 150%">${OCF_LNGI}</span></i>`
    requestAnimationFrame(update); // this is better than setinterval.
    // explain : setinterval uses client clock which sometime desync which cause lagging on some devices. requestAnimationFrame synchronizes with the browser's rendering.
}

requestAnimationFrame(update);
