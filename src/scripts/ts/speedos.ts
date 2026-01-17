import { Speedo } from './speedo.js';
import { SpeedoType } from './speedo.js';
import { Color } from './color.js';
import { m0reColor } from './m0recolors.js';
import { VDFElement } from './vdfelement.js';

export type SpeedoSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type Font = 'bahnschrift' | 'coolvetica' | 'coolvetica_italic' | 'eternal' | 'montserrat' | 'nk57' | 'poppins' | 'quake' | 'renogare' | 'roboto' | 'square' | 'surface';
export type Range = {closeMin: number, closeMax: number, goodMin: number, goodMax: number};

export class Speedos {
    previewSpeed?: number;
    speedo: Speedo[];
    round: boolean;
    drawShadows: boolean;
    private size: SpeedoSize;   // must use setter so vdfElm can be updated to match
    colorMain: Color;
    colorClose: Color;
    colorGood: Color;
    colorMain_Heighto: Color;
    colorDouble: Color;
    colorTriple: Color;
    colorMaxVel: Color;
    HSpeedoRange: Range;
    VSpeedoRange: Range;
    ASpeedoRange: Range;
    HeightoThresholds: {double: number, triple: number, maxVel: number};
    framerate: number;
    frametime: number;
    vdfElm: VDFElement;
    font: Font;

    constructor(){
        this.vdfElm = new VDFElement('speedos');
        this.size = <SpeedoSize>{};
        this.setSize('MEDIUM');
        this.vdfElm.xpos = 'cs-0.5';
        this.vdfElm.ypos = 'cs-0.5+54';

        this.round = true;
        this.drawShadows = true;
        this.framerate = 30;
        this.frametime = 1000/this.framerate;

        this.font = 'roboto';

        this.colorMain = m0reColor.WHITE;
        this.colorClose = m0reColor.BLUE;
        this.colorGood = m0reColor.GREEN;
        this.colorMain_Heighto = m0reColor.WHITE;
        this.colorDouble = m0reColor.BLUE;
        this.colorTriple = m0reColor.GREEN;
        this.colorMaxVel = m0reColor.YELLOW;

        this.HSpeedoRange = {closeMin: 850, closeMax: 1350, goodMin: 1050, goodMax: 1150};
        this.VSpeedoRange = {closeMin: -1, closeMax: -1, goodMin: -1, goodMax: -1};
        this.ASpeedoRange = {closeMin: 850, closeMax: 1350, goodMin: 1050, goodMax: 1150};
        this.HeightoThresholds = {double: 1260, triple: 2160, maxVel: 7700};

        this.speedo = new Array<Speedo>(4);
        this.speedo[0] = new Speedo("NONE" as SpeedoType, this.colorMain);
        this.speedo[1] = new Speedo("HORIZONTAL" as SpeedoType, this.colorMain);
        this.speedo[2] = new Speedo("HEIGHTO" as SpeedoType, this.colorMain);
        this.speedo[3] = new Speedo("NONE" as SpeedoType, this.colorMain);
    }
    
    startPreview(): void{
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
                if(speedo.speedoType == 'HEIGHTO'){
                    speedo.playerSpeed = Math.round(this.previewSpeed! * (9999/3500));
                    if(this.round){
                        speedo.playerSpeed /= 10;
                        speedo.playerSpeed = Math.round(speedo.playerSpeed);
                        speedo.playerSpeed *= 10;
                    }
                } else{
                    speedo.playerSpeed = this.previewSpeed!;
                }
                speedo.updateColor(this);
            });
        }, this.frametime);
    }

    getSize(): SpeedoSize{
        return this.size;
    }

    setSize(size: SpeedoSize): void{
        this.size = size;
        switch (this.size) {
            case "SMALL":
                this.vdfElm.wide = '52';
                this.vdfElm.tall = '52';
                break;
            case "MEDIUM":
                this.vdfElm.wide = '72';
                this.vdfElm.tall = '72';
                break;
            case "LARGE":
                this.vdfElm.wide = '84';
                this.vdfElm.tall = '84';
                break;    
            default:
                this.vdfElm.wide = '72 // error: defaulted to medium size';
                this.vdfElm.tall = '72 // error: defaulted to medium size';
                break;
        }
    }
}