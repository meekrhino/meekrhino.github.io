import { ThemeType } from 'grommet'
import { Colors } from './constants'

/* Global Grommet theme */
export const THEME: ThemeType = {
    global: {
        colors: {
            ...Colors
        },
        font: {
            family: "Arial"
        }
    },
    button: {
        primary: {
            padding: {
                horizontal: "5px",
                vertical: "5px"
            }
        }
    }
}
