import Action from "./Action";

export default class SeedAction extends Action {

    constructor(public lanceur: number, public receveur: number) {
        super();
    }

    public toString(): string {
        return `SEED ${this.lanceur} ${this.receveur}`;
    }

}