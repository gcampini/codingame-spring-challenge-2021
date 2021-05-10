import Action from "./Action";

export default class GrowAction extends Action {

    constructor(public index: number) {
        super();
    }

    public toString() {
        return `GROW ${this.index}`
    }

}