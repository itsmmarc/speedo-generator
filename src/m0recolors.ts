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
m0reColors.set(m0reColor.WHITE,new Color(255,255,255));
m0reColors.set(m0reColor.TAN,new Color(235,226,202));
m0reColors.set(m0reColor.GREY,new Color(150,152,154));
m0reColors.set(m0reColor.BLACK,new Color(0,0,0));
m0reColors.set(m0reColor.MAROON,new Color(150,50,255));
m0reColors.set(m0reColor.RED,new Color(255,0,0));
m0reColors.set(m0reColor.SALMON,new Color(250,125,115));
m0reColors.set(m0reColor.ORANGE,new Color(255,155,75));
m0reColors.set(m0reColor.YELLOW,new Color(255,190,0));
m0reColors.set(m0reColor.OLIVE,new Color(180,200,100));
m0reColors.set(m0reColor.GREEN,new Color(0,255,85));
m0reColors.set(m0reColor.FOREST,new Color(0,135,55));
m0reColors.set(m0reColor.TEAL,new Color(81,181,182));
m0reColors.set(m0reColor.CYAN,new Color(98,219,220));
m0reColors.set(m0reColor.BLUE,new Color(35,125,235));
m0reColors.set(m0reColor.NAVY,new Color(90,120,200));
m0reColors.set(m0reColor.PURPLE,new Color(150,50,235));
m0reColors.set(m0reColor.VIOLET,new Color(190,150,210));
m0reColors.set(m0reColor.PINK,new Color(250,185,240));
m0reColors.set(m0reColor.MAGENTA,new Color(255,0,127));