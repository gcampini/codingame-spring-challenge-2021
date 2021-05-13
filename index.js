class Parameters {

}

class Game {
    constructor() {
        this.round = 0;
        this.nutrients = 0;

        /** @type {Cell[]} */
        this.cells = [];

        /** @type {Action[]} */
        this.possibleActions = [];

        /** @type {Tree[]} */
        this.trees = [];
        this.mySun = 0;
        this.myScore = 0;
        this.opponentsSun = 0;
        this.opponentScore = 0;
        this.opponentIsWaiting = 0;
    }

    /**
     * @return {boolean|Action}
     */
    getWorthCompleteAction(){
        const treesToComplete = this.possibleActions.filter(action => action.type === Action.COMPLETE);
        if(treesToComplete.length === 0)
            return false;
        return treesToComplete.sort((a, b) => {
            const treeA = this.myTrees.find(value => value.cellIndex === a.targetCell.index);
            const treeB = this.myTrees.find(value => value.cellIndex === b.targetCell.index);

            return (b.targetCell.richness - a.targetCell.richness) + (treeB.size - treeA.size);
        })[0];
    }

    /**
     * @return {boolean|Action}
     */
    getWorthGrowAction(){
        const treesToGrow = this.possibleActions.filter(action => action.type === Action.GROW);
        if (treesToGrow.length > 0){
            const treesToGrowWorth = treesToGrow.sort((a, b) => {
                const treeA = this.myTrees.find(value => value.cellIndex === a.targetCell.index);
                const treeB = this.myTrees.find(value => value.cellIndex === b.targetCell.index);

                return (b.targetCell.richness - a.targetCell.richness) + (treeB.size - treeA.size);
            });
            return treesToGrowWorth[0];
        }

        return false;
    }

    /**
     *
     * @return {boolean|Action}
     */
    getWorthSeedAction(){
        if(game.day < 3 && this.myTrees.filter(tree => tree.size === 0).length === 0)
            return false;

        const seeds = this.possibleActions
            .filter(action => action.type === Action.SEED)
            .sort((a, b) => {
                return b.targetCell.attraction() - a.targetCell.attraction();
            });

        if(seeds.length === 0)
            return false;

        return seeds[0];
    }

    getNextAction() {
        this.myTrees = this.trees.filter(value => value.isMine && !value.isDormant);
        game.cells.forEach(value => {
            console.error("index : ", value.index, "shadow attraction", value.shadowImpact())
        })

        const completeAction = this.getWorthCompleteAction();
        if(completeAction)
            return completeAction;

        const growAction = this.getWorthGrowAction();
        if(growAction)
            return growAction;

        const seedAction = this.getWorthSeedAction();
        if(seedAction)
            return seedAction;

        return this.possibleActions[0];
    }
}
const game = new Game();

class Cell {
    constructor(index, richness, neighbors) {
        this.index = index
        this.richness = richness
        this.neighbors = neighbors
    }

    tree(){
        this.tree = game.trees.find(tree => tree.cellIndex === this.index);
        return this.tree;
    }

    /**
     *
     * @param {number} direction
     * @return {Cell[]}
     */
    ray(direction){
        const cells = [];
        let current = this;

        while (current){
            cells.push(current);
            if(current.neighbors[direction] !== -1){
                current = game.cells[current.neighbors[direction]];
            }else{
                current = null;
            }
        }
        return cells;
    }

    attraction(){
        let attraction = 0;
        if(this.tree())
            return attraction;

        attraction += (this.richness / 3) * 3;
        attraction += this.shadowImpact()
        return attraction;
    }

    shadowImpact(){
        let total = 0;
        let subtotal = 0;
        const neighbors = this.ray(game.day % 6);
        for (let i = 0; i < neighbors.length; i++) {
            const tree = neighbors[i].tree()
            if (!tree)
                continue;
            // Ombre qui affecte cette cell
            subtotal -= Math.min(4, 4 + tree.size - i) / 4;
        }
        total += (subtotal / neighbors.length + 1) / 2;
        return total / 6;
    }
}

class Tree {
    constructor(cellIndex, size, isMine, isDormant) {
        this.cellIndex = cellIndex
        this.size = size
        this.isMine = isMine
        this.isDormant = isDormant
    }
}

class Action {
    static WAIT = 'WAIT';
    static SEED = 'SEED';
    static GROW = 'GROW';
    static COMPLETE = 'COMPLETE';

    constructor(type, targetCellIdx, sourceCellIdx) {
        this.type = type
        this.targetCell = game.cells.find(c => c.index === targetCellIdx)
        this.sourceCell = game.cells.find(c => c.index === sourceCellIdx)
    }

    static parse(line) {
        const parts = line.split(' ')
        if (parts[0] === Action.WAIT) {
            return new Action(Action.WAIT)
        }
        if (parts[0] === Action.SEED) {
            return new Action(Action.SEED, parseInt(parts[2]), parseInt(parts[1]))
        }
        return new Action(parts[0], parseInt(parts[1]))
    }

    toString() {
        if (this.type === Action.WAIT) {
            return Action.WAIT
        }
        if (this.type === Action.SEED) {
            return `${Action.SEED} ${this.sourceCell.index} ${this.targetCell.index}`
        }
        return `${this.type} ${this.targetCell.index}`
    }
}

const numberOfCells = parseInt(readline());
for (let i = 0; i < numberOfCells; i++) {
    let inputs = readline().split(' ');
    const index = parseInt(inputs[0]);
    const richness = parseInt(inputs[1]);
    const neigh0 = parseInt(inputs[2]);
    const neigh1 = parseInt(inputs[3]);
    const neigh2 = parseInt(inputs[4]);
    const neigh3 = parseInt(inputs[5]);
    const neigh4 = parseInt(inputs[6]);
    const neigh5 = parseInt(inputs[7]);
    let worth = 0;
    game.cells.push(
        new Cell(index, richness, [neigh0, neigh1, neigh2, neigh3, neigh4, neigh5], worth)
    )
}

while (true) {
    game.day = parseInt(readline());
    game.nutrients = parseInt(readline());

    let inputs = [];
    inputs = readline().split(' ');
    game.mySun = parseInt(inputs[0]);
    game.myScore = parseInt(inputs[1]);

    inputs = readline().split(' ');
    game.opponentSun = parseInt(inputs[0]);
    game.opponentScore = parseInt(inputs[1]);
    game.opponentIsWaiting = inputs[2] !== '0';
    game.trees = []

    const numberOfTrees = parseInt(readline());
    for (let i = 0; i < numberOfTrees; i++) {
        inputs = readline().split(' ');
        const cellIndex = parseInt(inputs[0]);
        const size = parseInt(inputs[1]);
        const isMine = inputs[2] !== '0';
        const isDormant = inputs[3] !== '0';
        game.trees.push(
            new Tree(cellIndex, size, isMine, isDormant)
        )
    }

    game.possibleActions = []
    const numberOfPossibleAction = parseInt(readline());
    for (let i = 0; i < numberOfPossibleAction; i++) {
        const possibleAction = readline();
        game.possibleActions.push(Action.parse(possibleAction))
    }

    console.log(game.getNextAction().toString());
}
