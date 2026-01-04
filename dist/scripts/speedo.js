export var SpeedoType;
(function (SpeedoType) {
    SpeedoType[SpeedoType["NONE"] = 0] = "NONE";
    SpeedoType[SpeedoType["HORIZONTAL"] = 1] = "HORIZONTAL";
    SpeedoType[SpeedoType["VERTICAL"] = 2] = "VERTICAL";
    SpeedoType[SpeedoType["ABSOLUTE"] = 3] = "ABSOLUTE";
    SpeedoType[SpeedoType["HEIGHTO"] = 4] = "HEIGHTO";
})(SpeedoType || (SpeedoType = {}));
const SOLDIER_HSPEEDO_CLOSE_MIN = 850;
const SOLDIER_HSPEEDO_CLOSE_MAX = 1350;
const SOLDIER_VSPEEDO_CLOSE_MIN = -1;
const SOLDIER_VSPEEDO_CLOSE_MAX = -1;
const SOLDIER_ASPEEDO_CLOSE_MIN = SOLDIER_HSPEEDO_CLOSE_MIN;
const SOLDIER_ASPEEDO_CLOSE_MAX = SOLDIER_HSPEEDO_CLOSE_MAX;
const SOLDIER_HSPEEDO_GOOD_MIN = 1050;
const SOLDIER_HSPEEDO_GOOD_MAX = 1150;
const SOLDIER_VSPEEDO_GOOD_MIN = -1;
const SOLDIER_VSPEEDO_GOOD_MAX = -1;
const SOLDIER_ASPEEDO_GOOD_MIN = SOLDIER_HSPEEDO_GOOD_MIN;
const SOLDIER_ASPEEDO_GOOD_MAX = SOLDIER_HSPEEDO_GOOD_MAX;
export class Speedo {
    playerSpeed;
    color;
    speedoType;
    constructor(speedoType, color) {
        this.playerSpeed = 0;
        this.speedoType = speedoType;
        this.color = color;
    }
    updateColor(colorMain, colorClose, colorGood) {
        if (this.speedoType != SpeedoType.HEIGHTO) {
            if (this.isGood()) {
                this.color = colorGood;
            }
            else if (this.isClose()) {
                this.color = colorClose;
            }
            else {
                this.color = colorMain;
            }
        }
        else {
            // implement heighto colors here
            return;
        }
    }
    isClose() {
        switch (this.speedoType) {
            case SpeedoType.HORIZONTAL:
                if (this.playerSpeed > SOLDIER_HSPEEDO_CLOSE_MIN && this.playerSpeed < SOLDIER_HSPEEDO_CLOSE_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case SpeedoType.VERTICAL:
                if (this.playerSpeed > SOLDIER_VSPEEDO_CLOSE_MIN && this.playerSpeed < SOLDIER_VSPEEDO_CLOSE_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case SpeedoType.ABSOLUTE:
                if (this.playerSpeed > SOLDIER_ASPEEDO_CLOSE_MIN && this.playerSpeed < SOLDIER_ASPEEDO_CLOSE_MAX) {
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
            case SpeedoType.HORIZONTAL:
                if (this.playerSpeed > SOLDIER_HSPEEDO_GOOD_MIN && this.playerSpeed < SOLDIER_HSPEEDO_GOOD_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case SpeedoType.VERTICAL:
                if (this.playerSpeed > SOLDIER_VSPEEDO_GOOD_MIN && this.playerSpeed < SOLDIER_VSPEEDO_GOOD_MAX) {
                    return true;
                }
                else {
                    return false;
                }
            case SpeedoType.ABSOLUTE:
                if (this.playerSpeed > SOLDIER_ASPEEDO_GOOD_MIN && this.playerSpeed < SOLDIER_ASPEEDO_GOOD_MAX) {
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
