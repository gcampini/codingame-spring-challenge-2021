import Game from "./Game";
import Tree from "./Tree";

export default class Cell {

    public readonly cercle: number;

    constructor(public index: number, public richness: number, public neighbors: number[]) {
        const bounds = [1, 7, 19, 37];
        for (let i = 0; i < bounds.length; i++) {
            if (index < bounds[i]) {
                this.cercle = i;
                break;
            }
        }
    }

    public tree(game: Game): Tree | undefined {
        return game.trees.find(tree => tree.cell.index === this.index);
    }

    public ray(game: Game, direction: number): Cell[] {
        const cells = [];
        let current: Cell = this;
        while (current) {
            if (current.neighbors[direction] !== -1) {
                const neighbor = game.cells[current.neighbors[direction]];
                cells.push(neighbor);
                current = neighbor;
            } else current = null;
        }
        return cells;
    }

    public attraction(game: Game): number {
        let attraction = 0;
        if (this.tree(game)) return attraction;
        attraction += this.richness / 3;
        attraction -= this.shadow(game);
        return attraction;
    }

    // between 0 and 1
    public shadow(game: Game): number {
        const directionMenace = 6 - game.sunDirection;
        let total = 0;
        const ombresPotentielles = this.ray(game, directionMenace).splice(0, 4).filter(o => !!o);
        for (let i = 0; i < ombresPotentielles.length; i++) {
            const tree = ombresPotentielles[i].tree(game);
            if (tree) total += Math.min(4, 4 + tree.size - i);
        }
        return total / 16;
    }

}