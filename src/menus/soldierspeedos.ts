import { SpeedoType } from '../speedo.js';
import { Speedos } from '../speedos.js'
import { SpeedoSize } from '../speedos.js';

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
    switch (speedosObj.size) {
        case "SMALL":
            $('.speedo').removeClass('speedo-size-medium');
            $('.speedo').removeClass('speedo-size-large');

            $('.speedo').addClass('speedo-size-small');
            break;
        case "MEDIUM":
            $('.speedo').removeClass('speedo-size-small');
            $('.speedo').removeClass('speedo-size-large');

            $('.speedo').addClass('speedo-size-medium');
            break;
        case "LARGE":
            $('.speedo').removeClass('speedo-size-small');
            $('.speedo').removeClass('speedo-size-medium');

            $('.speedo').addClass('speedo-size-large');
            break;
        default:
            break;
    }

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

// POSITION
const xSlider = document.getElementById('xpos') as HTMLInputElement;
const ySlider = document.getElementById('ypos') as HTMLInputElement;

const markerElm = document.getElementById('marker') as HTMLElement;
const markerStyle = window.getComputedStyle(markerElm) as CSSStyleDeclaration;
const markerSize = [+(markerStyle.getPropertyValue('width').replace("px","")),+(markerStyle.getPropertyValue('height').replace("px",""))] as number[];

const markerBoundsElm = document.getElementById('markerbounds') as HTMLElement;
const markerBoundsStyle = window.getComputedStyle(markerBoundsElm) as CSSStyleDeclaration;
const markerBoundsWidth = +(markerBoundsStyle.getPropertyValue('width').replace("px","")) as number;
const markerBoundsHeight = +(markerBoundsStyle.getPropertyValue('height').replace("px","")) as number;
const markerBounds = [markerBoundsWidth - markerSize[0], markerBoundsHeight - markerSize[1]] as number[];

xSlider.addEventListener('input', () =>{
    markerElm.style.left = (+xSlider.value * (markerBounds[0]/100)).toString();
})
xSlider.addEventListener('change', () =>{
    let center: number = markerBounds[0]/2;
    let markerLeft = +markerElm.style.left.replace("px","");

    let xOffset: number = markerLeft - center;
    xOffset = Math.round(xOffset/markerBoundsWidth * 640);  // 640 is the width of screen in 16:9 in tf2 hud units

    let newXPos: string = 'cs-0.5';
    if(markerLeft==0){
        newXPos = '0';
    } else if(markerLeft==markerBounds[0]){
        newXPos = 'rs1';
    } else if(xOffset>0){
        newXPos = newXPos.concat('+', xOffset.toString());
    } else if(xOffset<0){
        newXPos = newXPos.concat(xOffset.toString());
    }

    speedosObj.position.xpos = newXPos;
})

ySlider.addEventListener('input', () =>{
    markerElm.style.top = (+ySlider.value * (markerBounds[1]/100)).toString();
})
ySlider.addEventListener('change', () =>{
    let center: number = markerBounds[1]/2;
    let markerTop = +markerElm.style.top.replace("px","");

    let yOffset: number = markerTop - center;
    yOffset = Math.round(yOffset/markerBoundsHeight * 480);  // 480 is the height of screen in tf2 hud units

    let newYPos: string = 'cs-0.5';
    if(markerTop==0){
        newYPos = '0';
    } else if(markerTop==markerBounds[1]){
        newYPos = 'rs1';
    } else if(yOffset>0){
        newYPos = newYPos.concat('+', yOffset.toString());
    } else if(yOffset<0){
        newYPos = newYPos.concat(yOffset.toString());
    }

    speedosObj.position.ypos = newYPos;
})

// POSITION IMAGE
let imageUpload = document.getElementById('imageupload') as HTMLInputElement;
let posPreviewImg = document.getElementById('position_preview_img') as HTMLImageElement;

imageUpload.addEventListener('change', () =>{
    changeImage(imageUpload);
})

function changeImage(input: HTMLInputElement){
    let reader: FileReader;

    if(input.files && input.files[0]){
        reader = new FileReader();

        reader.onload = () => {
            posPreviewImg.setAttribute('src', reader.result as string);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// SIZE
const speedoSizeElm = document.getElementById('sizes') as HTMLSelectElement;

speedoSizeElm.addEventListener('change', () => {
    speedosObj.size = speedoSizeElm.value as SpeedoSize;
    updateSpeedoStyles();
})

// SHADOWS
const shadowsCBox = document.getElementById('shadows_checkbox') as HTMLInputElement;

shadowsCBox.addEventListener('change', () => {speedosObj.drawShadows = shadowsCBox.checked; updateSpeedoStyles()});

// ROUNDING
const roundingCBox = document.getElementById('rounding_checkbox') as HTMLInputElement;

roundingCBox.addEventListener('change', () => {speedosObj.round = roundingCBox.checked; updateSpeedoStyles()});

//===================================================================================
// ON PAGE LOAD
//-----------------------------------------------------------------------------------
updateSpeedoStyles();
// load default settings based on defaults of speedosObj
slot1_DropDownMenu.value = speedosObj.speedo[0].speedoType;
slot2_DropDownMenu.value = speedosObj.speedo[1].speedoType;
slot3_DropDownMenu.value = speedosObj.speedo[2].speedoType;
slot4_DropDownMenu.value = speedosObj.speedo[3].speedoType;
speedoSizeElm.value = speedosObj.size;
shadowsCBox.checked = speedosObj.drawShadows;
roundingCBox.checked = speedosObj.round;