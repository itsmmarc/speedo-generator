import { SpeedoType } from "../speedo.js";
import { presetDemo, presetSoldier, SpeedoSize, Font } from "../speedo-group.js";
import { Color } from "../color.js";
import { zipSpeedos } from "../zip.js";
import { matchClassStartingWith } from "../util.js";
import * as _ from "lodash";

const NUM_SPEEDOS = 4;
const TF_SCREEN_WIDTH_16_9 = 852;
const TF_SCREEN_WIDTH_4_3 = 640;
let TF_SCREEN_WIDTH_CURRENT = TF_SCREEN_WIDTH_16_9;
const TF_SCREEN_HEIGHT = 480;

let hasReadVDF: boolean = false;

const speedoColl = document.getElementsByClassName("speedo") as HTMLCollection; // collection of all speedo class elements
const speedoElmArray = Array.prototype.slice.call(speedoColl) as HTMLElement[];
let speedoGroup = _.cloneDeep(presetSoldier);

//===================================================================================
// PREVIEW RENDERING
//-----------------------------------------------------------------------------------

/**
 * Checks for style changes of the speedo object and updates the document speedo elements to match.
 */
function updateSpeedoStyles() {
        updateSpeedoSize();
        updateSpeedoFont();
        updateSpeedoVisibility();
}

function updateSpeedoSize() {
        $(".speedo").removeClass((index, className) => {
                return matchClassStartingWith("speedo-size-", className);
        });

        switch (speedoGroup.getSize()) {
                case "SMALL":
                        $(".speedo").addClass("speedo-size-small");
                        break;
                case "MEDIUM":
                        $(".speedo").addClass("speedo-size-medium");
                        break;
                case "LARGE":
                        $(".speedo").addClass("speedo-size-large");
                        break;
                default:
                        break;
        }
}
function updateSpeedoFont() {
        $(".speedo").removeClass((index, className) => {
                return matchClassStartingWith("font-", className);
        });

        switch (speedoGroup.font) {
                case "bahnschrift":
                        $(".speedo").addClass("font-bahnschrift");
                        break;
                case "coolvetica":
                        $(".speedo").addClass("font-coolvetica");
                        break;
                case "coolvetica_italic":
                        $(".speedo").addClass("font-coolvetica_italic");
                        break;
                case "eternal":
                        $(".speedo").addClass("font-eternal");
                        break;
                case "montserrat":
                        $(".speedo").addClass("font-montserrat");
                        break;
                case "nk57":
                        $(".speedo").addClass("font-nk57");
                        break;
                case "poppins":
                        $(".speedo").addClass("font-poppins");
                        break;
                case "quake":
                        $(".speedo").addClass("font-quake");
                        break;
                case "renogare":
                        $(".speedo").addClass("font-renogare");
                        break;
                case "roboto":
                        $(".speedo").addClass("font-roboto");
                        break;
                case "square":
                        $(".speedo").addClass("font-square");
                        break;
                case "surface":
                        $(".speedo").addClass("font-surface");
                        break;
                default:
                        console.log("error in speedo object font, ", speedoGroup.font, " is not a valid font");
                        break;
        }
}
function updateSpeedoVisibility() {
        let slotSelector: string;

        for (const [index, speedo] of speedoGroup.speedos.entries()) {
                slotSelector = `.speedo.slot_${index + 1}`;

                if (speedo.speedoType === "NONE") {
                        $(slotSelector).not(".hidden").addClass("hidden");
                } else {
                        $(`${slotSelector}.hidden`).not(".shadow").removeClass("hidden");

                        if (speedoGroup.drawShadows) {
                                $(`${slotSelector}.shadow.hidden`).removeClass("hidden");
                        } else {
                                $(`${slotSelector}.shadow`).not(".hidden").addClass("hidden");
                        }
                }
        }
}
//===================================================================================
// BUTTONS
//-----------------------------------------------------------------------------------
// PRESET
const presetDemoElm = document.getElementById("preset-demo") as HTMLButtonElement;
presetDemoElm.addEventListener("click", () => {
        speedoGroup = _.cloneDeep(presetDemo);
        initialize();
});

const presetSoldierElm = document.getElementById("preset-soldier") as HTMLButtonElement;
presetSoldierElm.addEventListener("click", () => {
        speedoGroup = _.cloneDeep(presetSoldier);
        initialize();
});

