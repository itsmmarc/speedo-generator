import JSZip from "jszip";
import { saveAs } from "file-saver";
import { unzip } from "unzipit";
export async function zipSpeedos(speedoGroup) {
    const zip_name = "speedo-generator-hud-0.1.6.zip";
    const hud_resources_url = `http://localhost:5173/files/${zip_name}`;
    const speedo_materials_path = "YOURHUD/materials/vgui/replay/thumbnails/speedo/";
    const speedo_resource_path = "YOURHUD/speedo/";
    importHudResources(hud_resources_url).then((zip) => {
        zip.file("README.md", createReadme());
        zip.file(`${speedo_materials_path}speedo_config.vmt`, generateSpeedoConfig_vmt(speedoGroup));
        zip.file(`${speedo_resource_path}speedo_config.res`, generateSpeedoConfig_res(speedoGroup));
        zip.file("YOURHUD/speedo_config.json", generateSpeedoJSON(speedoGroup));
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "test.zip");
        });
    });
}
async function importHudResources(url) {
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
        // console.log(names[i]);
        zip.file(names[i], blobsByName[names[i]]);
    }
    return zip;
}
function generateSpeedoConfig_vmt(speedoGroup) {
    let s = "";
    // font
    s = s.concat(`#base fonts/${speedoGroup.font}/digits.vmt`);
    s = s.concat('\n"UnlitGeneric"{\n');
    // rounding
    s = s.concat(`\t$round\t${speedoGroup.round ? 1 : 0}\n`);
    // colors
    s = s.concat(`\t$colorMain\t ${speedoGroup.colorMain.getVMTColor()}\n`);
    s = s.concat(`\t$colorClose\t ${speedoGroup.colorClose.getVMTColor()}\n`);
    s = s.concat(`\t$colorGood\t ${speedoGroup.colorGood.getVMTColor()}\n`);
    s = s.concat(`\t$colorMainH\t ${speedoGroup.colorHeightoMain.getVMTColor()}\n`);
    s = s.concat(`\t$colorDouble\t ${speedoGroup.colorDouble.getVMTColor()}\n`);
    s = s.concat(`\t$colorTriple\t ${speedoGroup.colorTriple.getVMTColor()}\n`);
    s = s.concat(`\t$colorMaxVel\t ${speedoGroup.colorMaxVel.getVMTColor()}\n`);
    s = s.concat(`\t$hCloseMin\t ${speedoGroup.HSpeedoRange.closeMin.toString()}\n`);
    s = s.concat(`\t$hCloseMax\t ${speedoGroup.HSpeedoRange.closeMax.toString()}\n`);
    s = s.concat(`\t$hGoodMin\t ${speedoGroup.HSpeedoRange.goodMin.toString()}\n`);
    s = s.concat(`\t$hGoodMax\t ${speedoGroup.HSpeedoRange.goodMax.toString()}\n`);
    s = s.concat(`\t$vCloseMin\t ${speedoGroup.HSpeedoRange.closeMin.toString()}\n`);
    s = s.concat(`\t$vCloseMax\t ${speedoGroup.HSpeedoRange.closeMax.toString()}\n`);
    s = s.concat(`\t$vGoodMin\t ${speedoGroup.HSpeedoRange.goodMin.toString()}\n`);
    s = s.concat(`\t$vGoodMax\t ${speedoGroup.HSpeedoRange.goodMax.toString()}\n`);
    s = s.concat(`\t$aCloseMin\t ${speedoGroup.HSpeedoRange.closeMin.toString()}\n`);
    s = s.concat(`\t$aCloseMax\t ${speedoGroup.HSpeedoRange.closeMax.toString()}\n`);
    s = s.concat(`\t$aGoodMin\t ${speedoGroup.HSpeedoRange.goodMin.toString()}\n`);
    s = s.concat(`\t$aGoodMax\t ${speedoGroup.HSpeedoRange.goodMax.toString()}\n`);
    s = s.concat(`\t$doubleThreshold\t ${speedoGroup.HeightoThresholds.double.toString()}\n`);
    s = s.concat(`\t$tripleThreshold\t ${speedoGroup.HeightoThresholds.triple.toString()}\n`);
    s = s.concat(`\t$maxVelThreshold\t ${speedoGroup.HeightoThresholds.maxVel.toString()}\n`);
    s = s.concat("}");
    return s;
}
function generateSpeedoConfig_res(speedoGroup) {
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
function generateSpeedoJSON(speedoGroup) {
    const tabSize = 4;
    return JSON.stringify(speedoGroup, (key, val) => {
        // exclude variables not relevant to config
        if (key !== "previewSpeed" && key !== "playerSpeed") {
            return val;
        }
    }, tabSize);
}
