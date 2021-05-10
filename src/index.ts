/* @ts-ignore */
const rl = readline;
import Action from "./model/actions/Action";
import CompleteAction from "./model/actions/CompleteAction";
import GrowAction from "./model/actions/GrowAction";
import SeedAction from "./model/actions/SeedAction";
import WaitAction from "./model/actions/WaitAction";
import Cell from "./model/Cell";
import Game from "./model/Game";
import Tree from "./model/Tree";
import BronzeSolver from "./solvers/bronze";

const cells: Cell[] = [];
const numberOfCells: number = parseInt(rl()); // 37
for (let i = 0; i < numberOfCells; i++) {
    let inputs: string[] = rl().split(' ');
    const index: number = parseInt(inputs[0]); // 0 is the center cell, the next cells spiral outwards
    const richness: number = parseInt(inputs[1]); // 0 if the cell is unusable, 1-3 for usable cells
    const neigh0: number = parseInt(inputs[2]); // the index of the neighbouring cell for each direction
    const neigh1: number = parseInt(inputs[3]);
    const neigh2: number = parseInt(inputs[4]);
    const neigh3: number = parseInt(inputs[5]);
    const neigh4: number = parseInt(inputs[6]);
    const neigh5: number = parseInt(inputs[7]);
    cells.push(new Cell(index, richness, [neigh0, neigh1, neigh2, neigh3, neigh4, neigh5]));
}

const game = new Game(0, 0, [], cells, [], 0, 0, 0, 0, false);
const solver = new BronzeSolver();

while (true) {
    const day: number = parseInt(rl()); // the game lasts 24 days: 0-23
    const nutrients: number = parseInt(rl()); // the base score you gain from the next COMPLETE action

    var inputs: string[] = rl().split(' ');
    const sun: number = parseInt(inputs[0]); // your sun points
    const score: number = parseInt(inputs[1]); // your current score

    var inputs: string[] = rl().split(' ');
    const oppSun: number = parseInt(inputs[0]); // opponent's sun points
    const oppScore: number = parseInt(inputs[1]); // opponent's score

    const oppIsWaiting: boolean = inputs[2] !== '0'; // whether your opponent is asleep until the next day

    const numberOfTrees: number = parseInt(rl()); // the current amount of trees
    const trees: Tree[] = [];
    for (let i = 0; i < numberOfTrees; i++) {
        let inputs: string[] = rl().split(' ');
        const cellIndex: number = parseInt(inputs[0]); // location of this tree
        const size: number = parseInt(inputs[1]); // size of this tree: 0-3
        const isMine: boolean = inputs[2] !== '0'; // 1 if this is your tree
        const isDormant: boolean = inputs[3] !== '0'; // 1 if this tree is dormant
        trees.push(new Tree(game.cells[cellIndex], size, isMine, isDormant));
    }

    game.trees = trees;

    const numberOfPossibleMoves: number = parseInt(rl());
    const actions: Action[] = [];
    for (let i = 0; i < numberOfPossibleMoves; i++) {
        const possibleMove: string = rl();
        actions.push(parse(possibleMove));
    }

    game.actions = actions;
    game.round = day;
    game.nutrients = nutrients;
    game.mySun = sun;
    game.myScore = score;
    game.opponentsSun = oppSun;
    game.opponentScore = oppScore;
    game.opponentIsWaiting = oppIsWaiting;

    const action = solver.solve(game);

    console.log(action.toString());
}

function parse(string: string): Action {
    const args = string.split(' ');
    if (args[0] === 'WAIT') return new WaitAction();
    if (args[0] === 'COMPLETE') return new CompleteAction(parseInt(args[1]));
    if (args[0] === 'GROW') return new GrowAction(parseInt(args[1]));
    if (args[0] === 'SEED') return new SeedAction(parseInt(args[1]), parseInt(args[2]));
}