// SLOTS
const slot1Elm = document.getElementById("dropdown_slot_1") as HTMLSelectElement;
const slot2Elm = document.getElementById("dropdown_slot_2") as HTMLSelectElement;
const slot3Elm = document.getElementById("dropdown_slot_3") as HTMLSelectElement;
const slot4Elm = document.getElementById("dropdown_slot_4") as HTMLSelectElement;

slot1Elm.addEventListener("change", () => {
        speedoGroup.speedos[0].speedoType = slot1Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});
slot2Elm.addEventListener("change", () => {
        speedoGroup.speedos[1].speedoType = slot2Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});
slot3Elm.addEventListener("change", () => {
        speedoGroup.speedos[2].speedoType = slot3Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});
slot4Elm.addEventListener("change", () => {
        speedoGroup.speedos[3].speedoType = slot4Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});

// POSITION
const aspectRatio4x3Elm = document.getElementById("4x3") as HTMLButtonElement;
const aspectRatio16x9Elm = document.getElementById("16x9") as HTMLButtonElement;
const positionPreviewElm = document.getElementById("position_preview") as HTMLElement;

aspectRatio16x9Elm.addEventListener("click", () => {
        TF_SCREEN_WIDTH_CURRENT = TF_SCREEN_WIDTH_16_9;
        positionPreviewElm.style.aspectRatio = "16 / 9";
        updatePositionSize();
});
aspectRatio4x3Elm.addEventListener("click", () => {
        TF_SCREEN_WIDTH_CURRENT = TF_SCREEN_WIDTH_4_3;
        positionPreviewElm.style.aspectRatio = "4 / 3";
        updatePositionSize();
});

const xSliderElm = document.getElementById("xpos") as HTMLInputElement;
const ySliderElm = document.getElementById("ypos") as HTMLInputElement;

const markerElm = document.getElementById("marker") as HTMLElement;
const markerStyle = window.getComputedStyle(markerElm) as CSSStyleDeclaration;
let markerSize: { width: number; height: number };

const markerBoundsElm = document.getElementById("position_preview_img") as HTMLElement; // using image within to prevent dragging on upload image button
const markerBoundsStyle = window.getComputedStyle(markerBoundsElm) as CSSStyleDeclaration;
let markerBoundsWidth: number;
let markerBoundsHeight: number;
let markerBounds: { width: number; height: number };

xSliderElm.addEventListener("input", () => {
        updatePosition_x();
});

ySliderElm.addEventListener("input", () => {
        updatePosition_y();
});

markerBoundsElm.addEventListener("drag", (event: MouseEvent) => {
        event.preventDefault();

        if (event.clientX != 0) {
                let xValue: number = (event.offsetX / markerBoundsWidth) * +xSliderElm.max;
                xSliderElm.value = xValue.toString();

                updatePosition_x();
        }
        if (event.clientY != 0) {
                let yValue: number = (event.offsetY / markerBoundsHeight) * +ySliderElm.max;
                ySliderElm.value = yValue.toString();

                updatePosition_y();
        }
});

/**
 * Reads dimensions of markerBounds element and calls `updateMarkerSize()`.
 */
function updatePositionSize(): void {
        markerBoundsWidth = +markerBoundsStyle.getPropertyValue("width").replace("px", "") as number;
        markerBoundsHeight = +markerBoundsStyle.getPropertyValue("height").replace("px", "") as number;
        updateMarkerSize();
}

/**
 * Sets dimensions of marker element, updates markerBounds, and clamps slider values to new bounds.
 */
function updateMarkerSize(): void {
        // scale marker element to match size of markerbounds
        markerElm.style.width = `${Number(speedoGroup.vdfElm.wide) * (markerBoundsWidth / TF_SCREEN_WIDTH_CURRENT)}px`;
        markerElm.style.height = `${Number(speedoGroup.vdfElm.tall) * (markerBoundsHeight / TF_SCREEN_HEIGHT)}px`;
        markerSize = {
                width: parseFloat(markerStyle.getPropertyValue("width")),
                height: parseFloat(markerStyle.getPropertyValue("height")),
        };
        markerBounds = {
                width: markerBoundsWidth - markerSize.width,
                height: markerBoundsHeight - markerSize.height,
        };

        // clamp slider values
        let xValue = xSliderElm.value;
        let yValue = ySliderElm.value;
        let xMax = TF_SCREEN_WIDTH_CURRENT - +speedoGroup.vdfElm.wide;
        let yMax = TF_SCREEN_HEIGHT - +speedoGroup.vdfElm.tall;
        xValue = Math.max(0, Math.min(+xValue, xMax)).toString();
        yValue = Math.max(0, Math.min(+yValue, yMax)).toString();
        xSliderElm.max = xMax.toString();
        ySliderElm.max = yMax.toString();
        xSliderElm.value = xValue;
        ySliderElm.value = yValue;

        // run only on first load
        if (!hasReadVDF) {
                readXPos();
                readYPos();
                hasReadVDF = true;
        }
        if (speedoGroup.vdfElm.xpos === "rs1") {
                xSliderElm.value = xSliderElm.max;
        }

        updatePosition_x();
        updatePosition_y();
}

