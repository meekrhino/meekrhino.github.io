import { Box, BoxExtendedProps, Text } from "grommet"
import React = require("react")

/**
 * Labeled content
 */
 interface LabeledProps extends BoxExtendedProps {
    label: string
    rtl?: boolean
    labelWidth?: string
}

const defaultLabelWidth = "120px"
const Labeled: React.FC<LabeledProps> = ( { labelWidth = defaultLabelWidth, ...props } ) => {
    return  <Box
                flex
                direction="row"
                style={{ minHeight: "unset" }}
                align="center"
                pad={{ horizontal: "10px", vertical: "8px" }}>
                <Box width={{ min: labelWidth }} justify="center">
                    <Text>{props.label}</Text>
                </Box>
                {props.children}
            </Box>
}

export default Labeled