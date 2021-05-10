import Action from './actions/Action';
import Cell from './Cell';
import Tree from './Tree';

export default class Game {

    constructor(
        public round: number,
        public nutrients: number,
        public actions: Action[],
        public cells: Cell[],
        public trees: Tree[],
        public mySun: number,
        public myScore: number,
        public opponentsSun: number,
        public opponentScore: number,
        public opponentIsWaiting: boolean
    ) {
    }

    get sunDirection(): number {
        return this.round % 6;
    }

    get myTrees(): Tree[] {
        return this.trees.filter(t => t.isMine);
    }

}