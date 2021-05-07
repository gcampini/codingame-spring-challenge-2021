
class Game {
    constructor() {
        this.round = 0
        this.nutrients = 0
        this.cells = []
        this.possibleActions = []
        this.trees = []
        this.mySun = 0
        this.myScore = 0
        this.opponentsSun = 0
        this.opponentScore = 0
        this.opponentIsWaiting = 0
    }

    debug(){
        console.error("[DEBUG] possibleActions : ", this.possibleActions);
        console.error("[DEBUG][ACTION][GROW] : ",  this.possibleActions.filter(action => action.type === Action.GROW));
        console.error("[DEBUG] trees : ", this.trees);
        console.error("------------------------------------------------")
    }

    getNextAction() {
        this.debug();
        const wait = this.possibleActions[0];
        const treesToComplete = this.possibleActions.filter(action => action.type === Action.COMPLETE && action.targetCell.richness >= 2);
        if(treesToComplete.length > 1)
            return treesToComplete[0];

        /* todo : faire grandir un arbre pour envoyer les graines dans les cellules à 3 points */
        const treesToGrow = this.possibleActions.filter(action => action.type === Action.GROW);
        if(treesToGrow.length > 0)
            return treesToGrow[0];

        const seeds = this.possibleActions.filter(action => action.type === Action.SEED);
        if(seeds.length > 0){
            /* todo worthSeeds can be performed by a BFT to reach the neighbors */
            const worthSeeds = seeds.sort(action => {
                action.targetCell.richness >= 2
            });
            if(worthSeeds.length > 0)
                return worthSeeds[0];
        }

        return wait;
    }
}
const game = new Game();

class Cell {
    constructor(index, richness, neighbors) {
        this.index = index
        this.richness = richness
        this.neighbors = neighbors
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
    game.cells.push(
        new Cell(index, richness, [neigh0, neigh1, neigh2, neigh3, neigh4, neigh5])
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

    game.round++;
    const action = game.getNextAction();
    console.log(action.toString());
}
