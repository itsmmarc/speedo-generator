import { SpeedoType } from "../speedo.js";
import { presetDemo, presetSoldier, SpeedoSize, Range } from "../speedo-group.js";
import { Color } from "../color.js";
import { zipSpeedos } from "../zip.js";
import { matchClassStartingWith } from "../util.js";
import * as _ from "lodash";

const TF_SCREEN_WIDTH_16_9 = 852;
const TF_SCREEN_WIDTH_4_3 = 640;
let TF_SCREEN_WIDTH_CURRENT = TF_SCREEN_WIDTH_16_9;
const TF_SCREEN_HEIGHT = 480;

let hasReadVDF: boolean = false;

let speedoGroup = _.cloneDeep(presetSoldier);

const presetJHDemoElm = $("#preset-jh-demo").filter("button");
const presetJHSoldierElm = $("#preset-jh-soldier").filter("button");

const aspectRatio4x3Elm = $("#4x3").filter("button");
const aspectRatio16x9Elm = $("#16x9").filter("button");

const downloadElm = $("#download-btn").filter("button");
const uploadJSONElm = $("#upload-btn").filter("input") as JQuery<HTMLInputElement>;

const slotElms = $("select.slot").filter("select") as JQuery<HTMLSelectElement>;

const speedoFontElm = $("#fonts").filter("select") as JQuery<HTMLSelectElement>;
const speedoSizeElm = $("#sizes").filter("select") as JQuery<HTMLSelectElement>;
const shadowsElm = $("#shadows_checkbox");
const roundingElm = $("#rounding_checkbox");

const positionPreviewElm = $("#position_preview").filter("div");
const xSliderElm = $("#xpos").filter("input");
const ySliderElm = $("#ypos").filter("input");
const markerElm = $("#marker").filter("div");
let markerSize: { width: number; height: number };
const markerBoundsElm = document.getElementById("position_preview_img") as HTMLImageElement; // using image within to prevent dragging on upload image button
let markerBoundsWidth: number;
let markerBoundsHeight: number;
let markerBounds: { width: number; height: number };
const uploadImageElm = $("#imageupload").filter("input") as JQuery<HTMLInputElement>;
const positionPreviewImgElm = $("#position_preview_img").filter("img") as JQuery<HTMLImageElement>;

const colorMainElm = $("#colorMain");
const colorCloseElm = $("#colorClose");
const colorGoodElm = $("#colorGood");

const colorMainHeightoElm = $("#colorMain_Heighto");
const colorDoubleElm = $("#colorDouble");
const colorTripleElm = $("#colorTriple");
const colorMaxVelElm = $("#colorMaxVel");

const rangeGap: number = 0;

const dualRangeContainerElms = $(".range-container.dual");

const slider_heighto_double = $("#slider-heighto-double").filter("input") as JQuery<HTMLInputElement>;
const text_heighto_double = $("#text-heighto-double").filter("input") as JQuery<HTMLInputElement>;
const track_heighto_double = $("#track-heighto-double");

const slider_heighto_triple = $("#slider-heighto-triple").filter("input") as JQuery<HTMLInputElement>;
const text_heighto_triple = $("#text-heighto-triple").filter("input") as JQuery<HTMLInputElement>;
const track_heighto_triple = $("#track-heighto-triple");

const slider_heighto_maxVel = $("#slider-heighto-maxvel").filter("input") as JQuery<HTMLInputElement>;
const text_heighto_maxVel = $("#text-heighto-maxvel").filter("input") as JQuery<HTMLInputElement>;
const track_heighto_maxVel = $("#track-heighto-maxvel");

$(() => {
        addListeners();
        initialize();
        setInterval(() => {
                for (const [index, speedo] of speedoGroup.speedos.entries()) {
                        $(`.speedo.slot_${index + 1}`).text(speedo.playerSpeed);
                        $(`.speedo.slot_${index + 1}`).css("color", speedo.color.getCSSColor());
                }
        }, speedoGroup.frametime);
});

window.addEventListener("resize", () => {
        updatePositionSize();
});

