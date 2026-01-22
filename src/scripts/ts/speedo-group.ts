import { Speedo } from "./speedo.js";
import { SpeedoType } from "./speedo.js";
import { Color } from "./color.js";
import { m0reColor } from "./m0recolors.js";
import { VDFElement } from "./vdfelement.js";

export type SpeedoSize = "SMALL" | "MEDIUM" | "LARGE";
export type Font =
        | "bahnschrift"
        | "coolvetica"
        | "coolvetica_italic"
        | "eternal"
        | "montserrat"
        | "nk57"
        | "poppins"
        | "quake"
        | "renogare"
        | "roboto"
        | "square"
        | "surface";

export type Range = {
        closeMin: number;
        closeMax: number;
        goodMin: number;
        goodMax: number;
};

export class SpeedoGroup {
        previewSpeed?: number;
        speedos: Speedo[];
        round: boolean;
        drawShadows: boolean;
        private size: SpeedoSize; // must use setter so vdfElm can be updated to match
        colorMain: Color;
        colorClose: Color;
        colorGood: Color;
        colorHeightoMain: Color;
        colorDouble: Color;
        colorTriple: Color;
        colorMaxVel: Color;
        HSpeedoRange: Range;
        VSpeedoRange: Range;
        ASpeedoRange: Range;
        HeightoThresholds: { double: number; triple: number; maxVel: number };
        framerate: number;
        frametime: number;
        vdfElm: VDFElement;
        font: Font;

        constructor() {
                this.vdfElm = new VDFElement("speedos");
                this.setSize((this.size = "MEDIUM"));
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
                this.colorHeightoMain = m0reColor.WHITE;
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

                this.speedos = [];
                this.speedos.push(new Speedo("NONE" as SpeedoType, this.colorMain));
                this.speedos.push(new Speedo("NONE" as SpeedoType, this.colorMain));
                this.speedos.push(new Speedo("NONE" as SpeedoType, this.colorMain));
                this.speedos.push(new Speedo("NONE" as SpeedoType, this.colorMain));
        }

        startPreview(): void {
                const sine_max: number = 3500;
                const sine_min: number = 0;
                const sine_period: number = 6;
                const sine_rate: number = (sine_max - sine_min) / sine_period / this.frametime;
                this.previewSpeed = 0;

                // still need to implement sine shape, number currently moves linearly
                setInterval(() => {
                        // increment speed
                        this.previewSpeed! += Math.round(sine_rate);
                        // round if needed
                        if (this.round) {
                                this.previewSpeed! /= 10;
                                this.previewSpeed! = Math.round(this.previewSpeed!);
                                this.previewSpeed! *= 10;
                        }
                        // loop back to 0 when it reaches max
                        if (this.previewSpeed! > sine_max) {
                                this.previewSpeed = sine_min;
                        }
                        // update speed & color of all speedo slots
                        for (const speedo of this.speedos) {
                                if (speedo.speedoType === "HEIGHTO") {
                                        speedo.playerSpeed = Math.round(this.previewSpeed! * (9999 / 3500));
                                        if (this.round) {
                                                speedo.playerSpeed /= 10;
                                                speedo.playerSpeed = Math.round(speedo.playerSpeed);
                                                speedo.playerSpeed *= 10;
                                        }
                                } else {
                                        speedo.playerSpeed = this.previewSpeed!;
                                }
                                speedo.updateColor(this);
                        }
                }, this.frametime);
        }

        getSize(): SpeedoSize {
                return this.size;
        }

