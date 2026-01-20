import { Speedo } from "./speedo.js";
import { m0reColor } from "./m0recolors.js";
import { VDFElement } from "./vdfelement.js";
export class Speedos {
    previewSpeed;
    speedo;
    round;
    drawShadows;
    size; // must use setter so vdfElm can be updated to match
    colorMain;
    colorClose;
    colorGood;
    colorMain_Heighto;
    colorDouble;
    colorTriple;
    colorMaxVel;
    HSpeedoRange;
    VSpeedoRange;
    ASpeedoRange;
    HeightoThresholds;
    framerate;
    frametime;
    vdfElm;
    font;
    constructor() {
        this.vdfElm = new VDFElement("speedos");
        this.size = {};
        this.setSize("MEDIUM");
        this.vdfElm.xpos = "cs-0.5";
        this.vdfElm.ypos = "cs-0.5";
        this.round = true;
        this.drawShadows = true;
        this.framerate = 30;
        this.frametime = 1000 / this.framerate;
        this.font = "roboto";
        this.colorMain = m0reColor.WHITE;
        this.colorClose = m0reColor.BLUE;
        this.colorGood = m0reColor.GREEN;
        this.colorMain_Heighto = m0reColor.WHITE;
        this.colorDouble = m0reColor.BLUE;
        this.colorTriple = m0reColor.GREEN;
        this.colorMaxVel = m0reColor.YELLOW;
        this.HSpeedoRange = {
            closeMin: 0,
            closeMax: 0,
            goodMin: 0,
            goodMax: 0,
        };
        this.VSpeedoRange = {
            closeMin: 0,
            closeMax: 0,
            goodMin: 0,
            goodMax: 0,
        };
        this.ASpeedoRange = {
            closeMin: 0,
            closeMax: 0,
            goodMin: 0,
            goodMax: 0,
        };
        this.HeightoThresholds = {
            double: 10000,
            triple: 10000,
            maxVel: 10000,
        };
        this.speedo = new Array(4);
        this.speedo[0] = new Speedo("NONE", this.colorMain);
        this.speedo[1] = new Speedo("NONE", this.colorMain);
        this.speedo[2] = new Speedo("NONE", this.colorMain);
        this.speedo[3] = new Speedo("NONE", this.colorMain);
    }
    startPreview() {
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
            this.speedo.forEach((speedo) => {
                if (speedo.speedoType == "HEIGHTO") {
                    speedo.playerSpeed = Math.round(this.previewSpeed * (9999 / 3500));
                    if (this.round) {
                        speedo.playerSpeed /= 10;
                        speedo.playerSpeed = Math.round(speedo.playerSpeed);
                        speedo.playerSpeed *= 10;
                    }
                }
                else {
                    speedo.playerSpeed = this.previewSpeed;
                }
                speedo.updateColor(this);
            });
        }, this.frametime);
    }
    getSize() {
        return this.size;
    }
    setSize(size) {
        this.size = size;
        switch (this.size) {
            case "SMALL":
                this.vdfElm.wide = "52";
                this.vdfElm.tall = "52";
                break;
            case "MEDIUM":
                this.vdfElm.wide = "72";
                this.vdfElm.tall = "72";
                break;
            case "LARGE":
                this.vdfElm.wide = "84";
                this.vdfElm.tall = "84";
                break;
            default:
                this.vdfElm.wide = "72 // error: defaulted to medium size";
                this.vdfElm.tall = "72 // error: defaulted to medium size";
                break;
        }
    }
}
export const presetDemo = (() => {
    let speedos = new Speedos();
    speedos.setSize("MEDIUM");
    speedos.vdfElm.xpos = "cs-0.5";
    speedos.vdfElm.ypos = "cs-0.5+54";
    speedos.round = true;
    speedos.drawShadows = true;
    speedos.framerate = 30;
    speedos.frametime = 1000 / speedos.framerate;
    speedos.font = "roboto";
    speedos.colorMain = m0reColor.WHITE;
    speedos.colorClose = m0reColor.BLUE;
    speedos.colorGood = m0reColor.GREEN;
    speedos.colorMain_Heighto = m0reColor.WHITE;
    speedos.colorDouble = m0reColor.BLUE;
    speedos.colorTriple = m0reColor.GREEN;
    speedos.colorMaxVel = m0reColor.YELLOW;
    speedos.HSpeedoRange = {
        closeMin: 700,
        closeMax: 1200,
        goodMin: 850,
        goodMax: 900,
    };
    speedos.VSpeedoRange = {
        closeMin: 800,
        closeMax: 1500,
        goodMin: 1100,
        goodMax: 1200,
    };
    speedos.ASpeedoRange = {
        closeMin: -1,
        closeMax: -1,
        goodMin: -1,
        goodMax: -1,
    };
    speedos.HeightoThresholds = {
        double: 10000,
        triple: 10000,
        maxVel: 10000,
    };
    speedos.speedo[0] = new Speedo("NONE", speedos.colorMain);
    speedos.speedo[1] = new Speedo("HORIZONTAL", speedos.colorMain);
    speedos.speedo[2] = new Speedo("VERTICAL", speedos.colorMain);
    speedos.speedo[3] = new Speedo("NONE", speedos.colorMain);
    return speedos;
})();
export const presetSoldier = (() => {
    let speedos = new Speedos();
    speedos.setSize("MEDIUM");
    speedos.vdfElm.xpos = "cs-0.5";
    speedos.vdfElm.ypos = "cs-0.5+54";
    speedos.round = true;
    speedos.drawShadows = true;
    speedos.framerate = 30;
    speedos.frametime = 1000 / speedos.framerate;
    speedos.font = "roboto";
    speedos.colorMain = m0reColor.WHITE;
    speedos.colorClose = m0reColor.BLUE;
    speedos.colorGood = m0reColor.GREEN;
    speedos.colorMain_Heighto = m0reColor.WHITE;
    speedos.colorDouble = m0reColor.BLUE;
    speedos.colorTriple = m0reColor.GREEN;
    speedos.colorMaxVel = m0reColor.YELLOW;
    speedos.HSpeedoRange = {
        closeMin: 850,
        closeMax: 1350,
        goodMin: 1050,
        goodMax: 1150,
    };
    speedos.VSpeedoRange = {
        closeMin: -1,
        closeMax: -1,
        goodMin: -1,
        goodMax: -1,
    };
    speedos.ASpeedoRange = {
        closeMin: 850,
        closeMax: 1350,
        goodMin: 1050,
        goodMax: 1150,
    };
    speedos.HeightoThresholds = {
        double: 1260,
        triple: 2160,
        maxVel: 7700,
    };
    speedos.speedo[0] = new Speedo("NONE", speedos.colorMain);
    speedos.speedo[1] = new Speedo("HORIZONTAL", speedos.colorMain);
    speedos.speedo[2] = new Speedo("HEIGHTO", speedos.colorMain);
    speedos.speedo[3] = new Speedo("NONE", speedos.colorMain);
    return speedos;
})();
Object.freeze(presetDemo);
Object.freeze(presetSoldier);
