import JSZip from "jszip";
import { saveAs } from "file-saver";
export function zipSpeedos(speedos) {
    let zip = new JSZip();
    const speedo_materials_path = 'YOURHUD/materials/vgui/replay/thumbnails/speedo/';
    zip.file(''.concat(speedo_materials_path, 'speedo_config.vmt'), generateSpeedoConfig_vmt(speedos));
    zip.file('YOURHUD/speedo/speedo_config.res', generateSpeedoConfig_res(speedos));
    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "test.zip");
    });
}
function generateSpeedoConfig_vmt(speedos) {
    let s = '';
    // font %PLACERHOLDER%
    s = s.concat('#base fonts/roboto/digits.vmt\n');
    s = s.concat('\nUnlitGeneric{\n');
    // rounding
    s = s.concat('\t$roundAmount ');
    if (speedos.round) {
        s = s.concat('10\n');
    }
    else {
        s = s.concat('1\n');
    }
    // colors
    s = s.concat('\t$colorMain\t', speedos.colorMain.getVMTColor(), '\n');
    s = s.concat('\t$colorClose\t', speedos.colorClose.getVMTColor(), '\n');
    s = s.concat('\t$colorGood\t', speedos.colorGood.getVMTColor(), '\n');
    s = s.concat('\t$colorMainH\t', speedos.colorMain_Heighto.getVMTColor(), '\n');
    s = s.concat('\t$colorDouble\t', speedos.colorDouble.getVMTColor(), '\n');
    s = s.concat('\t$colorTriple\t', speedos.colorTriple.getVMTColor(), '\n');
    s = s.concat('\t$colorMaxVel\t', speedos.colorMaxVel.getVMTColor(), '\n');
    s = s.concat('}');
    return s;
}
function generateSpeedoConfig_res(speedos) {
    let s = '';
    let i = 0;
    speedos.speedo.forEach(speedo => {
        if (speedo.speedoType == "NONE") {
            s = s.concat('//');
        }
        s = s.concat('#base slot/', (i + 1).toString(), '/');
        switch (speedo.speedoType) {
            case "ABSOLUTE":
                s = s.concat('aspeedo.res\n');
                break;
            case "HORIZONTAL":
                s = s.concat('hspeedo.res\n');
                break;
            case "VERTICAL":
                s = s.concat('vspeedo.res\n');
                break;
            case "HEIGHTO":
                s = s.concat('heighto.res\n');
                break;
            case "NONE":
            default:
                s = s.concat('NULL\n');
                break;
        }
    });
    s = s.concat('\nspeedo_config.res{\n\tspeedos{\n');
    let size;
    switch (speedos.size) {
        case "SMALL":
            size = '52';
            break;
        case "MEDIUM":
            size = '72';
            break;
        case "LARGE":
            size = '84';
            break;
        default:
            size = '72 // defaulted to medium size, generator compiler error';
            break;
    }
    s = s.concat('\t\twide ', size, '\n');
    s = s.concat('\t\ttall ', size, '\n');
    s = s.concat('\t\txpos ', speedos.position.xpos, '\n');
    s = s.concat('\t\typos ', speedos.position.ypos, '\n');
    let shadowsVisible;
    if (speedos.drawShadows) {
        shadowsVisible = '1';
    }
    else {
        shadowsVisible = '0';
    }
    for (let i = 1; i <= 4; i++) {
        s = s.concat('\t\tslot_', i.toString(), '_container{\n\t\t\tshadows_container{');
        s = s.concat('\n\t\t\t\tvisible ', shadowsVisible, '\n\t\t\t}\n\t\t}\n');
    }
    s = s.concat('\t}\n}\n');
    return s;
}
