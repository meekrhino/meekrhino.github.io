import * as React from 'react'
import styled from "styled-components";
import BingoBoard, { BingoOption } from "../components/BingoBoard";
import { Box, BoxExtendedProps, Button, CheckBox, Text } from "grommet"
import { useHistory } from 'react-router-dom';
import { PageProps } from '../utils/models';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import { Header } from '../components/Header';

/**
 * Assorted components
 */
const Row: React.FC<BoxExtendedProps> = ( props ) => {
    return  <Box
                flex
                direction="row"
                gap="medium"
                width="100%"
                justify="center"
                align="center">
                {props.children}
            </Box>
}

const StyledLink = styled.a`
    font-size: 16pt;
`

/**
 * Mobile Footer
 */
const MobileFooter: React.FC<BoxExtendedProps> = ( props ) => {

    return  <Box
                flex
                gap="none"
                direction="row"
                height={{ min: "80px" }}
                width="100%"
                style={{ position: "absolute", bottom: "0px" }}
                {...props}/>
}

/**
 * Mobile Footer Button
 */
const MobileFooterButton: React.FC<BoxExtendedProps> = ( props ) => {
    return  <Box
                width="50%"
                align="center"
                justify="center"
                {...props}/>
}

/**
 * Page props
 */
 export interface BingoPageProps extends PageProps {
    root: string
    title: string
    seed: string
    options?: BingoOption[]
}

/**
 * Page renderer
 */
const BingoPage: React.FC<BingoPageProps> = ( props ) => {
    const [ info, setInfo ] = React.useState( false )
    const history = useHistory()

    const resetSeed = ( () => {
        history.push( props.root )
    } )

    const anyTooltip = !!props.options?.find( o => typeof o !== "string" && o.tooltip )
    return  <Box>
        <BrowserView>
            {renderDesktopVersion(
                props,
                anyTooltip,
                info,
                setInfo,
                resetSeed
            )}
        </BrowserView>
        <MobileView>
            {renderMobileVersion(
                props,
                anyTooltip,
                info,
                setInfo,
                resetSeed
            )}
        </MobileView>
    </Box>
}

/**
 * Render the desktop version of the page
 */
const renderDesktopVersion = (
    props: BingoPageProps,
    anyTooltip: boolean,
    info: boolean,
    setInfo: ( info: boolean ) => void,
    resetSeed: () => void
) => {
    return  (
        <Box fill gap="small" height={{ min: "100vh" }}>
            <Header>
                {props.title}
            </Header>
            <Box flex={{ grow: 0 }} align="center" gap="medium" overflow="auto">
                <Row>
                    <Button
                        primary
                        color="button"
                        onClick={() => props.setDarkMode( !props.darkMode )}
                        style={{ padding: "8px" }}>
                        Toggle Dark Mode
                    </Button>
                    {anyTooltip && <CheckBox
                        checked={info}
                        onChange={( e ) => setInfo( e.target.checked )}
                        label="Show Detailed Info" />}
                    <Button
                        primary
                        color="button"
                        onClick={resetSeed}
                        style={{ padding: "8px" }}>
                        New Card
                    </Button>
                </Row>
                <StyledLink href="https://docs.google.com/document/d/1Waefod2BSDOGfPOZQGCF1payGVe54fT8zIHIoMsuOog/edit?usp=sharing">
                    Rules and Glossary
                </StyledLink>
                {renderBoard( props, info )}
            </Box>
        </Box>
    )
}

/**
 * Render the mobile version of the page
 */
const renderMobileVersion = (
    props: BingoPageProps,
    anyTooltip: boolean,
    info: boolean,
    setInfo: ( info: boolean ) => void,
    resetSeed: () => void
) => {
    return  (
        <Box fill gap="small">
            <Header>
                {props.title}
            </Header>
            <Box flex align='center' gap="medium" overflow="auto">
                {renderBoard( props, info )}
                {anyTooltip && <CheckBox
                    checked={info}
                    onChange={( e ) => setInfo( e.target.checked )}
                    label="Show Detailed Info" />}
                <StyledLink href="https://docs.google.com/document/d/1Waefod2BSDOGfPOZQGCF1payGVe54fT8zIHIoMsuOog/edit?usp=sharing">
                    Rules and Glossary
                </StyledLink>
            </Box>
            <MobileFooter>
                <MobileFooterButton
                    background="button"
                    onClick={() => props.setDarkMode( !props.darkMode )}>
                    Toggle Dark Mode
                </MobileFooterButton>
                <MobileFooterButton
                    background="brand"
                    onClick={resetSeed}>
                    New Card
                </MobileFooterButton>
            </MobileFooter>
        </Box>
    )
}

/**
 * Render the bingo board
 */
const renderBoard = ( props: BingoPageProps, detailed: boolean ) => {
    return  <BingoBoard
                detailed={detailed}
                {...props}/>
}

export default BingoPage
