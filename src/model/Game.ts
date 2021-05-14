import Action from './Action';
import Cell from './Cell';
import Tree from './Tree';

export default class Game {
    round: number;
    nutrients: number;
    cells: Cell[];
    possibleActions: Action[];
    trees: Tree[];
    mySun: number;
    myScore: number;
    opponentsSun: number;
    opponentScore: number;
    opponentIsWaiting: boolean;

    day: number;
    opponentSun: number;

    constructor() {
        this.round = 0;
        this.nutrients = 0;
        this.cells = [];
        this.possibleActions = [];
        this.trees = [];
        this.mySun = 0;
        this.myScore = 0;
        this.opponentsSun = 0;
        this.opponentScore = 0;
        this.opponentIsWaiting = false;
    }

    getNextAction() {
        // TODO: write your algorithm here
        return this.possibleActions[0];
    }
}