/**
 * Positions marker element to match slider value and updates vdf xpos.
 */
function updatePosition_x(): void {
        // update marker horizontal position
        markerElm.style.left = (+xSliderElm.value * (markerBounds.width / +xSliderElm.max)).toString();

        // calculate vdf xpos
        let center: number = +xSliderElm.max / 2;
        let xValue: number = +xSliderElm.value;
        let xOffset: number = Math.round(xValue - center);

        let newXPos: string = "cs-0.5";
        if (xValue === 0) {
                newXPos = "0";
        } else if (xValue === Number(xSliderElm.max)) {
                newXPos = "rs1";
        } else if (xOffset > 0) {
                newXPos = `+${xOffset}`;
        } else if (xOffset < 0) {
                newXPos = xOffset.toString();
        }

        speedoGroup.vdfElm.xpos = newXPos;
}

/**
 * Positions marker element to match slider value and updates vdf ypos.
 */
function updatePosition_y(): void {
        // update marker vertical position
        markerElm.style.top = (+ySliderElm.value * (markerBounds.height / +ySliderElm.max)).toString();

        // calculate vdf ypos
        let center: number = +ySliderElm.max / 2;
        let yValue: number = +ySliderElm.value;
        let yOffset: number = Math.round(yValue - center);

        let newYPos: string = "cs-0.5";
        if (yValue === 0) {
                newYPos = "0";
        } else if (yValue === Number(ySliderElm.max)) {
                newYPos = "rs1";
        } else if (yOffset > 0) {
                newYPos = `+${yOffset}`;
        } else if (yOffset < 0) {
                newYPos = yOffset.toString();
        }

        speedoGroup.vdfElm.ypos = newYPos;
}

/**
 * Reads vdf xpos into xSlider value.
 */
function readXPos() {
        let value: string = speedoGroup.vdfElm.xpos;
        let center: number = +xSliderElm.max / 2;

        switch (true) {
                case value.includes("cs-0.5"):
                        value = value.replace("cs-0.5", "");
                        value = (Number(value) + center).toString();
                        xSliderElm.value = value;
                        return;
                case value.includes("rs1"):
                        value = xSliderElm.max;
                        xSliderElm.value = value;
                        return;
                default:
                        break;
        }
        value = center.toString();
        xSliderElm.value = value;
}

/**
 * Reads vdf ypos into ySlider value.
 */
function readYPos() {
        let value: string = speedoGroup.vdfElm.ypos;
        let center: number = +ySliderElm.max / 2;

        switch (true) {
                case value.includes("cs-0.5"):
                        value = value.replace("cs-0.5", "");
                        value = (Number(value) + center).toString();
                        ySliderElm.value = value;
                        return;
                case value.includes("rs1"):
                        value = ySliderElm.max;
                        ySliderElm.value = value;
                        return;
                default:
                        break;
        }
        value = center.toString();
        ySliderElm.value = value;
}

// POSITION IMAGE
let imageUploadElm = document.getElementById("imageupload") as HTMLInputElement;
let positionPreviewImgElm = document.getElementById("position_preview_img") as HTMLImageElement;

imageUploadElm.addEventListener("change", () => {
        changeImage(imageUploadElm, positionPreviewImgElm);
});

/**
 * Reads uploaded image and changes image on page to it.
 *
 * @param input `input[type="file"]` element to upload image
 * @param output `img` element to update with uploaded image
 */
function changeImage(input: HTMLInputElement, output: HTMLImageElement) {
        let reader: FileReader;

        if (input.files && input.files[0]) {
                reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                reader.onload = () => {
                        output.setAttribute("src", reader.result as string);
                };
        }
}

// FONT
const speedoFontElm = document.getElementById("fonts") as HTMLSelectElement;
speedoFontElm.addEventListener("change", () => {
        speedoGroup.font = speedoFontElm.value as Font;
        updateSpeedoStyles();
});

// SIZE
const speedoSizeElm = document.getElementById("sizes") as HTMLSelectElement;

