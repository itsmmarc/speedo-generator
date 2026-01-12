import { Speedo } from './speedo.js';
import { SpeedoType } from './speedo.js';
import { Color } from './color.js';
import { m0reColor } from './m0recolors.js';
import { VDFElement } from './vdfelement.js';

export type SpeedoSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export class Speedos {
    previewSpeed?: number;
    speedo: Speedo[];
    round: boolean;
    drawShadows: boolean;
    size: SpeedoSize;
    colorMain: Color;
    colorClose: Color;
    colorGood: Color;
    colorMain_Heighto: Color;
    colorDouble: Color;
    colorTriple: Color;
    colorMaxVel: Color;
    framerate: number;
    frametime: number;
    position: VDFElement;

    constructor(){
        this.round = true;
        this.drawShadows = true;
        this.size = "MEDIUM" as SpeedoSize;
        this.colorMain = m0reColor.WHITE;
        this.colorClose = m0reColor.BLUE;
        this.colorGood = m0reColor.GREEN;
        this.colorMain_Heighto = m0reColor.WHITE;
        this.colorDouble = m0reColor.BLUE;
        this.colorTriple = m0reColor.GREEN;
        this.colorMaxVel = m0reColor.YELLOW;
        this.framerate = 30;
        this.frametime = 1000/this.framerate;

        this.speedo = new Array<Speedo>(4);
        this.speedo[0] = new Speedo("NONE" as SpeedoType, this.colorMain);
        this.speedo[1] = new Speedo("HORIZONTAL" as SpeedoType, this.colorMain);
        this.speedo[2] = new Speedo("HEIGHTO" as SpeedoType, this.colorMain);
        this.speedo[3] = new Speedo("NONE" as SpeedoType, this.colorMain);

        this.position = new VDFElement('speedos', 'cs-0.5', 'cs-0.5+54');
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
            // round if needed
            if(this.round){
                this.previewSpeed! /= 10;
                this.previewSpeed! = Math.round(this.previewSpeed!);
                this.previewSpeed! *= 10;
            }
            // loop back to 0 when it reaches max
            if(this.previewSpeed!>sine_max){
                this.previewSpeed = sine_min;
            }
            // update speed & color of all speedo slots
            this.speedo.forEach(speedo => {
                speedo.playerSpeed = this.previewSpeed!;
                speedo.updateColor(this);
                //console.log(speedo.color.getCSSColor());
            });
        }, this.frametime);
    }
}