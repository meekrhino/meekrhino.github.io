import {
    Box,
    BoxExtendedProps,
    Button,
    CheckBox,
    Keyboard,
    Text,
    TextInput,
    TextInputProps
} from 'grommet'
import { IconButton } from 'grommet-controls'
import { Add, Checkbox, CheckboxSelected, Checkmark, Favorite, Trash, Undo } from 'grommet-icons'
import { BackgroundType } from 'grommet/utils'
import * as React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { ProgressPlugin } from 'webpack'
import { Header } from '../components/Header'
import { FirebaseContext } from '../launch/app'
import Firebase, { uid } from '../utils/firebase-utils'
import {
    Deletable,
    ModeData,
    OptionData,
    OptionGroupData,
    PageData
} from '../utils/models'

interface Props {
    data: PageData
    darkMode: boolean
    setDarkMode: ( darkMode: boolean ) => void
}


/**
 * Column Section component
 */

interface ColumnSectionProps extends BoxExtendedProps {
    header1: string | JSX.Element
    section1: JSX.Element
    header2?: string | JSX.Element
    section2?: JSX.Element
}

const ColumnSection: React.FC<ColumnSectionProps> = ( props ) => {
    return <Box
                direction="column"
                width="20%"
                border={{ size: "1px", color: "tile-border", side: "right" }}>
                <StyledColumnHeader
                    background="manage-header"
                    justify="center"
                    border={{ size: "1px", color: "manage-header-border", side: "horizontal" }}>
                    {props.header1}
                </StyledColumnHeader>
                {props.section1}
                {props.header2 && <StyledColumnHeader
                    background="manage-header"
                    justify="center"
                    border={{ size: "1px", color: "manage-header-border", side: "horizontal" }}>
                    {props.header2}
                </StyledColumnHeader>}
                {props.section2}
            </Box>
}

/**
 * Column Header component
 */

const StyledColumnHeader = styled( Box )`
    height: 60px;
    padding: 8px 30px;
    width: 100%;
`

/**
 * Column Subsection
 */
const ColumnSubsection: React.FC<BoxExtendedProps> = ( props ) => {
    return  <Box
                flex={{ grow: 0 }}
                direction="column"
                pad={{ vertical: "10px" }}
                {...props}/>
}

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

/**
 * RTL Text Input
 */
const TextInputRTL: React.FC<TextInputProps> = ( props ) => {
    const rtlStyle: React.CSSProperties = {
        direction: "rtl",
        textOverflow: "ellipsis"
    }

    return <TextInput style={rtlStyle} {...props}/>
}

/**
 * Item rows
 */
const StyledItemRow = styled( Box )`
    :hover {
        background: "red";
    }
`

const ItemRow: React.FC<BoxExtendedProps> = ( props ) => {
    return   <Box
                flex
                direction="row"
                align="center"
                pad={{ horizontal: "10px" }}
                {...props}>
                {props.children}
            </Box>
}

/**
 * Mode row
 */
interface ModeRowProps extends BoxExtendedProps {
    page: PageData
    mode: ModeData
    isSelected: boolean
    setPageData: ( page: PageData ) => void
}

