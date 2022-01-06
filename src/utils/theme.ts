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
    table: {
        body: {
            border: "1px solid"
        }
    }
}
