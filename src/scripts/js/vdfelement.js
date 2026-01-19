export class VDFElement {
    fieldName;
    controlName;
    xpos;
    ypos;
    wide;
    tall;
    visible;
    enabled;
    constructor(name) {
        this.fieldName = name;
        this.xpos = "0";
        this.ypos = "0";
        this.visible = true;
        this.enabled = true;
        this.wide = "";
        this.tall = "";
    }
}
