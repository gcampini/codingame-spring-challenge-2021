import Cell from "./Cell";
import Game from "./Game";

export default class Tree {

    public static readonly growCostBySize = [1, 3, 7];

    constructor(public cell: Cell, public size: number, public isMine: boolean, public isDormant: boolean) {
    }

    public growCost(game: Game): number {
        return Tree.growCostBySize[this.size] + game.trees.filter(tree => tree.size === this.size && tree.isMine === this.isMine).length;
    }

}