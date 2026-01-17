export class VDFElement {
        fieldName: string;
        controlName?: string;
        xpos: string;
        ypos: string;
        wide: string;
        tall: string;
        visible: boolean;
        enabled: boolean;

        constructor(name: string) {
                this.fieldName = name;
                this.xpos = "0";
                this.ypos = "0";
                this.visible = true;
                this.enabled = true;
                this.wide = "";
                this.tall = "";
        }
}
