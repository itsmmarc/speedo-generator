import { Color } from "./color.js";
import { SpeedoGroup } from "./speedo-group.js";

export type SpeedoType = "NONE" | "HORIZONTAL" | "VERTICAL" | "ABSOLUTE" | "HEIGHTO";

export class Speedo {
        playerSpeed: number;
        color: Color;
        speedoType: SpeedoType;

        constructor(speedoType: SpeedoType, color: Color) {
                this.playerSpeed = 0;
                this.speedoType = speedoType;
                this.color = color;
        }

        updateColor(speedoGroup: SpeedoGroup): void {
                if (this.speedoType != "HEIGHTO") {
                        if (this.isGood(speedoGroup)) {
                                this.color = speedoGroup.colorGood;
                        } else if (this.isClose(speedoGroup)) {
                                this.color = speedoGroup.colorClose;
                        } else {
                                this.color = speedoGroup.colorMain;
                        }
                } else {
                        if (this.isDouble(speedoGroup)) {
                                this.color = speedoGroup.colorDouble;
                        } else if (this.isTriple(speedoGroup)) {
                                this.color = speedoGroup.colorTriple;
                        } else if (this.isMaxVel(speedoGroup)) {
                                this.color = speedoGroup.colorMaxVel;
                        } else {
                                this.color = speedoGroup.colorHeightoMain;
                        }
                        return;
                }
        }

        isClose(speedoGroup: SpeedoGroup): boolean {
                switch (this.speedoType) {
                        case "HORIZONTAL":
                                if (
                                        this.playerSpeed > speedoGroup.HSpeedoRange.closeMin &&
                                        this.playerSpeed < speedoGroup.HSpeedoRange.closeMax
                                ) {
                                        return true;
                                }
                                return false;
                        case "VERTICAL":
                                if (
                                        this.playerSpeed > speedoGroup.VSpeedoRange.closeMin &&
                                        this.playerSpeed < speedoGroup.VSpeedoRange.closeMax
                                ) {
                                        return true;
                                }
                                return false;
                        case "ABSOLUTE":
                                if (
                                        this.playerSpeed > speedoGroup.ASpeedoRange.closeMin &&
                                        this.playerSpeed < speedoGroup.ASpeedoRange.closeMax
                                ) {
                                        return true;
                                }
                                return false;
                        default:
                                return false;
                }
        }
        isGood(speedoGroup: SpeedoGroup): boolean {
                switch (this.speedoType) {
                        case "HORIZONTAL":
                                if (
                                        this.playerSpeed > speedoGroup.HSpeedoRange.goodMin &&
                                        this.playerSpeed < speedoGroup.HSpeedoRange.goodMax
                                ) {
                                        return true;
                                }
                                return false;
                        case "VERTICAL":
                                if (
                                        this.playerSpeed > speedoGroup.VSpeedoRange.goodMin &&
                                        this.playerSpeed < speedoGroup.VSpeedoRange.goodMax
                                ) {
                                        return true;
                                }
                                return false;
                        case "ABSOLUTE":
                                if (
                                        this.playerSpeed > speedoGroup.ASpeedoRange.goodMin &&
                                        this.playerSpeed < speedoGroup.ASpeedoRange.goodMax
                                ) {
                                        return true;
                                }
                                return false;
                        default:
                                return false;
                }
        }
        isDouble(speedoGroup: SpeedoGroup): boolean {
                if (
                        this.playerSpeed > speedoGroup.HeightoThresholds.double &&
                        this.playerSpeed < speedoGroup.HeightoThresholds.triple
                ) {
                        return true;
                }
                return false;
        }
        isTriple(speedoGroup: SpeedoGroup): boolean {
                if (
                        this.playerSpeed > speedoGroup.HeightoThresholds.triple &&
                        this.playerSpeed < speedoGroup.HeightoThresholds.maxVel
                ) {
                        return true;
                }
                return false;
        }
        isMaxVel(speedoGroup: SpeedoGroup): boolean {
                if (this.playerSpeed > speedoGroup.HeightoThresholds.maxVel) {
                        return true;
                }
                return false;
        }
}
