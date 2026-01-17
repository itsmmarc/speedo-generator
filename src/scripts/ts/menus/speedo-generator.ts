import { SpeedoType } from "../speedo.js";
import { Speedos } from "../speedos.js";
import { SpeedoSize } from "../speedos.js";
import { Color } from "../color.js";
import { zipSpeedos } from "../zip.js";
import { Font } from "../speedos.js";
import { matchClassStartingWith } from "../util.js";

const NUM_SPEEDOS = 4;
const speedoColl = document.getElementsByClassName("speedo") as HTMLCollection; // collection of all speedo class elements
const speedoElmArray = Array.prototype.slice.call(speedoColl) as HTMLElement[];
const speedosObj = new Speedos();

//===================================================================================
// PREVIEW RENDERING
//-----------------------------------------------------------------------------------

function updateSpeedoStyles() {
        switch (speedosObj.getSize()) {
                case "SMALL":
                        $(".speedo").removeClass("speedo-size-medium");
                        $(".speedo").removeClass("speedo-size-large");

                        $(".speedo").addClass("speedo-size-small");
                        break;
                case "MEDIUM":
                        $(".speedo").removeClass("speedo-size-small");
                        $(".speedo").removeClass("speedo-size-large");

                        $(".speedo").addClass("speedo-size-medium");
                        break;
                case "LARGE":
                        $(".speedo").removeClass("speedo-size-small");
                        $(".speedo").removeClass("speedo-size-medium");

                        $(".speedo").addClass("speedo-size-large");
                        break;
                default:
                        break;
        }
        switch (speedosObj.font) {
                case "bahnschrift":
                        if (!$(".speedo").hasClass("font-bahnschrift")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-bahnschrift");
                        }
                        break;
                case "coolvetica":
                        if (!$(".speedo").hasClass("font-coolvetica")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-coolvetica");
                        }
                        break;
                case "coolvetica_italic":
                        if (!$(".speedo").hasClass("font-coolvetica-italic")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-coolvetica_italic");
                        }
                        break;
                case "eternal":
                        if (!$(".speedo").hasClass("font-eternal")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-eternal");
                        }
                        break;
                case "montserrat":
                        if (!$(".speedo").hasClass("font-montserrat")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-montserrat");
                        }
                        break;
                case "nk57":
                        if (!$(".speedo").hasClass("font-nk57")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-nk57");
                        }
                        break;
                case "poppins":
                        if (!$(".speedo").hasClass("font-poppins")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-poppins");
                        }
                        break;
                case "quake":
                        if (!$(".speedo").hasClass("font-quake")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-quake");
                        }
                        break;
                case "renogare":
                        if (!$(".speedo").hasClass("font-renogare")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-renogare");
                        }
                        break;
                case "roboto":
                        if (!$(".speedo").hasClass("font-roboto")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-roboto");
                        }
                        break;
                case "square":
                        if (!$(".speedo").hasClass("font-square")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-square");
                        }
                        break;
                case "surface":
                        if (!$(".speedo").hasClass("font-surface")) {
                                $(".speedo").removeClass((index, className) => {
                                        return matchClassStartingWith("font", className);
                                });
                                $(".speedo").addClass("font-surface");
                        }
                        break;
                default:
                        console.log("error in speeds object font, ", speedosObj.font, " is not a valid font");
                        break;
        }

        speedoElmArray.forEach((speedoElm) => {
                let slot = "slot_";
                for (let i = 1; i <= NUM_SPEEDOS; i++) {
                        slot += i;
                        let speedoObj = speedosObj.speedo[i - 1];

                        if (speedoElm.classList.contains(slot)) {
                                // Check if speedo should be visible
                                if (speedoObj.speedoType == "NONE" && !speedoElm.classList.contains("hidden")) {
                                        speedoElm.classList.add("hidden");
                                } else if (speedoObj.speedoType != "NONE" && speedoElm.classList.contains("hidden")) {
                                        speedoElm.classList.remove("hidden");
                                }

                                // check if shadows should be drawn
                                if (speedoObj.speedoType != "NONE") {
                                        if (speedoElm.classList.contains("shadow")) {
                                                if (speedosObj.drawShadows && speedoElm.classList.contains("hidden")) {
                                                        speedoElm.classList.remove("hidden");
                                                } else if (
                                                        !speedosObj.drawShadows &&
                                                        !speedoElm.classList.contains("hidden")
                                                ) {
                                                        speedoElm.classList.add("hidden");
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
const slot1Elm = document.getElementById("dropdown_slot_1") as HTMLSelectElement;
const slot2Elm = document.getElementById("dropdown_slot_2") as HTMLSelectElement;
const slot3Elm = document.getElementById("dropdown_slot_3") as HTMLSelectElement;
const slot4Elm = document.getElementById("dropdown_slot_4") as HTMLSelectElement;

slot1Elm.addEventListener("change", () => {
        speedosObj.speedo[0].speedoType = slot1Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});
slot2Elm.addEventListener("change", () => {
        speedosObj.speedo[1].speedoType = slot2Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});
slot3Elm.addEventListener("change", () => {
        speedosObj.speedo[2].speedoType = slot3Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});
slot4Elm.addEventListener("change", () => {
        speedosObj.speedo[3].speedoType = slot4Elm.selectedOptions[0].value as SpeedoType;
        updateSpeedoStyles();
});

// POSITION
const xSlider = document.getElementById("xpos") as HTMLInputElement;
const ySlider = document.getElementById("ypos") as HTMLInputElement;

const markerElm = document.getElementById("marker") as HTMLElement;
const markerStyle = window.getComputedStyle(markerElm) as CSSStyleDeclaration;
let markerSize: { width: number; height: number };

const markerBoundsElm = document.getElementById("markerbounds") as HTMLElement;
const markerBoundsStyle = window.getComputedStyle(markerBoundsElm) as CSSStyleDeclaration;
const markerBoundsWidth = +markerBoundsStyle.getPropertyValue("width").replace("px", "") as number;
const markerBoundsHeight = +markerBoundsStyle.getPropertyValue("height").replace("px", "") as number;
let markerBounds: { width: number; height: number };

xSlider.addEventListener("input", () => {
        updatePosition_x();
});

ySlider.addEventListener("input", () => {
        updatePosition_y();
});

markerBoundsElm.addEventListener("drag", (event: MouseEvent) => {
        if (event.offsetX > 0) {
                let xValue: number = (event.offsetX / markerBoundsWidth) * +xSlider.max;
                xSlider.value = xValue.toString();

                updatePosition_x();
        }
        if (event.offsetY > 0) {
                let yValue: number = (event.offsetY / markerBoundsHeight) * +ySlider.max;
                ySlider.value = yValue.toString();

                updatePosition_y();
        }
});

function updateMarkerSize() {
        markerElm.style.width = "".concat((+speedosObj.vdfElm.wide * 0.75).toString(), "px");
        markerElm.style.height = "".concat((+speedosObj.vdfElm.tall * 0.75).toString(), "px");
        markerSize = {
                width: +markerStyle.getPropertyValue("width").replace("px", ""),
                height: +markerStyle.getPropertyValue("height").replace("px", ""),
        };
        markerBounds = {
                width: markerBoundsWidth - markerSize.width,
                height: markerBoundsHeight - markerSize.height,
        };
        xSlider.max = (852 - +speedosObj.vdfElm.wide).toString();
        ySlider.max = (480 - +speedosObj.vdfElm.tall).toString();
}

function updatePosition_x() {
        // update marker horizontal position
        markerElm.style.left = (+xSlider.value * (markerBounds.width / +xSlider.max)).toString();

        // calculate vdf xpos
        let center: number = +xSlider.max / 2;
        let xValue: number = +xSlider.value;
        let xOffset: number = Math.round(xValue - center);

        let newXPos: string = "cs-0.5";
        if (xValue == 0) {
                newXPos = "0";
        } else if (xValue == +xSlider.max) {
                newXPos = "rs1";
        } else if (xOffset > 0) {
                newXPos = newXPos.concat("+", xOffset.toString());
        } else if (xOffset < 0) {
                newXPos = newXPos.concat(xOffset.toString());
        }

        speedosObj.vdfElm.xpos = newXPos;
}

function updatePosition_y() {
        // update marker vertical position
        markerElm.style.top = (+ySlider.value * (markerBounds.height / +ySlider.max)).toString();

        // calculate vdf ypos
        let center: number = +ySlider.max / 2;
        let yValue: number = +ySlider.value;
        let yOffset: number = Math.round(yValue - center);

        let newYPos: string = "cs-0.5";
        if (yValue == 0) {
                newYPos = "0";
        } else if (yValue == +ySlider.max) {
                newYPos = "rs1";
        } else if (yOffset > 0) {
                newYPos = newYPos.concat("+", yOffset.toString());
        } else if (yOffset < 0) {
                newYPos = newYPos.concat(yOffset.toString());
        }

        speedosObj.vdfElm.ypos = newYPos;
}

// POSITION IMAGE
let imageUpload = document.getElementById("imageupload") as HTMLInputElement;
let posPreviewImg = document.getElementById("position_preview_img") as HTMLImageElement;

imageUpload.addEventListener("change", () => {
        changeImage(imageUpload);
});

function changeImage(input: HTMLInputElement) {
        let reader: FileReader;

        if (input.files && input.files[0]) {
                reader = new FileReader();

                reader.onload = () => {
                        posPreviewImg.setAttribute("src", reader.result as string);
                };

                reader.readAsDataURL(input.files[0]);
        }
}

// FONT
const speedoFontElm = document.getElementById("fonts") as HTMLSelectElement;
speedoFontElm.addEventListener("change", () => {
        speedosObj.font = speedoFontElm.value as Font;
        updateSpeedoStyles();
});

// SIZE
const speedoSizeElm = document.getElementById("sizes") as HTMLSelectElement;

speedoSizeElm.addEventListener("change", () => {
        speedosObj.setSize(speedoSizeElm.value as SpeedoSize);
        updateMarkerSize();
        updateSpeedoStyles();
});

// SHADOWS
const shadowsElm = document.getElementById("shadows_checkbox") as HTMLInputElement;

shadowsElm.addEventListener("change", () => {
        speedosObj.drawShadows = shadowsElm.checked;
        updateSpeedoStyles();
});

// ROUNDING
const roundingElm = document.getElementById("rounding_checkbox") as HTMLInputElement;

roundingElm.addEventListener("change", () => {
        speedosObj.round = roundingElm.checked;
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
        speedosObj.colorMain = Color.input_to_color(colorMainElm.value);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max
        );
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max
        );
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max
        );
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max
        );
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max
        );
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max
        );
});
colorCloseElm.addEventListener("input", () => {
        speedosObj.colorClose = Color.input_to_color(colorCloseElm.value);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max
        );
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max
        );
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max
        );
});
colorGoodElm.addEventListener("input", () => {
        speedosObj.colorGood = Color.input_to_color(colorGoodElm.value);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max
        );
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max
        );
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max
        );
});

