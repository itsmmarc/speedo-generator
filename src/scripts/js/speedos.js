import { Speedo } from './speedo.js';
import { m0reColor } from './m0recolors.js';
import { VDFElement } from './vdfelement.js';
export class Speedos {
    previewSpeed;
    speedo;
    round;
    drawShadows;
    size;
    colorMain;
    colorClose;
    colorGood;
    colorMain_Heighto;
    colorDouble;
    colorTriple;
    colorMaxVel;
    framerate;
    frametime;
    vdfElm;
    font;
    constructor() {
        this.round = true;
        this.drawShadows = true;
        this.size = "MEDIUM";
        this.colorMain = m0reColor.WHITE;
        this.colorClose = m0reColor.BLUE;
        this.colorGood = m0reColor.GREEN;
        this.colorMain_Heighto = m0reColor.WHITE;
        this.colorDouble = m0reColor.BLUE;
        this.colorTriple = m0reColor.GREEN;
        this.colorMaxVel = m0reColor.YELLOW;
        this.framerate = 30;
        this.frametime = 1000 / this.framerate;
        this.speedo = new Array(4);
        this.speedo[0] = new Speedo("NONE", this.colorMain);
        this.speedo[1] = new Speedo("HORIZONTAL", this.colorMain);
        this.speedo[2] = new Speedo("HEIGHTO", this.colorMain);
        this.speedo[3] = new Speedo("NONE", this.colorMain);
        this.vdfElm = new VDFElement('speedos', 'cs-0.5', 'cs-0.5+54');
        this.font = 'roboto';
    }
    startSpeedoPreview() {
        const sine_max = 3500;
        const sine_min = 0;
        const sine_period = 6;
        const sine_rate = (sine_max - sine_min) / sine_period / this.frametime;
        this.previewSpeed = 0;
        // still need to implement sine shape, number currently moves linearly
        setInterval(() => {
            // increment speed
            this.previewSpeed += Math.round(sine_rate);
            // round if needed
            if (this.round) {
                this.previewSpeed /= 10;
                this.previewSpeed = Math.round(this.previewSpeed);
                this.previewSpeed *= 10;
            }
            // loop back to 0 when it reaches max
            if (this.previewSpeed > sine_max) {
                this.previewSpeed = sine_min;
            }
            // update speed & color of all speedo slots
            this.speedo.forEach(speedo => {
                speedo.playerSpeed = this.previewSpeed;
                speedo.updateColor(this);
                //console.log(speedo.color.getCSSColor());
            });
        }, this.frametime);
    }
}
