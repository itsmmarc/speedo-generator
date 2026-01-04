export class Color {
    name;
    rgb;
    constructor(name, rgb) {
        this.name = name;
        this.rgb = rgb;
    }
    // function to return rgb value in css syntax
    getCSSColor() {
        let color = '';
        color = color.concat('rgb(', this.rgb[0].toString(), ',', this.rgb[1].toString(), ',', this.rgb[2].toString(), ')');
        //let color: string = "rgb(" + this.rgb[0].toString + "," + this.rgb[1].toString + "," + this.rgb[2].toString + ")";
        return color;
    }
}