speedoSizeElm.addEventListener("change", () => {
        speedoGroup.setSize(speedoSizeElm.value as SpeedoSize);
        updateMarkerSize();
        updateSpeedoStyles();
});

// SHADOWS
const shadowsElm = document.getElementById("shadows_checkbox") as HTMLInputElement;

shadowsElm.addEventListener("change", () => {
        speedoGroup.drawShadows = shadowsElm.checked;
        updateSpeedoStyles();
});

// ROUNDING
const roundingElm = document.getElementById("rounding_checkbox") as HTMLInputElement;

roundingElm.addEventListener("change", () => {
        speedoGroup.round = roundingElm.checked;
});

// COLORS
const colorMainElm = document.getElementById("colorMain") as HTMLInputElement;
const colorCloseElm = document.getElementById("colorClose") as HTMLInputElement;
const colorGoodElm = document.getElementById("colorGood") as HTMLInputElement;

const colorMainHeightoElm = document.getElementById("colorMain_Heighto") as HTMLInputElement;
const colorDoubleElm = document.getElementById("colorDouble") as HTMLInputElement;
const colorTripleElm = document.getElementById("colorTriple") as HTMLInputElement;
const colorMaxVelElm = document.getElementById("colorMaxVel") as HTMLInputElement;

colorMainElm.addEventListener("input", () => {
        speedoGroup.colorMain = Color.input_to_color(colorMainElm.value);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max,
        );
});
colorCloseElm.addEventListener("input", () => {
        speedoGroup.colorClose = Color.input_to_color(colorCloseElm.value);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max,
        );
});
colorGoodElm.addEventListener("input", () => {
        speedoGroup.colorGood = Color.input_to_color(colorGoodElm.value);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max,
        );
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max,
        );
});

