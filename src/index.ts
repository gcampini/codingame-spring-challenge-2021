/* @ts-ignore */
const rl = readline;

import Cell from "./model/Cell";
import Tree from "./model/Tree";
import Action from "./model/Action";
import Game from "./model/Game";
import SilverSolver from "./solvers/silver";

const solver = new SilverSolver();
const game = new Game();

const numberOfCells = parseInt(rl());
for (let i = 0; i < numberOfCells; i++) {
    var inputs = rl().split(' ');
    const index = parseInt(inputs[0]);
    const richness = parseInt(inputs[1]);
    const neigh0 = parseInt(inputs[2]);
    const neigh1 = parseInt(inputs[3]);
    const neigh2 = parseInt(inputs[4]);
    const neigh3 = parseInt(inputs[5]);
    const neigh4 = parseInt(inputs[6]);
    const neigh5 = parseInt(inputs[7]);

    game.cells.push(
        new Cell(index, richness, [
            neigh0,
            neigh1,
            neigh2,
            neigh3,
            neigh4,
            neigh5,
        ])
    );
}

while (true) {
    game.day = parseInt(rl());
    game.nutrients = parseInt(rl());
    var inputs = rl().split(' ');
    game.mySun = parseInt(inputs[0]);
    game.myScore = parseInt(inputs[1]);
    var inputs = rl().split(' ');
    game.opponentSun = parseInt(inputs[0]);
    game.opponentScore = parseInt(inputs[1]);
    game.opponentIsWaiting = inputs[2] !== '0';
    game.trees = [];

    const numberOfTrees = parseInt(rl());

    for (let i = 0; i < numberOfTrees; i++) {
        var inputs = rl().split(' ');
        const cellIndex = parseInt(inputs[0]);
        const size = parseInt(inputs[1]);
        const isMine = inputs[2] !== '0';
        const isDormant = inputs[3] !== '0';

        game.trees.push(new Tree(cellIndex, size, isMine, isDormant));
    }

    game.possibleActions = [];
    const numberOfPossibleAction = parseInt(rl());

    for (let i = 0; i < numberOfPossibleAction; i++) {
        const possibleAction = rl();
        game.possibleActions.push(Action.parse(possibleAction));
    }

    const action = solver.solve(game);
    console.log(action.toString());
}
