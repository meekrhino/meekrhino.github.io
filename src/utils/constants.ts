import React = require("react");

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

export enum Pages {
    LANDING = "/",
    LYDIA = "/lydlbutton-bingo",
    DIGIMON = "/dw-rando-bingo",
    ERROR = "*"
}
