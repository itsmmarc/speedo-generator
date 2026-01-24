export class Speedo {
    playerSpeed;
    color;
    speedoType;
    constructor(speedoType, color) {
        this.playerSpeed = 0;
        this.speedoType = speedoType;
        this.color = color;
    }
    updateColor(speedoGroup) {
        if (this.speedoType != "HEIGHTO") {
            if (this.isGood(speedoGroup)) {
                this.color = speedoGroup.colorGood;
            }
            else if (this.isClose(speedoGroup)) {
                this.color = speedoGroup.colorClose;
            }
            else {
                this.color = speedoGroup.colorMain;
            }
        }
        else {
            if (this.isDouble(speedoGroup)) {
                this.color = speedoGroup.colorDouble;
            }
            else if (this.isTriple(speedoGroup)) {
                this.color = speedoGroup.colorTriple;
            }
            else if (this.isMaxVel(speedoGroup)) {
                this.color = speedoGroup.colorMaxVel;
            }
            else {
                this.color = speedoGroup.colorHeightoMain;
            }
            return;
        }
    }
    isClose(speedoGroup) {
        switch (this.speedoType) {
            case "HORIZONTAL":
                if (this.playerSpeed > speedoGroup.HSpeedoCloseRange.min &&
                    this.playerSpeed < speedoGroup.HSpeedoCloseRange.max) {
                    return true;
                }
                return false;
            case "VERTICAL":
                if (this.playerSpeed > speedoGroup.VSpeedoCloseRange.min &&
                    this.playerSpeed < speedoGroup.VSpeedoCloseRange.max) {
                    return true;
                }
                return false;
            case "ABSOLUTE":
                if (this.playerSpeed > speedoGroup.ASpeedoCloseRange.min &&
                    this.playerSpeed < speedoGroup.ASpeedoCloseRange.max) {
                    return true;
                }
                return false;
            default:
                return false;
        }
    }
    isGood(speedoGroup) {
        switch (this.speedoType) {
            case "HORIZONTAL":
                if (this.playerSpeed > speedoGroup.HSpeedoGoodRange.min &&
                    this.playerSpeed < speedoGroup.HSpeedoGoodRange.max) {
                    return true;
                }
                return false;
            case "VERTICAL":
                if (this.playerSpeed > speedoGroup.VSpeedoGoodRange.min &&
                    this.playerSpeed < speedoGroup.VSpeedoGoodRange.max) {
                    return true;
                }
                return false;
            case "ABSOLUTE":
                if (this.playerSpeed > speedoGroup.ASpeedoGoodRange.min &&
                    this.playerSpeed < speedoGroup.ASpeedoGoodRange.max) {
                    return true;
                }
                return false;
            default:
                return false;
        }
    }
    isDouble(speedoGroup) {
        if (this.playerSpeed > speedoGroup.HeightoThresholds.double &&
            this.playerSpeed < speedoGroup.HeightoThresholds.triple) {
            return true;
        }
        return false;
    }
    isTriple(speedoGroup) {
        if (this.playerSpeed > speedoGroup.HeightoThresholds.triple &&
            this.playerSpeed < speedoGroup.HeightoThresholds.maxVel) {
            return true;
        }
        return false;
    }
    isMaxVel(speedoGroup) {
        if (this.playerSpeed > speedoGroup.HeightoThresholds.maxVel) {
            return true;
        }
        return false;
    }
}
