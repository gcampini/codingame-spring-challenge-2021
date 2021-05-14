import Action from "../model/Action";
import Game from "../model/Game";

export default interface Solver {

    solve(game: Game): Action;

}
