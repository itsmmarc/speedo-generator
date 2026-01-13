import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Speedos } from "./speedos";
import {unzip, ZipInfo} from 'unzipit';

export async function zipSpeedos(speedos: Speedos){
    const hud_resources_url = 'http://localhost:5173/files/hudresources.zip';
    const speedo_materials_path: string = 'YOURHUD/materials/vgui/replay/thumbnails/speedo/';
    const speedo_resource_path: string = 'YOURHUD/speedo/';

    importHudResources(hud_resources_url).then((zip) =>{
        zip.file('README.md', createReadme());
        zip.file(''.concat(speedo_materials_path, 'speedo_config.vmt'), generateSpeedoConfig_vmt(speedos));
        zip.file(''.concat(speedo_resource_path, 'speedo_config.res'), generateSpeedoConfig_res(speedos));

        zip.generateAsync({type:"blob"}).then(function(content){
            saveAs(content, 'test.zip');
        });
    });
    
}

async function importHudResources(url: string): Promise<JSZip>{
    const {entries}: ZipInfo = await unzip(url);
    const names: string[] = Object.keys(entries);
    const blobs: Blob[] = await Promise.all(Object.values(entries).map(e => e.blob()));
    const arraySize: number = names.length;

    for(let i = 0; i<arraySize; i++){
        let s = names[i].split('/');
        s[0] = 'YOURHUD';
        names[i] = s.join('/');
    }

    // names and blobs are now parallel arrays so do whatever you want.
    const blobsByName = Object.fromEntries(names.map((name, i) => [name, blobs[i]]));
    
    let zip = new JSZip();
    for(let i = 0; i<arraySize; i++){
        // console.log(names[i]);
        zip.file(names[i], blobsByName[names[i]]);
    }

    return zip;
}

function generateSpeedoConfig_vmt(speedos: Speedos): string{
    let s: string = '';

    // font %PLACERHOLDER%
    s = s.concat('#base fonts/roboto/digits.vmt\n');

    s = s.concat('\nUnlitGeneric{\n');

    // rounding
    s = s.concat('\t$roundAmount ');
    if(speedos.round){
        s = s.concat('10\n');
    } else{
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

function generateSpeedoConfig_res(speedos: Speedos): string{
    let s: string = '';

    let i: number = 1;
    speedos.speedo.forEach(speedo => {
        if(speedo.speedoType == "NONE"){
            s = s.concat('//');
        }
        s = s.concat('#base slot/', (i++).toString(), '/');
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

    let size: string;
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

    let shadowsVisible: string;
    if(speedos.drawShadows){
        shadowsVisible = '1';
    } else{
        shadowsVisible = '0';
    }

    for(let i = 1; i <= 4; i++){
        s = s.concat('\t\tslot_', i.toString(), '_container{\n\t\t\tshadows_container{');
        s = s.concat('\n\t\t\t\tvisible ', shadowsVisible, '\n\t\t\t}\n\t\t}\n');
    }
    s = s.concat('\t}\n}\n');

    return s;
}

function createReadme(): string{
    return '# mmarc Speedo Generator\n\n' + '## Installation:\n'
        + '1. Drag and drop the contents of `YOURHUD` into your HUD\'s folder. eg: `tf/custom/m0rehud/`\.\n'
        + '2. Add the following line to the top of your HUD\'s `resource/ui/hudplayerclass.res`\n'
        + '#base ../../speedo/speedo.res\n'
        + '3. Enjoy :)';
}