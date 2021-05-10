import Action from "../model/actions/Action";
import Game from "../model/Game";

export default interface Solver {

    solve(game: Game): Action;

}