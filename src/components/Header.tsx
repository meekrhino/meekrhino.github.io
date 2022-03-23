import * as React from 'react'
import { Box, BoxExtendedProps, Menu, Stack } from "grommet"
import styled from "styled-components"
import { MenuItem } from '../pages/ManagePage'
import { Menu as MenuIcon } from "grommet-icons"


/**
 * Mobile Header
 */
const StyledHeader = styled( Box )`
    font-size: 24pt;
    font-weight: 800;
`

interface Props extends BoxExtendedProps{
    menuItems?: MenuItem[]
}

export const Header: React.FC<Props> = ( props ) => {
    return  <Stack anchor="right">
        <StyledHeader
            flex={false}
            tag="header"
            background="brand"
            pad="small"
            align="center"
            {...props}>
            {props.children}
        </StyledHeader>
        {props.menuItems && <Menu
            dropAlign={{ right: "right", top: "bottom" }}
            hoverIndicator
            items={props.menuItems}>
            <MenuIcon style={{ padding: "10px" }}/>
        </Menu>}
    </Stack>
}