function addListeners() {
        presetJHDemoElm.on("click", () => {
                speedoGroup = _.cloneDeep(presetDemo);
                initialize();
        });

        presetJHSoldierElm.on("click", () => {
                speedoGroup = _.cloneDeep(presetSoldier);
                initialize();
        });

        slotElms.each((index, slotElm) => {
                slotElm.addEventListener("change", () => {
                        speedoGroup.speedos[index].speedoType = slotElm.value as SpeedoType;
                        updateSpeedoVisibility();
                });
        });

        aspectRatio16x9Elm.on("click", () => {
                TF_SCREEN_WIDTH_CURRENT = TF_SCREEN_WIDTH_16_9;
                positionPreviewElm.css("aspectRatio", "16 / 9");
                updatePositionSize();
        });
        aspectRatio4x3Elm.on("click", () => {
                TF_SCREEN_WIDTH_CURRENT = TF_SCREEN_WIDTH_4_3;
                positionPreviewElm.css("aspectRatio", "4 / 3");
                updatePositionSize();
        });
        xSliderElm.on("input", () => {
                updatePosition_x();
        });

        ySliderElm.on("input", () => {
                updatePosition_y();
        });

        markerBoundsElm.addEventListener("drag", (event: MouseEvent) => {
                event.preventDefault();

                if (event.clientX != 0) {
                        let xValue: number = (event.offsetX / markerBoundsWidth) * Number(xSliderElm.attr("max"));
                        xSliderElm.val(xValue);

                        updatePosition_x();
                }
                if (event.clientY != 0) {
                        let yValue: number = (event.offsetY / markerBoundsHeight) * Number(ySliderElm.attr("max"));
                        ySliderElm.val(yValue);

                        updatePosition_y();
                }
        });

        uploadImageElm.on("change", () => {
                changeImage(uploadImageElm, positionPreviewImgElm);
        });

        speedoFontElm.on("change", () => {
                updateSpeedoFont();
        });

        speedoSizeElm.on("change", () => {
                speedoGroup.setSize(speedoSizeElm.val() as SpeedoSize);
                updateMarkerSize();
                updateSpeedoSize();
        });

        shadowsElm.on("change", () => {
                speedoGroup.drawShadows = shadowsElm.prop("checked");
                updateSpeedoVisibility();
        });

        roundingElm.on("change", () => {
                speedoGroup.round = roundingElm.prop("checked");
        });

        // COLORS
        colorMainElm.on("input", () => {
                speedoGroup.colorMain = Color.input_to_color(colorMainElm.val() as string);
                dualRangeContainerElms.each(function (this: HTMLElement) {
                        let container = getDualRangeContainer(this);
                        let color = getDualRangeColor(container);

                        fillDualSlider(color, container.sliderTrack, container.sliderMin, container.sliderMax);
                });
        });
        colorCloseElm.on("input", () => {
                speedoGroup.colorClose = Color.input_to_color(colorCloseElm.val() as string);
                dualRangeContainerElms.filter(".close").each(function (this: HTMLElement) {
                        let container = getDualRangeContainer(this);
                        let color = getDualRangeColor(container);

                        fillDualSlider(color, container.sliderTrack, container.sliderMin, container.sliderMax);
                });
        });
        colorGoodElm.on("input", () => {
                speedoGroup.colorGood = Color.input_to_color(colorGoodElm.val() as string);
                dualRangeContainerElms.filter(".good").each(function (this: HTMLElement) {
                        let container = getDualRangeContainer(this);
                        let color = getDualRangeColor(container);

                        fillDualSlider(color, container.sliderTrack, container.sliderMin, container.sliderMax);
                });
        });

        colorMainHeightoElm.on("input", () => {
                speedoGroup.colorHeightoMain = Color.input_to_color(colorMainHeightoElm.val() as string);
                fillSingleSlider(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
                fillSingleSlider(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
                fillSingleSlider(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
        });
        colorDoubleElm.on("input", () => {
                speedoGroup.colorDouble = Color.input_to_color(colorDoubleElm.val() as string);
                fillSingleSlider(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
        });
        colorTripleElm.on("input", () => {
                speedoGroup.colorTriple = Color.input_to_color(colorTripleElm.val() as string);
                fillSingleSlider(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
        });
        colorMaxVelElm.on("input", () => {
                speedoGroup.colorMaxVel = Color.input_to_color(colorMaxVelElm.val() as string);
                fillSingleSlider(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
        });

        // COLOR RANGES
        dualRangeContainerElms.each(function (this: HTMLElement) {
                let container = getDualRangeContainer(this);

                container.sliderMin.on("input", () => {
                        let color = getDualRangeColor(container);
                        container.range.min = processRangeMin(
                                container.sliderMin,
                                container.sliderMax,
                                container.sliderTrack,
                                container.textMin,
                                color,
                        );
                });
                container.sliderMax.on("input", () => {
                        let color = getDualRangeColor(container);
                        container.range.max = processRangeMax(
                                container.sliderMin,
                                container.sliderMax,
                                container.sliderTrack,
                                container.textMax,
                                color,
                        );
                });
                container.textMin.on("change", () => {
                        let color = getDualRangeColor(container);
                        container.sliderMin.val(container.textMin.val() as string);
                        container.range.min = processRangeMin(
                                container.sliderMin,
                                container.sliderMax,
                                container.sliderTrack,
                                container.textMin,
                                color,
                        );
                });
                container.textMax.on("change", () => {
                        let color = getDualRangeColor(container);
                        container.sliderMax.val(container.textMax.val() as string);
                        container.range.max = processRangeMax(
                                container.sliderMin,
                                container.sliderMax,
                                container.sliderTrack,
                                container.textMax,
                                color,
                        );
                });
        });

        // heighto
        slider_heighto_double.on("input", () => {
                speedoGroup.HeightoThresholds.double = processRangeSingle(
                        slider_heighto_double,
                        text_heighto_double,
                        track_heighto_double,
                        speedoGroup.colorDouble,
                );
        });

        slider_heighto_triple.on("input", () => {
                speedoGroup.HeightoThresholds.triple = processRangeSingle(
                        slider_heighto_triple,
                        text_heighto_triple,
                        track_heighto_triple,
                        speedoGroup.colorTriple,
                );
        });

        slider_heighto_maxVel.on("input", () => {
                speedoGroup.HeightoThresholds.maxVel = processRangeSingle(
                        slider_heighto_maxVel,
                        text_heighto_maxVel,
                        track_heighto_maxVel,
                        speedoGroup.colorMaxVel,
                );
        });

        text_heighto_double.on("change", () => {
                slider_heighto_double.val(text_heighto_double.val() as string);
                speedoGroup.HeightoThresholds.double = processRangeSingle(
                        slider_heighto_double,
                        text_heighto_double,
                        track_heighto_double,
                        speedoGroup.colorDouble,
                );
        });

        text_heighto_triple.on("change", () => {
                slider_heighto_triple.val(text_heighto_triple.val() as string);
                speedoGroup.HeightoThresholds.triple = processRangeSingle(
                        slider_heighto_triple,
                        text_heighto_triple,
                        track_heighto_triple,
                        speedoGroup.colorTriple,
                );
        });

        text_heighto_maxVel.on("change", () => {
                slider_heighto_maxVel.val(text_heighto_maxVel.val() as string);
                speedoGroup.HeightoThresholds.maxVel = processRangeSingle(
                        slider_heighto_maxVel,
                        text_heighto_maxVel,
                        track_heighto_maxVel,
                        speedoGroup.colorMaxVel,
                );
        });

        downloadElm.on("click", () => {
                zipSpeedos(speedoGroup);
        });

        uploadJSONElm.on("change", () => {
                speedoGroup.importFromJSON(uploadJSONElm).then(() => {
                        initialize();
                });
        });
}
function initialize() {
        hasReadVDF = false;
        readSpeedoGroupToPage();
        updateSpeedoSize();
        updateSpeedoFont();
        updateSpeedoVisibility();
        updatePositionSize();
        dualRangeContainerElms.each(function (this: HTMLElement) {
                let container = getDualRangeContainer(this);
                let color = getDualRangeColor(container);

                container.range.min = processRangeMin(
                        container.sliderMin,
                        container.sliderMax,
                        container.sliderTrack,
                        container.textMin,
                        color,
                );
                container.range.max = processRangeMax(
                        container.sliderMin,
                        container.sliderMax,
                        container.sliderTrack,
                        container.textMax,
                        color,
                );
        });
        speedoGroup.HeightoThresholds.double = processRangeSingle(
                slider_heighto_double,
                text_heighto_double,
                track_heighto_double,
                speedoGroup.colorDouble,
        );
        speedoGroup.HeightoThresholds.triple = processRangeSingle(
                slider_heighto_triple,
                text_heighto_triple,
                track_heighto_triple,
                speedoGroup.colorTriple,
        );
        speedoGroup.HeightoThresholds.maxVel = processRangeSingle(
                slider_heighto_maxVel,
                text_heighto_maxVel,
                track_heighto_maxVel,
                speedoGroup.colorMaxVel,
        );
        speedoGroup.startPreview();
}

/**
 * Loads values from speedo object into DOM elements.
 */
function readSpeedoGroupToPage(): void {
        slotElms.each((index, slotElm) => {
                slotElm.value = speedoGroup.speedos[index].speedoType;
        });
        speedoFontElm.val(speedoGroup.font);
        speedoSizeElm.val(speedoGroup.getSize());
        shadowsElm.attr("checked", speedoGroup.drawShadows.toString());
        roundingElm.attr("checked", speedoGroup.round.toString());
        colorMainElm.val(speedoGroup.colorMain.getInputColor());
        colorCloseElm.val(speedoGroup.colorClose.getInputColor());
        colorGoodElm.val(speedoGroup.colorGood.getInputColor());
        colorMainHeightoElm.val(speedoGroup.colorHeightoMain.getInputColor());
        colorDoubleElm.val(speedoGroup.colorDouble.getInputColor());
        colorTripleElm.val(speedoGroup.colorTriple.getInputColor());
        colorMaxVelElm.val(speedoGroup.colorMaxVel.getInputColor());

        dualRangeContainerElms.each(function (this: HTMLElement) {
                let container = getDualRangeContainer(this);

                container.sliderMin.val(container.range.min.toString());
                container.sliderMax.val(container.range.max.toString());
        });
        slider_heighto_double.val(speedoGroup.HeightoThresholds.double.toString());
        slider_heighto_triple.val(speedoGroup.HeightoThresholds.triple.toString());
        slider_heighto_maxVel.val(speedoGroup.HeightoThresholds.maxVel.toString());
}

function updateSpeedoSize(): void {
        $(".speedo-container").removeClass((index, className) => {
                return matchClassStartingWith("speedo-size-", className);
        });

        switch (speedoGroup.getSize()) {
                case "SMALL":
                        $(".speedo-container").addClass("speedo-size-small");
                        break;
                case "MEDIUM":
                        $(".speedo-container").addClass("speedo-size-medium");
                        break;
                case "LARGE":
                        $(".speedo-container").addClass("speedo-size-large");
                        break;
                default:
                        break;
        }
}
function updateSpeedoFont(): void {
        speedoGroup.font = speedoFontElm.val() as string;
        speedoGroup.hasCustomFont = speedoGroup.font.includes("custom");

        $(".speedo").removeClass((index, className) => {
                return matchClassStartingWith("font-", className);
        });

        $(".speedo").addClass(`font-${speedoGroup.font.toString()}`);
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

/**
 * Reads dimensions of markerBounds element and calls `updateMarkerSize()`.
 */
function updatePositionSize(): void {
        markerBoundsWidth = markerBoundsElm.getBoundingClientRect().width;
        markerBoundsHeight = markerBoundsElm.getBoundingClientRect().height;
        updateMarkerSize();
}

/**
 * Sets dimensions of marker element, updates markerBounds, and clamps slider values to new bounds.
 */
function updateMarkerSize(): void {
        // scale marker element to match size of markerbounds
        let newWidth = Number(speedoGroup.vdfElm.wide) * (markerBoundsWidth / TF_SCREEN_WIDTH_CURRENT);
        let newHeight = Number(speedoGroup.vdfElm.tall) * (markerBoundsHeight / TF_SCREEN_HEIGHT);
        markerElm.css("width", `${newWidth}px`);
        markerElm.css("height", `${newHeight}px`);
        markerSize = {
                width: parseFloat(markerElm.css("width")),
                height: parseFloat(markerElm.css("height")),
        };
        markerBounds = {
                width: markerBoundsWidth - markerSize.width,
                height: markerBoundsHeight - markerSize.height,
        };

        // clamp slider values
        let xValue = xSliderElm.val();
        let yValue = ySliderElm.val();
        let xMax = TF_SCREEN_WIDTH_CURRENT - Number(speedoGroup.vdfElm.wide);
        let yMax = TF_SCREEN_HEIGHT - Number(speedoGroup.vdfElm.tall);
        xValue = Math.max(0, Math.min(Number(xValue), xMax)).toString();
        yValue = Math.max(0, Math.min(Number(yValue), yMax)).toString();
        xSliderElm.attr("max", xMax.toString());
        ySliderElm.attr("max", yMax.toString());
        xSliderElm.val(xValue);
        ySliderElm.val(yValue);

        // run only on first load
        if (!hasReadVDF) {
                readXPos();
                readYPos();
                hasReadVDF = true;
        }
        if (speedoGroup.vdfElm.xpos === "rs1") {
                xSliderElm.val(xSliderElm.attr("max") as string);
        }

        updatePosition_x();
        updatePosition_y();
}

/**
 * Positions marker element to match slider value and updates vdf xpos.
 */
function updatePosition_x(): void {
        // update marker horizontal position
        let markerLeft = Number(xSliderElm.val()) * (markerBounds.width / Number(xSliderElm.attr("max")));
        markerElm.css("left", `${markerLeft}px`);

        // calculate vdf xpos
        let center: number = Number(xSliderElm.attr("max")) / 2;
        let xValue: number = Number(xSliderElm.val());
        let xOffset: number = Math.round(xValue - center);

        let newXPos: string = "cs-0.5";
        if (xValue === 0) {
                newXPos = "0";
        } else if (xValue === Number(xSliderElm.attr("max"))) {
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
        let markerTop = Number(ySliderElm.val()) * (markerBounds.height / Number(ySliderElm.attr("max")));
        markerElm.css("top", `${markerTop}px`);

        // calculate vdf ypos
        let center: number = Number(ySliderElm.attr("max")) / 2;
        let yValue: number = Number(ySliderElm.val());
        let yOffset: number = Math.round(yValue - center);

        let newYPos: string = "cs-0.5";
        if (yValue === 0) {
                newYPos = "0";
        } else if (yValue === Number(ySliderElm.attr("max"))) {
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
        let center: number = Number(xSliderElm.attr("max")) / 2;

        switch (true) {
                case value.includes("cs-0.5"):
                        value = value.replace("cs-0.5", "");
                        value = (Number(value) + center).toString();
                        xSliderElm.val(value);
                        return;
                case value.includes("rs1"):
                        value = xSliderElm.attr("max") as string;
                        xSliderElm.val(value);
                        return;
                default:
                        break;
        }
        value = center.toString();
        xSliderElm.val(value);
}

/**
 * Reads vdf ypos into ySlider value.
 */
function readYPos() {
        let value: string = speedoGroup.vdfElm.ypos;
        let center: number = Number(ySliderElm.attr("max")) / 2;

        switch (true) {
                case value.includes("cs-0.5"):
                        value = value.replace("cs-0.5", "");
                        value = (Number(value) + center).toString();
                        ySliderElm.val(value);
                        return;
                case value.includes("rs1"):
                        value = ySliderElm.attr("max") as string;
                        ySliderElm.val(value);
                        return;
                default:
                        break;
        }
        value = center.toString();
        ySliderElm.val(value);
}

/**
 * Reads uploaded image and changes image on page to it.
 *
 * @param input `input[type="file"]` element to upload image
 * @param output `img` element to update with uploaded image
 */
function changeImage(input: JQuery<HTMLInputElement>, output: JQuery<HTMLImageElement>) {
        let reader: FileReader;

        if (input[0].files && input[0].files[0]) {
                reader = new FileReader();
                reader.readAsDataURL(input[0].files[0]);
                reader.onload = () => {
                        output.attr("src", reader.result as string);
                };
        }
}

function processRangeMin(
        sliderMin: JQuery<HTMLInputElement>,
        sliderMax: JQuery<HTMLInputElement>,
        sliderTrack: JQuery<HTMLElement>,
        textMin: JQuery<HTMLInputElement>,
        color: Color,
): number {
        processSliderMin(sliderMin, sliderMax, textMin);
        fillDualSlider(color, sliderTrack, sliderMin, sliderMax);
        return parseInt(sliderMin.val() as string);
}

function processRangeMax(
        sliderMin: JQuery<HTMLInputElement>,
        sliderMax: JQuery<HTMLInputElement>,
        sliderTrack: JQuery<HTMLElement>,
        textMax: JQuery<HTMLInputElement>,
        color: Color,
): number {
        processSliderMax(sliderMin, sliderMax, textMax);
        fillDualSlider(color, sliderTrack, sliderMin, sliderMax);
        return parseInt(sliderMax.val() as string);
}

function processRangeSingle(
        slider: JQuery<HTMLInputElement>,
        text: JQuery<HTMLInputElement>,
        sliderTrack: JQuery<HTMLElement>,
        color: Color,
): number {
        text.val(slider.val() as string);
        fillSingleSlider(color, sliderTrack, slider);
        return parseInt(slider.val() as string);
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
function processSliderMin(
        sliderMin: JQuery<HTMLElement>,
        sliderMax: JQuery<HTMLElement>,
        textMin?: JQuery<HTMLElement>,
) {
        if (Number(sliderMin.val()) >= Number(sliderMax.val())) {
                sliderMin.val((Number(sliderMax.val()) - rangeGap).toString());
        }
        if (textMin) {
                textMin.val(sliderMin.val() as string);
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
function processSliderMax(
        sliderMin: JQuery<HTMLElement>,
        sliderMax: JQuery<HTMLElement>,
        textMax?: JQuery<HTMLElement>,
) {
        if (Number(sliderMax.val()) <= Number(sliderMin.val())) {
                sliderMax.val((Number(sliderMin.val()) + rangeGap).toString());
        }
        if (textMax) {
                textMax.val(sliderMax.val() as string);
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
function fillDualSlider(
        colorFocus: Color,
        sliderTrack: JQuery<HTMLElement>,
        sliderMin: JQuery<HTMLElement>,
        sliderMax: JQuery<HTMLElement>,
) {
        let colorMainCSS = speedoGroup.colorMain.getCSSColor();
        let colorFocusCSS = colorFocus.getCSSColor();
        let percent1: string = (
                (parseInt(sliderMin.val() as string) / parseInt(sliderMin.attr("max") as string)) *
                100
        ).toString();
        let percent2: string = (
                (parseInt(sliderMax.val() as string) / parseInt(sliderMax.attr("max") as string)) *
                100
        ).toString();
        sliderTrack.css(
                "background",
                `linear-gradient( to right, ` +
                        `${colorMainCSS}, ` +
                        `${colorMainCSS} ${percent1}%, ` +
                        `${colorFocusCSS} ${percent1}%, ` +
                        `${colorFocusCSS} ${percent2}%, ` +
                        `${colorMainCSS} ${percent2}% )`,
        );
}

/**
 * Fills the color above slider value.
 *
 * @param colorFocus Color to fill above slider value.
 * @param sliderTrack Div element to recolor.
 * @param slider
 */
function fillSingleSlider(color: Color, sliderTrack: JQuery<HTMLElement>, slider: JQuery<HTMLElement>) {
        let colorNull = speedoGroup.colorHeightoMain.getCSSColor();
        let colorFocus = color.getCSSColor();
        let percent: string = (
                (parseInt(slider.val() as string) / parseInt(slider.attr("max") as string)) *
                100
        ).toString();
        sliderTrack.css(
                "background",
                `linear-gradient( to right, ` +
                        `${colorNull}, ` +
                        `${colorNull} ${percent}%, ` +
                        `${colorFocus} ${percent}%)`,
        );
}

/**
 * Relevant data from within a dual range-container div
 */
type DualRangeContainer = {
        sliderMin: JQuery<HTMLInputElement>;
        sliderMax: JQuery<HTMLInputElement>;
        textMin: JQuery<HTMLInputElement>;
        textMax: JQuery<HTMLInputElement>;
        sliderTrack: JQuery<HTMLElement>;
        isClose: boolean;
        isGood: boolean;
        range: Range;
};

/**
 * Gets relevant data from within a dual range-container div
 * @param container HTMLElement of a div with `.range-container.dual`
 * @returns Relevant data from within a dual range-container div
 */
function getDualRangeContainer(container: HTMLElement): DualRangeContainer {
        let containerDetails: DualRangeContainer = {
                sliderMin: $(container).find(".range-slider.min").filter("input") as JQuery<HTMLInputElement>,
                sliderMax: $(container).find(".range-slider.max").filter("input") as JQuery<HTMLInputElement>,
                textMin: $(container).find(".range-text.min").filter("input") as JQuery<HTMLInputElement>,
                textMax: $(container).find(".range-text.max").filter("input") as JQuery<HTMLInputElement>,
                sliderTrack: $(container).find(".slider-track"),
                isClose: $(container).hasClass("close"),
                isGood: $(container).hasClass("good"),
                range: { min: 0, max: 0 },
        };

        if ($(container).hasClass("hspeedo")) {
                containerDetails.range = containerDetails.isClose
                        ? speedoGroup.HSpeedoCloseRange
                        : containerDetails.isGood
                          ? speedoGroup.HSpeedoGoodRange
                          : { min: 0, max: 0 };
        } else if ($(container).hasClass("vspeedo")) {
                containerDetails.range = containerDetails.isClose
                        ? speedoGroup.VSpeedoCloseRange
                        : containerDetails.isGood
                          ? speedoGroup.VSpeedoGoodRange
                          : { min: 0, max: 0 };
        } else if ($(container).hasClass("aspeedo")) {
                containerDetails.range = containerDetails.isClose
                        ? speedoGroup.ASpeedoCloseRange
                        : containerDetails.isGood
                          ? speedoGroup.ASpeedoGoodRange
                          : { min: 0, max: 0 };
        }

        return containerDetails;
}

/**
 * Gets the focus color for the sliderTrack inside of a dual range-container div
 * @param container
 * @returns focus color for the sliderTrack
 */
function getDualRangeColor(container: DualRangeContainer): Color {
        return container.isClose
                ? speedoGroup.colorClose
                : container.isGood
                  ? speedoGroup.colorGood
                  : new Color(0, 0, 0);
}

////////////////////////

const uploadFontBtn = $("input#upload-font") as JQuery<HTMLInputElement>;
let customFontCounter = 1;
uploadFontBtn.on("change", () => {
        uploadFont(uploadFontBtn);
});
function uploadFont(input: JQuery<HTMLInputElement>) {
        let reader: FileReader;

        if (input[0].files && input[0].files[0]) {
                reader = new FileReader();
                reader.readAsDataURL(input[0].files[0]);
                reader.onload = () => {
                        if (reader.result) {
                                loadFont(reader.result as string);
                        }
                };
        }
}

function loadFont(fontdata: string) {
        const fontName = `custom${customFontCounter++}`;
        const font = new FontFace(fontName, `url(${fontdata})`);
        document.fonts.add(font);
        font.load().then(() => {
                const css = `.font-${fontName}{font-family: ${fontName}}`;
                const style = document.createElement("style");
                style.innerText = css;
                style.setAttribute("id", "fontName");
                $("body").append(style);

                addFontPreview(font);
        });
}

function addFontPreview(font: FontFace) {
        const option = document.createElement("option");
        option.value = font.family;
        option.innerText = font.family;
        speedoFontElm.append(option);
        speedoFontElm.val(font.family);
        updateSpeedoFont();
}