const ModeRow:  React.FC<ModeRowProps> = ( props ) => {
    const [ renaming, setRenaming ] = React.useState( false )
    const [ newName, setNewName ] = React.useState( props.mode.displayName )

    const toggleDisabled = ( e: React.MouseEvent ) => {
        e.stopPropagation()
        editMode(
            props.page,
            props.setPageData,
            props.mode.id,
            { disabled: !props.mode.disabled }
        )
    }

    const setFavorite = () => {
        editPage(
            props.page,
            props.setPageData,
            { defaultMode: props.mode.id }
        )
    }

    const toggleDeleted = ( e: React.MouseEvent ) => {
        e.stopPropagation()
        toggleDeletion( props.page, props.setPageData, props.mode )
    }

    const onBlur = () => {
        setRenaming( false )
        setNewName( props.mode.displayName )
    }

    const onConfirm = () => {
        if( newName !== props.mode.displayName ) {
            editMode(
                props.page,
                props.setPageData,
                props.mode.id,
                { displayName: newName }
            )
        }

        setRenaming( false )
    }

    const nameElement = (() => {
        if( renaming ) {
            return <Box>
                <Keyboard
                    onEnter={onConfirm}
                    onEsc={onBlur}>
                    <TextInput
                        autoFocus
                        plain
                        placeholder="Enter name here"
                        value={newName}
                        onChange={( e ) => setNewName( e.target.value )}
                        onBlurCapture={onBlur}/>
                </Keyboard>
            </Box>
        }
        return  <Text onDoubleClick={() => setRenaming( true )}>
                    {props.mode.displayName}
                </Text>
    } )()

    const isFavorite = props.page.defaultMode == props.mode.id
    const favTooltip = `${props.mode.displayName} is the default mode`

    const numUndeletedModes =
        Array.from( props.page.modes.values() )
            .filter( m => !m.deleted ).length > 1
    const delTooltip = `Delete ${props.mode.displayName}. This can be undone until save.`

    const delIcon = props.mode.deleted?
        <Undo color="black"/>
      : <Trash color="black"/>

    const nameStyle: React.CSSProperties = {
        textDecoration: props.mode.deleted? "line-through" : undefined,
        userSelect: "none"
    }

    return  <ItemRow
                alignContent="left"
                {...props}>
                <IconButton
                    icon={props.mode.disabled? <Checkbox/> : <CheckboxSelected color="green"/>}
                    onClick={toggleDisabled}
                    hoverIndicator={false}/>
                <Box
                    flex
                    direction="row"
                    align="center"
                    justify="between"
                    style={nameStyle}>
                    {nameElement}
                    <Box direction="row">
                        {isFavorite && <IconButton
                            icon={<Favorite color="red"/>}
                            data-for="tooltip"
                            data-tip={favTooltip}
                            hoverIndicator={false}/>}
                        {( numUndeletedModes || props.mode.deleted ) && <IconButton
                            icon={delIcon}
                            data-for="tooltip"
                            data-tip={delTooltip}
                            onClick={toggleDeleted}/>}
                    </Box>
                </Box>
            </ItemRow>
}

/**
 * Manage Page
 */
const ManagePage: React.FC<Props> = ( props ) => {
    const firebase = React.useContext( FirebaseContext )

    const [ pageState, setPageState ] = React.useState( copyPage( props.data ) )
    const [ selectedMode, setSelectedMode ] = React.useState( pageState.defaultMode )

    /**
     * Track when changes have been made to toggle save button
     */
    const [ hasChanges, setHasChanges ] = React.useState( false )

    React.useEffect( () => {
        if( !hasChanges ) {
            setHasChanges( true )
        }
    }, [ pageState ] )

    console.log( "rendered" )

    return <Box fill height={{ min: "100vh" }}>
        <ReactTooltip
            id="tooltip"
            effect="solid"
            delayShow={500}/>
        <Header>
            {`Managing ${"lydlbutton"}'s page`}
        </Header>
        <Box flex direction="row">
            <ColumnSection
                header1="Page"
                section1={
                    <PageDataSection
                        page={pageState}
                        setPageData={setPageState}/>}
                header2={
                    <ModesSectionHeader
                        page={pageState}
                        setPageData={setPageState}
                        setSelectedMode={setSelectedMode}/>}
                section2={renderModesSection( pageState, setPageState, selectedMode, setSelectedMode )}>
            </ColumnSection>
            <ColumnSection
                header1={
                    <ModeDataHeader
                        modeName={pageState.modes.get( selectedMode ).displayName}/>}
                section1={
                    <ModeDataSection
                        page={pageState}
                        setPageData={setPageState}
                        mode={pageState.modes.get( selectedMode )}/>}
                header2="Option Groups"
                section2={renderOptionGroupsSection()}>
            </ColumnSection>
            <ColumnSection
                header1="Options"
                section1={renderOptionsSection()}>
            </ColumnSection>
        </Box>
    </Box>
}

/**
 * Render page data editing section
 */
interface PageDataSectionProps {
    page: PageData
    setPageData: ( d: PageData ) => void
}

