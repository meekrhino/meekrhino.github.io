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
        },
        input: {
            weight: 400
        },
        breakpoints: {
            medium: {
                value: 1790
            }
        }
    },
    button: {
        primary: {
            extend: "padding: 12px"
        },
        size: {
            large: {
                border: {
                    radius: '8px'
                }
            }
        },
        default: {
            background: {
                opacity: 1
            }
        },
        border: {
            radius: '8px'
        }
    },
    table: {
        body: {
            border: "1px solid"
        }
    }
}
