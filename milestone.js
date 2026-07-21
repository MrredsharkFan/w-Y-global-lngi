//will be added soon

//[] -> sup
//{} -> sub

var milestones = [
    ["1,2", "w / (0)(1)", "First Limit Ordinal, and the start of the journey."],
    ["1,2,2", "w[2] / (0)(1)(1)", "Growth rate of Conway's Chained Array Notation."],
    ["1,2,3", "w[w] / (0)(1)(2)", "The growth rate of Linear Array Notations."],
    ["1,2,4", "ep{0} / (0)(1,1)", "SCO (Small Cantor Ordinal), also the Proof-Theortic Ordinal (PTO) of Peano Arithematic, and the limit of PrSS"],
    ["1,2,4,6", "z{0} / (0)(1,1)(2,1)", "CO (Cantor Ordinal)"],
    ["1,2,4,6,7", "phi(w,0) / (0)(1,1)(2,1)(3)", "HCO (Hyper Cantor Ordinal), also the limit of LPrSS"],
    ["1,2,4,6,8", "phi(1,0,0) / G{0} / (0)(1,1)(2,1)(3,1)", "FSO, also the limit of Transfinite LPrSS"],
    ["1,2,4,7", "psi(W{2}) / (0)(1,1)(2,2)", "BHO (Bachmann-Howard Ordinal), and it's time for a collapse in Ordinal Markup!"],
    ["1,2,4,7,9,12", "psi(W{2}psi{1}(W{2})) / (0)(1,1)(2,2)(3,1)(4,2)", "Endgame of Ordinal Markup, if you guys are wondering..."],
    //p(W_2*p1(W_2))
    ["1,2,4,7,11", "psi(W{3}) / (0)(1,1)(2,2)(3,3)", "Fun fact, I just returned to HK when this ordinal was reached, and I was on the plane!"],
    ["1,2,4,7,11,16", "psi(W{4}) / (0)(1,1)(2,2)(3,3)(4,4)", "Hmph why is this taking so long"],
    ["1,2,4,8", "psi(W{w}) / (0)(1,1,1)", "BO (???? Ordinal), the start of the 3-row BMS series!"],
    ["1,2,4,8,10", "psi(W{w}*W) / (0)(1,1,1)(2,1)", "This is the point where BMS upgrades. But w-Y, or anything above 1-Y, doesn't yet!"],
    ["1,2,4,8,11", "psi(W{w}*W{2}) / (0)(1,1,1)(2,1)(1,1)(2,2,1)(3,2)", "This is the TRUE upgrading point of Y sequence."],
    ["1,2,4,8,11,8", "psi(W{w}[2]) / (0)(1,1,1)(2,1)(1,1,1)", "Here's the result of the upgrade!"],
    ["1,2,4,8,11,15", "psi(W{w+1}) / (0)(1,1,1)(2,1)(3,2)", "TFBO, Limit of Buchholz's OCF"],
    ["1,2,4,8,12", "psi(W{w[2]}) / (0)(1,1,1)(2,1,1)", "This is somewhat similar to z0, in terms of structure. Not sure how though..."],
    ["1,2,4,8,12,14", "psi(W{W}) / (0)(1,1,1)(2,1,1)(3,1)", "Bird's Ordinal (BIO), BAN's limit before extensions."],
    ["1,2,4,8,12,15,9", "psi(I) / (0)(1,1,1)(2,1,1)(3,1)(2)", "Extended Buchholz Ordinal (EBO), we have to use a new type of uncountables, inaccessibles beyond here."],
    ["1,2,4,8,12,15,19", "psi(W{I+1}) / (0)(1,1,1)(2,1,1)(3,1)(4,2)", "Jager's Ordinal (JO)"],
    ["1,2,4,8,12,16", "psi(I{w}) / (0)(1,1,1)(2,1,1)(3,1,1)", "Small Inaccessible Ordinal (SIO), and the limit of Address Notation."],
    ["1,2,4,8,12,16,13", "psi(I(w,0)) / (0)(1,1,1)(2,1,1)(3,1,1)(3)", "Battery Management System Ordinal (BMSO), and limit of aSAN-1."],
    ["1,2,4,8,12,16,16", "psi(M{w}) / (0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)", "Small Mahlo Ordinal (SMO)"],
    ["1,2,4,8,12,16,20", "psi(K{w}) / (0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)", "Small Weakly Compact Ordinal (SKO)"],
    ["1,2,4,8,13", "psi(&Pi;{w}) / (0)(1,1,1)(2,2)", "Small Stergert Ordinal (SSO), and limit of pDAN."],
    ["1,2,4,8,13,20", "(0)(1,1,1)(2,2)(3,3,1)", "Filler."],
    ["1,2,4,8,14", "(0)(1,1,1)(2,2,1)", "Uh oh I forgor"],
    ["1,2,4,8,14,12,18,13", "(0)(1,1,1)(2,2,1)(2,1,1)(3,2,1)(3)", "Limit of Secondary Dropping Array Notation."],
    ["1,2,4,8,14,15", "(0)(1,1,1)(2,2,1)(3)", "Small Dropping Ordinal (SDO), similar to &phi;(&omega;,0) in structure, and is the limit of SAN, TON (projceted) and several more!"],
    ["1,2,4,8,14,21", "(0)(1,1,1)(2,2,1)(3,3)", "Upper bound of Weakly Compact OCFs."],
    ["1,2,4,8,15", "(0)(1,1,1)(2,2,2)", "Limit of Degrees of Reflection (Optimal)."],
    ["1,2,4,8,15,22,27", "(0)(1,1,1)(2,2,2)(3,2,2)(4,2)", "Limit of Weak Superstrong Binary Notation III. (is this even defined?)"],
    ["1,2,4,8,15,22,27,16", "(0)(1,1,1)(2,2,2)(3,2,2)(4,2)(3)", "Limit of Aarex's Superstrong Binary Notation."],
    ["1,2,4,8,16", "(0)(1,1,1,1)", "Trio Sequence System Ordinal (TSSO), and the start of 4 row! It's only going to be quicker."],
    ["1,2,4,8,16,32", "(0)(1,1,1,1,1)", "Quad Sequence System Ordinal (QSSO)"],
    ["1,2,4,8,16,32,1", "(0)(1,1,1,1,1)(0)", "There is a common joke going around in QQ where hypcos banned some guys in this exact sequence of minutes.<br>Exactly QSSO+1."],
    ["1,2,4,8,16,32,64", "(0)(1,1,1,1,1,1)", "Quin Sequence System Ordinal (QiSSO)"],
    ["1,3", "(0)(1[w])", "Small Hydra Ordinal! (SHO), Since we are using the strong version (there's no going back), it will desync from normal DBMS...<br>This might be the PTO of Z<sub>2</sub> tho... It's unproven!"],
    ["1,3,2,5,6,4,9,13,19,21", "(0)(1[W])", "There is a MASSIVE upgrade here. &Omega; rows of BMS is too easy!? (IDK if this sequence is correct tho...)"],
    ["1,3,2,5,6,5", "1,3,4,3 (1-Y) / (0)(1,,1)(2)(1,,1)", "Guo Bu Qu De Ordinal (GHO), since this upgrade is so powerful, people investigated deeply into it, and we still don't know how that happened"],
    ["1,3,2,5,7", "1,3,4,7,9 (1-Y) / (0)(1,,1)(2)(3,1,,1)(4,1)", "They align weirdly"],
    ["1,3,3", "1,3,5 (1-Y) / (0)(1,,1)(2,,1)", "Weak &omega;<sup>2</sup> rows if you REALLY want to bargain about it"],
    ["1,3,4", "1,3,6 (1-Y) / (0)(1,,1)(2,1,,1)", "There is a reason why there isn't much analysis done on strong magma."],
    ["1,3,5", "1,3,7 (1-Y) / (0)(1,,1)(2,,2)", "I believe there's not much analysis with strong magma... They might not even be accurate!"],
    ["1,3,6", "1,3,7,14 (1-Y) / (0)(1,,1)(2,,2)(3,,2)", "1,3,8 has some sort of charm that makes them catch. How lovely!?"],
    ["1,3,7", "1,3,7,15 (1-Y) / (0)(1,,1)(2,,2)(3,,2)", "This is interesting, the 3rd number lined up"],
    ["1,3,8", "1,3,8 (1-Y) / (0)(1,,1)(2,1,,2)", "The theortical first catching point of weak & strong magmas of w-Y."],
    ["1,3,9", "1,3,9 (1-Y) / (0)(1,,1)(2,1,,2,1)", "Important but since nothing reaches here, this is filler. also w+1 rows of DBMS."],
    ["1,3,10", "1,4 (1-Y) / (0)(1,,1,,1)", "w2 rows of DBMS."],
    ["1,4", "1,w (1-Y) / (0)((1,,)[w]) / (0)(1,,,1)", "Limit of 1-Y."],
]

