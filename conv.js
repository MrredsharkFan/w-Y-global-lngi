/*
BMS and Y_Sequence class Usage
BMS.[Functions] will call a function belong to BMS, and the same for Y_Sequence

- BMS.cmp will return -1,0,1
- BMS.fs(array,n) where array in the format [[collum1],[collum2],[collum3],...]
- BMS.isSuccessor return a boolean

the same for Y_Sequence, but importantly Y_Sequence output is string (except hInv,gInv,isSuccessor and cmp)
*/
class BMS {

    static cmp(m1, m2) {
        function sequence_compare(seq1, seq2) {
            if (seq1.length === 0) {
                if (seq2.length === 0) return 0;
                else return -1;
            } else {
                if (seq2.length === 0) return 1;
                else {
                    if (seq1[0] < seq2[0]) return -1;
                    else if (seq1[0] > seq2[0]) return 1;
                    else return sequence_compare(seq1.slice(1), seq2.slice(1));
                }
            }
        }

        if (m1 === "Limit" && m2 === "Limit") return 0;
        if (m1 === "Limit") return 1;
        if (m2 === "Limit") return -1;

        if (m1.length === 0) return m2.length === 0 ? 0 : -1;
        if (m2.length === 0) return 1;

        let col1 = m1[0];
        let col2 = m2[0];

        const diff = col1.length - col2.length;

        if (diff > 0) {
            col2 = col2.concat(Array(diff).fill(0));
        } else if (diff < 0) {
            col1 = col1.concat(Array(-diff).fill(0));
        }

        const c = sequence_compare(col1, col2);

        return c || this.cmp(m1.slice(1), m2.slice(1));
    }

    static isSuccessor(matrix) {
        return matrix !== "Limit" && (matrix.length === 0 || !matrix.at(-1)?.some(x => x !== 0));
    }

    static fs(m, FSterm) {
        if (m === "Limit") {
            if (FSterm === 0) return [[0]];
            return [
                Array(FSterm).fill(0),
                Array(FSterm).fill(1)
            ];
        }

        if (m.length === 0) {
            return [];
        }

        const parent_cache = Object.create(null);
        const ascending_cache = Object.create(null);

        function parent(x, y) {
            const key = `${x},${y}`;

            if (key in parent_cache) {
                return parent_cache[key];
            }

            let p = x;

            while ((p = y ? parent(p, y - 1) : p - 1) >= 0) {
                if (m[p][y] < m[x][y]) break;
            }

            return parent_cache[key] = p;
        }

        function ascending(r, x, y) {
            const key = `${r},${x},${y}`;

            if (key in ascending_cache) {
                return ascending_cache[key];
            }

            return ascending_cache[key] =
                r <= x &&
                (r === x || ascending(r, parent(x, y), y));
        }

        const endcol = m.length - 1;
        let result = m.slice(0, endcol);

        const child = m[endcol];
        const ymax = child.length - 1;

        let LNZ;

        for (LNZ = ymax; LNZ >= 0; --LNZ) {
            if (child[LNZ] > 0) break;
        }

        if (LNZ < 0) {
            return result;
        }

        const BR = parent(endcol, LNZ);
        const BRcolumn = m[BR];

        const offset = child.map((v, y) =>
            y < LNZ ? v - BRcolumn[y] : 0
        );

        const offsetAsc = Array(endcol)
            .fill(0, BR)
            .map((_, x) =>
                offset.map((v, y) =>
                    ascending(BR, x, y) ? v : 0
                )
            );

        for (let n = 1; n <= FSterm; n++) {
            for (let col = BR; col < endcol; col++) {
                result.push(
                    m[col].map(
                        (v, y) =>
                            v + offsetAsc[col][y] * n
                    )
                );
            }
        }

        if (
            ymax > 0 &&
            result.every(column => column[ymax] === 0)
        ) {
            result = result.map(column =>
                column.slice(0, ymax)
            );
        }

        return result;
    }

    static ZERO = [];

    static f(alpha, beta) {
        let n = 0;

        while (true) {
            const x = this.fs(beta, n);

            if (this.cmp(x, alpha) > 0) {
                return x;
            }

            n++;
        }
    }

    static g(alpha, beta, s) {
        while (true) {
            if (this.isSuccessor(beta)) return alpha;

            const split = this.f(alpha, beta);

            if (s === "") return split;

            const bit = s[0];
            s = s.slice(1);

            if (bit === "0") {
                beta = split;
            } else {
                alpha = split;
            }
        }
    }

    static gInv(alpha, beta, target) {
        let result = "";

        while (!this.isSuccessor(beta)) {
            const split = this.f(alpha, beta);
            const c = this.cmp(target, split);

            if (c === 0) break;

            if (c < 0) {
                result += "0";
                beta = split;
            } else {
                result += "1";
                alpha = split;
            }
        }

        return result;
    }

    static h(x, k = 0.5, maxlen = 100, eps = 1e-10) {
        let result = "";

        while (Math.abs(x - k) > eps && result.length < maxlen) {
            if (x < k) {
                result += "0";
                x = x / k;
            } else {
                result += "1";
                x = (x - k) / (1 - k);
            }
        }

        return result;
    }

    static hInv(s, k = 0.5) {
        let x = k;

        for (let i = s.length - 1; i >= 0; i--) {
            if (s[i] === "0") {
                x = k * x;
            } else {
                x = k + (1 - k) * x;
            }
        }

        return x;
    }
}

class Y_Sequence {