colorMainHeightoElm.addEventListener("input", () => {
        speedosObj.colorMain_Heighto = Color.input_to_color(colorMainHeightoElm.value);
        slider_fill_color(speedosObj.colorDouble, track_heighto_double, slider_heighto_double);
        slider_fill_color(speedosObj.colorTriple, track_heighto_triple, slider_heighto_triple);
        slider_fill_color(speedosObj.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
});
colorDoubleElm.addEventListener("input", () => {
        speedosObj.colorDouble = Color.input_to_color(colorDoubleElm.value);
        slider_fill_color(speedosObj.colorDouble, track_heighto_double, slider_heighto_double);
});
colorTripleElm.addEventListener("input", () => {
        speedosObj.colorTriple = Color.input_to_color(colorTripleElm.value);
        slider_fill_color(speedosObj.colorTriple, track_heighto_triple, slider_heighto_triple);
});
colorMaxVelElm.addEventListener("input", () => {
        speedosObj.colorMaxVel = Color.input_to_color(colorMaxVelElm.value);
        slider_fill_color(speedosObj.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
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
        slider_process_min(slider_hspeedo_close_min, slider_hspeedo_close_max, text_hspeedo_close_min);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max
        );
        speedosObj.HSpeedoRange.closeMin = parseInt(slider_hspeedo_close_min.value);
}

function process_hspeedo_close_max() {
        slider_process_max(slider_hspeedo_close_min, slider_hspeedo_close_max, text_hspeedo_close_max);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_hspeedo_close,
                slider_hspeedo_close_min,
                slider_hspeedo_close_max
        );
        speedosObj.HSpeedoRange.closeMax = parseInt(slider_hspeedo_close_max.value);
}

function process_hspeedo_good_min() {
        slider_process_min(slider_hspeedo_good_min, slider_hspeedo_good_max, text_hspeedo_good_min);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max
        );
        speedosObj.HSpeedoRange.goodMin = parseInt(slider_hspeedo_good_min.value);
}

