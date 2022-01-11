import { ThemeType } from 'grommet'
import { COLORS } from './constants'

/* Global Grommet theme */
export const THEME: ThemeType = {
    global: {
        colors: {
            ...COLORS
        },
        font: {
            family: "Arial"
        }
    },
    button: {
        padding: {
            horizontal: "5px",
            vertical: "5px"
        }
    }
}
