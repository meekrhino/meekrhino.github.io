import { Box, BoxExtendedProps } from "grommet"
import React = require("react")


const ModalBody: React.FC<BoxExtendedProps> = ( props ) => {
    return <Box
                flex={{ grow: 0 }}
                height={{ min: "300px" }}
                width={{ min: "300px" }}
                direction="column"
                align="center"
                pad="medium"
                gap="small"
                {...props}/>
}

export default ModalBody