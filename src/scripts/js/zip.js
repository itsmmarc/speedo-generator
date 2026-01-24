import JSZip from "jszip";
import { saveAs } from "file-saver";
import { unzip } from "unzipit";
import { VFormats, VFrameCollection, VImageData, Vtf } from "vtf-js";
export async function zipSpeedos(speedoGroup) {
    const downloadZipName = `generated-speedo-id`; // %PLACEHOLDER%
    const hudResourcesName = "speedo-generator-hud-0.1.6.zip";
    const hudResourcesUrl = `http://localhost:5173/files/${hudResourcesName}`; // %PLACEHOLDER%
    const speedoMaterialsPath = "YOURHUD/materials/vgui/replay/thumbnails/speedo/";
    const speedoResourcePath = "YOURHUD/speedo/";
    importZip(hudResourcesUrl).then((zip) => {
        zip.file("README.md", createReadme());
        zip.file(`${speedoMaterialsPath}speedo_config.vmt`, generateSpeedoConfigVmt(speedoGroup));
        zip.file(`${speedoResourcePath}speedo_config.res`, generateSpeedoConfigRes(speedoGroup));
        zip.file("YOURHUD/speedo_config.json", generateSpeedoConfigJSON(speedoGroup));
        if (!speedoGroup.hasCustomFont) {
            downloadZip(zip, downloadZipName);
            return;
        }
        const fontPath = `${speedoMaterialsPath}fonts/${speedoGroup.font}/`;
        const vtfPath = `${fontPath}${speedoGroup.font}/digits.vtf`;
        const vmtPath = `${fontPath}${speedoGroup.font}/digits.vmt`;
        const vtfHeight = 64;
        const vtfWidth = vtfHeight * 4;
        generateSpeedoFrames(speedoGroup, vtfWidth, vtfHeight).then((frames) => {
            generateVTF(frames, vtfWidth, vtfHeight).then((vtf) => {
                zip.file(vtfPath, vtf);
                zip.file(vmtPath, generateFontVmt(speedoGroup));
                downloadZip(zip, downloadZipName);
                return;
            });
        });
    });
}
async function importZip(url) {
    const { entries } = await unzip(url);
    const names = Object.keys(entries);
    const blobs = await Promise.all(Object.values(entries).map((e) => e.blob()));
    const arraySize = names.length;
    for (let i = 0; i < arraySize; i++) {
        let s = names[i].split("/");
        s[0] = "YOURHUD";
        names[i] = s.join("/");
    }
    // names and blobs are now parallel arrays so do whatever you want.
    const blobsByName = Object.fromEntries(names.map((name, i) => [name, blobs[i]]));
    let zip = new JSZip();
    for (let i = 0; i < arraySize; i++) {
        zip.file(names[i], blobsByName[names[i]]);
    }
    return zip;
}
function generateSpeedoConfigVmt(speedoGroup) {
    return (`#base fonts/${speedoGroup.font}/digits.vmt` +
        `\n"UnlitGeneric"\n` +
        `{\n` +
        `\t$round\t${speedoGroup.round ? 1 : 0}\n` +
        `\t$framerate\t${speedoGroup.framerate}\n` +
        `\t$colorMain\t ${speedoGroup.colorMain.getVMTColor()}\n` +
        `\t$colorClose\t ${speedoGroup.colorClose.getVMTColor()}\n` +
        `\t$colorGood\t ${speedoGroup.colorGood.getVMTColor()}\n` +
        `\t$colorMainH\t ${speedoGroup.colorHeightoMain.getVMTColor()}\n` +
        `\t$colorDouble\t ${speedoGroup.colorDouble.getVMTColor()}\n` +
        `\t$colorTriple\t ${speedoGroup.colorTriple.getVMTColor()}\n` +
        `\t$colorMaxVel\t ${speedoGroup.colorMaxVel.getVMTColor()}\n` +
        `\t$hCloseMin\t ${speedoGroup.HSpeedoCloseRange.min.toString()}\n` +
        `\t$hCloseMax\t ${speedoGroup.HSpeedoCloseRange.max.toString()}\n` +
        `\t$hGoodMin\t ${speedoGroup.HSpeedoGoodRange.min.toString()}\n` +
        `\t$hGoodMax\t ${speedoGroup.HSpeedoGoodRange.max.toString()}\n` +
        `\t$vCloseMin\t ${speedoGroup.HSpeedoCloseRange.min.toString()}\n` +
        `\t$vCloseMax\t ${speedoGroup.HSpeedoCloseRange.max.toString()}\n` +
        `\t$vGoodMin\t ${speedoGroup.HSpeedoGoodRange.min.toString()}\n` +
        `\t$vGoodMax\t ${speedoGroup.HSpeedoGoodRange.max.toString()}\n` +
        `\t$aCloseMin\t ${speedoGroup.HSpeedoCloseRange.min.toString()}\n` +
        `\t$aCloseMax\t ${speedoGroup.HSpeedoCloseRange.max.toString()}\n` +
        `\t$aGoodMin\t ${speedoGroup.HSpeedoGoodRange.min.toString()}\n` +
        `\t$aGoodMax\t ${speedoGroup.HSpeedoGoodRange.max.toString()}\n` +
        `\t$doubleThreshold\t ${speedoGroup.HeightoThresholds.double.toString()}\n` +
        `\t$tripleThreshold\t ${speedoGroup.HeightoThresholds.triple.toString()}\n` +
        `\t$maxVelThreshold\t ${speedoGroup.HeightoThresholds.maxVel.toString()}\n` +
        `}`);
}
function generateSpeedoConfigRes(speedoGroup) {
    let s = "";
    let baseSlot;
    for (const [index, speedo] of speedoGroup.speedos.entries()) {
        baseSlot = `#base slot/${(index + 1).toString()}/`;
        switch (speedo.speedoType) {
            case "ABSOLUTE":
                s = s.concat(`${baseSlot}aspeedo.res\n`);
                break;
            case "HORIZONTAL":
                s = s.concat(`${baseSlot}hspeedo.res\n`);
                break;
            case "VERTICAL":
                s = s.concat(`${baseSlot}vspeedo.res\n`);
                break;
            case "HEIGHTO":
                s = s.concat(`${baseSlot}heighto.res\n`);
                break;
            case "NONE":
            default:
                s = s.concat(`// ${baseSlot}NULL\n`);
                break;
        }
    }
    s = s.concat("\nspeedo_config.res{\n\tspeedos{\n");
    s = s.concat(`\t\twide ${speedoGroup.vdfElm.wide}\n`);
    s = s.concat(`\t\ttall ${speedoGroup.vdfElm.tall}\n`);
    s = s.concat(`\t\txpos ${speedoGroup.vdfElm.xpos}\n`);
    s = s.concat(`\t\typos ${speedoGroup.vdfElm.ypos}\n`);
    let shadowsVisible;
    if (speedoGroup.drawShadows) {
        shadowsVisible = "1";
    }
    else {
        shadowsVisible = "0";
    }
    for (const [index, speedo] of speedoGroup.speedos.entries()) {
        s = s.concat(`\t\tslot_${index + 1}_container{\n`, `\t\t\tshadows_container{\n`, `\t\t\t\tvisible ${shadowsVisible}\n`, `\t\t\t}\n`, `\t\t}\n`);
    }
    s = s.concat("\t}\n}\n");
    return s;
}
function generateSpeedoConfigJSON(speedoGroup) {
    const tabSize = 4;
    return JSON.stringify(speedoGroup, (key, val) => {
        // exclude variables not relevant to config
        if (key !== "previewSpeed" && key !== "playerSpeed" && key !== "color") {
            return val;
        }
    }, tabSize);
}
function createReadme() {
    return ("# mmarc Speedo Generator\n\n" +
        "## Installation:\n" +
        "0. **Linux users** must edit `cfg/speedo_config.cfg` and replace `%YOURHUD%` with the exact name of your HUD's folder\n" +
        "1. Drag and drop the contents of `YOURHUD` into your HUD's folder. eg: `tf/custom/m0rehud/`.\n" +
        "2. Add the following line to the top of your HUD's `resource/ui/hudplayerclass.res`\n" +
        "#base ../../speedo/speedo.res\n" +
        "3. Add the following line to `tf/cfg/autoexec.cfg' in \n" +
        "exec speedo_config\n" +
        "\n## Usage:\n" +
        "Use the command `speedo_toggle` (or `speedo_enable` and `speedo_disable`) ingame to toggle the speedos on and off");
}
async function generateSpeedoFrames(speedoGroup, width, height) {
    const fontSize = height;
    return await Promise.all(Array.from({ length: 10 }).map((_, index) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.font = `${fontSize}px ${speedoGroup.font}`;
        if (index !== 10) {
            let textWidth = ctx.measureText(index.toString()).width;
            let center = { x: width / 2 - textWidth / 2, y: height };
            ctx.fillText(index.toString(), center.x, center.y);
        }
        return convertCanvasToBlobAsync(canvas);
    }));
}
async function generateVTF(images, width, height) {
    const frames = [];
    let frame;
    for (const image of images) {
        frame = new Uint8Array(image);
        frames.push(new VImageData(frame, width, height));
    }
    const frameColl = new VFrameCollection(frames);
    const vtf = new Vtf(frameColl, { version: 4, format: VFormats.DXT5 });
    return await vtf.encode();
}
function generateFontVmt(speedoGroup) {
    return (`\"UnlitGeneric\"\n` +
        `{\n` +
        `\t$basetexture                  vgui/replay/thumbnails/speedo/fonts/${speedoGroup.font}/digits.vtf\n` +
        `\t$translucent                  1\n` +
        `\t$vertexcolor                  1\n` +
        `\t$no_fullbright                1\n` +
        `\t$ignorez                      1\n` +
        `}`);
}
async function downloadZip(zip, name) {
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${name}.zip`);
    });
}
async function convertCanvasToBlobAsync(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob.arrayBuffer()));
    });
}
