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
            cells.push(current);
            if (current.neighbors[direction] !== -1) {
                const neighbor = game.cells[current.neighbors[direction]];
                current = neighbor;
            } else current = null;
        }
        return cells;
    }

    public attraction(game: Game): number {
        let attraction = 0;
        if (this.tree(game)) return attraction;
        attraction += (this.richness / 3) * 3;
        attraction += this.shadowAttraction(game);
        return attraction;
    }

    // between 0 and 1
    public shadowAttraction(game: Game): number {
        let total = 0;
        for (let direction = 0; direction < 6; direction++) {
            let subtotal = 0;
            const voisins = this.ray(game, direction).splice(0, 4).filter(cell => !!cell);
            for (let i = 0; i < voisins.length; i++) {
                const tree = voisins[i].tree(game);
                if (!tree) continue;
                // Ombre qui affecte cette cell
                subtotal -= Math.min(4, 4 + tree.size - i) / 4;
                // Ombre projetée sur une autre cell
                const cellSize = (this.tree(game) ? this.tree(game).size : 0);
                subtotal += ((tree.isMine ? -1 : 1) * (4 + tree.size + cellSize - i) + 10) / 20;
            }
            total += (subtotal / voisins.length + 1) / 2;
        }
        return total / 6;
    }

}