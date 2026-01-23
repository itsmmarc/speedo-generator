import { SpeedoType } from "../speedo.js";
import { presetDemo, presetSoldier, SpeedoSize, Font } from "../speedo-group.js";
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

const presetDemoElm = $("#preset-demo").filter("button");
const presetSoldierElm = $("#preset-soldier").filter("button");

const aspectRatio4x3Elm = $("#4x3").filter("button");
const aspectRatio16x9Elm = $("#16x9").filter("button");

const downloadElm = $("#download-btn").filter("button");
const uploadElm = $("#upload-btn").filter("input") as JQuery<HTMLInputElement>;

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
let imageUploadElm = $("#imageupload").filter("input") as JQuery<HTMLInputElement>;
let positionPreviewImgElm = $("#position_preview_img").filter("img") as JQuery<HTMLImageElement>;

const colorMainElm = $("#colorMain");
const colorCloseElm = $("#colorClose");
const colorGoodElm = $("#colorGood");

const colorMainHeightoElm = $("#colorMain_Heighto");
const colorDoubleElm = $("#colorDouble");
const colorTripleElm = $("#colorTriple");
const colorMaxVelElm = $("#colorMaxVel");

const rangeGap: number = 0;

const slider_hspeedo_close_min = $("#slider-hspeedo-close-min").filter("input") as JQuery<HTMLInputElement>;
const slider_hspeedo_close_max = $("#slider-hspeedo-close-max").filter("input") as JQuery<HTMLInputElement>;
const text_hspeedo_close_min = $("#text-hspeedo-close-min").filter("input") as JQuery<HTMLInputElement>;
const text_hspeedo_close_max = $("#text-hspeedo-close-max").filter("input") as JQuery<HTMLInputElement>;
const track_hspeedo_close = $("#track-hspeedo-close");

const slider_hspeedo_good_min = $("#slider-hspeedo-good-min").filter("input") as JQuery<HTMLInputElement>;
const slider_hspeedo_good_max = $("#slider-hspeedo-good-max").filter("input") as JQuery<HTMLInputElement>;
const text_hspeedo_good_min = $("#text-hspeedo-good-min").filter("input") as JQuery<HTMLInputElement>;
const text_hspeedo_good_max = $("#text-hspeedo-good-max").filter("input") as JQuery<HTMLInputElement>;
const track_hspeedo_good = $("#track-hspeedo-good");

const slider_vspeedo_close_min = $("#slider-vspeedo-close-min").filter("input") as JQuery<HTMLInputElement>;
const slider_vspeedo_close_max = $("#slider-vspeedo-close-max").filter("input") as JQuery<HTMLInputElement>;
const text_vspeedo_close_min = $("#text-vspeedo-close-min").filter("input") as JQuery<HTMLInputElement>;
const text_vspeedo_close_max = $("#text-vspeedo-close-max").filter("input") as JQuery<HTMLInputElement>;
const track_vspeedo_close = $("#track-vspeedo-close");

const slider_vspeedo_good_min = $("#slider-vspeedo-good-min").filter("input") as JQuery<HTMLInputElement>;
const slider_vspeedo_good_max = $("#slider-vspeedo-good-max").filter("input") as JQuery<HTMLInputElement>;
const text_vspeedo_good_min = $("#text-vspeedo-good-min").filter("input") as JQuery<HTMLInputElement>;
const text_vspeedo_good_max = $("#text-vspeedo-good-max").filter("input") as JQuery<HTMLInputElement>;
const track_vspeedo_good = $("#track-vspeedo-good");

const slider_aspeedo_close_min = $("#slider-aspeedo-close-min").filter("input") as JQuery<HTMLInputElement>;
const slider_aspeedo_close_max = $("#slider-aspeedo-close-max").filter("input") as JQuery<HTMLInputElement>;
const text_aspeedo_close_min = $("#text-aspeedo-close-min").filter("input") as JQuery<HTMLInputElement>;
const text_aspeedo_close_max = $("#text-aspeedo-close-max").filter("input") as JQuery<HTMLInputElement>;
const track_aspeedo_close = $("#track-aspeedo-close");