colorMainHeightoElm.addEventListener("input", () => {
        speedoGroup.colorHeightoMain = Color.input_to_color(colorMainHeightoElm.value);
        slider_fill_color(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
        slider_fill_color(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
        slider_fill_color(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
});
colorDoubleElm.addEventListener("input", () => {
        speedoGroup.colorDouble = Color.input_to_color(colorDoubleElm.value);
        slider_fill_color(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
});
colorTripleElm.addEventListener("input", () => {
        speedoGroup.colorTriple = Color.input_to_color(colorTripleElm.value);
        slider_fill_color(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
});
colorMaxVelElm.addEventListener("input", () => {
        speedoGroup.colorMaxVel = Color.input_to_color(colorMaxVelElm.value);
        slider_fill_color(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
});

// COLOR RANGES
const rangeGap: number = 0;
// hspeedo
const slider_hspeedo_close_min = document.getElementById("slider-hspeedo-close-min") as HTMLInputElement;
const slider_hspeedo_close_max = document.getElementById("slider-hspeedo-close-max") as HTMLInputElement;
const text_hspeedo_close_min = document.getElementById("text-hspeedo-close-min") as HTMLInputElement;
const text_hspeedo_close_max = document.getElementById("text-hspeedo-close-max") as HTMLInputElement;
const track_hspeedo_close = document.getElementById("track-hspeedo-close") as HTMLDivElement;

const slider_hspeedo_good_min = document.getElementById("slider-hspeedo-good-min") as HTMLInputElement;
const slider_hspeedo_good_max = document.getElementById("slider-hspeedo-good-max") as HTMLInputElement;
const text_hspeedo_good_min = document.getElementById("text-hspeedo-good-min") as HTMLInputElement;
const text_hspeedo_good_max = document.getElementById("text-hspeedo-good-max") as HTMLInputElement;
const track_hspeedo_good = document.getElementById("track-hspeedo-good") as HTMLDivElement;

slider_hspeedo_close_min.addEventListener("input", () => {
        process_hspeedo_close_min();
});

slider_hspeedo_close_max.addEventListener("input", () => {
        process_hspeedo_close_max();
});

slider_hspeedo_good_min.addEventListener("input", () => {
        process_hspeedo_good_min();
});

slider_hspeedo_good_max.addEventListener("input", () => {
        process_hspeedo_good_max();
});

text_hspeedo_close_min.addEventListener("change", () => {
        slider_hspeedo_close_min.value = text_hspeedo_close_min.value;
        process_hspeedo_close_min();
});

text_hspeedo_close_max.addEventListener("change", () => {
        slider_hspeedo_close_max.value = text_hspeedo_close_max.value;
        process_hspeedo_close_max();
});

text_hspeedo_good_min.addEventListener("change", () => {
        slider_hspeedo_good_min.value = text_hspeedo_good_min.value;
        process_hspeedo_good_min();
});

text_hspeedo_good_max.addEventListener("change", () => {
        slider_hspeedo_good_max.value = text_hspeedo_good_max.value;
        process_hspeedo_good_max();
});

function process_hspeedo_close_min() {
        process_slider_min(slider_hspeedo_close_min, slider_hspeedo_close_max, text_hspeedo_close_min);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max,
        );
        speedoGroup.HSpeedoRange.closeMin = parseInt(slider_hspeedo_close_min.value);
}

function process_hspeedo_close_max() {
        process_slider_max(slider_hspeedo_close_min, slider_hspeedo_close_max, text_hspeedo_close_max);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max,
        );
        speedoGroup.HSpeedoRange.closeMax = parseInt(slider_hspeedo_close_max.value);
}

function process_hspeedo_good_min() {
        process_slider_min(slider_hspeedo_good_min, slider_hspeedo_good_max, text_hspeedo_good_min);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max,
        );
        speedoGroup.HSpeedoRange.goodMin = parseInt(slider_hspeedo_good_min.value);
}

function process_hspeedo_good_max() {
        process_slider_max(slider_hspeedo_good_min, slider_hspeedo_good_max, text_hspeedo_good_max);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max,
        );
        speedoGroup.HSpeedoRange.goodMax = parseInt(slider_hspeedo_good_max.value);
}

// vspeedo
const slider_vspeedo_close_min = document.getElementById("slider-vspeedo-close-min") as HTMLInputElement;
const slider_vspeedo_close_max = document.getElementById("slider-vspeedo-close-max") as HTMLInputElement;
const text_vspeedo_close_min = document.getElementById("text-vspeedo-close-min") as HTMLInputElement;
const text_vspeedo_close_max = document.getElementById("text-vspeedo-close-max") as HTMLInputElement;
const track_vspeedo_close = document.getElementById("track-vspeedo-close") as HTMLDivElement;

const slider_vspeedo_good_min = document.getElementById("slider-vspeedo-good-min") as HTMLInputElement;
const slider_vspeedo_good_max = document.getElementById("slider-vspeedo-good-max") as HTMLInputElement;
const text_vspeedo_good_min = document.getElementById("text-vspeedo-good-min") as HTMLInputElement;
const text_vspeedo_good_max = document.getElementById("text-vspeedo-good-max") as HTMLInputElement;
const track_vspeedo_good = document.getElementById("track-vspeedo-good") as HTMLDivElement;

slider_vspeedo_close_min.addEventListener("input", () => {
        process_vspeedo_close_min();
});

slider_vspeedo_close_max.addEventListener("input", () => {
        process_vspeedo_close_max();
});

slider_vspeedo_good_min.addEventListener("input", () => {
        process_vspeedo_good_min();
});

slider_vspeedo_good_max.addEventListener("input", () => {
        process_vspeedo_good_max();
});

text_vspeedo_close_min.addEventListener("change", () => {
        slider_vspeedo_close_min.value = text_vspeedo_close_min.value;
        process_vspeedo_close_min();
});

text_vspeedo_close_max.addEventListener("change", () => {
        slider_vspeedo_close_max.value = text_vspeedo_close_max.value;
        process_vspeedo_close_max();
});

text_vspeedo_good_min.addEventListener("change", () => {
        slider_vspeedo_good_min.value = text_vspeedo_good_min.value;
        process_vspeedo_good_min();
});

text_vspeedo_good_max.addEventListener("change", () => {
        slider_vspeedo_good_max.value = text_vspeedo_good_max.value;
        process_vspeedo_good_max();
});

function process_vspeedo_close_min() {
        process_slider_min(slider_vspeedo_close_min, slider_vspeedo_close_max, text_vspeedo_close_min);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max,
        );
        speedoGroup.VSpeedoRange.closeMin = parseInt(slider_vspeedo_close_min.value);
}

function process_vspeedo_close_max() {
        process_slider_max(slider_vspeedo_close_min, slider_vspeedo_close_max, text_vspeedo_close_max);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max,
        );
        speedoGroup.VSpeedoRange.closeMax = parseInt(slider_vspeedo_close_max.value);
}

function process_vspeedo_good_min() {
        process_slider_min(slider_vspeedo_good_min, slider_vspeedo_good_max, text_vspeedo_good_min);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max,
        );
        speedoGroup.VSpeedoRange.goodMin = parseInt(slider_vspeedo_good_min.value);
}

