import Action from "../model/actions/Action";
import CompleteAction from "../model/actions/CompleteAction";
import GrowAction from "../model/actions/GrowAction";
import SeedAction from "../model/actions/SeedAction";
import WaitAction from "../model/actions/WaitAction";
import Game from "../model/Game";
import Tree from "../model/Tree";
import Solver from "./Solver";

const roundMax = 23;

export default class BronzeSolver implements Solver {

    solve(game: Game): Action {

        const treesToComplete = game.myTrees.filter(tree => tree.size === 3 && !tree.isDormant);
        if (game.mySun >= 4 && (treesToComplete.length > 10 * (1 - (game.round / roundMax)))) {
            return new CompleteAction(treesToComplete[0].cell.index);
        }

        if (game.round >= 3 && game.myTrees.filter(tree => tree.size === 0).length === 0) {
            const seedActions = game.actions.filter(a => {
                if (!(a instanceof SeedAction)) return false;
                return game.cells[a.lanceur].cercle === 3;
            }).sort((a: SeedAction, b: SeedAction) => {
                const receveurA = game.cells[a.receveur];
                const receveurB = game.cells[b.receveur];
                return receveurB.attraction(game) - receveurA.attraction(game);
            });
            if (seedActions.length > 0) return seedActions[0];
        }

        const treeToGrow = game.myTrees.filter(tree => !tree.isDormant && tree.size < 3).sort((t1, t2) => t2.growCost(game) - t1.growCost(game))[0];
        if (treeToGrow && treeToGrow.growCost(game) <= game.mySun) return new GrowAction(treeToGrow.cell.index);

        return new WaitAction();

    }

}