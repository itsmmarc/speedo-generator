export class Speedo {
    playerSpeed;
    color;
    speedoType;
    constructor(speedoType, color) {
        this.playerSpeed = 0;
        this.speedoType = speedoType;
        this.color = color;
    }
    updateColor(speedos) {
        if (this.speedoType != "HEIGHTO") {
            if (this.isGood(speedos)) {
                this.color = speedos.colorGood;
            }
            else if (this.isClose(speedos)) {
                this.color = speedos.colorClose;
            }
            else {
                this.color = speedos.colorMain;
            }
        }
        else {
            if (this.isDouble(speedos)) {
                this.color = speedos.colorDouble;
            }
            else if (this.isTriple(speedos)) {
                this.color = speedos.colorTriple;
            }
            else if (this.isMaxVel(speedos)) {
                this.color = speedos.colorMaxVel;
            }
            else {
                this.color = speedos.colorMain_Heighto;
            }
            return;
        }
    }
    isDouble(speedos) {
        if (this.playerSpeed > speedos.HeightoThresholds.double &&
            this.playerSpeed < speedos.HeightoThresholds.triple) {
            return true;
        }
        return false;
    }
    isTriple(speedos) {
        if (this.playerSpeed > speedos.HeightoThresholds.triple &&
            this.playerSpeed < speedos.HeightoThresholds.maxVel) {
            return true;
        }
        return false;
    }
    isMaxVel(speedos) {
        if (this.playerSpeed > speedos.HeightoThresholds.maxVel) {
            return true;
        }
        return false;
    }
    isClose(speedos) {
        switch (this.speedoType) {
            case "HORIZONTAL":
                if (this.playerSpeed > speedos.HSpeedoRange.closeMin &&
                    this.playerSpeed < speedos.HSpeedoRange.closeMax) {
                    return true;
                }
                else {
                    return false;
                }
            case "VERTICAL":
                if (this.playerSpeed > speedos.VSpeedoRange.closeMin &&
                    this.playerSpeed < speedos.VSpeedoRange.closeMax) {
                    return true;
                }
                else {
                    return false;
                }
            case "ABSOLUTE":
                if (this.playerSpeed > speedos.ASpeedoRange.closeMin &&
                    this.playerSpeed < speedos.ASpeedoRange.closeMax) {
                    return true;
                }
                else {
                    return false;
                }
            default:
                return false;
        }
    }
    isGood(speedos) {
        switch (this.speedoType) {
            case "HORIZONTAL":
                if (this.playerSpeed > speedos.HSpeedoRange.goodMin &&
                    this.playerSpeed < speedos.HSpeedoRange.goodMax) {
                    return true;
                }
                else {
                    return false;
                }
            case "VERTICAL":
                if (this.playerSpeed > speedos.VSpeedoRange.goodMin &&
                    this.playerSpeed < speedos.VSpeedoRange.goodMax) {
                    return true;
                }
                else {
                    return false;
                }
            case "ABSOLUTE":
                if (this.playerSpeed > speedos.ASpeedoRange.goodMin &&
                    this.playerSpeed < speedos.ASpeedoRange.goodMax) {
                    return true;
                }
                else {
                    return false;
                }
            default:
                return false;
        }
    }
}
