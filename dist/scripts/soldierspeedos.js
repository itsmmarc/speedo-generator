"use strict";
const digits = document.getElementsByClassName('digits'); // collection of digit elements
const digitsArray = Array.prototype.slice.call(digits);
let speedovalue = 0;
const framerate = 30;
const frametime = 1000 / framerate;
var SpeedometerType;
(function (SpeedometerType) {
    SpeedometerType[SpeedometerType["HORIZONTAL"] = 1] = "HORIZONTAL";
    SpeedometerType[SpeedometerType["VERTICAL"] = 2] = "VERTICAL";
    SpeedometerType[SpeedometerType["ABSOLUTE"] = 3] = "ABSOLUTE";
    SpeedometerType[SpeedometerType["HEIGHTO"] = 4] = "HEIGHTO";
})(SpeedometerType || (SpeedometerType = {}));
// speedo digit counter
setInterval(function () {
    digitsArray.forEach(item => {
        item.textContent = speedovalue.toString();
        item.style.setProperty('color', getColor(item));
    });
    let sine_max = 3500;
    let sine_min = 0;
    let sine_period = 6;
    let sine_rate = (sine_max - sine_min) / sine_period / frametime;
    speedovalue += Math.round(sine_rate);
    if (speedovalue > sine_max) {
        speedovalue = sine_min;
    }
}, frametime);
// get speedo color
function getColor(item) {
    let speed;
    if (item.textContent) {
        speed = parseInt(item.textContent);
    }
    else {
        return 'rgb(255, 255, 255)';
    }
    switch (true) {
        case item.classList.contains('HORIZONTAL'):
            if (isGood(speed)) {
                return 'rgb(0, 255, 85)';
            }
            if (isClose(speed)) {
                return 'rgb(35, 125, 235)';
            }
            return 'rgb(255, 255, 255)';
        default:
            return 'rgb(255, 255, 255)';
    }
}
// refactor later to deal with other speedo types
function isClose(speed) {
    const HSPEEDO_CLOSE_MIN = 850;
    const HSPEEDO_CLOSE_MAX = 1350;
    if (speed > HSPEEDO_CLOSE_MIN && speed < HSPEEDO_CLOSE_MAX) {
        return true;
    }
    else {
        return false;
    }
}
function isGood(speed) {
    const HSPEEDO_GOOD_MIN = 1050;
    const HSPEEDO_GOOD_MAX = 1150;
    if (speed > HSPEEDO_GOOD_MIN && speed < HSPEEDO_GOOD_MAX) {
        return true;
    }
    else {
        return false;
    }
}
// SHADOWS
const enableShadowsBtn = document.getElementById('shadows_enable');
const disableShadowsBtn = document.getElementById('shadows_disable');
const shadows = document.getElementsByClassName('digits shadow');
const shadowsArray = Array.prototype.slice.call(shadows);
enableShadowsBtn.addEventListener('click', () => {
    shadowsArray.forEach(item => {
        if (item.classList.contains('hidden')) {
            item.classList.remove('hidden');
        }
    });
});
disableShadowsBtn.addEventListener('click', () => {
    shadowsArray.forEach(item => {
        if (!item.classList.contains('hidden')) {
            item.classList.add('hidden');
        }
    });
});
