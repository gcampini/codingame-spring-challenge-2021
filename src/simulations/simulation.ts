/*  
0 wait
1 grow
2 seed
3 complete
*/

const paths: Record<string, { score: number, sun: number, trees: number[], round: number, nutri: number }>[] = [
    {
        '': {
            score: 0,
            sun: 2,
            trees: [1, 1],
            round: 0,
            nutri: 20
        }
    }
];

const maxRounds = 6;

function next(i = 0) {

    console.log(i);

    paths[i + 1] = {};
    let modified = false;

    const keys = Object.keys(paths[i]);
    for (let j = 0; j < keys.length; j++) {
        const path = keys[j];

        const state = paths[i][path];

        if (state.round >= maxRounds) continue;

        modified = true;

        // WAIT action
        paths[i + 1][path + '0'] = {
            score: state.score,
            sun: state.sun + state.trees.reduce((a, b) => a + b % 4, 0), // TODO: shadows...
            trees: state.trees.map(size => size % 4), // reveille les arbres dormants
            round: state.round + 1,
            nutri: state.nutri
        };

        // GROW action
        const sunRemainingForSizesThatCanBeGrown
            = [0, 1, 2].map(size => state.sun - 1 - state.trees.filter(tree => tree === size).length);
        // console.log(sunRemainingForSizesThatCanBeGrown);
        const indexOfTreeToGrow = state.trees.findIndex(size => size < 3 && sunRemainingForSizesThatCanBeGrown[size] >= 0);
        // console.log(indexOfTreeToGrow);
        if (indexOfTreeToGrow !== -1) {
            // console.log('grow', state.trees[indexOfTreeToGrow]);
            const nextSun = sunRemainingForSizesThatCanBeGrown[state.trees[indexOfTreeToGrow]];
            const nextTrees = [...state.trees];
            nextTrees[indexOfTreeToGrow] += 5;
            paths[i + 1][path + '1'] = {
                score: state.score,
                sun: nextSun,
                trees: nextTrees,
                round: state.round,
                nutri: state.nutri
            };
        }

        // COMPLETE action
        if (state.round >= (3 * maxRounds) / 4 // TODO: arbitraire ?
            && state.sun >= 4
            && state.trees.length < 15) { // TODO: arbitraire ?
            const treeIndexToComplete = state.trees.findIndex(size => size === 3);
            if (treeIndexToComplete !== -1) {
                const nextTrees = [...state.trees];
                nextTrees.splice(treeIndexToComplete, 1);
                // console.log('complete', state.round);
                paths[i + 1][path + '3'] = {
                    score: state.score + state.nutri,
                    sun: state.sun - 4,
                    trees: nextTrees,
                    round: state.round,
                    nutri: Math.max(0, state.nutri - 1)
                };
            }
        }


        // SEED action
        const cost = state.trees.filter(size => size === 0).length;
        if (cost <= state.sun) {
            const indexTreeThatCanThrow = state.trees.findIndex(size => size > 0 && size < 4);
            if (indexTreeThatCanThrow !== -1) {
                const nextTrees = [...state.trees];
                nextTrees[indexTreeThatCanThrow] += 4;
                nextTrees.push(4);
                paths[i + 1][path + '2'] = {
                    score: state.score,
                    sun: state.sun - cost,
                    trees: nextTrees,
                    round: state.round,
                    nutri: state.nutri
                };
            }
        }

    }

    if (modified) next(i + 1);
}

next();

console.log('Fini, calcul du chemin optimal...');

let maxPath = null, maxState: any = { score: 0 };
let n = 0;
for (const depth of paths) {
    for (const path in depth) {
        const state = depth[path];
        if (state.score + ~~(state.sun / 3) > maxState.score + ~~(maxState.sun / 3)) {
            maxPath = path;
            maxState = state;
        }
        n += 1;
    }
}

console.log(n);
console.log(maxPath, maxState);

