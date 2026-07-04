var tt = 0
// convert second to day,hour,minutes
function formatSeconds(totalSeconds) {
    if (totalSeconds <= 0) return "0 seconds";

    // 1. Calculate the values and update the remainder using %=
    let s = totalSeconds;
    const days = Math.floor(s / 86400); s %= 86400;
    const hours = Math.floor(s / 3600); s %= 3600;
    const minutes = Math.floor(s / 60); s %= 60;
    const seconds = s;

    // 2. Helper function to handle plurals and skip zeros
    const p = (val, unit) => val > 0 ? `${val} ${unit}${val > 1 ? 's' : ''}` : null;

    // 3. Build the array and filter out the nulls (zeros)
    const parts = [
        p(days, 'day'),
        p(hours, 'hour'),
        p(minutes, 'minute'),
        p(seconds.toFixed(2), 'second')
    ];

    return parts.filter(Boolean).join(' ');
}
function scratch_bar_init() {
    //scratch bars!!!
    for (var i = 0; i < 53; i++) {
        const p = document.createElement("div")
        p.style.height = "6.25%";
        p.style.position = "absolute";
        p.style.top = `${i * 6.25}%`
        p.id = `bar_${i}`
        p.style.textWrap = `nowrap`
        document.getElementById("scratch_content").appendChild(p)
    }
}

var lt = 0
function update_scratch_bars(x) {
    for (var i = 0; i < 53; i++) {
        if (i < super_list.length) {
            var u = x + super_list[i][2] / (2 ** super_list[i][1] / 2)
            if (i == 0) {
                u = Math.ceil(x)
            }
            var t = get_time_inv(u)

            // Calculate seconds remaining from now until the target time (t + st)
            const secondsLeft = Math.max(0, ((t + st) - Date.now()) / 1000);
            if (page == 1) {
                document.getElementById(`bar_${i}`).style.visibility = "visible"
                if (page == 1) {
                    document.getElementById(`bar_${i}`).innerHTML =
                        `${convert_From_wY(super_list[i][0] + (i == super_list.length - 1 ? ",1" : ""), scratch_bar_display)} <small>(${((1 - super_list[i][2]) * 100).toFixed(2)}% / 
                ${tt == 0 ? `${formatSeconds(secondsLeft)} left` : `in ${new Date(secondsLeft * 1000 + Date.now()).toLocaleString()}`})</small>`

                    document.getElementById(`bar_${i}`).style.backgroundColor = `hsl(${super_list[i][1] * 10},100%,90%)`
                    document.getElementById(`bar_${i}`).style.width = `${(1 - super_list[i][2]) * 100}%`
                }
            }
            if (i + 1 == super_list.length) {
                lt = secondsLeft
            }
        } else {
            document.getElementById(`bar_${i}`).style.visibility = "hidden"
        }
    }
}

scratch_bar_init()

var super_list = []


function ntl(m) {
    super_list = []
    var ord = `1,${Math.max(1, Math.floor(m))}`
    var steps = 0
    var m = 1 - (m % 1)
    while (ord.length < 100 && ord.split(",").at(-1) < 1e8 && steps < 53) {
        super_list = super_list.concat([[ord, steps, m]])
        if (m <= 1e-14) {
            break
        }
        var exp = 0
        while (m <= 1) {
            steps = steps + 1
            m = m * 2
            exp = exp + 1
        }
        var base = Y_Sequence.fs(ord, exp).split(",")
        var ordl = ord.split(",").length
        ord = base.slice(0, ordl + exp - 1).join(",")
        m = m - 1
        if (ord.split(",").at(-1) == 1) {
            ord = ord.split(",");
            ord.pop();
            ord = ord.join(",");

            super_list.push([ord, steps, m]);

            steps = 69
            break;
        }
    }
    if (steps == 53) {
        ord = ord.split(",");
        ord.pop();
        ord = ord.join(",");
        //probably?
    }
    return [ord, m, exp]
}

function num_to_lngi(m) {
    var m = m - m % 1 + 0.5 + 0.5 * (m % 1)
    return ntl(m)
}

function get_time(t) {
    return (Math.log10(1 + t / 864000) / 2 + 2)
}

function get_time_inv(n) {
    return (10 ** ((n - 2) * 2) - 1) * 864000
}

