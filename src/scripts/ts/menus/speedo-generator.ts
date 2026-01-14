import { SpeedoType } from '../speedo.js';
import { Speedos } from '../speedos.js'
import { SpeedoSize } from '../speedos.js';
import { Color } from '../color.js';
import { zipSpeedos } from '../zip.js';
import { Font } from '../speedos.js';
import { matchClassStartingWith } from '../util.js';

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
    switch(speedosObj.font) {
        case "bahnschrift":
            if(!$('.speedo').hasClass('font-bahnschrift')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-bahnschrift');
            }
            break;
        case "coolvetica":
            if(!$('.speedo').hasClass('font-coolvetica')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-coolvetica');
            }
            break;
        case "coolvetica_italic":
            if(!$('.speedo').hasClass('font-coolvetica-italic')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-coolvetica_italic');
            }
            break;
        case "eternal":
            if(!$('.speedo').hasClass('font-eternal')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-eternal');
            }
            break;
        case "montserrat":   
            if(!$('.speedo').hasClass('font-montserrat')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-montserrat');
            }
            break;
        case "nk57":
            if(!$('.speedo').hasClass('font-nk57')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-nk57');
            }
            break;
        case "poppins":
            if(!$('.speedo').hasClass('font-poppins')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-poppins');
            }
            break;
        case "quake":
            if(!$('.speedo').hasClass('font-quake')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-quake');
            }
            break;
        case "renogare":
            if(!$('.speedo').hasClass('font-renogare')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-renogare');
            }
            break;
        case "roboto":
            if(!$('.speedo').hasClass('font-roboto')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-roboto');
            }
            break;
        case "square":
            if(!$('.speedo').hasClass('font-square')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-square');
            }
            break;
        case "surface":
            if(!$('.speedo').hasClass('font-surface')){
                $('.speedo').removeClass((index, className)=>{return matchClassStartingWith('font', className)});
                $('.speedo').addClass('font-surface');
            }
            break;
        default:
            console.log('error in speeds object font, ', speedosObj.font, ' is not a valid font');
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
const slot1Elm = document.getElementById('dropdown_slot_1') as HTMLSelectElement;
const slot2Elm = document.getElementById('dropdown_slot_2') as HTMLSelectElement;
const slot3Elm = document.getElementById('dropdown_slot_3') as HTMLSelectElement;
const slot4Elm = document.getElementById('dropdown_slot_4') as HTMLSelectElement;

slot1Elm.addEventListener('change', () => {
    speedosObj.speedo[0].speedoType = slot1Elm.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
slot2Elm.addEventListener('change', () => {
    speedosObj.speedo[1].speedoType = slot2Elm.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
slot3Elm.addEventListener('change', () => {
    speedosObj.speedo[2].speedoType = slot3Elm.selectedOptions[0].value as SpeedoType;
    updateSpeedoStyles();
});
slot4Elm.addEventListener('change', () => {
    speedosObj.speedo[3].speedoType = slot4Elm.selectedOptions[0].value as SpeedoType;
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
    updatePosition_x();
})

ySlider.addEventListener('input', () =>{
    updatePosition_y();
})

markerBoundsElm.addEventListener('drag', (event: MouseEvent) =>{
    if(event.offsetX > 0){
        let xValue: number = event.offsetX / markerBoundsWidth * 100;
        xSlider.value = xValue.toString();
        
        updatePosition_x();
    }
    if(event.offsetY > 0){
        let yValue: number = event.offsetY / markerBoundsHeight * 100;
        ySlider.value = yValue.toString();
        
        updatePosition_y();
    }
});

function updatePosition_x(){
    markerElm.style.left = (+xSlider.value * (markerBounds[0]/100)).toString();

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

    speedosObj.vdfElm.xpos = newXPos;
}

function updatePosition_y(){
    markerElm.style.top = (+ySlider.value * (markerBounds[1]/100)).toString();

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

    speedosObj.vdfElm.ypos = newYPos;
}

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

// FONT
const speedoFontElm = document.getElementById('fonts') as HTMLSelectElement;
speedoFontElm.addEventListener('change', () =>{
    speedosObj.font = speedoFontElm.value as Font;
    updateSpeedoStyles();
})

// SIZE
const speedoSizeElm = document.getElementById('sizes') as HTMLSelectElement;

speedoSizeElm.addEventListener('change', () => {
    speedosObj.size = speedoSizeElm.value as SpeedoSize;
    updateSpeedoStyles();
})

// SHADOWS
const shadowsElm = document.getElementById('shadows_checkbox') as HTMLInputElement;

shadowsElm.addEventListener('change', () => {speedosObj.drawShadows = shadowsElm.checked; updateSpeedoStyles()});

// ROUNDING
const roundingElm = document.getElementById('rounding_checkbox') as HTMLInputElement;

roundingElm.addEventListener('change', () => {speedosObj.round = roundingElm.checked;});

// COLORS
const colorMainElm = document.getElementById('colorMain') as HTMLInputElement;
const colorCloseElm = document.getElementById('colorClose') as HTMLInputElement;
const colorGoodElm = document.getElementById('colorGood') as HTMLInputElement;

const colorMainHeightoElm = document.getElementById('colorMain_Heighto') as HTMLInputElement;
const colorDoubleElm = document.getElementById('colorDouble') as HTMLInputElement;
const colorTripleElm = document.getElementById('colorTriple') as HTMLInputElement;
const colorMaxVelElm = document.getElementById('colorMaxVel') as HTMLInputElement;

colorMainElm.addEventListener('input', () => {
    speedosObj.colorMain = Color.input_to_color(colorMainElm.value);
});
colorCloseElm.addEventListener('input', () => {
    speedosObj.colorClose = Color.input_to_color(colorCloseElm.value);
});
colorGoodElm.addEventListener('input', () => {
    speedosObj.colorGood = Color.input_to_color(colorGoodElm.value);
});

colorMainHeightoElm.addEventListener('input', () => {
    speedosObj.colorMain_Heighto = Color.input_to_color(colorMainHeightoElm.value);
});
colorDoubleElm.addEventListener('input', () => {
    speedosObj.colorDouble = Color.input_to_color(colorDoubleElm.value);
});
colorTripleElm.addEventListener('input', () => {
    speedosObj.colorTriple = Color.input_to_color(colorTripleElm.value);
});
colorMaxVelElm.addEventListener('input', () => {
    speedosObj.colorMaxVel = Color.input_to_color(colorMaxVelElm.value);
});

// COLOR RANGES
// const sliderMin = document.getElementById('colorMain-min-slider') as HTMLInputElement;
// const sliderMax = document.getElementById('colorMain-max-slider') as HTMLInputElement;
// const textMin = document.getElementById('colorMain-min-text') as HTMLInputElement;
// const textMax = document.getElementById('colorMain-max-text') as HTMLInputElement;
// const rangeGap: number = 0;
// const sliderTrack = document.getElementById('colorMain-track') as HTMLElement;
// const slidermaxValue = sliderMin.max;

// sliderMin.addEventListener('input', () =>{
//     if(parseInt(sliderMin.value) >= parseInt(sliderMax.value)){
//         sliderMin.value = (parseInt(sliderMax.value) - rangeGap).toString();
//     }
//     textMin.value = sliderMin.value;
// })

// sliderMax.addEventListener('input', () =>{
//     if(parseInt(sliderMax.value) <= parseInt(sliderMin.value)){
//         sliderMax.value = (parseInt(sliderMin.value) + rangeGap).toString();
//     }
//     textMax.value = sliderMax.value;
// })

// DOWNLOAD
const downloadElm = document.getElementById('download-btn') as HTMLButtonElement;

downloadElm.addEventListener('click', () =>{
    zipSpeedos(speedosObj);
});

//===================================================================================
// ON PAGE LOAD
//-----------------------------------------------------------------------------------
updateSpeedoStyles();
speedosObj_to_Elements();

// load default settings based on defaults of speedosObj
function speedosObj_to_Elements(){
    slot1Elm.value = speedosObj.speedo[0].speedoType;
    slot2Elm.value = speedosObj.speedo[1].speedoType;
    slot3Elm.value = speedosObj.speedo[2].speedoType;
    slot4Elm.value = speedosObj.speedo[3].speedoType;
    speedoFontElm.value = speedosObj.font;
    speedoSizeElm.value = speedosObj.size;
    shadowsElm.checked = speedosObj.drawShadows;
    roundingElm.checked = speedosObj.round;
    colorMainElm.value = speedosObj.colorMain.getInputColor();
    colorCloseElm.value = speedosObj.colorClose.getInputColor();
    colorGoodElm.value = speedosObj.colorGood.getInputColor();
    colorMainHeightoElm.value = speedosObj.colorMain_Heighto.getInputColor();
    colorDoubleElm.value = speedosObj.colorDouble.getInputColor();
    colorTripleElm.value = speedosObj.colorTriple.getInputColor();
    colorMaxVelElm.value = speedosObj.colorMaxVel.getInputColor();
}