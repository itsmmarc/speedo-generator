import { Color } from "./color.js";

export enum SpeedoType{NONE=0, HORIZONTAL=1, VERTICAL=2, ABSOLUTE=3, HEIGHTO=4}

const SOLDIER_HSPEEDO_CLOSE_MIN: number = 850;
const SOLDIER_HSPEEDO_CLOSE_MAX: number = 1350;
const SOLDIER_VSPEEDO_CLOSE_MIN: number = -1;
const SOLDIER_VSPEEDO_CLOSE_MAX: number = -1;
const SOLDIER_ASPEEDO_CLOSE_MIN: number = SOLDIER_HSPEEDO_CLOSE_MIN;
const SOLDIER_ASPEEDO_CLOSE_MAX: number = SOLDIER_HSPEEDO_CLOSE_MAX;

const SOLDIER_HSPEEDO_GOOD_MIN: number = 1050;
const SOLDIER_HSPEEDO_GOOD_MAX: number = 1150;
const SOLDIER_VSPEEDO_GOOD_MIN: number = -1;
const SOLDIER_VSPEEDO_GOOD_MAX: number = -1;
const SOLDIER_ASPEEDO_GOOD_MIN: number = SOLDIER_HSPEEDO_GOOD_MIN;
const SOLDIER_ASPEEDO_GOOD_MAX: number = SOLDIER_HSPEEDO_GOOD_MAX;

export class Speedo {
    playerSpeed: number;
    color: Color;
    speedoType: SpeedoType;

    constructor(speedoType: SpeedoType, color: Color){
        this.playerSpeed = 0;
        this.speedoType = speedoType;
        this.color = color;
    }

    updateColor(colorMain: Color, colorClose: Color, colorGood: Color): void{
        if(this.speedoType!=SpeedoType.HEIGHTO){
            if(this.isGood()){
                this.color = colorGood;
            } else if(this.isClose()){
                this.color = colorClose;
            } else{
                this.color = colorMain;
            }
        } else{
            // implement heighto colors here
            return;
        }
    }

    isClose(): boolean{
        switch (this.speedoType) {
            case SpeedoType.HORIZONTAL:
                if(this.playerSpeed>SOLDIER_HSPEEDO_CLOSE_MIN && this.playerSpeed<SOLDIER_HSPEEDO_CLOSE_MAX){
                    return true;
                } else{ return false;}
            case SpeedoType.VERTICAL:
                if(this.playerSpeed>SOLDIER_VSPEEDO_CLOSE_MIN && this.playerSpeed<SOLDIER_VSPEEDO_CLOSE_MAX){
                    return true;
                } else{ return false;}
            case SpeedoType.ABSOLUTE:
                if(this.playerSpeed>SOLDIER_ASPEEDO_CLOSE_MIN && this.playerSpeed<SOLDIER_ASPEEDO_CLOSE_MAX){
                    return true;
                } else{ return false;}
            default:
                return false;
        }
    }
    isGood(): boolean{
        switch (this.speedoType) {
            case SpeedoType.HORIZONTAL:
                if(this.playerSpeed>SOLDIER_HSPEEDO_GOOD_MIN && this.playerSpeed<SOLDIER_HSPEEDO_GOOD_MAX){
                    return true;
                } else{ return false;}
            case SpeedoType.VERTICAL:
                if(this.playerSpeed>SOLDIER_VSPEEDO_GOOD_MIN && this.playerSpeed<SOLDIER_VSPEEDO_GOOD_MAX){
                    return true;
                } else{ return false;}
            case SpeedoType.ABSOLUTE:
                if(this.playerSpeed>SOLDIER_ASPEEDO_GOOD_MIN && this.playerSpeed<SOLDIER_ASPEEDO_GOOD_MAX){
                    return true;
                } else{ return false;}
            default:
                return false;
        }
    }
}