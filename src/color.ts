export class Color{
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // function to return rgb value in css syntax
    getCSSColor(): string{
        let color: string = '';
        color = color.concat('rgb(',this.r.toString(),',',this.g.toString(),',',this.b.toString(),')');
        return color;
    }
}