const PageDataSection: React.FC<PageDataSectionProps> = ( props ) => {
    const [ root, setRoot ] = React.useState( props.page.root )
    const [ linkText, setLinkText ] = React.useState( props.page.externalLinkText )
    const [ link, setLink ] = React.useState( props.page.externalLink )

    return  <ColumnSubsection>
                <Labeled
                    label="Page URL">
                    <TextInput
                        placeholder="lydlbutton"
                        value={root}
                        onChange={( e ) => setRoot( e.target.value )}
                        onBlur={() => editPage( props.page, props.setPageData, { root: root })}/>
                </Labeled>
                <Labeled
                    label="Link Text">
                    <TextInput
                        placeholder={`Rules & Glossary`}
                        value={linkText}
                        onChange={( e ) => setLinkText( e.target.value )}
                        onBlur={() => editPage( props.page, props.setPageData, { externalLinkText: linkText })}/>
                </Labeled>
                <Labeled
                    label="Link Location"
                    rtl>
                    <TextInputRTL
                        placeholder="https://my-rules.com"
                        value={link}
                        onChange={( e ) => setLink( e.target.value )}
                        onBlur={() => editPage( props.page, props.setPageData, { externalLink: link })}/>
                </Labeled>
            </ColumnSubsection>
}

/**
 * Render mode selection setting header
 */
interface ModeHeaderProps {
    page: PageData
    setPageData: ( d: PageData ) => void
    setSelectedMode: ( modeId: string ) => void
}

const ModesSectionHeader: React.FC<ModeHeaderProps> = ( props ) => {
    const [ adding, setAdding ] = React.useState( false )
    const [ addingName, setAddingName ] = React.useState( "" )

    const onBlur = () => {
        setAdding( false )
        setAddingName( "" )
    }

    const onConfirm = () => {
        if( addingName ) {
            const newModeData = newMode( props.page, props.setPageData, addingName )
            props.setSelectedMode( newModeData.id )
        }

        setAdding( false )
        setAddingName( "" )
    }

    const addElement = (() => {
        if( adding ) {
            return <Box>
                <Keyboard
                    onEnter={onConfirm}
                    onEsc={onBlur}>
                    <TextInput
                        autoFocus
                        plain
                        placeholder="Enter name here"
                        value={addingName}
                        onChange={( e ) => setAddingName( e.target.value )}
                        onBlurCapture={onBlur}/>
                </Keyboard>
            </Box>
        }
        return  <Button
                    onClick={() => setAdding( true )}
                    gap="xsmall"
                    plain
                    hoverIndicator={{
                        size: "cover",
                        color: "brand",
                        opacity: 0.3,
                        repeat: "repeat"
                    }}
                    icon={<Add color="brand"/>}
                    label="Add Mode"
                    color="brand"
                    style={{ display: "inherit", padding: "8px" }}/>
    })()

    return  <Box flex direction="row" justify="between" align="center">
                <Box width={{ min: defaultLabelWidth }} justify="center">
                    <Text>Modes</Text>
                </Box>
                {addElement}
            </Box>

}

/**
 * Render mode selection section
 */
interface ModesSectionProps {
    page: PageData
    setPageData: ( d: PageData ) => void
    selectedMode: string
    setSelectedMode: ( modeId: string ) => void
}

const renderModesSection = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    selectedMode: string,
    setSelectedMode: ( modeId: string ) => void
): JSX.Element => {
    const modesList = Array.from( page.modes ) || []

    return  <ColumnSubsection gap="small">
                {modesList.map( ( [ id, m ] ) => {
                    const isSelected = m.id == selectedMode
                    const rowColor: BackgroundType = (() => {
                        if( m.deleted )  {
                            return { opacity: 0.4, color: "error" }
                        }
                        else if( isSelected ) {
                            return { opacity: 0.4, color: "brand" }
                        }
                        return undefined
                    } )()

                    return  <ModeRow
                                key={`mode-row-${id}`}
                                page={page}
                                setPageData={setPageData}
                                mode={m}
                                isSelected={isSelected}
                                hoverIndicator={m.deleted? {
                                    size: "cover",
                                    color: "error",
                                    opacity: 0.7,
                                    repeat: "repeat"
                                } : true}
                                background={rowColor}
                                onClick={() => setSelectedMode( m.id )}/>
                } )}
            </ColumnSubsection>
}

/**
 * Render modes data editing section
 */
interface ModeDataHeaderProps {
    modeName: string
}

const ModeDataHeader: React.FC<ModeDataHeaderProps> = ( props ) => {
    return  <Box flex direction="row" justify="between" align="center">
                <Box width={{ min: defaultLabelWidth }} justify="center">
                    <Text>Mode</Text>
                </Box>
                <Text weight="bold">
                    {props.modeName}
                </Text>
            </Box>
}

/**
 * Render modes data editing section
 */
interface ModeDataSectionProps {
    page: PageData
    setPageData: ( d: PageData ) => void
    mode: ModeData
}

