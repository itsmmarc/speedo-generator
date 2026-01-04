import { SpeedoType } from '../speedo.js';
import { Speedos } from '../speedos.js'

const NUM_SPEEDOS = 4;
const speedoColl = document.getElementsByClassName('speedo') as HTMLCollection;    // collection of all speedo class elements
const speedoElmArray = Array.prototype.slice.call(speedoColl) as HTMLElement[];
const speedosObj = new Speedos();

//===================================================================================
// PREVIEW RENDERING
//-----------------------------------------------------------------------------------
speedosObj.startSpeedoPreview();
setInterval(() => {
    speedoElmArray.forEach(speedoElm => {
        let slot = 'slot_';
        for(let i = 1; i <= NUM_SPEEDOS; i++){
            slot += i;
            let speedoObj = speedosObj.speedo[i-1];
            if(speedoElm.classList.contains(slot)){
                speedoElm.textContent = speedoObj.playerSpeed.toString();
                speedoElm.style.setProperty('color', speedoObj.color.getCSSColor());
                //console.log('set color of ',slot,' to ',speedoObj.color.getCSSColor());
            }
            slot = slot.slice(0, -1);
        }
    });
}, speedosObj.frametime);

function updateSpeedoStyles(){
    speedoElmArray.forEach(speedoElm => {        
        let slot = 'slot_';
        for(let i = 1; i <= NUM_SPEEDOS; i++){
            slot += i;
            let speedoObj = speedosObj.speedo[i-1];

            if(speedoElm.classList.contains(slot)){
                // Check if speedo should be visible
                if(speedoObj.speedoType == "NONE" && !speedoElm.classList.contains('hidden')){
                    speedoElm.classList.add('hidden');
                } else if(speedoObj.speedoType != "NONE" && speedoElm.classList.contains('hidden')){
                    speedoElm.classList.remove('hidden');
                }

                // check if shadows should be drawn
                if(speedoObj.speedoType != "NONE"){
                    if(speedoElm.classList.contains('shadow')){
                        if(speedosObj.drawShadows && speedoElm.classList.contains('hidden')){
                            speedoElm.classList.remove('hidden');
                        } else if(!speedosObj.drawShadows && !speedoElm.classList.contains('hidden')){
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
// SLOTS
const slot1_DropDownMenu = document.getElementById('dropdown_slot_1') as HTMLSelectElement;
const slot2_DropDownMenu = document.getElementById('dropdown_slot_2') as HTMLSelectElement;
const slot3_DropDownMenu = document.getElementById('dropdown_slot_3') as HTMLSelectElement;
const slot4_DropDownMenu = document.getElementById('dropdown_slot_4') as HTMLSelectElement;

slot1_DropDownMenu.addEventListener('change', () => {
    speedosObj.speedo[0].speedoType = slot1_DropDownMenu.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
slot2_DropDownMenu.addEventListener('change', () => {
    speedosObj.speedo[1].speedoType = slot2_DropDownMenu.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
slot3_DropDownMenu.addEventListener('change', () => {
    speedosObj.speedo[2].speedoType = slot3_DropDownMenu.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
slot4_DropDownMenu.addEventListener('change', () => {
    speedosObj.speedo[3].speedoType = slot4_DropDownMenu.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
// SHADOWS
const enableShadowsBtn = document.getElementById('shadows_enable') as HTMLElement;
const disableShadowsBtn = document.getElementById('shadows_disable') as HTMLElement;

enableShadowsBtn.addEventListener('click', () =>    {speedosObj.drawShadows = true; updateSpeedoStyles()});
disableShadowsBtn.addEventListener('click', () =>   {speedosObj.drawShadows = false;updateSpeedoStyles()});

// ROUNDING
const enableRoundingBtn = document.getElementById('rounding_enable') as HTMLElement;
const disableRoundingBtn = document.getElementById('rounding_disable') as HTMLElement;

enableRoundingBtn.addEventListener('click', () =>    {speedosObj.round = true; updateSpeedoStyles()});
disableRoundingBtn.addEventListener('click', () =>   {speedosObj.round = false;updateSpeedoStyles()});

//===================================================================================
// ON PAGE LOAD
//-----------------------------------------------------------------------------------
updateSpeedoStyles();
slot1_DropDownMenu.value = speedosObj.speedo[0].speedoType;
slot2_DropDownMenu.value = speedosObj.speedo[1].speedoType;
slot3_DropDownMenu.value = speedosObj.speedo[2].speedoType;
slot4_DropDownMenu.value = speedosObj.speedo[3].speedoType;