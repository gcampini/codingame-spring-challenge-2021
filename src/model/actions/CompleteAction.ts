export default class CompleteAction implements Action {

    constructor(public index: number) {
    }

    public toString() {
        return `COMPLETE ${this.index}`;
    }

}