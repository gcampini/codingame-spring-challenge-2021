import Cell from './Cell';
import Tree from './Tree';

export default class Game {

    constructor(
        public round: number,
        public nutrients: number,
        public cells: Cell[],
        public possibleActions = [],
        public trees: Tree[],
        public mySun: number,
        public myScore: number,
        public opponentsSun: number,
        public opponentScore: number,
        public opponentIsWaiting: boolean
    ) {
    }

}