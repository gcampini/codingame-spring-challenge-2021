export default class GrowAction implements Action {

    constructor(public index: number) {
    }

    public toString() {
        return `GROW ${this.index}`
    }

}