const HSPEEDO_CLOSE_MIN = 850;
const HSPEEDO_CLOSE_MAX = 1350;
const HSPEEDO_GOOD_MIN = 1050;
const HSPEEDO_GOOD_MAX = 1150;
const VSPEEDO_CLOSE_MIN = -1;
const VSPEEDO_CLOSE_MAX = -1;
const VSPEEDO_GOOD_MIN = -1;
const VSPEEDO_GOOD_MAX = -1;
const ASPEEDO_CLOSE_MIN = HSPEEDO_CLOSE_MIN;
const ASPEEDO_CLOSE_MAX = HSPEEDO_CLOSE_MAX;
const ASPEEDO_GOOD_MIN = HSPEEDO_GOOD_MIN;
const ASPEEDO_GOOD_MAX = HSPEEDO_GOOD_MAX;
const HEIGHTO_DOUBLE_THRESH = 1260;
const HEIGHTO_TRIPLE_THRESH = 2160;
const HEIGHTO_MAXVEL_THRESH = 7700;
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
            if (this.isGood()) {
                this.color = speedos.colorGood;
            }
            else if (this.isClose()) {
                this.color = speedos.colorClose;
            }
            else {
                this.color = speedos.colorMain;
            }
        }
        else {
            if (this.isDouble()) {
                this.color = speedos.colorDouble;
            }
            else if (this.isTriple()) {
                this.color = speedos.colorTriple;
            }
            else if (this.isMaxVel()) {
                this.color = speedos.colorMaxVel;
            }
            else {
                this.color = speedos.colorMain_Heighto;
            }
            return;
        }
    }
    isDouble() {
        if (this.playerSpeed > HEIGHTO_DOUBLE_THRESH && this.playerSpeed < HEIGHTO_TRIPLE_THRESH) {
            return true;
        }
        return false;
    }
    isTriple() {
        if (this.playerSpeed > HEIGHTO_TRIPLE_THRESH && this.playerSpeed < HEIGHTO_MAXVEL_THRESH) {
            return true;
        }
        return false;
    }
    isMaxVel() {
        if (this.playerSpeed > HEIGHTO_MAXVEL_THRESH) {
            return true;
        }
        return false;
    }
    isClose() {
        switch (this.speedoType) {
            case "HORIZONTAL":
                if (this.playerSpeed > HSPEEDO_CLOSE_MIN && this.playerSpeed < HSPEEDO_CLOSE_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case "VERTICAL":
                if (this.playerSpeed > VSPEEDO_CLOSE_MIN && this.playerSpeed < VSPEEDO_CLOSE_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case "ABSOLUTE":
                if (this.playerSpeed > ASPEEDO_CLOSE_MIN && this.playerSpeed < ASPEEDO_CLOSE_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            default:
                return false;
        }
    }
    isGood() {
        switch (this.speedoType) {
            case "HORIZONTAL":
                if (this.playerSpeed > HSPEEDO_GOOD_MIN && this.playerSpeed < HSPEEDO_GOOD_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case "VERTICAL":
                if (this.playerSpeed > VSPEEDO_GOOD_MIN && this.playerSpeed < VSPEEDO_GOOD_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case "ABSOLUTE":
                if (this.playerSpeed > ASPEEDO_GOOD_MIN && this.playerSpeed < ASPEEDO_GOOD_MAX) {
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
