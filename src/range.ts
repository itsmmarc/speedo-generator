export class Range{
    min: number;
    max: number;

    constructor(min?: number, max?: number){
        this.min = min || 0;
        this.max = max || 0;
    }
}