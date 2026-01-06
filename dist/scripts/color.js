export class Color {
    r;
    g;
    b;
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    // function to return rgb value in css syntax
    getCSSColor() {
        let color = '';
        color = color.concat('rgb(', this.r.toString(), ',', this.g.toString(), ',', this.b.toString(), ')');
        return color;
    }
}