        setSize(size: SpeedoSize): void {
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

        async importFromJSON(input: HTMLInputElement) {
                if (!input.value.length) return;

                if (input.files && input.files[0]) {
                        let temp = new SpeedoGroup();
                        Object.assign(temp, JSON.parse(await input.files[0].text()));

                        for (const [index, speedo] of this.speedos.entries()) {
                                speedo.speedoType = temp.speedos[index].speedoType;
                        }
                        this.round = temp.round;
                        this.drawShadows = temp.drawShadows;
                        this.colorMain.clone(temp.colorMain);
                        this.colorClose.clone(temp.colorClose);
                        this.colorGood.clone(temp.colorGood);
                        this.colorHeightoMain.clone(temp.colorHeightoMain);
                        this.colorDouble.clone(temp.colorDouble);
                        this.colorTriple.clone(temp.colorTriple);
                        this.colorMaxVel.clone(temp.colorMaxVel);
                        this.HSpeedoRange = temp.HSpeedoRange;
                        this.VSpeedoRange = temp.VSpeedoRange;
                        this.ASpeedoRange = temp.ASpeedoRange;
                        this.HeightoThresholds = temp.HeightoThresholds;
                        this.framerate = temp.framerate;
                        this.frametime = temp.frametime;
                        this.vdfElm = temp.vdfElm;
                        this.font = temp.font;
                }
        }
}

export const presetDemo = ((): SpeedoGroup => {
        let speedoGroup = new SpeedoGroup();

        speedoGroup.setSize("MEDIUM");
        speedoGroup.vdfElm.xpos = "cs-0.5";
        speedoGroup.vdfElm.ypos = "cs-0.5+54";

        speedoGroup.round = true;
        speedoGroup.drawShadows = true;
        speedoGroup.framerate = 30;
        speedoGroup.frametime = 1000 / speedoGroup.framerate;

        speedoGroup.font = "roboto";

        speedoGroup.colorMain = m0reColor.WHITE;
        speedoGroup.colorClose = m0reColor.BLUE;
        speedoGroup.colorGood = m0reColor.GREEN;
        speedoGroup.colorHeightoMain = m0reColor.WHITE;
        speedoGroup.colorDouble = m0reColor.BLUE;
        speedoGroup.colorTriple = m0reColor.GREEN;
        speedoGroup.colorMaxVel = m0reColor.YELLOW;

        speedoGroup.HSpeedoRange = {
                closeMin: 700,
                closeMax: 1200,
                goodMin: 850,
                goodMax: 900,
        };
        speedoGroup.VSpeedoRange = {
                closeMin: 800,
                closeMax: 1500,
                goodMin: 1100,
                goodMax: 1200,
        };
        speedoGroup.ASpeedoRange = {
                closeMin: -1,
                closeMax: -1,
                goodMin: -1,
                goodMax: -1,
        };
        speedoGroup.HeightoThresholds = {
                double: 10000,
                triple: 10000,
                maxVel: 10000,
        };

        speedoGroup.speedos[0] = new Speedo("NONE" as SpeedoType, speedoGroup.colorMain);
        speedoGroup.speedos[1] = new Speedo("HORIZONTAL" as SpeedoType, speedoGroup.colorMain);
        speedoGroup.speedos[2] = new Speedo("VERTICAL" as SpeedoType, speedoGroup.colorMain);
        speedoGroup.speedos[3] = new Speedo("NONE" as SpeedoType, speedoGroup.colorMain);

        return speedoGroup;
})();
Object.freeze(presetDemo);

export const presetSoldier = ((): SpeedoGroup => {
        let speedoGroup = new SpeedoGroup();

        speedoGroup.setSize("MEDIUM");
        speedoGroup.vdfElm.xpos = "cs-0.5";
        speedoGroup.vdfElm.ypos = "cs-0.5+54";

        speedoGroup.round = true;
        speedoGroup.drawShadows = true;
        speedoGroup.framerate = 30;
        speedoGroup.frametime = 1000 / speedoGroup.framerate;

        speedoGroup.font = "roboto";

        speedoGroup.colorMain = m0reColor.WHITE;
        speedoGroup.colorClose = m0reColor.BLUE;
        speedoGroup.colorGood = m0reColor.GREEN;
        speedoGroup.colorHeightoMain = m0reColor.WHITE;
        speedoGroup.colorDouble = m0reColor.BLUE;
        speedoGroup.colorTriple = m0reColor.GREEN;
        speedoGroup.colorMaxVel = m0reColor.YELLOW;

        speedoGroup.HSpeedoRange = {
                closeMin: 850,
                closeMax: 1350,
                goodMin: 1050,
                goodMax: 1150,
        };
        speedoGroup.VSpeedoRange = {
                closeMin: -1,
                closeMax: -1,
                goodMin: -1,
                goodMax: -1,
        };
        speedoGroup.ASpeedoRange = {
                closeMin: 850,
                closeMax: 1350,
                goodMin: 1050,
                goodMax: 1150,
        };
        speedoGroup.HeightoThresholds = {
                double: 1260,
                triple: 2160,
                maxVel: 7700,
        };

        speedoGroup.speedos[0] = new Speedo("NONE" as SpeedoType, speedoGroup.colorMain);
        speedoGroup.speedos[1] = new Speedo("HORIZONTAL" as SpeedoType, speedoGroup.colorMain);
        speedoGroup.speedos[2] = new Speedo("HEIGHTO" as SpeedoType, speedoGroup.colorMain);
        speedoGroup.speedos[3] = new Speedo("NONE" as SpeedoType, speedoGroup.colorMain);

        return speedoGroup;
})();
Object.freeze(presetSoldier);