function process_vspeedo_good_max() {
        process_slider_max(slider_vspeedo_good_min, slider_vspeedo_good_max, text_vspeedo_good_max);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max,
        );
        speedoGroup.VSpeedoRange.goodMax = parseInt(slider_vspeedo_good_max.value);
}

// aspeedo
const slider_aspeedo_close_min = document.getElementById("slider-aspeedo-close-min") as HTMLInputElement;
const slider_aspeedo_close_max = document.getElementById("slider-aspeedo-close-max") as HTMLInputElement;
const text_aspeedo_close_min = document.getElementById("text-aspeedo-close-min") as HTMLInputElement;
const text_aspeedo_close_max = document.getElementById("text-aspeedo-close-max") as HTMLInputElement;
const track_aspeedo_close = document.getElementById("track-aspeedo-close") as HTMLDivElement;

const slider_aspeedo_good_min = document.getElementById("slider-aspeedo-good-min") as HTMLInputElement;
const slider_aspeedo_good_max = document.getElementById("slider-aspeedo-good-max") as HTMLInputElement;
const text_aspeedo_good_min = document.getElementById("text-aspeedo-good-min") as HTMLInputElement;
const text_aspeedo_good_max = document.getElementById("text-aspeedo-good-max") as HTMLInputElement;
const track_aspeedo_good = document.getElementById("track-aspeedo-good") as HTMLDivElement;

slider_aspeedo_close_min.addEventListener("input", () => {
        process_aspeedo_close_min();
});

slider_aspeedo_close_max.addEventListener("input", () => {
        process_aspeedo_close_max();
});

slider_aspeedo_good_min.addEventListener("input", () => {
        process_aspeedo_good_min();
});

slider_aspeedo_good_max.addEventListener("input", () => {
        process_aspeedo_good_max();
});

text_aspeedo_close_min.addEventListener("change", () => {
        slider_aspeedo_close_min.value = text_aspeedo_close_min.value;
        process_aspeedo_close_min();
});

text_aspeedo_close_max.addEventListener("change", () => {
        slider_aspeedo_close_max.value = text_aspeedo_close_max.value;
        process_aspeedo_close_max();
});

text_aspeedo_good_min.addEventListener("change", () => {
        slider_aspeedo_good_min.value = text_aspeedo_good_min.value;
        process_aspeedo_good_min();
});

text_aspeedo_good_max.addEventListener("change", () => {
        slider_aspeedo_good_max.value = text_aspeedo_good_max.value;
        process_aspeedo_good_max();
});

function process_aspeedo_close_min() {
        process_slider_min(slider_aspeedo_close_min, slider_aspeedo_close_max, text_aspeedo_close_min);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max,
        );
        speedoGroup.ASpeedoRange.closeMin = +slider_aspeedo_close_min.value;
}

function process_aspeedo_close_max() {
        process_slider_max(slider_aspeedo_close_min, slider_aspeedo_close_max, text_aspeedo_close_max);
        slider_dual_fill_color(
                speedoGroup.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max,
        );
        speedoGroup.ASpeedoRange.closeMax = +slider_aspeedo_close_max.value;
}

function process_aspeedo_good_min() {
        process_slider_min(slider_aspeedo_good_min, slider_aspeedo_good_max, text_aspeedo_good_min);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max,
        );
        speedoGroup.ASpeedoRange.goodMin = +slider_aspeedo_good_min.value;
}

function process_aspeedo_good_max() {
        process_slider_max(slider_aspeedo_good_min, slider_aspeedo_good_max, text_aspeedo_good_max);
        slider_dual_fill_color(
                speedoGroup.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max,
        );
        speedoGroup.ASpeedoRange.goodMax = +slider_aspeedo_good_max.value;
}

// heighto
const slider_heighto_double = document.getElementById("slider-heighto-double") as HTMLInputElement;
const text_heighto_double = document.getElementById("text-heighto-double") as HTMLInputElement;
const track_heighto_double = document.getElementById("track-heighto-double") as HTMLDivElement;

const slider_heighto_triple = document.getElementById("slider-heighto-triple") as HTMLInputElement;
const text_heighto_triple = document.getElementById("text-heighto-triple") as HTMLInputElement;
const track_heighto_triple = document.getElementById("track-heighto-triple") as HTMLDivElement;

const slider_heighto_maxVel = document.getElementById("slider-heighto-maxvel") as HTMLInputElement;
const text_heighto_maxVel = document.getElementById("text-heighto-maxvel") as HTMLInputElement;
const track_heighto_maxVel = document.getElementById("track-heighto-maxvel") as HTMLDivElement;