var milestone_time = []
var milestone_rank = []

//transform all milestones
for (var i in milestones) {
    milestones[i][1] = milestones[i][1].replaceAll("[", "<sup>")
        .replaceAll("]", "</sup>")
        .replaceAll("{", "<sub>")
        .replaceAll("}", "</sub>")
        .replaceAll("w", "&omega;")
        .replaceAll("z", "&zeta;")
        .replaceAll("phi", "&phi;")
        .replaceAll("G", "&Gamma;")
        .replaceAll("psi", "&psi;")
        .replaceAll("ep", "&epsilon;")
        .replaceAll("W", "&Omega;")
    var p = search_time(milestones[i][0])
    milestone_time[i] = p[0]
    console.log(p)
    milestone_rank[i] = p[1]
}

function update_milestones(page) {
    if (page < 0) {
        mpage = 0;
        var page = 0
    }
    var L = milestones.length
    const P = document.getElementsByClassName("tmilestone-box");
    var ct = get_time(Date.now() - st)
    for (var i = 0; i < 5; i++) {
        var M = page * 5 + i
        if (M < L) {
            var T = Date.now() - get_time_inv(milestone_time[M]) - st
            var R = milestone_rank[M]
            P[i].style.visibility = "visible"
            P[i].style["background-image"] = `linear-gradient(45deg,${(ct >= milestone_time[M]) ? `rgba(140,255,140,${1-R * 0.03})` : `rgba(255,140,140,${1-R * 0.03})`},white)`
            P[i].innerHTML = `
            <div style="display: flex; flex-direction: row">
                <div style="flex: 1; font-size: 150%">${milestones[M][0]}</div>
                <div style="flex: 1; text-align: right">
                    <span style="font-size: 120%">${milestones[M][1]}</span>
                    ${T<0?`<br>in ${formatSeconds(-T/1000)}`:``}
                </div>
            </div><hr>
            ${milestones[M][2]}`
        } else {
            P[i].style.visibility = "hidden"
            P[i].innerHTML = ""
        }
    }
    document.getElementById("mpage").innerHTML = mpage+1
}