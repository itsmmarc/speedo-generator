export class VDFElement{
    fieldName: string;
    controlName?: string;
    xpos: string;
    ypos: string;
    wide?: string;
    tall?: string;
    visible: boolean;
    enabled: boolean;

    constructor(name: string, xpos?: string, ypos?: string){
        this.fieldName = name;
        this.xpos = xpos || '0';
        this.ypos = ypos || '0';
        this.visible = true;
        this.enabled = true;

    }
}