slider_heighto_double.addEventListener("input", () => {
        process_heighto_double();
});

slider_heighto_triple.addEventListener("input", () => {
        process_heighto_triple();
});

slider_heighto_maxVel.addEventListener("input", () => {
        process_heighto_maxVel();
});

text_heighto_double.addEventListener("change", () => {
        slider_heighto_double.value = text_heighto_double.value;
        process_heighto_double();
});

text_heighto_triple.addEventListener("change", () => {
        slider_heighto_triple.value = text_heighto_triple.value;
        process_heighto_triple();
});

text_heighto_maxVel.addEventListener("change", () => {
        slider_heighto_maxVel.value = text_heighto_maxVel.value;
        process_heighto_maxVel();
});

function process_heighto_double() {
        text_heighto_double.value = slider_heighto_double.value;
        slider_fill_color(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
        speedoGroup.HeightoThresholds.double = parseInt(slider_heighto_double.value);
}

function process_heighto_triple() {
        text_heighto_triple.value = slider_heighto_triple.value;
        slider_fill_color(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
        speedoGroup.HeightoThresholds.triple = parseInt(slider_heighto_triple.value);
}

function process_heighto_maxVel() {
        text_heighto_maxVel.value = slider_heighto_maxVel.value;
        slider_fill_color(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
        speedoGroup.HeightoThresholds.maxVel = parseInt(slider_heighto_maxVel.value);
}

// all sliders
/**
 * Limits the value of the minimum slider to stay below the value of the maximum slider.
 * Updates text input to reflect value.
 *
 * @param sliderMin
 * @param sliderMax
 * @param textMin
 */
function process_slider_min(sliderMin: HTMLInputElement, sliderMax: HTMLInputElement, textMin: HTMLInputElement) {
        if (+sliderMin.value >= +sliderMax.value) {
                sliderMin.value = (+sliderMax.value - rangeGap).toString();
        }
        if (textMin) {
                textMin.value = sliderMin.value;
        }
}

/**
 * Limits the value of the maximum slider to stay above the value of the minimum slider.
 * Updates text input to reflect value.
 *
 * @param sliderMin
 * @param sliderMax
 * @param textMin
 */
function process_slider_max(sliderMin: HTMLInputElement, sliderMax: HTMLInputElement, textMax?: HTMLInputElement) {
        if (+sliderMax.value <= +sliderMin.value) {
                sliderMax.value = (+sliderMin.value + rangeGap).toString();
        }
        if (textMax) {
                textMax.value = sliderMax.value;
        }
}

/**
 * Fills the color between minimum & maximum dual slider values.
 *
 * @param colorFocus Color to fill between minimum and maximum values.
 * @param sliderTrack Div element to recolor.
 * @param sliderMin Minimum value slider.
 * @param sliderMax Maximum value slider.
 */
function slider_dual_fill_color(
        colorFocus: Color,
        sliderTrack: HTMLDivElement,
        sliderMin: HTMLInputElement,
        sliderMax: HTMLInputElement,
) {
        let colorMainCSS = speedoGroup.colorMain.getCSSColor();
        let colorFocusCSS = colorFocus.getCSSColor();
        let percent1: string = ((parseInt(sliderMin.value) / parseInt(sliderMin.max)) * 100).toString();
        let percent2: string = ((parseInt(sliderMax.value) / parseInt(sliderMax.max)) * 100).toString();
        sliderTrack.style.background =
                `linear-gradient( to right, ` +
                `${colorMainCSS}, ` +
                `${colorMainCSS}, ${percent1}%, ` +
                `${colorFocusCSS}, ${percent1}%, ` +
                `${colorFocusCSS} ${percent2}%, ` +
                `${colorMainCSS} ${percent2}% )`;
}

/**
 * Fills the color above slider value.
 *
 * @param colorFocus Color to fill above slider value.
 * @param sliderTrack Div element to recolor.
 * @param slider
 */
function slider_fill_color(color: Color, sliderTrack: HTMLDivElement, slider: HTMLInputElement) {
        let colorNull = speedoGroup.colorHeightoMain.getCSSColor();
        let colorFocus = color.getCSSColor();
        let percent: string = ((parseInt(slider.value) / parseInt(slider.max)) * 100).toString();
        sliderTrack.style.background =
                `linear-gradient( to right, ` +
                `${colorNull}, ` +
                `${colorNull} ${percent}%, ` +
                `${colorFocus} ${percent}%)`;
}

// DOWNLOAD
const downloadElm = document.getElementById("download-btn") as HTMLButtonElement;

downloadElm.addEventListener("click", () => {
        zipSpeedos(speedoGroup);
});

// UPLOAD
const uploadElm = document.getElementById("upload-btn") as HTMLInputElement;

uploadElm.addEventListener("change", () => {
        speedoGroup.importFromJSON(uploadElm).then(() => {
                initialize();
        });
});

//===================================================================================
// ON PAGE LOAD
//-----------------------------------------------------------------------------------
window.onload = () => {
        initialize();
};

function initialize() {
        hasReadVDF = false;
        updateSpeedoStyles();
        readSpeedoGroupToPage();
        updatePositionSize();
        process_hspeedo_close_min();
        process_hspeedo_close_max();
        process_hspeedo_good_min();
        process_hspeedo_good_max();
        process_vspeedo_close_min();
        process_vspeedo_close_max();
        process_vspeedo_good_min();
        process_vspeedo_good_max();
        process_aspeedo_close_min();
        process_aspeedo_close_max();
        process_aspeedo_good_min();
        process_aspeedo_good_max();
        process_heighto_double();
        process_heighto_triple();
        process_heighto_maxVel();

        speedoGroup.startPreview();
        setInterval(() => {
                speedoElmArray.forEach((speedoElm) => {
                        let slot = "slot_";
                        for (let i = 1; i <= NUM_SPEEDOS; i++) {
                                slot += i;
                                let speedoObj = speedoGroup.speedos[i - 1];
                                if (speedoElm.classList.contains(slot)) {
                                        speedoElm.textContent = speedoObj.playerSpeed.toString();
                                        speedoElm.style.setProperty("color", speedoObj.color.getCSSColor());
                                }
                                slot = slot.slice(0, -1);
                        }
                });
        }, speedoGroup.frametime);
}

window.addEventListener("resize", () => {
        updatePositionSize();
});

/**
 * Loads values from speedo object into DOM elements.
 */
function readSpeedoGroupToPage() {
        slot1Elm.value = speedoGroup.speedos[0].speedoType;
        slot2Elm.value = speedoGroup.speedos[1].speedoType;
        slot3Elm.value = speedoGroup.speedos[2].speedoType;
        slot4Elm.value = speedoGroup.speedos[3].speedoType;
        speedoFontElm.value = speedoGroup.font;
        speedoSizeElm.value = speedoGroup.getSize();
        shadowsElm.checked = speedoGroup.drawShadows;
        roundingElm.checked = speedoGroup.round;
        colorMainElm.value = speedoGroup.colorMain.getInputColor();
        colorCloseElm.value = speedoGroup.colorClose.getInputColor();
        colorGoodElm.value = speedoGroup.colorGood.getInputColor();
        colorMainHeightoElm.value = speedoGroup.colorHeightoMain.getInputColor();
        colorDoubleElm.value = speedoGroup.colorDouble.getInputColor();
        colorTripleElm.value = speedoGroup.colorTriple.getInputColor();
        colorMaxVelElm.value = speedoGroup.colorMaxVel.getInputColor();
        slider_hspeedo_close_min.value = speedoGroup.HSpeedoRange.closeMin.toString();
        slider_hspeedo_close_max.value = speedoGroup.HSpeedoRange.closeMax.toString();
        slider_hspeedo_good_min.value = speedoGroup.HSpeedoRange.goodMin.toString();
        slider_hspeedo_good_max.value = speedoGroup.HSpeedoRange.goodMax.toString();
        slider_vspeedo_close_min.value = speedoGroup.VSpeedoRange.closeMin.toString();
        slider_vspeedo_close_max.value = speedoGroup.VSpeedoRange.closeMax.toString();
        slider_vspeedo_good_min.value = speedoGroup.VSpeedoRange.goodMin.toString();
        slider_vspeedo_good_max.value = speedoGroup.VSpeedoRange.goodMax.toString();
        slider_aspeedo_close_min.value = speedoGroup.ASpeedoRange.closeMin.toString();
        slider_aspeedo_close_max.value = speedoGroup.ASpeedoRange.closeMax.toString();
        slider_aspeedo_good_min.value = speedoGroup.ASpeedoRange.goodMin.toString();
        slider_aspeedo_good_max.value = speedoGroup.ASpeedoRange.goodMax.toString();
        slider_heighto_double.value = speedoGroup.HeightoThresholds.double.toString();
        slider_heighto_triple.value = speedoGroup.HeightoThresholds.triple.toString();
        slider_heighto_maxVel.value = speedoGroup.HeightoThresholds.maxVel.toString();
}
