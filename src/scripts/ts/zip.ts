import JSZip from "jszip";
import { saveAs } from "file-saver";
import { SpeedoGroup } from "./speedo-group";
import { unzip, ZipInfo } from "unzipit";

export async function zipSpeedos(speedoGroup: SpeedoGroup) {
        const zip_name = "speedo-generator-hud-0.1.6.zip";
        const hud_resources_url = `/resources/${zip_name}`;
        const speedo_materials_path: string = "YOURHUD/materials/vgui/replay/thumbnails/speedo/";
        const speedo_resource_path: string = "YOURHUD/speedo/";

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

async function importHudResources(url: string): Promise<JSZip> {
        const { entries }: ZipInfo = await unzip(url);
        const names: string[] = Object.keys(entries);
        const blobs: Blob[] = await Promise.all(Object.values(entries).map((e) => e.blob()));
        const arraySize: number = names.length;

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

function generateSpeedoConfig_vmt(speedoGroup: SpeedoGroup): string {
        return (
                `#base fonts/${speedoGroup.font}/digits.vmt` +
                '\n"UnlitGeneric"{\n' +
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
                "}"
        );
}

function generateSpeedoConfig_res(speedoGroup: SpeedoGroup): string {
        let s: string = "";
        let baseSlot: string;

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

        let shadowsVisible: string;
        if (speedoGroup.drawShadows) {
                shadowsVisible = "1";
        } else {
                shadowsVisible = "0";
        }

        for (const [index, _] of speedoGroup.speedos.entries()) {
                s = s.concat(
                        `\t\tslot_${index + 1}_container{\n`,
                        `\t\t\tshadows_container{\n`,
                        `\t\t\t\tvisible ${shadowsVisible}\n`,
                        `\t\t\t}\n`,
                        `\t\t}\n`,
                );
        }
        s = s.concat("\t}\n}\n");

        return s;
}

function createReadme(): string {
        return (
                "# mmarc Speedo Generator\n\n" +
                "## Installation:\n" +
                "0. **Linux users** must edit `cfg/speedo_config.cfg` and replace `%YOURHUD%` with the exact name of your HUD's folder\n" +
                "1. Drag and drop the contents of `YOURHUD` into your HUD's folder. eg: `tf/custom/m0rehud/`.\n" +
                "2. Add the following line to the top of your HUD's `resource/ui/hudplayerclass.res`\n" +
                "#base ../../speedo/speedo.res\n" +
                "3. Add the following line to `tf/cfg/autoexec.cfg' in \n" +
                "exec speedo_config\n" +
                "\n## Usage:\n" +
                "Use the command `speedo_toggle` (or `speedo_enable` and `speedo_disable`) ingame to toggle the speedos on and off"
        );
}

function generateSpeedoJSON(speedoGroup: SpeedoGroup): string {
        const tabSize = 4;
        return JSON.stringify(
                speedoGroup,
                (key, val) => {
                        // exclude variables not relevant to config
                        if (key !== "previewSpeed" && key !== "playerSpeed" && key !== "color") {
                                return val;
                        }
                },
                tabSize,
        );
}