function process_hspeedo_good_max() {
        slider_process_max(slider_hspeedo_good_min, slider_hspeedo_good_max, text_hspeedo_good_max);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_hspeedo_good,
                slider_hspeedo_good_min,
                slider_hspeedo_good_max
        );
        speedosObj.HSpeedoRange.goodMax = parseInt(slider_hspeedo_good_max.value);
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
        slider_process_min(slider_vspeedo_close_min, slider_vspeedo_close_max, text_vspeedo_close_min);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max
        );
        speedosObj.VSpeedoRange.closeMin = parseInt(slider_vspeedo_close_min.value);
}

function process_vspeedo_close_max() {
        slider_process_max(slider_vspeedo_close_min, slider_vspeedo_close_max, text_vspeedo_close_max);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_vspeedo_close,
                slider_vspeedo_close_min,
                slider_vspeedo_close_max
        );
        speedosObj.VSpeedoRange.closeMax = parseInt(slider_vspeedo_close_max.value);
}

function process_vspeedo_good_min() {
        slider_process_min(slider_vspeedo_good_min, slider_vspeedo_good_max, text_vspeedo_good_min);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max
        );
        speedosObj.VSpeedoRange.goodMin = parseInt(slider_vspeedo_good_min.value);
}

function process_vspeedo_good_max() {
        slider_process_max(slider_vspeedo_good_min, slider_vspeedo_good_max, text_vspeedo_good_max);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_vspeedo_good,
                slider_vspeedo_good_min,
                slider_vspeedo_good_max
        );
        speedosObj.VSpeedoRange.goodMax = parseInt(slider_vspeedo_good_max.value);
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
        slider_process_min(slider_aspeedo_close_min, slider_aspeedo_close_max, text_aspeedo_close_min);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max
        );
        speedosObj.ASpeedoRange.closeMin = parseInt(slider_aspeedo_close_min.value);
}

