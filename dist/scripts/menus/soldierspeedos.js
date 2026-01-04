import { SpeedoType } from '../speedo.js';
import { Speedos } from '../speedos.js';
const NUM_SPEEDOS = 4;
const speedoColl = document.getElementsByClassName('speedo'); // collection of all speedo class elements
const speedoElmArray = Array.prototype.slice.call(speedoColl);
const speedosObj = new Speedos();
//===================================================================================
// PREVIEW RENDERING
//-----------------------------------------------------------------------------------
speedosObj.startSpeedoPreview();
setInterval(() => {
    speedoElmArray.forEach(speedoElm => {
        let slot = 'slot_';
        for (let i = 1; i <= NUM_SPEEDOS; i++) {
            slot += i;
            let speedoObj = speedosObj.speedo[i - 1];
            if (speedoElm.classList.contains(slot)) {
                speedoElm.textContent = speedoObj.playerSpeed.toString();
                speedoElm.style.setProperty('color', speedoObj.color.getCSSColor());
                //console.log('set color of ',slot,' to ',speedoObj.color.getCSSColor());
            }
            slot = slot.slice(0, -1);
        }
    });
}, speedosObj.frametime);
function updateSpeedoStyles() {
    speedoElmArray.forEach(speedoElm => {
        let slot = 'slot_';
        for (let i = 1; i <= NUM_SPEEDOS; i++) {
            slot += i;
            let speedoObj = speedosObj.speedo[i - 1];
            if (speedoElm.classList.contains(slot)) {
                // Check if speedo should be visible
                if (speedoObj.speedoType == SpeedoType.NONE && !speedoElm.classList.contains('hidden')) {
                    speedoElm.classList.add('hidden');
                }
                else if (speedoObj.speedoType != SpeedoType.NONE && speedoElm.classList.contains('hidden')) {
                    speedoElm.classList.remove('hidden');
                }
                // check if shadows should be drawn
                if (speedoObj.speedoType != SpeedoType.NONE) {
                    if (speedoElm.classList.contains('shadow')) {
                        if (speedosObj.drawShadows && speedoElm.classList.contains('hidden')) {
                            speedoElm.classList.remove('hidden');
                        }
                        else if (!speedosObj.drawShadows && !speedoElm.classList.contains('hidden')) {
                            speedoElm.classList.add('hidden');
                        }
                    }
                }
            }
            slot = slot.slice(0, -1);
        }
    });
}
//===================================================================================
// BUTTONS
//-----------------------------------------------------------------------------------
// SHADOWS
const enableShadowsBtn = document.getElementById('shadows_enable');
const disableShadowsBtn = document.getElementById('shadows_disable');
enableShadowsBtn.addEventListener('click', () => { speedosObj.drawShadows = true; updateSpeedoStyles(); });
disableShadowsBtn.addEventListener('click', () => { speedosObj.drawShadows = false; updateSpeedoStyles(); });
// ROUNDING
const enableRoundingBtn = document.getElementById('rounding_enable');
const disableRoundingBtn = document.getElementById('rounding_disable');
enableRoundingBtn.addEventListener('click', () => { speedosObj.round = true; updateSpeedoStyles(); });
disableRoundingBtn.addEventListener('click', () => { speedosObj.round = false; updateSpeedoStyles(); });
// on page first load
updateSpeedoStyles();
