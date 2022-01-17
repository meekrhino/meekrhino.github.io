import * as React from 'react'
import { Box, BoxExtendedProps } from "grommet"
import styled from "styled-components"


/**
 * Mobile Header
 */
const StyledHeader = styled( Box )`
    font-size: 24pt;
    font-weight: 800;
`

export const Header: React.FC<BoxExtendedProps> = ( props ) => {
    return  <StyledHeader
        flex={false}
        tag="header"
        background="brand"
        pad="small"
        align="center"
        {...props}>
        {props.children}
    </StyledHeader>
}