function process_aspeedo_close_max() {
        slider_process_max(slider_aspeedo_close_min, slider_aspeedo_close_max, text_aspeedo_close_max);
        slider_dual_fill_color(
                speedosObj.colorClose,
                track_aspeedo_close,
                slider_aspeedo_close_min,
                slider_aspeedo_close_max
        );
        speedosObj.ASpeedoRange.closeMax = parseInt(slider_aspeedo_close_max.value);
}

function process_aspeedo_good_min() {
        slider_process_min(slider_aspeedo_good_min, slider_aspeedo_good_max, text_aspeedo_good_min);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max
        );
        speedosObj.ASpeedoRange.goodMin = parseInt(slider_aspeedo_good_min.value);
}

function process_aspeedo_good_max() {
        slider_process_max(slider_aspeedo_good_min, slider_aspeedo_good_max, text_aspeedo_good_max);
        slider_dual_fill_color(
                speedosObj.colorGood,
                track_aspeedo_good,
                slider_aspeedo_good_min,
                slider_aspeedo_good_max
        );
        speedosObj.ASpeedoRange.goodMax = parseInt(slider_aspeedo_good_max.value);
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
        slider_fill_color(speedosObj.colorDouble, track_heighto_double, slider_heighto_double);
        speedosObj.HeightoThresholds.double = parseInt(slider_heighto_double.value);
}

function process_heighto_triple() {
        text_heighto_triple.value = slider_heighto_triple.value;
        slider_fill_color(speedosObj.colorTriple, track_heighto_triple, slider_heighto_triple);
        speedosObj.HeightoThresholds.triple = parseInt(slider_heighto_triple.value);
}

