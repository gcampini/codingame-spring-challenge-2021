import Action from "./Action";

export default class CompleteAction extends Action {

    constructor(public index: number) {
        super();
    }

    public toString() {
        return `COMPLETE ${this.index}`;
    }

}