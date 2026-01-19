import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Speedos } from "./speedos";
import { unzip, ZipInfo } from "unzipit";

export async function zipSpeedos(speedos: Speedos) {
        const zip_name = "speedo-generator-hud-0.1.5.zip";
        const hud_resources_url = "http://localhost:5173/files/" + zip_name;
        const speedo_materials_path: string = "YOURHUD/materials/vgui/replay/thumbnails/speedo/";
        const speedo_resource_path: string = "YOURHUD/speedo/";

        importHudResources(hud_resources_url).then((zip) => {
                zip.file("README.md", createReadme());
                zip.file("".concat(speedo_materials_path, "speedo_config.vmt"), generateSpeedoConfig_vmt(speedos));
                zip.file("".concat(speedo_resource_path, "speedo_config.res"), generateSpeedoConfig_res(speedos));

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

function generateSpeedoConfig_vmt(speedos: Speedos): string {
        let s: string = "";

        // font
        s = s.concat("#base fonts/", speedos.font, "/digits.vmt");

        s = s.concat("\nUnlitGeneric{\n");

        // rounding
        s = s.concat("\t$round\t");
        if (speedos.round) {
                s = s.concat("1\n");
        } else {
                s = s.concat("0\n");
        }

        // colors
        s = s.concat("\t$colorMain\t", speedos.colorMain.getVMTColor(), "\n");
        s = s.concat("\t$colorClose\t", speedos.colorClose.getVMTColor(), "\n");
        s = s.concat("\t$colorGood\t", speedos.colorGood.getVMTColor(), "\n");
        s = s.concat("\t$colorMainH\t", speedos.colorMain_Heighto.getVMTColor(), "\n");
        s = s.concat("\t$colorDouble\t", speedos.colorDouble.getVMTColor(), "\n");
        s = s.concat("\t$colorTriple\t", speedos.colorTriple.getVMTColor(), "\n");
        s = s.concat("\t$colorMaxVel\t", speedos.colorMaxVel.getVMTColor(), "\n");
        s = s.concat("\t$hCloseMin\t", speedos.HSpeedoRange.closeMin.toString(), "\n");
        s = s.concat("\t$hCloseMax\t", speedos.HSpeedoRange.closeMax.toString(), "\n");
        s = s.concat("\t$hGoodMin\t", speedos.HSpeedoRange.goodMin.toString(), "\n");
        s = s.concat("\t$hGoodMax\t", speedos.HSpeedoRange.goodMax.toString(), "\n");
        s = s.concat("\t$vCloseMin\t", speedos.HSpeedoRange.closeMin.toString(), "\n");
        s = s.concat("\t$vCloseMax\t", speedos.HSpeedoRange.closeMax.toString(), "\n");
        s = s.concat("\t$vGoodMin\t", speedos.HSpeedoRange.goodMin.toString(), "\n");
        s = s.concat("\t$vGoodMax\t", speedos.HSpeedoRange.goodMax.toString(), "\n");
        s = s.concat("\t$aCloseMin\t", speedos.HSpeedoRange.closeMin.toString(), "\n");
        s = s.concat("\t$aCloseMax\t", speedos.HSpeedoRange.closeMax.toString(), "\n");
        s = s.concat("\t$aGoodMin\t", speedos.HSpeedoRange.goodMin.toString(), "\n");
        s = s.concat("\t$aGoodMax\t", speedos.HSpeedoRange.goodMax.toString(), "\n");
        s = s.concat("\t$doubleThreshold\t", speedos.HeightoThresholds.double.toString(), "\n");
        s = s.concat("\t$tripleThreshold\t", speedos.HeightoThresholds.triple.toString(), "\n");
        s = s.concat("\t$maxVelThreshold\t", speedos.HeightoThresholds.maxVel.toString(), "\n");
        s = s.concat("}");

        return s;
}

function generateSpeedoConfig_res(speedos: Speedos): string {
        let s: string = "";

        let i: number = 1;
        speedos.speedo.forEach((speedo) => {
                if (speedo.speedoType == "NONE") {
                        s = s.concat("//");
                }
                s = s.concat("#base slot/", (i++).toString(), "/");
                switch (speedo.speedoType) {
                        case "ABSOLUTE":
                                s = s.concat("aspeedo.res\n");
                                break;
                        case "HORIZONTAL":
                                s = s.concat("hspeedo.res\n");
                                break;
                        case "VERTICAL":
                                s = s.concat("vspeedo.res\n");
                                break;
                        case "HEIGHTO":
                                s = s.concat("heighto.res\n");
                                break;
                        case "NONE":
                        default:
                                s = s.concat("NULL\n");
                                break;
                }
        });

        s = s.concat("\nspeedo_config.res{\n\tspeedos{\n");

        s = s.concat("\t\twide ", speedos.vdfElm.wide, "\n");
        s = s.concat("\t\ttall ", speedos.vdfElm.tall, "\n");
        s = s.concat("\t\txpos ", speedos.vdfElm.xpos, "\n");
        s = s.concat("\t\typos ", speedos.vdfElm.ypos, "\n");

        let shadowsVisible: string;
        if (speedos.drawShadows) {
                shadowsVisible = "1";
        } else {
                shadowsVisible = "0";
        }

        for (let i = 1; i <= 4; i++) {
                s = s.concat("\t\tslot_", i.toString(), "_container{\n\t\t\tshadows_container{");
                s = s.concat("\n\t\t\t\tvisible ", shadowsVisible, "\n\t\t\t}\n\t\t}\n");
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