function process_heighto_maxVel() {
        text_heighto_maxVel.value = slider_heighto_maxVel.value;
        slider_fill_color(speedosObj.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
        speedosObj.HeightoThresholds.maxVel = parseInt(slider_heighto_maxVel.value);
}

// all sliders
function slider_process_min(sliderMin: HTMLInputElement, sliderMax: HTMLInputElement, textMin: HTMLInputElement) {
        if (parseInt(sliderMin.value) >= parseInt(sliderMax.value)) {
                sliderMin.value = (parseInt(sliderMax.value) - rangeGap).toString();
        }
        if (textMin) {
                textMin.value = sliderMin.value;
        }
}

function slider_process_max(sliderMin: HTMLInputElement, sliderMax: HTMLInputElement, textMax?: HTMLInputElement) {
        if (parseInt(sliderMax.value) <= parseInt(sliderMin.value)) {
                sliderMax.value = (parseInt(sliderMin.value) + rangeGap).toString();
        }
        if (textMax) {
                textMax.value = sliderMax.value;
        }
}

function slider_dual_fill_color(
        colorFocus: Color,
        sliderTrack: HTMLDivElement,
        sliderMin: HTMLInputElement,
        sliderMax: HTMLInputElement
) {
        let colorMainCSS = speedosObj.colorMain.getCSSColor();
        let colorFocusCSS = colorFocus.getCSSColor();
        let percent1: string = ((parseInt(sliderMin.value) / parseInt(sliderMin.max)) * 100).toString();
        let percent2: string = ((parseInt(sliderMax.value) / parseInt(sliderMax.max)) * 100).toString();
        sliderTrack.style.background = "".concat(
                "linear-gradient( to right, ",
                colorMainCSS,
                ", ",
                colorMainCSS,
                " ",
                percent1,
                "%, ",
                colorFocusCSS,
                " ",
                percent1,
                "%, ",
                colorFocusCSS,
                " ",
                percent2,
                "%, ",
                colorMainCSS,
                " ",
                percent2,
                "% )"
        );
}

function slider_fill_color(color: Color, sliderTrack: HTMLDivElement, slider: HTMLInputElement) {
        let colorNull = speedosObj.colorMain_Heighto.getCSSColor();
        let colorFocus = color.getCSSColor();
        let percent: string = ((parseInt(slider.value) / parseInt(slider.max)) * 100).toString();
        sliderTrack.style.background = "".concat(
                "linear-gradient( to right, ",
                colorNull,
                ", ",
                colorNull,
                " ",
                percent,
                "%, ",
                colorFocus,
                " ",
                percent,
                "%)"
        );
}

// DOWNLOAD
const downloadElm = document.getElementById("download-btn") as HTMLButtonElement;

downloadElm.addEventListener("click", () => {
        zipSpeedos(speedosObj);
});

//===================================================================================
// ON PAGE LOAD
//-----------------------------------------------------------------------------------
window.onload = () => {
        updateSpeedoStyles();
        speedosObj_to_Elements();
        updateMarkerSize();
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

        speedosObj.startPreview();
        setInterval(() => {
                speedoElmArray.forEach((speedoElm) => {
                        let slot = "slot_";
                        for (let i = 1; i <= NUM_SPEEDOS; i++) {
                                slot += i;
                                let speedoObj = speedosObj.speedo[i - 1];
                                if (speedoElm.classList.contains(slot)) {
                                        speedoElm.textContent = speedoObj.playerSpeed.toString();
                                        speedoElm.style.setProperty("color", speedoObj.color.getCSSColor());
                                }
                                slot = slot.slice(0, -1);
                        }
                });
        }, speedosObj.frametime);
};

// load default settings based on defaults of speedosObj
function speedosObj_to_Elements() {
        slot1Elm.value = speedosObj.speedo[0].speedoType;
        slot2Elm.value = speedosObj.speedo[1].speedoType;
        slot3Elm.value = speedosObj.speedo[2].speedoType;
        slot4Elm.value = speedosObj.speedo[3].speedoType;
        speedoFontElm.value = speedosObj.font;
        speedoSizeElm.value = speedosObj.getSize();
        shadowsElm.checked = speedosObj.drawShadows;
        roundingElm.checked = speedosObj.round;
        colorMainElm.value = speedosObj.colorMain.getInputColor();
        colorCloseElm.value = speedosObj.colorClose.getInputColor();
        colorGoodElm.value = speedosObj.colorGood.getInputColor();
        colorMainHeightoElm.value = speedosObj.colorMain_Heighto.getInputColor();
        colorDoubleElm.value = speedosObj.colorDouble.getInputColor();
        colorTripleElm.value = speedosObj.colorTriple.getInputColor();
        colorMaxVelElm.value = speedosObj.colorMaxVel.getInputColor();
        slider_hspeedo_close_min.value = speedosObj.HSpeedoRange.closeMin.toString();
        slider_hspeedo_close_max.value = speedosObj.HSpeedoRange.closeMax.toString();
        slider_hspeedo_good_min.value = speedosObj.HSpeedoRange.goodMin.toString();
        slider_hspeedo_good_max.value = speedosObj.HSpeedoRange.goodMax.toString();
        slider_vspeedo_close_min.value = speedosObj.VSpeedoRange.closeMin.toString();
        slider_vspeedo_close_max.value = speedosObj.VSpeedoRange.closeMax.toString();
        slider_vspeedo_good_min.value = speedosObj.VSpeedoRange.goodMin.toString();
        slider_vspeedo_good_max.value = speedosObj.VSpeedoRange.goodMax.toString();
        slider_aspeedo_close_min.value = speedosObj.ASpeedoRange.closeMin.toString();
        slider_aspeedo_close_max.value = speedosObj.ASpeedoRange.closeMax.toString();
        slider_aspeedo_good_min.value = speedosObj.ASpeedoRange.goodMin.toString();
        slider_aspeedo_good_max.value = speedosObj.ASpeedoRange.goodMax.toString();
        slider_heighto_double.value = speedosObj.HeightoThresholds.double.toString();
        slider_heighto_triple.value = speedosObj.HeightoThresholds.triple.toString();
        slider_heighto_maxVel.value = speedosObj.HeightoThresholds.maxVel.toString();
}
