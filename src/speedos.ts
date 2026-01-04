import { Speedo } from './speedo.js';
import { SpeedoType } from './speedo.js';
import { Color } from './color.js';
import { m0reColor } from './m0recolors.js';
import { m0reColors } from './m0recolors.js';

export enum SpeedoSize{SMALL=1, MEDIUM=2, LARGE=3}

export class Speedos {
    previewSpeed?: number;
    speedo: Speedo[];
    round: boolean;
    drawShadows: boolean;
    size: SpeedoSize;
    colorMain: Color;
    colorClose: Color;
    colorGood: Color;
    framerate: number;
    frametime: number;

    constructor(){
        this.round = true;
        this.drawShadows = true;
        this.size = SpeedoSize.MEDIUM;
        this.colorMain = m0reColors.get(m0reColor.WHITE) as Color;
        this.colorClose = m0reColors.get(m0reColor.BLUE) as Color;
        this.colorGood = m0reColors.get(m0reColor.GREEN) as Color;
        this.framerate = 30;
        this.frametime = 1000/this.framerate;

        this.speedo = new Array<Speedo>(4);
        this.speedo[0] = new Speedo(SpeedoType.NONE, this.colorMain);
        this.speedo[1] = new Speedo(SpeedoType.HORIZONTAL, this.colorMain);
        this.speedo[2] = new Speedo(SpeedoType.HEIGHTO, this.colorMain);
        this.speedo[3] = new Speedo(SpeedoType.NONE, this.colorMain);
    }
    
    startSpeedoPreview(): void{
        const sine_max: number = 3500;
        const sine_min: number = 0;
        const sine_period: number = 6
        const sine_rate: number = (sine_max - sine_min)/sine_period/this.frametime;
        this.previewSpeed = 0;
        
        // still need to implement sine shape, number currently moves linearly
        setInterval(() => {
            // increment speed
            this.previewSpeed! += Math.round(sine_rate);
            // loop back to 0 when it reaches max
            if(this.previewSpeed!>sine_max){
                this.previewSpeed = sine_min;
            }
            // update speed & color of all speedo slots
            this.speedo.forEach(speedo => {
                speedo.playerSpeed = this.previewSpeed!;
                speedo.updateColor(this.colorMain, this.colorClose, this.colorGood);
                //console.log(speedo.color.getCSSColor());
            });
        }, this.frametime);
    }
}