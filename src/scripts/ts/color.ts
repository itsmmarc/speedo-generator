export class Color {
        r: number;
        g: number;
        b: number;

        constructor(r?: number, g?: number, b?: number) {
                this.r = r || 0;
                this.g = g || 0;
                this.b = b || 0;
        }

        // function to return rgb value in css syntax
        getCSSColor(): string {
                let color: string = "";
                color = color.concat("rgb(", this.r.toString(), ",", this.g.toString(), ",", this.b.toString(), ")");

                return color;
        }

        getInputColor(): string {
                let color: string = "";
                let r_hex = this.r.toString(16).padStart(2, "0");
                let g_hex = this.g.toString(16).padStart(2, "0");
                let b_hex = this.b.toString(16).padStart(2, "0");
                color = color.concat("#", r_hex, g_hex, b_hex);

                return color;
        }

        getVMTColor(): string {
                let color: string = "";
                color = color.concat('"{ ', this.r.toString(), " ", this.g.toString(), " ", this.b.toString(), ' }"');
                return color;
        }

        static input_to_color(s: string): Color {
                let color: Color = new Color();
                let r_hex: string = s.charAt(1) + s.charAt(2);
                let g_hex: string = s.charAt(3) + s.charAt(4);
                let b_hex: string = s.charAt(5) + s.charAt(6);
                color.r = parseInt(r_hex, 16);
                color.g = parseInt(g_hex, 16);
                color.b = parseInt(b_hex, 16);

                return color;
        }

        clone(from: Color) {
                this.r = from.r;
                this.g = from.g;
                this.b = from.b;
        }
}
