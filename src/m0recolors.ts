import { Color } from "./color.js";

export enum m0reColor{
    WHITE,
    TAN,
    GREY,
    BLACK,
    MAROON,
    RED,
    SALMON,
    ORANGE,
    YELLOW,
    OLIVE,
    GREEN,
    FOREST,
    TEAL,
    CYAN,
    BLUE,
    NAVY,
    PURPLE,
    VIOLET,
    PINK,
    MAGENTA
}
export const m0reColors: Map<m0reColor, Color> = new Map<m0reColor, Color>();
m0reColors.set(m0reColor.WHITE,new Color('white', [255,255,255]));
m0reColors.set(m0reColor.TAN,new Color('tan', [235,226,202]));
m0reColors.set(m0reColor.GREY,new Color('grey', [150,152,154]));
m0reColors.set(m0reColor.BLACK,new Color('black', [0,0,0]));
m0reColors.set(m0reColor.MAROON,new Color('maroon', [150,50,255]));
m0reColors.set(m0reColor.RED,new Color('red', [255,0,0]));
m0reColors.set(m0reColor.SALMON,new Color('salmon', [250,125,115]));
m0reColors.set(m0reColor.ORANGE,new Color('orange', [255,155,75]));
m0reColors.set(m0reColor.YELLOW,new Color('yellow', [255,190,0]));
m0reColors.set(m0reColor.OLIVE,new Color('olive', [180,200,100]));
m0reColors.set(m0reColor.GREEN,new Color('green', [0,255,85]));
m0reColors.set(m0reColor.FOREST,new Color('forest', [0,135,55]));
m0reColors.set(m0reColor.TEAL,new Color('teal', [81,181,182]));
m0reColors.set(m0reColor.CYAN,new Color('cyan', [98,219,220]));
m0reColors.set(m0reColor.BLUE,new Color('blue', [35,125,235]));
m0reColors.set(m0reColor.NAVY,new Color('navy', [90,120,200]));
m0reColors.set(m0reColor.PURPLE,new Color('purple', [150,50,235]));
m0reColors.set(m0reColor.VIOLET,new Color('violet', [190,150,210]));
m0reColors.set(m0reColor.PINK,new Color('pink', [250,185,240]));
m0reColors.set(m0reColor.MAGENTA,new Color('magenta', [255,0,127]));