import { Speedo } from './speedo.js';
import { SpeedoType } from './speedo.js';
import { m0reColor } from './m0recolors.js';
import { m0reColors } from './m0recolors.js';
export var SpeedoSize;
(function (SpeedoSize) {
    SpeedoSize[SpeedoSize["SMALL"] = 1] = "SMALL";
    SpeedoSize[SpeedoSize["MEDIUM"] = 2] = "MEDIUM";
    SpeedoSize[SpeedoSize["LARGE"] = 3] = "LARGE";
})(SpeedoSize || (SpeedoSize = {}));
export class Speedos {
    previewSpeed;
    speedo;
    round;
    drawShadows;
    size;
    colorMain;
    colorClose;
    colorGood;
    framerate;
    frametime;
    constructor() {
        this.round = true;
        this.drawShadows = true;
        this.size = SpeedoSize.MEDIUM;
        this.colorMain = m0reColors.get(m0reColor.WHITE);
        this.colorClose = m0reColors.get(m0reColor.BLUE);
        this.colorGood = m0reColors.get(m0reColor.GREEN);
        this.framerate = 30;
        this.frametime = 1000 / this.framerate;
        this.speedo = new Array(4);
        this.speedo[0] = new Speedo(SpeedoType.NONE, this.colorMain);
        this.speedo[1] = new Speedo(SpeedoType.HORIZONTAL, this.colorMain);
        this.speedo[2] = new Speedo(SpeedoType.HEIGHTO, this.colorMain);
        this.speedo[3] = new Speedo(SpeedoType.NONE, this.colorMain);
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
                speedo.updateColor(this.colorMain, this.colorClose, this.colorGood);
                //console.log(speedo.color.getCSSColor());
            });
        }, this.frametime);
    }
}
