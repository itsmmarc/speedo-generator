var digits = document.getElementsByClassName('digits'); // collection of digit elements
var digitsArray = Array.prototype.slice.call(digits);
var speedovalue = 0;
var framerate = 30;
var frametime = 1000 / framerate;
var SpeedometerType;
(function (SpeedometerType) {
    SpeedometerType[SpeedometerType["HORIZONTAL"] = 1] = "HORIZONTAL";
    SpeedometerType[SpeedometerType["VERTICAL"] = 2] = "VERTICAL";
    SpeedometerType[SpeedometerType["ABSOLUTE"] = 3] = "ABSOLUTE";
    SpeedometerType[SpeedometerType["HEIGHTO"] = 4] = "HEIGHTO";
})(SpeedometerType || (SpeedometerType = {}));
// speedo digit counter
setInterval(function () {
    digitsArray.forEach(function (item) {
        item.textContent = speedovalue.toString();
        item.style.setProperty('color', getColor(item));
    });
    var sine_max = 3500;
    var sine_min = 0;
    var sine_period = 6;
    var sine_rate = (sine_max - sine_min) / sine_period / frametime;
    speedovalue += Math.round(sine_rate);
    if (speedovalue > sine_max) {
        speedovalue = sine_min;
    }
}, frametime);
// get speedo color
function getColor(item) {
    var speed;
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
    var HSPEEDO_CLOSE_MIN = 850;
    var HSPEEDO_CLOSE_MAX = 1350;
    if (speed > HSPEEDO_CLOSE_MIN && speed < HSPEEDO_CLOSE_MAX) {
        return true;
    }
    else {
        return false;
    }
}
function isGood(speed) {
    var HSPEEDO_GOOD_MIN = 1050;
    var HSPEEDO_GOOD_MAX = 1150;
    if (speed > HSPEEDO_GOOD_MIN && speed < HSPEEDO_GOOD_MAX) {
        return true;
    }
    else {
        return false;
    }
}
// SHADOWS
var enableShadowsBtn = document.getElementById('shadows_enable');
var disableShadowsBtn = document.getElementById('shadows_disable');
var shadows = document.getElementsByClassName('digits shadow');
var shadowsArray = Array.prototype.slice.call(shadows);
enableShadowsBtn.addEventListener('click', function () {
    shadowsArray.forEach(function (item) {
        if (item.classList.contains('hidden')) {
            item.classList.remove('hidden');
        }
    });
});
disableShadowsBtn.addEventListener('click', function () {
    shadowsArray.forEach(function (item) {
        if (!item.classList.contains('hidden')) {
            item.classList.add('hidden');
        }
    });
});
