import Action from "../model/Action";
import Game from "../model/Game";
import Solver from "./Solver";

const roundMax = 23;
export default class SilverSolver implements Solver {

    solve(game: Game): Action {

        game.possibleActions.filter(value => value.type === "COMPLETE");
        game.possibleActions.filter(value => value.type === "GROW");
        game.possibleActions.filter(value => value.type === "SEED");

        return new Action("WAIT");
    }

}