const slider_aspeedo_good_min = $("#slider-aspeedo-good-min").filter("input") as JQuery<HTMLInputElement>;
const slider_aspeedo_good_max = $("#slider-aspeedo-good-max").filter("input") as JQuery<HTMLInputElement>;
const text_aspeedo_good_min = $("#text-aspeedo-good-min").filter("input") as JQuery<HTMLInputElement>;
const text_aspeedo_good_max = $("#text-aspeedo-good-max").filter("input") as JQuery<HTMLInputElement>;
const track_aspeedo_good = $("#track-aspeedo-good");

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
        speedoGroup.startPreview();
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
        presetDemoElm.on("click", () => {
                speedoGroup = _.cloneDeep(presetDemo);
                initialize();
        });

        presetSoldierElm.on("click", () => {
                speedoGroup = _.cloneDeep(presetSoldier);
                initialize();
        });

        slotElms.each((index, slotElm) => {
                slotElm.addEventListener("change", () => {
                        speedoGroup.speedos[index].speedoType = slotElm.value as SpeedoType;
                        updateSpeedoStyles();
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

        imageUploadElm.on("change", () => {
                changeImage(imageUploadElm, positionPreviewImgElm);
        });

        speedoFontElm.on("change", () => {
                speedoGroup.font = speedoFontElm.val() as Font;
                updateSpeedoStyles();
        });

        speedoSizeElm.on("change", () => {
                speedoGroup.setSize(speedoSizeElm.val() as SpeedoSize);
                updateMarkerSize();
                updateSpeedoStyles();
        });

        shadowsElm.on("change", () => {
                speedoGroup.drawShadows = shadowsElm.prop("checked");
                updateSpeedoStyles();
        });

        roundingElm.on("change", () => {
                speedoGroup.round = roundingElm.prop("checked");
        });

        // COLORS
        colorMainElm.on("input", () => {
                speedoGroup.colorMain = Color.input_to_color(colorMainElm.val() as string);
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
        colorCloseElm.on("input", () => {
                speedoGroup.colorClose = Color.input_to_color(colorCloseElm.val() as string);
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
        colorGoodElm.on("input", () => {
                speedoGroup.colorGood = Color.input_to_color(colorGoodElm.val() as string);
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

        colorMainHeightoElm.on("input", () => {
                speedoGroup.colorHeightoMain = Color.input_to_color(colorMainHeightoElm.val() as string);
                slider_fill_color(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
                slider_fill_color(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
                slider_fill_color(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
        });
        colorDoubleElm.on("input", () => {
                speedoGroup.colorDouble = Color.input_to_color(colorDoubleElm.val() as string);
                slider_fill_color(speedoGroup.colorDouble, track_heighto_double, slider_heighto_double);
        });
        colorTripleElm.on("input", () => {
                speedoGroup.colorTriple = Color.input_to_color(colorTripleElm.val() as string);
                slider_fill_color(speedoGroup.colorTriple, track_heighto_triple, slider_heighto_triple);
        });
        colorMaxVelElm.on("input", () => {
                speedoGroup.colorMaxVel = Color.input_to_color(colorMaxVelElm.val() as string);
                slider_fill_color(speedoGroup.colorMaxVel, track_heighto_maxVel, slider_heighto_maxVel);
        });

        // COLOR RANGES
        // hspeedo
        slider_hspeedo_close_min.on("input", () => {
                speedoGroup.HSpeedoRange.closeMin = processRangeMin(
                        slider_hspeedo_close_min,
                        slider_hspeedo_close_max,
                        track_hspeedo_close,
                        text_hspeedo_close_min,
                        speedoGroup.colorClose,
                );
        });

        slider_hspeedo_close_max.on("input", () => {
                speedoGroup.HSpeedoRange.closeMax = processRangeMax(
                        slider_hspeedo_close_min,
                        slider_hspeedo_close_max,
                        track_hspeedo_close,
                        text_hspeedo_close_max,
                        speedoGroup.colorClose,
                );
        });

        slider_hspeedo_good_min.on("input", () => {
                speedoGroup.HSpeedoRange.goodMin = processRangeMin(
                        slider_hspeedo_good_min,
                        slider_hspeedo_good_max,
                        track_hspeedo_good,
                        text_hspeedo_good_min,
                        speedoGroup.colorGood,
                );
        });

        slider_hspeedo_good_max.on("input", () => {
                speedoGroup.HSpeedoRange.goodMax = processRangeMax(
                        slider_hspeedo_good_min,
                        slider_hspeedo_good_max,
                        track_hspeedo_good,
                        text_hspeedo_good_max,
                        speedoGroup.colorGood,
                );
        });

        text_hspeedo_close_min.on("change", () => {
                slider_hspeedo_close_min.val(text_hspeedo_close_min.val() as string);
                speedoGroup.HSpeedoRange.closeMin = processRangeMin(
                        slider_hspeedo_close_min,
                        slider_hspeedo_close_max,
                        track_hspeedo_close,
                        text_hspeedo_close_min,
                        speedoGroup.colorClose,
                );
        });

        text_hspeedo_close_max.on("change", () => {
                slider_hspeedo_close_max.val(text_hspeedo_close_max.val() as string);
                speedoGroup.HSpeedoRange.closeMax = processRangeMax(
                        slider_hspeedo_close_min,
                        slider_hspeedo_close_max,
                        track_hspeedo_close,
                        text_hspeedo_close_max,
                        speedoGroup.colorClose,
                );
        });

        text_hspeedo_good_min.on("change", () => {
                slider_hspeedo_good_min.val(text_hspeedo_good_min.val() as string);
                speedoGroup.HSpeedoRange.goodMin = processRangeMin(
                        slider_hspeedo_good_min,
                        slider_hspeedo_good_max,
                        track_hspeedo_good,
                        text_hspeedo_good_min,
                        speedoGroup.colorGood,
                );
        });

        text_hspeedo_good_max.on("change", () => {
                slider_hspeedo_good_max.val(text_hspeedo_good_max.val() as string);
                speedoGroup.HSpeedoRange.goodMax = processRangeMax(
                        slider_hspeedo_good_min,
                        slider_hspeedo_good_max,
                        track_hspeedo_good,
                        text_hspeedo_good_max,
                        speedoGroup.colorGood,
                );
        });

        // vspeedo
        slider_vspeedo_close_min.on("input", () => {
                speedoGroup.VSpeedoRange.closeMin = processRangeMin(
                        slider_vspeedo_close_min,
                        slider_vspeedo_close_max,
                        track_vspeedo_close,
                        text_vspeedo_close_min,
                        speedoGroup.colorClose,
                );
        });

        slider_vspeedo_close_max.on("input", () => {
                speedoGroup.VSpeedoRange.closeMax = processRangeMax(
                        slider_vspeedo_close_min,
                        slider_vspeedo_close_max,
                        track_vspeedo_close,
                        text_vspeedo_close_max,
                        speedoGroup.colorClose,
                );
        });

        slider_vspeedo_good_min.on("input", () => {
                speedoGroup.VSpeedoRange.goodMin = processRangeMin(
                        slider_vspeedo_good_min,
                        slider_vspeedo_good_max,
                        track_vspeedo_good,
                        text_vspeedo_good_min,
                        speedoGroup.colorGood,
                );
        });

        slider_vspeedo_good_max.on("input", () => {
                speedoGroup.VSpeedoRange.goodMax = processRangeMax(
                        slider_vspeedo_good_min,
                        slider_vspeedo_good_max,
                        track_vspeedo_good,
                        text_vspeedo_good_max,
                        speedoGroup.colorGood,
                );
        });

        text_vspeedo_close_min.on("change", () => {
                slider_vspeedo_close_min.val(text_vspeedo_close_min.val() as string);
                speedoGroup.VSpeedoRange.closeMin = processRangeMin(
                        slider_vspeedo_close_min,
                        slider_vspeedo_close_max,
                        track_vspeedo_close,
                        text_vspeedo_close_min,
                        speedoGroup.colorClose,
                );
        });

        text_vspeedo_close_max.on("change", () => {
                slider_vspeedo_close_max.val(text_vspeedo_close_max.val() as string);
                speedoGroup.VSpeedoRange.closeMax = processRangeMax(
                        slider_vspeedo_close_min,
                        slider_vspeedo_close_max,
                        track_vspeedo_close,
                        text_vspeedo_close_max,
                        speedoGroup.colorClose,
                );
        });

        text_vspeedo_good_min.on("change", () => {
                slider_vspeedo_good_min.val(text_vspeedo_good_min.val() as string);
                speedoGroup.VSpeedoRange.goodMin = processRangeMin(
                        slider_vspeedo_good_min,
                        slider_vspeedo_good_max,
                        track_vspeedo_good,
                        text_vspeedo_good_min,
                        speedoGroup.colorGood,
                );
        });

        text_vspeedo_good_max.on("change", () => {
                slider_vspeedo_good_max.val(text_vspeedo_good_max.val() as string);
                speedoGroup.VSpeedoRange.goodMax = processRangeMax(
                        slider_vspeedo_good_min,
                        slider_vspeedo_good_max,
                        track_vspeedo_good,
                        text_vspeedo_good_max,
                        speedoGroup.colorGood,
                );
        });

        // aspeedo
        slider_aspeedo_close_min.on("input", () => {
                speedoGroup.ASpeedoRange.closeMin = processRangeMin(
                        slider_aspeedo_close_min,
                        slider_aspeedo_close_max,
                        track_aspeedo_close,
                        text_aspeedo_close_min,
                        speedoGroup.colorClose,
                );
        });

        slider_aspeedo_close_max.on("input", () => {
                speedoGroup.ASpeedoRange.closeMax = processRangeMax(
                        slider_aspeedo_close_min,
                        slider_aspeedo_close_max,
                        track_aspeedo_close,
                        text_aspeedo_close_max,
                        speedoGroup.colorClose,
                );
        });

        slider_aspeedo_good_min.on("input", () => {
                speedoGroup.ASpeedoRange.goodMin = processRangeMin(
                        slider_aspeedo_good_min,
                        slider_aspeedo_good_max,
                        track_aspeedo_good,
                        text_aspeedo_good_min,
                        speedoGroup.colorGood,
                );
        });

        slider_aspeedo_good_max.on("input", () => {
                speedoGroup.ASpeedoRange.goodMax = processRangeMax(
                        slider_aspeedo_good_min,
                        slider_aspeedo_good_max,
                        track_aspeedo_good,
                        text_aspeedo_good_max,
                        speedoGroup.colorGood,
                );
        });

        text_aspeedo_close_min.on("change", () => {
                slider_aspeedo_close_min.val(text_aspeedo_close_min.val() as string);
                speedoGroup.ASpeedoRange.closeMin = processRangeMin(
                        slider_aspeedo_close_min,
                        slider_aspeedo_close_max,
                        track_aspeedo_close,
                        text_aspeedo_close_min,
                        speedoGroup.colorClose,
                );
        });

        text_aspeedo_close_max.on("change", () => {
                slider_aspeedo_close_max.val(text_aspeedo_close_max.val() as string);
                speedoGroup.ASpeedoRange.closeMax = processRangeMax(
                        slider_aspeedo_close_min,
                        slider_aspeedo_close_max,
                        track_aspeedo_close,
                        text_aspeedo_close_max,
                        speedoGroup.colorClose,
                );
        });

        text_aspeedo_good_min.on("change", () => {
                slider_aspeedo_good_min.val(text_aspeedo_good_min.val() as string);
                speedoGroup.ASpeedoRange.goodMin = processRangeMin(
                        slider_aspeedo_good_min,
                        slider_aspeedo_good_max,
                        track_aspeedo_good,
                        text_aspeedo_good_min,
                        speedoGroup.colorGood,
                );
        });

        text_aspeedo_good_max.on("change", () => {
                slider_aspeedo_good_max.val(text_aspeedo_good_max.val() as string);
                speedoGroup.ASpeedoRange.goodMax = processRangeMax(
                        slider_aspeedo_good_min,
                        slider_aspeedo_good_max,
                        track_aspeedo_good,
                        text_aspeedo_good_max,
                        speedoGroup.colorGood,
                );
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

        uploadElm.on("change", () => {
                speedoGroup.importFromJSON(uploadElm).then(() => {
                        initialize();
                });
        });
}
function initialize() {
        hasReadVDF = false;
        updateSpeedoStyles();
        readSpeedoGroupToPage();
        updatePositionSize();
        speedoGroup.HSpeedoRange.closeMin = processRangeMin(
                slider_hspeedo_close_min,
                slider_hspeedo_close_max,
                track_hspeedo_close,
                text_hspeedo_close_min,
                speedoGroup.colorClose,
        );
        speedoGroup.HSpeedoRange.closeMax = processRangeMax(
                slider_hspeedo_close_min,
                slider_hspeedo_close_max,
                track_hspeedo_close,
                text_hspeedo_close_max,
                speedoGroup.colorClose,
        );
        speedoGroup.HSpeedoRange.goodMin = processRangeMin(
                slider_hspeedo_good_min,
                slider_hspeedo_good_max,
                track_hspeedo_good,
                text_hspeedo_good_min,
                speedoGroup.colorGood,
        );
        speedoGroup.HSpeedoRange.goodMax = processRangeMax(
                slider_hspeedo_good_min,
                slider_hspeedo_good_max,
                track_hspeedo_good,
                text_hspeedo_good_max,
                speedoGroup.colorGood,
        );
        speedoGroup.VSpeedoRange.closeMin = processRangeMin(
                slider_vspeedo_close_min,
                slider_vspeedo_close_max,
                track_vspeedo_close,
                text_vspeedo_close_min,
                speedoGroup.colorClose,
        );
        speedoGroup.VSpeedoRange.closeMax = processRangeMax(
                slider_vspeedo_close_min,
                slider_vspeedo_close_max,
                track_vspeedo_close,
                text_vspeedo_close_max,
                speedoGroup.colorClose,
        );
        speedoGroup.VSpeedoRange.goodMin = processRangeMin(
                slider_vspeedo_good_min,
                slider_vspeedo_good_max,
                track_vspeedo_good,
                text_vspeedo_good_min,
                speedoGroup.colorGood,
        );
        speedoGroup.VSpeedoRange.goodMax = processRangeMax(
                slider_vspeedo_good_min,
                slider_vspeedo_good_max,
                track_vspeedo_good,
                text_vspeedo_good_max,
                speedoGroup.colorGood,
        );
        speedoGroup.ASpeedoRange.closeMin = processRangeMin(
                slider_aspeedo_close_min,
                slider_aspeedo_close_max,
                track_aspeedo_close,
                text_aspeedo_close_min,
                speedoGroup.colorClose,
        );
        speedoGroup.ASpeedoRange.closeMax = processRangeMax(
                slider_aspeedo_close_min,
                slider_aspeedo_close_max,
                track_aspeedo_close,
                text_aspeedo_close_max,
                speedoGroup.colorClose,
        );
        speedoGroup.ASpeedoRange.goodMin = processRangeMin(
                slider_aspeedo_good_min,
                slider_aspeedo_good_max,
                track_aspeedo_good,
                text_aspeedo_good_min,
                speedoGroup.colorGood,
        );
        speedoGroup.ASpeedoRange.goodMax = processRangeMax(
                slider_aspeedo_good_min,
                slider_aspeedo_good_max,
                track_aspeedo_good,
                text_aspeedo_good_max,
                speedoGroup.colorGood,
        );
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
        slider_hspeedo_close_min.val(speedoGroup.HSpeedoRange.closeMin.toString());
        slider_hspeedo_close_max.val(speedoGroup.HSpeedoRange.closeMax.toString());
        slider_hspeedo_good_min.val(speedoGroup.HSpeedoRange.goodMin.toString());
        slider_hspeedo_good_max.val(speedoGroup.HSpeedoRange.goodMax.toString());
        slider_vspeedo_close_min.val(speedoGroup.VSpeedoRange.closeMin.toString());
        slider_vspeedo_close_max.val(speedoGroup.VSpeedoRange.closeMax.toString());
        slider_vspeedo_good_min.val(speedoGroup.VSpeedoRange.goodMin.toString());
        slider_vspeedo_good_max.val(speedoGroup.VSpeedoRange.goodMax.toString());
        slider_aspeedo_close_min.val(speedoGroup.ASpeedoRange.closeMin.toString());
        slider_aspeedo_close_max.val(speedoGroup.ASpeedoRange.closeMax.toString());
        slider_aspeedo_good_min.val(speedoGroup.ASpeedoRange.goodMin.toString());
        slider_aspeedo_good_max.val(speedoGroup.ASpeedoRange.goodMax.toString());
        slider_heighto_double.val(speedoGroup.HeightoThresholds.double.toString());
        slider_heighto_triple.val(speedoGroup.HeightoThresholds.triple.toString());
        slider_heighto_maxVel.val(speedoGroup.HeightoThresholds.maxVel.toString());
}

/**
 * Checks for style changes of the speedo object and updates the document speedo elements to match.
 */
function updateSpeedoStyles(): void {
        updateSpeedoSize();
        updateSpeedoFont();
        updateSpeedoVisibility();
}

function updateSpeedoSize(): void {
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
function updateSpeedoFont(): void {
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
                        console.log(`error in speedo object font, ${speedoGroup.font} is not a valid font`);
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
        markerElm.css(
                "left",
                (Number(xSliderElm.val()) * (markerBounds.width / Number(xSliderElm.attr("max")))).toString(),
        );

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
        markerElm.css(
                "top",
                (Number(ySliderElm.val()) * (markerBounds.height / Number(ySliderElm.attr("max")))).toString(),
        );

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
        minSlider: JQuery<HTMLInputElement>,
        maxSlider: JQuery<HTMLInputElement>,
        sliderTrack: JQuery<HTMLElement>,
        minText: JQuery<HTMLInputElement>,
        color: Color,
): number {
        process_slider_min(minSlider, maxSlider, minText);
        slider_dual_fill_color(color, sliderTrack, minSlider, maxSlider);
        return parseInt(minSlider.val() as string);
}

function processRangeMax(
        minSlider: JQuery<HTMLInputElement>,
        maxSlider: JQuery<HTMLInputElement>,
        sliderTrack: JQuery<HTMLElement>,
        maxText: JQuery<HTMLInputElement>,
        color: Color,
): number {
        process_slider_max(minSlider, maxSlider, maxText);
        slider_dual_fill_color(color, sliderTrack, minSlider, maxSlider);
        return parseInt(maxSlider.val() as string);
}

function processRangeSingle(
        slider: JQuery<HTMLInputElement>,
        text: JQuery<HTMLInputElement>,
        sliderTrack: JQuery<HTMLElement>,
        color: Color,
): number {
        text.val(slider.val() as string);
        slider_fill_color(color, sliderTrack, slider);
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
function process_slider_min(
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
function process_slider_max(
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
function slider_dual_fill_color(
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
                        `${colorMainCSS}, ${percent1}%, ` +
                        `${colorFocusCSS}, ${percent1}%, ` +
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
function slider_fill_color(color: Color, sliderTrack: JQuery<HTMLElement>, slider: JQuery<HTMLElement>) {
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
