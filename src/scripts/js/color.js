export class Color {
    r;
    g;
    b;
    constructor(r, g, b) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
    }
    // function to return rgb value in css syntax
    getCSSColor() {
        let color = "";
        color = color.concat("rgb(", this.r.toString(), ",", this.g.toString(), ",", this.b.toString(), ")");
        return color;
    }
    getInputColor() {
        let color = "";
        let r_hex = this.r.toString(16).padStart(2, "0");
        let g_hex = this.g.toString(16).padStart(2, "0");
        let b_hex = this.b.toString(16).padStart(2, "0");
        color = color.concat("#", r_hex, g_hex, b_hex);
        return color;
    }
    getVMTColor() {
        let color = "";
        color = color.concat('"{ ', this.r.toString(), " ", this.g.toString(), " ", this.b.toString(), ' }"');
        return color;
    }
    static input_to_color(s) {
        let color = new Color();
        let r_hex = s.charAt(1) + s.charAt(2);
        let g_hex = s.charAt(3) + s.charAt(4);
        let b_hex = s.charAt(5) + s.charAt(6);
        color.r = parseInt(r_hex, 16);
        color.g = parseInt(g_hex, 16);
        color.b = parseInt(b_hex, 16);
        return color;
    }
    clone(from) {
        this.r = from.r;
        this.g = from.g;
        this.b = from.b;
    }
}