function renderAnalysisPanels() {

    analysisContainer.innerHTML = "";

    analysisPanels.forEach((panel, index) => {

        const card = document.createElement("div");

        card.className = "card resizable analysis-panel";
        card.style.flexBasis = `calc(${panel.width}% - 15px)`;
        card.style.backgroundColor = `hsl(${panel.hue}, 85%, 82%)`;

        card.innerHTML = `

<div class="analysis-header">

<button class="remove">Remove</button>

Width

<select class="width">

<option value="33">33%</option>
<option value="50">50%</option>
<option value="66">66%</option>
<option value="100">100%</option>

</select>

Notation

<select class="notation">

<option value="wY">ω-Y</option>
<option value="BMS">BMS</option>
<option value="OCN">OCN</option>
<option value="cOCF">cOCF</option>

</select>

</div>

<div class="analysis-content"></div>

<div class="resize-handle"></div>

`;

        card.querySelector(".width").value = panel.width;
        card.querySelector(".notation").value = panel.notation;

        panel.element = card.querySelector(".analysis-content");

        card.querySelector(".remove").onclick = () => {

            analysisPanels.splice(index, 1);

            renderAnalysisPanels();

        };

        card.querySelector(".width").onchange = e => {
            panel.width = Number(e.target.value);
            if (e.target.value == 100)
                card.style.flexBasis = `calc(${panel.width}%)`;
            else
                card.style.flexBasis = `calc(${panel.width}% - 15px)`;

        };

        card.querySelector(".notation").onchange = e => {

            panel.notation = e.target.value;

        };

        analysisContainer.appendChild(card);

        makeResizable(card);

    });

}

document.getElementById("analysis_add").onclick = () => {

    analysisPanels.push({

        notation: document.getElementById("analysis_add_type").value,
        width: 50,
        hue: Math.floor(Math.random() * 360)

    });

    renderAnalysisPanels();

};

renderAnalysisPanels();

//Start time: 25/6 UTC+8 | 23:00
var st = (1782316800000 + 23 * 3600000) + 864 * 1000

//checking
//var d = 4.0056
//var st = Date.now() - get_time_inv(d) //for the uhm, testing (d = start num)


function num_time(t) {
    var t = Math.max(0, t - st)
    if (t == 0) {
        return `Not started yet. Wait for the clock to hit.<br>Time left: <span style="font-size: 150%">${((st - Date.now()) / 1000).toFixed(3)}s</span>`
    } else {
        var u = get_time(t)
        var j = num_to_lngi(u)

        document.getElementById("main_lngi_bar").style.width = `${(1 - j[1]) * 100}%`
        update_scratch_bars(u)
        document.getElementById("main_lngi_bar").style.backgroundColor = lt / j[1] < 1 ? `hsl(100,90%,70%)` : `hsl(${(1 - j[1]) * 100},90%,70%)`
        return [`${((1 - j[1]) * 100).toFixed(3)}%`, formatSeconds(lt), j[0]]
    }
}

var tps = 0
var last_tick = 0
function update() {
    tps = 1000 / (Date.now() - last_tick)
    last_tick = Date.now()
    var u = num_time(Date.now())
    document.getElementById("main_lngi_Content").innerHTML = `<i>${u[2]}</i>`
    document.getElementById("main_lngi_bar").innerHTML = `${u[0]} to next ordinal (${u[1]} left)`
    document.getElementById("tps").innerHTML = `${tps.toFixed(1)} tps`
    if (page == 3) document.getElementById("input").value = u[2]
    analysisPanels.forEach(panel => {

        let txt = "";

        switch (panel.notation) {

            case "wY":
                txt = "<i>" + u[2] + "</i>";
                break;

            case "BMS":
                txt = convert_From_wY(u[2], "BMS");
                break;

            case "OCN":
                txt = convert_From_wY(u[2], "OCN");
                break;

            case "cOCF":
                txt = convert_From_wY(u[2], "cOCF");
                break;

        }

        panel.element.innerHTML = txt;

    });

    // Calculate total elapsed seconds and run it through formatSeconds
    const elapsedSeconds = Math.max(0, (Date.now() - st) / 1000);
    document.getElementById("time").innerHTML = `Time elapsed: ${formatSeconds(elapsedSeconds)}`
    document.getElementById("time_mode").innerHTML = `${tt == 0 ? "Time remaining" : "Time reached"} (Press to change)`

    //idk but i took inspiration from meta omega zero layers thing
    document.title = `ω-Y LNGI: <${super_list.slice(0, 10).at(-1)[0]}`
    requestAnimationFrame(update);
}

requestAnimationFrame(update);