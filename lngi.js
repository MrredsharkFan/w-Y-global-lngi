// convert second to day,hour,minutes
function formatSeconds(totalSeconds) {
    if (totalSeconds <= 0) return "0 seconds";

    // 1. Calculate the values and update the remainder using %=
    let s = totalSeconds;
    const days    = Math.floor(s / 86400);    s %= 86400;
    const hours   = Math.floor(s / 3600);     s %= 3600;
    const minutes = Math.floor(s / 60);       s %= 60;
    const seconds = s;

    // 2. Helper function to handle plurals and skip zeros
    const p = (val, unit) => val > 0 ? `${val} ${unit}${val > 1 ? 's' : ''}` : null;

    // 3. Build the array and filter out the nulls (zeros)
    const parts = [
        p(days,    'day'),
        p(hours,   'hour'),
        p(minutes, 'minute'),
        p(seconds.toFixed(2), 'second')
    ];

    return parts.filter(Boolean).join(' ');
}
// reason for 40 : because at line 72 you stop if steps >= 40
function scratch_bar_init() {
    //scratch bars!!!
    for (var i = 0; i < 40; i++){
        const p = document.createElement("div")
        p.style.height = "6.25%";
        p.style.position = "absolute";
        p.style.top = `${i * 6.25}%`
        p.id = `bar_${i}`
        p.style.textWrap = `nowrap`
        document.getElementById("scratch_bars").appendChild(p)
    }
}

var lt = 0
function update_scratch_bars(x) {
    for (var i = 0; i < 40; i++){
        if (i < super_list.length) {
            var t = get_time_inv(x + super_list[i][2] / (2 ** super_list[i][1] / 2))
            
            // Calculate seconds remaining from now until the target time (t + st)
            const secondsLeft = Math.max(0, ((t + st) - Date.now()) / 1000);

            document.getElementById(`bar_${i}`).style.visibility = "visible"
            document.getElementById(`bar_${i}`).innerHTML =
                `${super_list[i][0]} <small>(${((1 - super_list[i][2]) * 100).toFixed(2)}% / 
                ${formatSeconds(secondsLeft)} left)</small>`
                
            document.getElementById(`bar_${i}`).style.backgroundColor = `hsl(${super_list[i][1] * 10},100%,90%)`
            document.getElementById(`bar_${i}`).style.width = `${(1 - super_list[i][2]) * 100}%`
            if (i+1 == super_list.length) {
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
    var m = 1 - m % 1
    while (steps < 40 && ord.length < 500 && ord.split(",").at(-1) < 1e8) {
        if (m <= 1e-10) {
            break
        }
        var exp = 0
        while (m <= 1) {
            steps = steps + 1
            m = m * 2
            exp = exp + 1
        }
        var base = Y_Sequence.fs(ord, 8).split(",")
        var ordl = ord.split(",").length
        ord = base.slice(0, ordl + exp - 1).join(",")
        m = m - 1
        super_list = super_list.concat([[ord, steps, m]])
        if (ord.split(",").at(-1) == 1) {
            ord = ord.split(",")
            ord.pop()
            ord = ord.join(",")
            break
        }
    }
    return [ord, m, exp]
}

function num_to_lngi(m) {
    var m = m - m % 1 + 0.5 + 0.5 * (m % 1)
    return ntl(m)
}

//Start time: 25/6 UTC+8 | 23:00
const st = (1782316800000+23*3600000)
let BMS_LNGI, OCF_LNGI;

function get_time(t) {
    return Math.log10(1 + t / 864000)/2 + 2
}

function get_time_inv(n) {
    return (10**((n-2)*2) - 1)*864000
}

function num_time(t) {
    var t = Math.max(0, t - st)
    if (t == 0) {
        return `Not started yet. Wait for the clock to hit.<br>Time left: <span style="font-size: 150%">${((st - Date.now()) / 1000).toFixed(3)}s</span>`
    } else {
        var u = get_time(t)
        var j = num_to_lngi(u)

        if (Y_Sequence.cmp(j[0], '1,2,4,8,16,32,64,128,256,512,1024') == -1) BMS_LNGI = Conv_Y_sequence(j[0]); else BMS_LNGI = "" //max 10 rows to ensure the program doesn't freak out ig

        if (Y_Sequence.cmp(j[0], '1,2,4,8,13') == -1) OCF_LNGI = Conv_OCF(BMS_LNGI); else OCF_LNGI = ""  //SSO

        if (Array.isArray(BMS_LNGI)) BMS_LNGI = BMS_LNGI.map(p => `(${p.join(',')})`).join(''); // convert to string for display
    
        document.getElementById("main_lngi_bar").style.width = `${(1-j[1]) * 100}%`
        update_scratch_bars(u)
        return `Current ordinal [<small>${((1 - j[1]) * 100).toFixed(3)}% | ${formatSeconds(lt)} to next</small>]<br><span style="font-size: 150%">${j[0]}</span>`
    }
}

var tps = 0
var last_tick = 0
function update() {
    tps = 1000 / (Date.now() - last_tick)
    last_tick = Date.now()
    document.getElementById("main_lngi").innerHTML = `<i>${num_time(Date.now())}</i>`
    document.getElementById("BMS_lngi").innerHTML = BMS_LNGI == "" ? ">1,3 / (0)(1<sup>&omega;</sup>)" : `<i>BMS conversion may be inaccurate due to upgrade displacement</i><br>&approx;${BMS_LNGI}`
    document.getElementById("OCF_lngi").innerHTML = OCF_LNGI == "" ? ">SSO" : `OCF/OCN (Same as BMS):<br>${OCF_LNGI}`
    document.getElementById("tps").innerHTML = `Running at ${tps.toFixed(1)} tps`
    
    // Calculate total elapsed seconds and run it through formatSeconds
    const elapsedSeconds = Math.max(0, (Date.now() - st) / 1000);
    document.getElementById("time").innerHTML = `Time elapsed: ${formatSeconds(elapsedSeconds)}`

    //idk but i took inspiration from meta omega zero layers thing
    document.title = `ω-Y LNGI: <${super_list.slice(0,10).at(-1)[0]}`
    
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
