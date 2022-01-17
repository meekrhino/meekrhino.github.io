import { grommet, ThemeType } from 'grommet'
import { deepMerge } from 'grommet/utils'
import { Colors } from './constants'

/* Global Grommet theme */
export const THEME: ThemeType = deepMerge( grommet, {
    global: {
        colors: {
            ...Colors
        },
        font: {
            family: "Arial"
        },
        focus: {
            border: {
                color: "transparent"
            }
        }
    }
} )