const ModeDataSection: React.FC<ModeDataSectionProps> = ( props ) => {
    const [ title, setTitle ] = React.useState( props.mode.title )

    React.useEffect( () => {
        setTitle( props.mode.title )
    }, [ props.mode.id ] )

    return  <ColumnSubsection>
                <Labeled
                    label="Title">
                    <TextInput
                        placeholder={`${props.mode.displayName} Bingo`}
                        value={title}
                        onChange={( e ) => setTitle( e.target.value )}
                        onBlur={() => editMode(
                            props.page,
                            props.setPageData,
                            props.mode.id,
                            { title: title }
                        )}/>
                </Labeled>
                <Labeled
                    label="Free Space"
                    labelWidth="160px">
                    <CheckBox
                        reverse
                        checked={props.mode.useFreeSpace}
                        label={null}
                        onChange={( e ) => editMode(
                            props.page,
                            props.setPageData,
                            props.mode.id,
                            { useFreeSpace: e.target.checked }
                        )}/>
                </Labeled>
                <Labeled
                    label="Column Groups"
                    labelWidth="160px">
                    <CheckBox
                        reverse
                        checked={props.mode.groupPerColumn}
                        label={null}
                        onChange={( e ) => editMode(
                            props.page,
                            props.setPageData,
                            props.mode.id,
                            { groupPerColumn: e.target.checked }
                        )}/>
                </Labeled>
            </ColumnSubsection>
}

/**
 * Render option group selection section
 */
const renderOptionGroupsSection = (

): JSX.Element => {
    return  <ColumnSubsection>

            </ColumnSubsection>
}

/**
 * Render option selection section
 */
const renderOptionsSection = (

): JSX.Element => {
    return  <ColumnSubsection>

            </ColumnSubsection>
}


/**
 * Create page copy
 */
const copyPage = ( page: PageData ): PageData => {
    return {
        ...page,
        modes: new Map( page.modes ),
        optionGroups: new Map( page.optionGroups ),
        options: new Map( page.options )
    }
}


/**
 * Commit function
 */
const commitChanges = ( firebase: Firebase, page: PageData ) => {
    firebase.writePageData( "lydlbutton", page )
}


/**
 * Delete function
 */
const toggleDeletion = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    deletable: Deletable
) => {
    const newState = copyPage( page )

    deletable.deleted = !deletable.deleted

    setPageData( newState )
}


/**
 * New functions
 */
const newMode = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    name: string
) => {
    const newState = copyPage( page )

    const newId = uid()
    const newMode: ModeData = {
        id: newId,
        title: "",
        displayName: name,
        useFreeSpace: true,
        groupPerColumn: false,
        disabled: false,
        optionGroups: []
    }
    newState.modes.set( newId, newMode )

    setPageData( newState )
    return newMode
}

const newOptionGroup = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    name: string
) => {
    const newState = copyPage( page )

    const newId = uid()
    const newOg: OptionGroupData = {
        id: newId,
        displayName: name,
        options: []
    }
    newState.optionGroups.set( newId, newOg )

    setPageData( newState )
}

const newOption = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    text: string
) => {
    const newState = copyPage( page )

    const newId = uid()
    const newO: OptionData = {
        id: newId,
        text: text,
        tooltip: "",
        disabled: false
    }
    newState.options.set( newId, newO )

    setPageData( newState )
}


/**
 * Edit functions
 */
const editPage = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    newPageData: Partial<PageData>
) => {
    setPageData( { ...copyPage( page ), ...newPageData } )
}

const editMode = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    id: string,
    mode: Partial<ModeData>
) => {
    const newState = copyPage( page )
    const newMode: ModeData = {
        ...page.modes.get( id ),
        ...mode
    }
    newState.modes.set( id, newMode )

    setPageData( newState )
}

const editOptionGroup = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    id: string,
    optionGroup: Partial<OptionGroupData>
) => {
    const newState = copyPage( page )
    const newOg: OptionGroupData = {
        ...page.optionGroups.get( id ),
        ...optionGroup
    }
    newState.optionGroups.set( id, newOg )

    setPageData( newState )
}

const editOption = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    id: string,
    option: Partial<OptionData>
) => {
    const newState = copyPage( page )
    const newOption: OptionData = {
        ...page.options.get( id ),
        ...option
    }
    newState.options.set( id, newOption )

    setPageData( newState )
}

export default ManagePage
