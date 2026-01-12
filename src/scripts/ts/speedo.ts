import { Color } from "./color.js";
import { Speedos } from "./speedos.js";

export type SpeedoType = 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'ABSOLUTE' | 'HEIGHTO';

const HSPEEDO_CLOSE_MIN: number = 850;
const HSPEEDO_CLOSE_MAX: number = 1350;
const HSPEEDO_GOOD_MIN: number = 1050;
const HSPEEDO_GOOD_MAX: number = 1150;

const VSPEEDO_CLOSE_MIN: number = -1;
const VSPEEDO_CLOSE_MAX: number = -1;
const VSPEEDO_GOOD_MIN: number = -1;
const VSPEEDO_GOOD_MAX: number = -1;

const ASPEEDO_CLOSE_MIN: number = HSPEEDO_CLOSE_MIN;
const ASPEEDO_CLOSE_MAX: number = HSPEEDO_CLOSE_MAX;
const ASPEEDO_GOOD_MIN: number = HSPEEDO_GOOD_MIN;
const ASPEEDO_GOOD_MAX: number = HSPEEDO_GOOD_MAX;

const HEIGHTO_DOUBLE_THRESH: number = 1260
const HEIGHTO_TRIPLE_THRESH: number = 2160
const HEIGHTO_MAXVEL_THRESH: number = 7700

export class Speedo {
    playerSpeed: number;
    color: Color;
    speedoType: SpeedoType;

    constructor(speedoType: SpeedoType, color: Color){
        this.playerSpeed = 0;
        this.speedoType = speedoType;
        this.color = color;
    }

    updateColor(speedos: Speedos): void{
        if(this.speedoType!="HEIGHTO"){
            if(this.isGood()){
                this.color = speedos.colorGood;
            } else if(this.isClose()){
                this.color = speedos.colorClose;
            } else{
                this.color = speedos.colorMain;
            }
        } else{
            if(this.isDouble()){
                this.color = speedos.colorDouble;
            } else if(this.isTriple()){
                this.color = speedos.colorTriple;
            } else if(this.isMaxVel()){
                this.color = speedos.colorMaxVel;
            } else{
                this.color = speedos.colorMain_Heighto;
            }
            return;
        }
    }

    isDouble(): boolean{
        if(this.playerSpeed>HEIGHTO_DOUBLE_THRESH && this.playerSpeed<HEIGHTO_TRIPLE_THRESH){
            return true;
        }
        return false;
    }

    isTriple(): boolean{
        if(this.playerSpeed>HEIGHTO_TRIPLE_THRESH && this.playerSpeed<HEIGHTO_MAXVEL_THRESH){
            return true;
        }
        return false;
    }

    isMaxVel(): boolean{
        if(this.playerSpeed>HEIGHTO_MAXVEL_THRESH){
            return true;
        }
        return false;
    }

    isClose(): boolean{
        switch (this.speedoType) {
            case "HORIZONTAL":
                if(this.playerSpeed>HSPEEDO_CLOSE_MIN && this.playerSpeed<HSPEEDO_CLOSE_MAX){
                    return true;
                } else{ return false;}
            case "VERTICAL":
                if(this.playerSpeed>VSPEEDO_CLOSE_MIN && this.playerSpeed<VSPEEDO_CLOSE_MAX){
                    return true;
                } else{ return false;}
            case "ABSOLUTE":
                if(this.playerSpeed>ASPEEDO_CLOSE_MIN && this.playerSpeed<ASPEEDO_CLOSE_MAX){
                    return true;
                } else{ return false;}
            default:
                return false;
        }
    }
    isGood(): boolean{
        switch (this.speedoType) {
            case "HORIZONTAL":
                if(this.playerSpeed>HSPEEDO_GOOD_MIN && this.playerSpeed<HSPEEDO_GOOD_MAX){
                    return true;
                } else{ return false;}
            case "VERTICAL":
                if(this.playerSpeed>VSPEEDO_GOOD_MIN && this.playerSpeed<VSPEEDO_GOOD_MAX){
                    return true;
                } else{ return false;}
            case "ABSOLUTE":
                if(this.playerSpeed>ASPEEDO_GOOD_MIN && this.playerSpeed<ASPEEDO_GOOD_MAX){
                    return true;
                } else{ return false;}
            default:
                return false;
        }
    }
}