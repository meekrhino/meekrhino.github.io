import * as React from 'react'
import styled from "styled-components";
import BingoBoard, { BingoOption } from "../components/BingoBoard";
import { Box, BoxExtendedProps, Button, CheckBox, Select, Text } from "grommet"
import { useHistory } from 'react-router-dom';
import { ModeData, OptionData, PageData, PageProps } from '../utils/models';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import { Header } from '../components/Header';
import AuthenticationModal from '../components/AuthenticationModal';
import { FirebaseContext } from '../launch/app';

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

enum Modal {
    None,
    LogIn,
    Create
}

/**
 * Page props
 */
 export interface BingoPageProps extends PageProps {
    owner: string
    data: PageData
    seed: string
}

/**
 * Page renderer
 */
const BingoPage: React.FC<BingoPageProps> = ( props ) => {
    const getOptionsFromMode = ( mode: ModeData ) => {
        const activeOptionGroups = mode.optionGroups
            .map( og => props.data.optionGroups.get( og ) )
            .filter( og => !og.disabled )

        return activeOptionGroups.reduce(
            ( prev, current ) =>
                prev.concat( current.options.map( o => props.data.options.get( o ) )
            ), [] as OptionData[]
        )
    }

    const firebase = React.useContext( FirebaseContext )
    const [ open, setOpen ] = React.useState( Modal.None )

    const [ info, setInfo ] = React.useState( false )
    const history = useHistory()
    const [ mode, setMode ] = React.useState( props.data.modes.get( props.data.defaultMode ) )
    const [ options, setOptions ] = React.useState( getOptionsFromMode( mode ) )

    React.useEffect( () => {
        const newOptions = getOptionsFromMode( mode )
        setOptions( newOptions )
    }, [ mode.id ] )

    const resetSeed = ( () => {
        history.push( props.data.root )
    } )

    const enabledModes = Array.from( props.data.modes.values() ).filter( m => !m.disabled )
    const modeSelect =
        ( enabledModes.length > 1 ) && <Select
            options={enabledModes}
            value={mode}
            onChange={( { option } ) => setMode( option )}
            labelKey="displayName"/>

    const anyTooltip = !!options?.find( o => typeof o !== "string" && o.tooltip )
    return  <Box>
        <AuthenticationModal
            show={open != Modal.None}
            new={open == Modal.Create}
            create={firebase.createUser}
            signIn={firebase.signInUser}
            closeFn={() => setOpen( Modal.None )} />
        <BrowserView>
            {renderDesktopVersion(
                props,
                mode.title,
                mode.useFreeSpace,
                options,
                anyTooltip,
                info,
                setInfo,
                resetSeed,
                modeSelect,
                setOpen,
                !!firebase.getCurrentUser(),
                firebase.signOutUser,
                () => history.replace( `/${props.owner}/manage`)
            )}
        </BrowserView>
        <MobileView>
            {renderMobileVersion(
                props,
                mode.title,
                mode.useFreeSpace,
                options,
                anyTooltip,
                info,
                setInfo,
                resetSeed,
                modeSelect
            )}
        </MobileView>
    </Box>
}

/**
 * Render the desktop version of the page
 */
const renderDesktopVersion = (
    props: BingoPageProps,
    title: string,
    freeSpace: boolean,
    options: OptionData[],
    anyTooltip: boolean,
    info: boolean,
    setInfo: ( info: boolean ) => void,
    resetSeed: () => void,
    modeSelect: JSX.Element,
    openModal: ( modal: Modal ) => void,
    isSignedIn: boolean,
    signOut: () => void,
    manage: () => void
) => {
    const signedInMenu = [
        { label: "Manage", onClick: manage },
        { label: "Sign Out", onClick: signOut }
    ]

    const signedOutMenu = [
        { label: "Sign In", onClick: () => openModal( Modal.LogIn )},
        { label: "New Account", onClick: () => openModal( Modal.Create )}
    ]

    return  (
        <Box fill gap="small" height={{ min: "100vh" }}>
            <Header
                menuItems={isSignedIn? signedInMenu : signedOutMenu}>
                {title}
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
                {modeSelect}
                {renderBoard( props, options, info, freeSpace )}
                {props.data.externalLink && props.data.externalLinkText &&
                    <StyledLink href={props.data.externalLink}>
                        {props.data.externalLinkText}
                    </StyledLink>
                }
            </Box>
        </Box>
    )
}

/**
 * Render the mobile version of the page
 */
const renderMobileVersion = (
    props: BingoPageProps,
    title: string,
    freeSpace: boolean,
    options: OptionData[],
    anyTooltip: boolean,
    info: boolean,
    setInfo: ( info: boolean ) => void,
    resetSeed: () => void,
    modeSelect: JSX.Element
) => {
    return  (
        <Box fill gap="small">
            <Header>
                {title}
            </Header>
            <Box flex align='center' gap="medium" overflow="auto">
                {renderBoard( props, options, info, freeSpace )}
                {anyTooltip && <CheckBox
                    checked={info}
                    onChange={( e ) => setInfo( e.target.checked )}
                    label="Show Detailed Info" />}
                {modeSelect}
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
const renderBoard = (
    props: BingoPageProps,
    options: OptionData[],
    detailed: boolean,
    freeSpace: boolean,
) => {
    return  <BingoBoard
                options={options}
                detailed={detailed}
                freeSpace={freeSpace}
                {...props}/>
}

export default BingoPage