    static fs(s, n, legBasedAscension, stringify) {
        if (Array.isArray(s)) s = s.join(',');
        var lineBreakRegex = /\r?\n/g;
        var itemSeparatorRegex = /[\t ,]/g;
        if (s == "Limit") return '1,' + String(n + 2);
        function parseSequenceElement(s, i) {
            var strremoved = s;
            if (strremoved.indexOf("v") == -1 || !isFinite(Number(strremoved.substring(strremoved.indexOf("v") + 1)))) {
                var numval = Number(strremoved);
                return {
                    value: numval,
                    position: i,
                    parentIndex: -1
                };
            } else {
                return {
                    value: Number(strremoved.substring(0, strremoved.indexOf("v"))),
                    position: i,
                    parentIndex: Math.max(Math.min(i - 1, Number(strremoved.substring(strremoved.indexOf("v") + 1))), -1),
                    forcedParent: true
                };
            }
        }
        function equalVector(s, t, d) {
            if (d === undefined) d = 0;
            for (var i = d, l = Math.max(s.length, t.length); i < l; i++) {
                if ((s[i] || 0) != (t[i] || 0)) return false;
            }
            return true;
        }
        function addVector(s, t) {
            var r = [];
            for (var i = 0, l = Math.max(s.length, t.length); i < l; i++) {
                r.push((s[i] || 0) + (t[i] || 0));
            }
            return r;
        }
        function stBasis(d) {
            var r = [];
            while (r.length < d) r.push(0);
            r.push(1);
            return r;
        }
        function basis(d, k) {
            var r = [];
            while (r.length < d) r.push(0);
            r.push(k);
            return r;
        }
        function incrementCoord(s, d) {
            var r = s.slice(0);
            for (var i = 0; i < d; i++) r[i] = 0;
            return addVector(r, stBasis(d));
        }
        function addCoord(s, d, k) {
            var r = s.slice(0);
            for (var i = 0; i < d; i++) r[i] = 0;
            return addVector(r, basis(d, k));
        }
        function sumArray(s) {
            var r = 0;
            for (var i = 0; i < s.length; i++) r += s[i];
            return r;
        }
        function calcMountain(s, maxDim = Infinity) {
            if (maxDim === undefined) maxDim = Infinity;
            var coordOffset = typeof s == "object" ? s.coord : [];
            if (typeof s == "string") {
                s = s.split(itemSeparatorRegex).map(parseSequenceElement);
            }
            if (s instanceof Array && s.length <= 1) {
                return {
                    dim: 1,
                    arr: [{
                        dim: 0,
                        value: s[0].value,
                        strexp: s[0].strexp,
                        position: s[0].position,
                        coord: coordOffset.slice(0),
                        parentIndex: s[0].parentIndex,
                        forcedParent: s[0].forcedParent,
                        leftLegCoord: null,
                        rightLegCoord: null
                    }],
                    coord: coordOffset.slice(0)
                };
            } else if (!(s instanceof Array) && s.arr.length <= 1) {
                return s.arr[0];
            } else {
                var m;
                if (s instanceof Array) {
                    m = {
                        dim: 1,
                        arr: [],
                        coord: coordOffset.slice(0)
                    };
                    for (var i = 0; i < s.length; i++) {
                        m.arr.push({
                            dim: 0,
                            value: s[i].value,
                            strexp: s[i].strexp,
                            position: s[i].position,
                            coord: addCoord(coordOffset, 0, i),
                            parentIndex: s[i].parentIndex,
                            forcedParent: s[i].forcedParent,
                            leftLegCoord: null,
                            rightLegCoord: null
                        });
                        if (!s[i].forcedParent) {
                            for (var j = i; j >= 0; j--) {
                                if (s[j].value < s[i].value) {
                                    m.arr[i].parentIndex = j;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    m = s;
                }
                var lastPosition = sumArray(m.arr[m.arr.length - 1].coord);
                var dimensions = 1;
                while (dimensions <= maxDim) {
                    var uppers = calcDifference(m);
                    if (uppers.arr.length < 1) break;
                    var upperm = calcMountain(uppers, dimensions);
                    var upperdim = upperm.dim;
                    var raisedupperm = upperm;
                    while (raisedupperm.dim <= dimensions) {
                        raisedupperm = {
                            dim: raisedupperm.dim + 1,
                            arr: [raisedupperm],
                            coord: raisedupperm.coord.slice(0)
                        };
                    }
                    raisedupperm.coord = coordOffset.slice(0);
                    raisedupperm.arr.unshift(m);
                    m = raisedupperm;
                    dimensions++;
                }
                return m;
            }
        }
        function calcDifference(m) {
            var coordOffset = incrementCoord(m.coord, m.dim);
            var rightLegs = [];
            var rightLegTree = [];
            var rightLegPositions = [];
            if (m.dim == 1) {
                for (var i = 0; i < m.arr.length; i++) {
                    rightLegs.push(m.arr[i]);
                    rightLegTree.push(m.arr[i].parentIndex);
                    rightLegPositions.push(sumArray(m.arr[i].coord));
                }
            } else {
                for (var i = 0; i <= getLastPosition(m); i++) {
                    var node = findHighestWithPosition(m, i);
                    if (node) rightLegPositions.push(i);
                }
                for (var i = 0; i < rightLegPositions.length; i++) {
                    var node = findHighestWithPosition(m, rightLegPositions[i]);
                    rightLegs.push(node);
                    var pn = node;
                    while (pn) {
                        var ppn = parent(m, pn);
                        if (!ppn) ppn = leftLeg(m, pn);
                        if (!ppn) {
                            rightLegTree.push(-1);
                            break;
                        }
                        pn = ppn;
                        if (pn.parentIndex == -1 && rightLegPositions.indexOf(sumArray(pn.coord)) != -1) {
                            rightLegTree.push(rightLegPositions.indexOf(sumArray(pn.coord)));
                            break;
                        }
                    }
                    if (!pn) rightLegTree.push(-1);
                }
            }
            var rightLegInR = [];
            var rInRightLeg = [];
            var rightLegParents = [];
            var r = {
                dim: 1,
                arr: [],
                coord: coordOffset
            };
            for (var i = 0; i < rightLegs.length; i++) {
                var pi = i;
                while (pi > -1 && !(rightLegs[pi].value < rightLegs[i].value && (rightLegs[pi].coord[m.dim - 1] || 0) < (rightLegs[i].coord[m.dim - 1] || 0))) pi = rightLegTree[pi];
                rightLegParents.push(pi);
                if (pi != -1) {
                    rightLegInR.push(r.arr.length);
                    rInRightLeg.push(i);
                    r.arr.push({
                        dim: 0,
                        value: rightLegs[i].value - rightLegs[pi].value,
                        position: rightLegPositions[i],
                        coord: addCoord(coordOffset, 0, rightLegPositions[i] - sumArray(coordOffset)),
                        parentIndex: -1,
                        forcedParent: true,
                        leftLegCoord: rightLegs[pi].coord.slice(0),
                        rightLegCoord: rightLegs[i].coord.slice(0)
                    });
                } else {
                    rightLegInR.push(-1);
                }
            }
            for (var i = 0; i < r.arr.length; i++) {
                var pi = rInRightLeg[i];
                while (true) {
                    var ppi = rightLegParents[pi];
                    if (ppi == -1 || rightLegInR[ppi] == -1) break;
                    pi = ppi;
                    if (r.arr[rightLegInR[pi]].value < r.arr[i].value) {
                        r.arr[i].parentIndex = rightLegInR[pi];
                        break;
                    }
                }
            }
            return r;
        }
        function indexFromCoord(m, coord, d) {
            if (d === undefined) d = 0;
            var r = [];
            while (true) {
                if (m.dim <= d) {
                    if (equalVector(m.coord, coord, d)) return r;
                    else return null;
                }
                if (m.dim == 1) {
                    for (var i = 0; i < m.arr.length + 1; i++) {
                        if (i == m.arr.length) return null;
                        if (m.arr[i].coord[0] == coord[0]) {
                            r.push(i);
                            m = m.arr[i];
                            break;
                        }
                    }
                } else {
                    var i = coord[m.dim - 1] || 0;
                    if (i >= m.arr.length) return null;
                    r.push(i);
                    m = m.arr[i];
                }
            }
        }
        function findByIndex(m, index) {
            if (!index) return null;
            for (var i = 0; i < index.length; i++) m = m.arr[index[i] < 0 ? m.arr.length + index[i] : index[i]];
            return m;
        }
        function findByCoord(m, coord, d) {
            return findByIndex(m, indexFromCoord(m, coord, d));
        }
        function getLastPosition(m) {
            while (m.dim > 1) m = m.arr[0];
            return m.arr[m.arr.length - 1].position;
        }
        function findHighestWithPosition(m, position) {
            if (m.dim == 0) {
                if (m.position == position) return m;
                else null;
            } else {
                if (m.arr.length === 0) return null;
                if (m.dim == 1) {
                    var min = 0;
                    var max = m.arr.length - 1;
                    if (m.arr[min].position > position || m.arr[max].position < position) return null;
                    if (m.arr[min].position == position) return m.arr[min];
                    if (m.arr[max].position == position) return m.arr[max];
                    while (min != max) {
                        var mid = Math.floor((min + max) / 2);
                        if (m.arr[mid].position == position) return m.arr[mid];
                        else if (min == mid) return null;
                        else if (m.arr[mid].position < position) min = mid;
                        else if (m.arr[mid].position > position) max = mid;
                    }
                    return null;
                } else {
                    for (var i = m.arr.length - 1; i >= 0; i--) {
                        var lowestRow = m.arr[i];
                        while (lowestRow && lowestRow.dim > 1) lowestRow = lowestRow.arr[0];
                        if (!lowestRow) continue;
                        var nodeInLowestRow = findHighestWithPosition(lowestRow, position);
                        if (nodeInLowestRow) {
                            if (m.dim == 2) return nodeInLowestRow;
                            else return findHighestWithPosition(m.arr[i], position);
                        }
                    }
                    return null;
                }
            }
        }
        function parent(m, node) {
            if (node.dim != 0 || node.parentIndex == -1) return null;
            var index = indexFromCoord(m, node.coord);
            if (!index) return null;
            index[index.length - 1] = node.parentIndex;
            return findByIndex(m, index);
        }
        function leftLeg(m, node) {
            if (node.dim != 0 || !node.leftLegCoord) return null;
            return findByCoord(m, node.leftLegCoord);
        }
        function rightLeg(m, node) {
            if (node.dim != 0 || !node.rightLegCoord) return null;
            return findByCoord(m, node.rightLegCoord);
        }
        function findAbove(m, node) {
            if (node.dim != 0) return null;
            var index = indexFromCoord(m, node.coord);
            if (!index) return null;
            for (var i = index.length - 1; i > 0; i--) {
                index[i] = 0;
                index[i - 1]++;
                index[index.length - 1] = node.position - sumArray(index.slice(0, -1));
                if (!findByIndex(m, index.slice(0, i))) continue;
                var candidate = findByIndex(m, index);
                if (candidate) return candidate;
            }
            return null;
        }
        function flattenMountain(m) {
            var r = {};
            if (m.dim == 0) {
                r[m.coord.join(",")] = m;
            } else {
                for (var i = 0; i < m.arr.length; i++) {
                    Object.assign(r, flattenMountain(m.arr[i]));
                }
            }
            return r;
        }
        function cloneMountain(mountain) {
            var newMountain = Object.assign({}, mountain);
            if (mountain.dim === 0) {
                newMountain.coord = newMountain.coord.slice(0);
                newMountain.leftLegCoord = newMountain.leftLegCoord && newMountain.leftLegCoord.slice(0);
                newMountain.rightLegCoord = newMountain.rightLegCoord && newMountain.rightLegCoord.slice(0);
            } else {
                newMountain.arr = newMountain.arr.map(cloneMountain);
                newMountain.coord = newMountain.coord.slice(0);
            }
            return newMountain;
        }
        function getBadRoot(s) {
            var mountain;
            if (typeof s == "string") mountain = calcMountain(s);
            else mountain = s;
            return leftLeg(mountain, findHighestWithPosition(mountain, getLastPosition(mountain)));
        }
        function filterEmpty(mountain) {
            if (mountain.dim > 0) {
                for (var i = mountain.arr.length - 1; i >= 0; i--) {
                    filterEmpty(mountain.arr[i]);
                    if (mountain.arr[i].dim > 0 && mountain.arr[i].arr.length === 0) mountain.arr.slice(i, 1);
                }
            }
            return mountain;
        }
        function findHighestWithPositionBelow(m, sub, position) {
            var crawlIndex = indexFromCoord(m, sub.coord, sub.dim);
            while (true) {
                crawlIndex[crawlIndex.length - 1]--;
                while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] < 0) {
                    crawlIndex.pop();
                    crawlIndex[crawlIndex.length - 1]--;
                }
                if (crawlIndex.length === 0) break;
                var r = findHighestWithPosition(findByIndex(m, crawlIndex), position);
                if (r) return r;
            }
            return null;
        }
        var mountain;
        if (typeof s == "string") mountain = calcMountain(s);
        else mountain = s;
        if (stringify === undefined) stringify = true;
        var result = cloneMountain(mountain);
        var badRoot = getBadRoot(mountain);
        var cutPosition = getLastPosition(mountain);
        var topCut = findHighestWithPosition(mountain, cutPosition);
        var cutLookup = topCut;
        while (cutLookup) {
            var parentRow = findByCoord(result, cutLookup.coord, 1);
            parentRow.arr.pop();
            cutLookup = rightLeg(result, cutLookup);
        }
        filterEmpty(result);
        if (badRoot) {
            var badRootPosition = badRoot.position;
            var badRootRow = findByCoord(mountain, badRoot.coord, 1);
            var bottomCut = mountain;
            while (bottomCut.dim > 1) bottomCut = bottomCut.arr[0];
            bottomCut = bottomCut.arr[bottomCut.arr.length - 1];
            var belowCopyStackBase = [];
            var aboveCopyStackBase = [];
            var topCutIndex = indexFromCoord(mountain, topCut.coord);
            var crawlIndex = topCutIndex.slice(0, -1);
            while (true) {
                crawlIndex[crawlIndex.length - 1]--;
                while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] < 0) {
                    crawlIndex.pop();
                    crawlIndex[crawlIndex.length - 1]--;
                }
                if (crawlIndex.length === 0) break;
                var sourceSubMountain = findByIndex(mountain, crawlIndex);
                var destSubMountain = findByIndex(result, crawlIndex);
                belowCopyStackBase.push([sourceSubMountain, destSubMountain, null, 0, false]);
            }
            crawlIndex = topCutIndex.slice(0, -1);
            if (indexFromCoord(result, findByIndex(mountain, crawlIndex).coord, 1)) {
                while (true) {
                    var sourceSubMountain = findByIndex(mountain, crawlIndex);
                    var destSubMountain = findByIndex(result, crawlIndex);
                    aboveCopyStackBase.unshift([sourceSubMountain, destSubMountain]);
                    crawlIndex[crawlIndex.length - 1]++;
                    while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] >= findByIndex(mountain, crawlIndex.slice(0, -1)).arr.length) {
                        crawlIndex.pop();
                        crawlIndex[crawlIndex.length - 1]++;
                    }
                    if (crawlIndex.length === 0) break;
                }
            }
        }
        var subCutCache = {};
        var subBadRootCache = {};
        var subBadRootRowCache = {};
        var topNodeCache = {};
        var isAscendingCache = {};
        for (var i = 0; i <= n && badRoot; i++) {
            for (var x = i === 0 ? cutPosition : badRootPosition + 1; x < cutPosition + (i < n); x++) {
                var nodeBelow = null;
                var belowCopyStack = belowCopyStackBase.slice(0);
                while (belowCopyStack.length) {
                    var popItem = belowCopyStack.pop();
                    var sourceSubMountain = popItem[0];
                    var destSubMountain = popItem[1];
                    var cleanCopySource = popItem[2];
                    var cleanCopyOffset = popItem[3];
                    var ignoreBelow = popItem[4];
                    var sourceSubMountainID = sourceSubMountain.coord.join(",") + "," + sourceSubMountain.dim;
                    if (subCutCache[sourceSubMountainID] === undefined) {
                        var subCut = findHighestWithPosition(sourceSubMountain, cutPosition);
                        var subBadRoot = findHighestWithPosition(sourceSubMountain, badRootPosition);
                        var subBadRootRow = subBadRoot && findByCoord(sourceSubMountain, subBadRoot.coord, 1);
                        subCutCache[sourceSubMountainID] = subCut;
                        subBadRootCache[sourceSubMountainID] = subBadRoot;
                        subBadRootRowCache[sourceSubMountainID] = subBadRootRow;
                    } else {
                        var subCut = subCutCache[sourceSubMountainID];
                        var subBadRoot = subBadRootCache[sourceSubMountainID];
                        var subBadRootRow = subBadRootRowCache[sourceSubMountainID];
                    }
                    var sourceSubMountainAndPositionID = sourceSubMountainID + "," + x;
                    if (topNodeCache[sourceSubMountainAndPositionID] === undefined) {
                        var topNode = findHighestWithPosition(sourceSubMountain, x);
                        topNodeCache[sourceSubMountainAndPositionID] = topNode;
                        if (!topNode) continue;
                        if (legBasedAscension) {
                            var nodeInSubBadRootRow = subBadRootRow && findHighestWithPosition(subBadRootRow, x);
                            while (nodeInSubBadRootRow && nodeInSubBadRootRow.position > badRootPosition) {
                                var leftLegPosition = nodeInSubBadRootRow.leftLegCoord ? sumArray(nodeInSubBadRootRow.leftLegCoord) : nodeInSubBadRootRow.position - 1;
                                nodeInSubBadRootRow = findHighestWithPosition(subBadRootRow, leftLegPosition);
                            }
                            var isAscending = nodeInSubBadRootRow && nodeInSubBadRootRow.position == badRootPosition;
                            isAscendingCache[sourceSubMountainAndPositionID] = isAscending;
                        } else {
                            var referenceRow = subBadRootRow && subBadRootRow.coord[1] && findByCoord(sourceSubMountain, addCoord(subBadRootRow.coord, 1, -1), 1) || subBadRootRow;
                            var nodeInReferenceRow = referenceRow && findHighestWithPosition(referenceRow, x);
                            while (nodeInReferenceRow && nodeInReferenceRow.position > badRootPosition) nodeInReferenceRow = parent(referenceRow, nodeInReferenceRow);
                            var isAscending = nodeInReferenceRow && nodeInReferenceRow.position == badRootPosition;
                            isAscendingCache[sourceSubMountainAndPositionID] = isAscending;
                        }
                    } else {
                        var topNode = topNodeCache[sourceSubMountainAndPositionID];
                        if (!topNode) continue;
                        var isAscending = isAscendingCache[sourceSubMountainAndPositionID];
                    }

                    if (sourceSubMountain.dim == 1) {
                        if (cleanCopySource) {
                            var position = x + (cutPosition - badRootPosition) * i;
                            var sourceNode = findHighestWithPosition(cleanCopySource, x);
                            var sourceLeftLegPosition = sourceNode.leftLegCoord ? sumArray(sourceNode.leftLegCoord) : x - 1;
                            var leftLegPosition = sourceLeftLegPosition >= badRootPosition ? sourceLeftLegPosition + (cutPosition - badRootPosition) * i : sourceLeftLegPosition;
                            var nodeLeftDown = findHighestWithPositionBelow(result, destSubMountain, leftLegPosition);
                            var leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
                            var rightLegCoord = nodeBelow ? nodeBelow.coord : null;
                            if (nodeBelow) {
                                if (equalVector(leftLegCoord, rightLegCoord, 1)) {
                                    var leftLegIndex = indexFromCoord(result, leftLegCoord);
                                    nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
                                } else {
                                    nodeBelow.parentIndex = -1;
                                }
                            }
                            destSubMountain.arr.push(nodeBelow = {
                                dim: 0,
                                value: NaN,
                                position: position,
                                coord: addCoord(destSubMountain.coord, 0, position - sumArray(destSubMountain.coord)),
                                parentIndex: -1,
                                forcedParent: sourceNode.forcedParent,
                                leftLegCoord: leftLegCoord,
                                rightLegCoord: rightLegCoord
                            });
                        } else {
                            var position = x + (cutPosition - badRootPosition) * i;
                            var sourceNode = findHighestWithPosition(sourceSubMountain, x);
                            var sourceLeftLegPosition = sourceNode.leftLegCoord ? sumArray(sourceNode.leftLegCoord) : -1;
                            var leftLegPosition = sourceLeftLegPosition >= badRootPosition ? sourceLeftLegPosition + (cutPosition - badRootPosition) * i : sourceLeftLegPosition;
                            var nodeLeftDown = findHighestWithPositionBelow(result, destSubMountain, leftLegPosition);
                            var leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
                            var rightLegCoord = nodeBelow ? nodeBelow.coord : null;
                            if (nodeBelow) {
                                if (equalVector(leftLegCoord, rightLegCoord, 1)) {
                                    var leftLegIndex = indexFromCoord(result, leftLegCoord);
                                    nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
                                } else {
                                    nodeBelow.parentIndex = -1;
                                }
                            }
                            destSubMountain.arr.push(nodeBelow = {
                                dim: 0,
                                value: NaN,
                                position: position,
                                coord: addCoord(destSubMountain.coord, 0, position - sumArray(destSubMountain.coord)),
                                parentIndex: -1,
                                forcedParent: sourceNode.forcedParent,
                                leftLegCoord: leftLegCoord,
                                rightLegCoord: rightLegCoord
                            });
                        }
                    } else {
                        var subCutHeight = subCut && subCut.coord[sourceSubMountain.dim - 1] || 0;
                        var subBadRootHeight = subBadRoot && subBadRoot.coord[sourceSubMountain.dim - 1] || 0;
                        var topNodeHeight = topNode.coord[sourceSubMountain.dim - 1] || 0;
                        if (isAscending) {
                            if (cleanCopySource) {
                                var generationsFromSubBadRoot = 0;
                                var nodeInCleanCopySource = findHighestWithPosition(cleanCopySource, x);
                                if (nodeInCleanCopySource.leftLegCoord) {
                                    var lowAncestorNode = nodeInCleanCopySource;
                                    while (lowAncestorNode.position > badRootPosition) {
                                        lowAncestorNode = findHighestWithPosition(cleanCopySource, sumArray(lowAncestorNode.leftLegCoord));
                                        generationsFromSubBadRoot++;
                                    }
                                } else {
                                    generationsFromSubBadRoot = x - badRootPosition;
                                }
                                var lastReplacedCut = findHighestWithPosition(destSubMountain, badRootPosition + (cutPosition - badRootPosition) * i);
                                var lastReplacedCutHeight = lastReplacedCut && lastReplacedCut.coord[sourceSubMountain.dim - 1] || 0;
                                var targetHeight = i === 0 ? topNodeHeight : lastReplacedCutHeight + generationsFromSubBadRoot - cleanCopyOffset;
                                if (ignoreBelow) {
                                    while (destSubMountain.arr.length < targetHeight + 1) {
                                        destSubMountain.arr.push({
                                            dim: destSubMountain.dim - 1,
                                            arr: [],
                                            coord: addCoord(destSubMountain.coord, destSubMountain.dim - 1, destSubMountain.arr.length)
                                        });
                                    }
                                    for (var j = targetHeight; j >= 0; j--) {
                                        belowCopyStack.push([sourceSubMountain.arr[subBadRootHeight], destSubMountain.arr[j], cleanCopySource, Math.max(j - lastReplacedCutHeight + cleanCopyOffset, 0), true]);
                                    }
                                } else {
                                    if (!lastReplacedCut || cleanCopyOffset) throw Error("Something went wrong");
                                    while (destSubMountain.arr.length < targetHeight + 1) {
                                        destSubMountain.arr.push({
                                            dim: destSubMountain.dim - 1,
                                            arr: [],
                                            coord: addCoord(destSubMountain.coord, destSubMountain.dim - 1, destSubMountain.arr.length)
                                        });
                                    }
                                    for (var j = targetHeight; j >= 0; j--) {
                                        if (j < subBadRootHeight) {
                                            belowCopyStack.push([sourceSubMountain.arr[j], destSubMountain.arr[j], null, 0, false]);
                                        } else {
                                            belowCopyStack.push([sourceSubMountain.arr[subBadRootHeight], destSubMountain.arr[j], cleanCopySource, Math.max(j - lastReplacedCutHeight + cleanCopyOffset, 0), j > subBadRootHeight]);
                                        }
                                    }
                                }
                            } else {
                                if (cleanCopyOffset) throw Error("Something went wrong");
                                if (ignoreBelow) {
                                    var lastReplacedCut = findHighestWithPosition(destSubMountain, badRootPosition + (cutPosition - badRootPosition) * i);
                                    var lastReplacedCutHeight = lastReplacedCut && lastReplacedCut.coord[sourceSubMountain.dim - 1] || 0;
                                    if (!lastReplacedCut && cleanCopyOffset) throw Error("Something went wrong");
                                    var targetHeight = i === 0 ? topNodeHeight : lastReplacedCutHeight + topNodeHeight;
                                    while (destSubMountain.arr.length < targetHeight - subBadRootHeight + 1) {
                                        destSubMountain.arr.push({
                                            dim: destSubMountain.dim - 1,
                                            arr: [],
                                            coord: addCoord(destSubMountain.coord, destSubMountain.dim - 1, destSubMountain.arr.length)
                                        });
                                    }
                                    for (var j = targetHeight; j >= subBadRootHeight; j--) {
                                        if (j < lastReplacedCutHeight + subBadRootHeight + (sourceSubMountain.dim == 2)) {
                                            belowCopyStack.push([sourceSubMountain.arr[subBadRootHeight], destSubMountain.arr[j - subBadRootHeight], subBadRootRow, 0, true]);
                                        } else {
                                            belowCopyStack.push([sourceSubMountain.arr[j - lastReplacedCutHeight], destSubMountain.arr[j - subBadRootHeight], null, 0, j == lastReplacedCutHeight + subBadRootHeight]);
                                        }
                                    }
                                } else {
                                    while (destSubMountain.arr.length < topNodeHeight + (subCutHeight - subBadRootHeight) * i + 1) {
                                        destSubMountain.arr.push({
                                            dim: destSubMountain.dim - 1,
                                            arr: [],
                                            coord: addCoord(destSubMountain.coord, destSubMountain.dim - 1, destSubMountain.arr.length)
                                        });
                                    }
                                    for (var j = topNodeHeight + (subCutHeight - subBadRootHeight) * i; j >= 0; j--) {
                                        if (j < subBadRootHeight) {
                                            belowCopyStack.push([sourceSubMountain.arr[j], destSubMountain.arr[j], null, 0, false]);
                                        } else if (j < subBadRootHeight + (subCutHeight - subBadRootHeight) * i + (sourceSubMountain.dim == 2)) {
                                            belowCopyStack.push([sourceSubMountain.arr[subBadRootHeight], destSubMountain.arr[j], subBadRootRow, 0, j > subBadRootHeight]);
                                        } else {
                                            belowCopyStack.push([sourceSubMountain.arr[j - (subCutHeight - subBadRootHeight) * i], destSubMountain.arr[j], null, 0, i !== 0 && j == subBadRootHeight + (subCutHeight - subBadRootHeight) * i]);
                                        }
                                    }
                                }
                            }
                        } else {
                            if (cleanCopySource || cleanCopyOffset || ignoreBelow) throw Error("Something went wrong");
                            while (destSubMountain.arr.length < topNodeHeight + 1) {
                                destSubMountain.arr.push({
                                    dim: destSubMountain.dim - 1,
                                    arr: [],
                                    coord: addCoord(destSubMountain.coord, destSubMountain.dim - 1, destSubMountain.arr.length)
                                });
                            }
                            for (var j = topNodeHeight; j >= 0; j--) {
                                belowCopyStack.push([sourceSubMountain.arr[j], destSubMountain.arr[j], null, 0, false]);
                            }
                        }
                    }
                }
                var aboveCopySourceX = x == cutPosition ? badRootPosition : x;
                var aboveCopyStack = aboveCopyStackBase.slice(0);
                while (aboveCopyStack.length) {
                    var popItem = aboveCopyStack.pop();
                    var sourceSubMountain = popItem[0];
                    var destSubMountain = popItem[1];
                    var topNode = findHighestWithPosition(sourceSubMountain, aboveCopySourceX);
                    if (!topNode) continue;

                    if (sourceSubMountain.dim == 1) {
                        var position = x + (cutPosition - badRootPosition) * i;
                        var nodeInSourceSubMountain = topNode;
                        var sourceLeftLegPosition = nodeInSourceSubMountain.leftLegCoord ? sumArray(nodeInSourceSubMountain.leftLegCoord) : -1;
                        var leftLegPosition = sourceLeftLegPosition >= badRootPosition ? sourceLeftLegPosition + (cutPosition - badRootPosition) * i : sourceLeftLegPosition;
                        var nodeLeftDown = findHighestWithPositionBelow(result, destSubMountain, leftLegPosition);
                        var leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
                        var rightLegCoord = nodeBelow ? nodeBelow.coord : null;
                        if (nodeBelow) {
                            if (equalVector(leftLegCoord, rightLegCoord, 1)) {
                                var leftLegIndex = indexFromCoord(result, leftLegCoord);
                                nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
                            } else {
                                nodeBelow.parentIndex = -1;
                            }
                        }
                        destSubMountain.arr.push(nodeBelow = {
                            dim: 0,
                            value: NaN,
                            position: position,
                            coord: addCoord(destSubMountain.coord, 0, position - sumArray(destSubMountain.coord)),
                            parentIndex: -1,
                            forcedParent: nodeInSourceSubMountain.forcedParent,
                            leftLegCoord: leftLegCoord,
                            rightLegCoord: rightLegCoord
                        });
                    } else {
                        var topNodeHeight = topNode && topNode.coord[sourceSubMountain.dim - 1] || 0;
                        for (var j = topNodeHeight; j >= 0; j--) {
                            aboveCopyStack.push([sourceSubMountain.arr[j], destSubMountain.arr[j]]);
                        }
                    }
                }
            }
        }
        var lastBottomNode = result;
        while (lastBottomNode && lastBottomNode.dim > 0) {
            if (lastBottomNode.dim == 1) {
                lastBottomNode = lastBottomNode.arr[lastBottomNode.arr.length - 1];
            } else {
                lastBottomNode = lastBottomNode.arr[0];
            }
        }
        var resultLength = lastBottomNode && lastBottomNode.position || 0;
        for (var x = 0; x <= resultLength; x++) {
            var node = findHighestWithPosition(result, x);
            var aboveNode = null;
            while (node) {
                if (isNaN(node.value)) {
                    if (aboveNode) {
                        var pseudoParentNode = leftLeg(result, aboveNode);
                        if (node.coord.length == pseudoParentNode.coord.length) {
                            for (var i = node.coord.length - 1; i >= 0; i--) {
                                if (i === 0 && !equalVector(node.coord, aboveNode.coord, 2) || node.coord[i] < pseudoParentNode.coord[i] || equalVector(node.coord, aboveNode.coord, i + 1) && node.coord[i] > pseudoParentNode.coord[i] + 1) {
                                } else if (node.coord[i] > pseudoParentNode.coord[i]) break;
                            }
                        }
                        node.value = pseudoParentNode.value + aboveNode.value;
                    } else {
                        node.value = 1;
                    }
                }
                aboveNode = node;
                node = rightLeg(result, node);
            }
        }
        var rr;
        if (stringify) {
            rr = [];
            if (result.arr.length) {
                var bottomrow = result;
                while (bottomrow.dim > 1) bottomrow = bottomrow.arr[0];
                for (var i = 0; i < bottomrow.arr.length; i++) {
                    rr.push(bottomrow.arr[i].value + (bottomrow.arr[i].forcedParent ? "v" + bottomrow.arr[i].parentIndex : ""));
                }
            }
            rr = rr.join(",");
        } else {
            rr = result;
        }
        return rr;
    }

    static cmp(a, b) {
        if (a === "Limit" && b === "Limit") return 0;
        if (a === "Limit") return 1;
        if (b === "Limit") return -1;

        if (typeof a === "string") a = a.split(',').map(Number);
        if (typeof b === "string") b = b.split(',').map(Number);

        const n = Math.min(a.length, b.length);

        for (let i = 0; i < n; i++) {
            if (a[i] < b[i]) return -1;
            if (a[i] > b[i]) return 1;
        }

        if (a.length < b.length) return -1;
        if (a.length > b.length) return 1;
        return 0;
    }
    static isSuccessor(array) {
        if (array == '') return true;
        if (array == "Limit") return false;
        if (typeof array === "string") array = array.split(',').map(Number);
        return array.length === 0 || array.at(-1) === 1;
    }


    static ZERO = ''

    static f(alpha, beta) {

        let n = 0;

        while (true) {
            const x = this.fs(beta, n);

            if (this.cmp(x, alpha) > 0) {
                return x;
            }

            n++;
        }
    }


    static g(alpha, beta, s) {
        while (true) {
            if (this.isSuccessor(beta)) return alpha;

            const split = this.f(alpha, beta);

            if (s === "") return split;

            const bit = s[0];
            s = s.slice(1);

            if (bit === "0") {
                beta = split;
            } else {
                alpha = split;
            }
        }
    }

    static gInv(alpha, beta, target) {
        let result = "";

        while (!this.isSuccessor(beta)) {
            const split = this.f(alpha, beta);
            const c = this.cmp(target, split);

            if (c === 0) break;

            if (c < 0) {
                result += "0";
                beta = split;
            } else {
                result += "1";
                alpha = split;
            }
        }

        return result;
    }

    static h(x, k = 0.5, maxlen = 100, eps = 1e-10) {
        let result = "";

        while (Math.abs(x - k) > eps && result.length < maxlen) {
            if (x < k) {
                result += "0";
                x = x / k;
            } else {
                result += "1";
                x = (x - k) / (1 - k);
            }
        }

        return result;
    }

    static hInv(s, k = 0.5) {
        let x = k;

        for (let i = s.length - 1; i >= 0; i--) {
            if (s[i] === "0") {
                x = k * x;
            } else {
                x = k + (1 - k) * x;
            }
        }

        return x;
    }
}

