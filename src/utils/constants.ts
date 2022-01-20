import React = require("react");
import { ColorType } from "grommet/utils"

/* Store app name in a single location */
export const APP_NAME = 'Bingo'

/* Enable visible outlines for all Boxes */
export const TEST_MODE = false

/**
 * Color constants
 */
export const COLORS = {
    'very-light-blue': '#1FAFF0',
    'light-blue': '#125AC9',
    'blue': '#0B419E',
    'dark-blue': '#18429E',
    'very-light-red': '#DE8278',
    'light-red': '#D65656',
    'dark-red': '#CA222F',
    'light-yellow': '#EBC169',
    'dark-yellow': '#F6BA59',
    'light-orange': '#D9881D',
    'dark-orange': '#D06808',
    'very-light-plum': '#B8669E',
    'light-plum': '#863056',
    'plum': '#712246',
    'dark-plum': '#4D0528',
    'light-green': '#318670',
    'green': '#1B665C',
    'dark-green': '#085353',
    'black': '#000000',
    'dark-grey': '#333333',
    'grey-1': '#4F4F4F',
    'grey-2': '#828282',
    'grey-3': '#BDBDBD',
    'grey-4': '#E0E0E0',
    'grey-5': '#F2F2F2'
}

export const Colors: { [colors: string]: ColorType } = {
    "text":         { dark: "#F2F2F2",  light: "#333333" },
    "button":       { dark: "#CA222F",  light: "#7D4CDB" },
    "background":   { dark: "#1c1c1c",  light: "#FFFFFF" },
    "tile-border":  { dark: "#BDBDBD",  light: "#4F4F4F" },
    "tile-1":       { dark: "#3F3F3F",  light: "#F2F2F2" },
    "tile-2":       { dark: "#1FAFF0",  light: "#1FAFF0" },
    "tile-3":       { dark: "#125AC9",  light: "#125AC9" },
    "tile-4":       { dark: "#0B419E",  light: "#0B419E" },
    "brand":        { dark: "#0E5A8A",  light: "#48AFF0" },
    "manage-header-border":
                    { dark: "#BDBDBD",  light: "#4F4F4F" },
    "manage-header":{ dark: "#828282",  light: "#F2F2F2" },
    "error":        { dark: "#CA222F",  light: "#D65656" },
    "bubble":       { dark: "#4F4F4F",  light: "#4F4F4F" },
    "confirm":      { dark: "#085353",  light: "#1B665C" }
}

export enum Pages {
    LANDING = "/",
    LYDIA = "lydlbutton",
    DIGIMON = "dw-rando",
    ERROR = "*"
}

export enum Tier {
    FREE = "free",
    BASIC = "basic",
    PREMIUM = "premium"
}

export enum Feature {
    EDIT_ROOT,
    TOOLTIPS,
    UNLIMITED_MODES,
    UNLIMITED_OPTIONS,
    UNLIMITED_OPTION_GROUPS,
    USE_DATA_TRACKING,
    MUTUALLY_EXCLUSIVE_OPTIONS,
    WEIGHTED_OPTIONS,
    GROUP_PER_COLUMN
}

export const fillerData: string[] = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19",
    "20", "21", "22", "23", "24", "25"
]
