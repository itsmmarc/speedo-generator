export class VDFElement {
    fieldName;
    controlName;
    xpos;
    ypos;
    wide;
    tall;
    visible;
    enabled;
    constructor(name, xpos, ypos) {
        this.fieldName = name;
        this.xpos = xpos || '0';
        this.ypos = ypos || '0';
        this.visible = true;
        this.enabled = true;
    }
}