let Lim_BMS_in_Yseq = '1,3' // Lim(BMS) is 1,3 in y

/*
THIS IS JUST AN APPROXIMATION NOT EXACT
AFTER BH , IT SEEMS WRONG FOR ALL
*/

function Conv_BMS(ord) {
    return Y_Sequence.g(Y_Sequence.ZERO, Lim_BMS_in_Yseq, BMS.gInv(BMS.ZERO, "Limit", ord))
}

function Conv_Y_sequence(ord) {
    return BMS.g(BMS.ZERO, "Limit", Y_Sequence.gInv(Y_Sequence.ZERO, Lim_BMS_in_Yseq, ord));
}


function Conv_OCF(matrix) {
    function eq(a, b) {
        if (typeof (a) == 'number') { return a == b; }
        if (a.length == 2) { return eq(a[0], b[0]) && eq(a[1], b[1]); }
        return eq(a[0], b[0]) && eq(a[1], b[1]) && eq(a[2], b[2]);
    }
    // FROM COCF PROGRAM

    function paren(x, n) {
        console.log()
        let q = x[n] == '(' ? 1 : -1;
        let i = n;
        let t = 0;
        while (1) { t += (x[i] == '(' ? 1 : x[i] == ')' ? -1 : 0); if (!t) { break; }; i += q; }
        return i;
    }

    function firstTerm(x) {
        console.log()
        let m = paren(x, 1);
        return [x.slice(0, m + 1), x.slice(m + 2) || '0'];
    }

    function lastTerm(x) {
        console.log()
        let m = paren(x, x.length - 1);
        return [x.slice(0, m - 2) || '0', x.slice(m - 1)];
    }

    function terms(x) {
        console.log()
        if (x == '0') { return []; }
        return [firstTerm(x)[0]].concat(terms(firstTerm(x)[1]));
    }

    function arg(x) {
        console.log()
        return firstTerm(x)[0].slice(2, -1);
    }

    function lt(x, y) {
        console.log()
        if (y == '0') { return false; }
        if (x == '0') { return true; }
        if (x[0] == 'p' && y[0] == 'P') { return true; }
        if (x[0] == 'P' && y[0] == 'p') { return false; }
        if (arg(x) != arg(y)) { return lt(arg(x), arg(y)); }
        return lt(firstTerm(x)[1], firstTerm(y)[1]);
    }

    function add(x, y) {
        if (x == '0') { return y; }
        if (y == '0') { return x; }
        if (lt(firstTerm(x)[0], firstTerm(y)[0])) { return y; }
        let z = firstTerm(x)[0]
        let w = add(firstTerm(x)[1], y);
        if (w != '0') { return z + '+' + w; }
        return z;
    }

    function sub(x, y) {
        if (x == '0') { return '0'; }
        if (y == '0') { return x; }
        if (lt(firstTerm(y)[0], firstTerm(x)[0])) { return x; }
        return sub(firstTerm(x)[1], firstTerm(y)[1]);
    }

    function sua(x) { return split(x, 'P(0)'); }

    function exp(a) {
        if (a[0] == 'P') { return `P(${sub(a, 'P(0)')})`; }
        if (lt(a, 'p(p(P(0)))')) { return `p(${a})`; }
        let [x, y] = sua(arg(a));
        let p = split(y, `p(${add(x, 'P(0)')})`)[0];
        return 'p(' + add(x, add(p, sub(a, 'p(' + add(x, p) + ')'))) + ')';
    }

    function log(a) {
        if (a == '0') { return '0'; }
        if (a[0] == 'P') { return add('P(0)', arg(a)); }
        let [x, y] = sua(arg(a));
        let [p, q] = split(y, `p(${add(x, 'P(0)')})`);
        if (x == '0' && p == '0') {
            return q;
        }
        let m = add(`p(${add(x, p)})`, q);
        return m;
    }

    function div(a, b) { // only works when b is a.p.
        if (lt(a, b)) { return '0'; }
        return add(exp(sub(log(a), log(b))), div(firstTerm(a)[1], b));
    }

    function mul(a, b) { // only works when a is a.p.
        if (b == '0') { return '0'; }
        return add(exp(add(log(a), log(b))), mul(a, firstTerm(b)[1]))
    }

    function split(a, x) {
        if (a == '0') { return ['0', '0']; }
        if (lt(a, x)) { return ['0', a]; }
        if (lt(firstTerm(a)[0], x)) { return ['0', a]; }
        return [add(firstTerm(a)[0], split(firstTerm(a)[1], x)[0]), split(firstTerm(a)[1], x)[1]];
    }

    function op(x) { // "does it need parentheses when you write something*x"
        if (lt(x, 'p(p(0))')) { return false; }
        let f = (x[0] == 'p') ? `p(${sua(arg(x))[0]})` : 'P(0)';
        let g = null;
        let h = null;
        if (f == 'p(0)') { f = 'p(p(0))'; g = log(x); h = exp(g); }
        else { g = div(log(x), f); h = exp(mul(f, g)) }
        let c = div(x, h);
        let d = sub(x, mul(h, div(x, h)));
        if (d != '0') { return true; }
        return false;
    }

    // does not handle I(ψ(T^M),1) because it's too complicated
    function display(x, y) {
        //if(!y){return 'X'}
        //console.log(x);
        if (x == '0') { return '0'; }
        if (/^(p\(0\)\+)*p\(0\)$/.test(x)) { return ((x.length + 1) / 5).toString(); }
        let f = (x[0] == 'p') ? `p(${sua(arg(x))[0]})` : 'P(0)';
        let g = null;
        let h = null;
        if (f == 'p(0)') { f = 'p(p(0))'; g = log(x); h = firstTerm(x)[0]; }
        else { g = div(log(x), f); h = `${f == 'P(0)' ? 'P' : 'p'}(${split(arg(x), f)[0]})`; }
        let c = div(x, h);
        let d = sub(x, mul(h, div(x, h)));
        //console.log(f,g,h,'',c,d);
        if (c == 'p(0)' && d == '0') {
            if (exp(x) != x) {
                if (x == 'p(p(0))') { return 'ω'; }
                if (lt(x, 'p(P(0))')) { return `ω<sup>${display(log(x))}</sup>`; }
                return `${display(f)}<sup>${display(g)}</sup>`
            }
            if (x == 'P(0)') { return 'T'; }
            let m = div(log(lastTerm(arg(x))[1]), 'P(0)');
            let k = exp(mul('P(0)', div(log(lastTerm(arg(x))[1]), 'P(0)')));
            k = div(arg(x), k);
            //console.log(arg(x),k,m)
            k = sua(k);
            t = exp(add(mul('P(0)', m), 'P(0)'));
            let l = null;
            if (k[0] == '0') { l = '0'; }
            else { l = 'p(' + mul(exp(mul('P(0)', m)), k[0]) + ')'; }
            let r = 'p(' + mul(exp(mul('P(0)', m)), add(k[0], 'P(0)')) + ')';
            let [a, b] = split(k[1], r);
            a = 'p(' + mul(exp(mul('P(0)', m)), a) + ')'
            //console.log(k,r,l,a,b)
            if (a == 'p(0)') { a = '0'; }
            l = add(l, add(a, b))
            let s = ''
            if (lastTerm(arg(x))[1][0] == 'P' && b != '0') {
                if (m == 'p(0)') { s = 'Ω'; }
                else if (m == 'p(0)+p(0)') { s = 'I'; }
                else if (lt(m, 'p(P(P(p(P(P(P(0)))))))')) { s = `I(${display(sub(m, 'p(0)+p(0)'))},x)`; }
                else if (m == 'P(0)') { s = 'M'; }
                if (s == '') { return `ψ(${display(arg(x))})`; }
                if (l == 'p(0)') { return s.replace('x', '0'); }
                if (s.includes('x')) { return s.replace('x', display(sub(l, 'p(0)'))); }
                return `${s}<sub>${display(l)}</sub>`;
            }
            return `ψ(${display(arg(x))})`;
        }
        let a = display(h);
        //console.log(f,h,c,d)
        if (c != 'p(0)') {
            if (!op(c)) { a += display(c) }
            else { a += `&sdot;(${display(c)})`; }
        }
        if (d != '0') { a += '+' + display(d); }
        return a;
    }

    // END COCF

    function P(M, r, n) {
        if (r == -1) { return n - 1; }
        let q = P(M, r - 1, n);
        while (q > -1 && M[q][r] >= M[n][r]) { q = P(M, r - 1, q); }
        return q;
    }

    function C(M, n) {
        let X = [];
        for (let i = 0; i < M.length; i++) {
            if (P(M, 0, i) == n) { X.push(i); }
        }
        return X;
    }

    function CR(M, n) {
        let X = [];
        for (let i = 0; i < M.length; i++) {
            if (P(M, 0, i) == n) {
                X.push(i);
                X = X.concat(CR(M, i));
            }
        }
        return X;
    }

    function D(M, n) {
        let X = 0;
        for (let i = 0; i < M.length; i++) {
            if (P(M, 0, i) == n && M[i][1] > 0) { X++; }
        }
        return X;
    }

    function U(M, n) {
        if (M[n][1] == 0 || M[n][2] == 1 || n + 1 == M.length) { return [0, null]; }
        let m = P(M, 1, n);
        let L = [M[m][0] + 1, M[n][1], M[m][2] + 1];
        if (P(M, 1, n) == P(M, 1, n + 1) && eq(M[n + 1], L)) { return [1, n + 1]; }
        let q = n;
        let p = n;
        while (q != -1) {
            q = P(M, 0, q);
            if (P(M, 1, n) == P(M, 1, q) && eq(M[q], L) && M[n + 1][0] > M[q][0]) {
                if (M[p][2] == 1) { return [2, q] };
                return [1, q];
            }
            p = q;
        }
        return [0, null];
    }

    function mv(M, n, k) { // value of upgrader; k is same as in ov
        if (k) {
            let A = [k];
            while (A.at(-1) != n) { // "correct" value of k (justified?)
                A.push(P(M, 0, A.at(-1)));
                if (!M[A.at(-1)][0]) { break; } // if this ever gets used something's gone wrong
            }
            if (A.includes(n)) {
                for (i of A.toReversed()) {
                    if (M[i][2] == 0) { k = i; break; }
                }
            }
        }
        let S = '0';
        for (i of C(M, n)) {
            if (i > k && k) { break; }
            if (M[i][2] != 1) { continue; }
            let q = '0';
            for (j of C(M, i)) {
                if (j > k && k) { break; }
                q = add(q, ov(M, j, k));
            }
            S = add(S, exp(q));
        }
        let X = C(M, n).filter(x => M[x][2] && C(M, x).length);
        let p;
        if (!X.length) { p = 1; }
        else { p = M[CR(M, X.at(-1)).at(-1)][2]; }
        if (lt(sua(S)[1], 'p(p(0))') && p && !k) { S = add(S, 'p(0)'); } // 111 211 311 = ψ(T^2·ω), not ψ(T^2)
        // also, if k!=0, the condition will never be activated, since then it's a fixed point.
        return exp(S);
    }

    function ov(M, n, k) { // k = 3 (31) in 0 111 211 31 2 (-> T, since 31 is chain-upgraded)
        if (n == k) { return 'P(0)'; }
        if (M[n][2] == 0) { return o(M, n, k); }
        let S = '0';
        for (let i of C(M, n)) {
            if (i > k && k) { break; }
            S = add(S, ov(M, i, k));
        }
        return `P(${S})`;
    }

    function v(M, n, k) { // k is necessary to make the k value persist from ov (maybe? keeping it just in case)
        // console.log(n,k)
        if (M[n][1] == 0) { return '0'; }
        if (M[n][2] == 0) {
            let u = U(M, n);
            u = (u[0] ? mv(M, u[1], n * (u[0] == 2)) : 'p(0)');
            return add(v(M, P(M, 1, n), k), u);
        }
        return add(v(M, P(M, 2, n), k), mv(M, n, k));
    }

    function o(M, n, k) { // k is necessary to make the k value persist from ov
        let S = '0';
        for (let i of C(M, n)) {
            if (i > k && k) { break; }
            if (skipped(M, n).includes(i)) { continue; }
            S = add(S, o(M, i, k));
        }
        return `p(${add(mul('P(0)', v(M, n, k)), S)})`;
    }

    function skipped(M, n) {
        let S = [];
        let u = [...Array(M.length).keys()].map(x => (U(M, x)[0] == 1 ? U(M, x)[1] : null));
        //let u2=[...Array(M.length).keys()].map(x=>(U(M,x)[0]==2?U(M,x)[1]:null));
        for (let i of C(M, n)) {
            S = S.concat(skipped(M, i)); // for display purposes
            if (M[i][2] && M[n][2]) { S.push(i); continue; }
            if (u.includes(i)) {
                let c = C(M, i);
                if (c.length) { // e.g. 0 111 211 21 111 211
                    let j = c.at(-1);
                    if (eq(M[j], [M[i][0] + 1, M[i][1], 1])) { S.push(i); }
                    else if (eq(U(M, j - 1), [2, i]) && eq(M[j], [M[i][0] + 1, 0, 0]) && !C(M, j).length) { S.push(i); }
                }
                else { S.push(i); continue; }
            }
            if (eq(M[i], [M[n][0] + 1, 0, 0]) && eq(U(M, i - 1), [2, n]) && !C(M, i).length) { S.push(i); continue; }
        }
        return S;
    }

    function _o(M) {
        let S = '0';
        for (let i = 0; i < M.length; i++) { if (eq(M[i], [0, 0, 0])) { S = add(S, o(M, i)); } }
        return S;
    }

    function processMatrix(M) {
        return M.map(row => {
            let r = row.slice();
            while (r.length < 3) {
                r.push(0);
            }
            return r;
        });
    }
    return display(_o(processMatrix(matrix)))
}
