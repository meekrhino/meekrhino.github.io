import {
    Box,
    BoxExtendedProps,
    Button,
    CheckBox,
    Keyboard,
    Menu,
    Text,
    TextInput,
    TextInputProps,
    Notification,
    Layer
} from 'grommet'
import { IconButton } from 'grommet-controls'
import { Add, Checkbox, CheckboxSelected, Checkmark, Database, Favorite, MoreVertical, Trash, Undo } from 'grommet-icons'
import { BackgroundType } from 'grommet/utils'
import * as React from 'react'
import { RingLoader } from 'react-spinners'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { BingoCell } from '../components/BingoBoard'
import { Header } from '../components/Header'
import Labeled from '../components/Labeled'
import OptionImportModal from '../components/OptionImportModal'
import { FirebaseContext } from '../launch/app'
import { Tier } from '../utils/constants'
import Firebase, { uid } from '../utils/firebase-utils'
import {
    ItemData,
    ModeData,
    OptionData,
    OptionGroupData,
    PageData
} from '../utils/models'

interface Props {
    owner: string
    data: PageData
    darkMode: boolean
    setDarkMode: ( darkMode: boolean ) => void
}

export interface MenuItem {
    label: string
    onClick: () => void
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
                width="min( 25%, 400px )"
                border={{ size: "1px", color: "tile-border", side: "right" }}>
                <StyledColumnHeader
                    background="manage-header"
                    justify="center"
                    border={{ size: "1px", color: "manage-header-border", side: "bottom" }}>
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
    padding: 8px 8px 8px 30px;
    width: 100%;
    flex-shrink: 0;
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

const defaultLabelWidth = "120px"

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

interface ItemRowProps extends BoxExtendedProps {
    page: PageData
    item: ItemData
    isSelected: boolean
    canDelete: boolean
    setPageData: ( page: PageData ) => void
    editFn: (
        page: PageData,
        setPageData: ( data: PageData ) => void,
        id: string,
        data: Partial<ItemData>
    ) => void
    checked: boolean
    toggleChecked: () => void
    uses?: number
    usesTipThis?: string
    usesTipThat?: string
    menuItems?: MenuItem[]
}

const ItemRow: React.FC<ItemRowProps> = ( props ) => {
    const [ renaming, setRenaming ] = React.useState( false )
    const [ newName, setNewName ] = React.useState( props.item.displayName )

    const toggleDeleted = ( e: React.MouseEvent ) => {
        e.stopPropagation()
        toggleDeletion( props.page, props.setPageData, props.item )
    }

    const toggleChecked = ( e: React.MouseEvent ) => {
        e.stopPropagation()
        props.toggleChecked()
    }

    const onBlur = () => {
        setRenaming( false )
        setNewName( props.item.displayName )
    }

    const onConfirm = () => {
        if( newName !== props.item.displayName ) {
            props.editFn(
                props.page,
                props.setPageData,
                props.item.id,
                { displayName: newName }
            )
        }

        setRenaming( false )
    }

    const delTooltip = `Delete ${props.item.displayName}. This can be undone until save.`
    const delIcon = props.item.deleted?
        <Undo color="black"/>
      : <Trash color="black"/>
    const nameStyle: React.CSSProperties = {
        textDecoration: props.item.deleted? "line-through" : undefined,
        userSelect: "none",
        opacity: props.item.disabled? 0.4 : 1
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
                    {props.item.displayName}
                </Text>
    } )()

    const rowColor: BackgroundType = (() => {
        if( props.item.deleted )  {
            return { opacity: 0.4, color: "error" }
        }
        else if( props.isSelected ) {
            return { opacity: 0.4, color: "brand" }
        }
        return undefined
    } )()

    const hoverStyle: BackgroundType | boolean = ( () => {
        if( props.item.deleted ) {
            return { opacity: 0.7, color: "error" }
        }
        else if( props.isSelected ) {
            return { opacity: 0.7, color: "brand" }
        }
        return true
    } )()

    const usesTooltip = (() => {
        if( props.uses === 0 ) {
            return `This ${props.usesTipThis} is not used`
        }
        return `This ${props.usesTipThis} is used in ${props.uses} ${props.usesTipThat}s`
    })()

    return  <Box
        alignContent="left"
        direction="row"
        align="center"
        pad={{ horizontal: "10px" }}
        background={rowColor}
        style={nameStyle}
        hoverIndicator={hoverStyle}
        {...props}>
        <IconButton
            icon={props.checked? <CheckboxSelected color="green"/> : <Checkbox/>}
            onClick={toggleChecked}
            hoverIndicator={{ color: "transparent" }}/>
        {nameElement}
        {props.children}
        {( props.canDelete || props.item.deleted ) && <IconButton
            icon={delIcon}
            data-for="tooltip"
            data-tip={delTooltip}
            onClick={toggleDeleted}/>}
        {!!( props.uses !== undefined && props.uses !== 1 ) && <Box
            background="bubble"
            pad={{ horizontal: "xsmall" }}
            round
            data-for="tooltip"
            data-tip={usesTooltip}>
            <Text size="small">{props.uses}</Text>
        </Box>}
        {props.menuItems && <Menu
            dropAlign={{ right: "right", top: "bottom" }}
            hoverIndicator
            onClick={( e: React.MouseEvent ) => e.stopPropagation()}
            items={props.menuItems}>
            <MoreVertical />
        </Menu>}
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
    const setFavorite = () => {
        editPage(
            props.page,
            props.setPageData,
            { defaultMode: props.mode.id }
        )
    }

    const toggleDisabled = () => {
        editMode(
            props.page,
            props.setPageData,
            props.mode.id,
            { disabled: !props.mode.disabled }
        )
    }

    const menuItems = [
        { label: "Make Default", onClick: setFavorite }
    ]

    const isFavorite = props.page.defaultMode == props.mode.id
    const favTooltip = `${props.mode.displayName} is the default mode`

    const numUndeletedModes =
        Array.from( props.page.modes.values() )
            .filter( m => !m.deleted ).length

    return  <ItemRow
                {...props}
                flex={{ grow: 0, shrink: 0 }}
                canDelete={numUndeletedModes > 1}
                item={props.mode}
                editFn={editMode}
                checked={!props.mode.disabled}
                toggleChecked={toggleDisabled}
                menuItems={menuItems}>
                <Box
                    flex={{ grow: 1, shrink: 0 }}
                    direction="row"
                    align="center"
                    justify="end">
                    {isFavorite && <IconButton
                        icon={<Favorite color="red"/>}
                        data-for="tooltip"
                        data-tip={favTooltip}
                        hoverIndicator={false}/>}
                </Box>
            </ItemRow>
}

/**
 * Option Group row
 */
interface OptionGroupRowProps extends BoxExtendedProps {
    page: PageData
    selectedMode: ModeData
    optionGroup: OptionGroupData
    isSelected: boolean
    setPageData: ( page: PageData ) => void
}

const OptionGroupRow:  React.FC<OptionGroupRowProps> = ( props ) => {

    const numUndeletedOgs =
        Array.from( props.page.optionGroups.values() )
            .filter( og => !og.deleted ).length

    const isIncluded = !!props.selectedMode?.optionGroups.includes(
        props.optionGroup.id
    )

    const toggleIncluded = () => {
        const includedGroups = props.selectedMode?.optionGroups?.slice() || []
        const thisIndex = includedGroups.findIndex(
            ( id ) => id == props.optionGroup.id
        )
        if( thisIndex >= 0 ) {
            includedGroups.splice( thisIndex, 1 )
        }
        else {
            includedGroups.push( props.optionGroup.id )
        }
        editMode(
            props.page,
            props.setPageData,
            props.selectedMode.id,
            { optionGroups: includedGroups }
        )
    }

    const toggleDisabled = () => {
        editOptionGroup(
            props.page,
            props.setPageData,
            props.optionGroup.id,
            { disabled: !props.optionGroup.disabled }
        )
    }

    const menuItems = [
        { label: props.optionGroup.disabled? "Enable" : "Disable", onClick: toggleDisabled }
    ]

    const uses = Array.from( props.page.modes.values() ).filter( ( m ) => (
        m.optionGroups.includes( props.optionGroup.id )
    ) ).length

    return  <ItemRow
                canDelete={numUndeletedOgs > 1}
                item={props.optionGroup}
                editFn={editOptionGroup}
                checked={isIncluded}
                toggleChecked={toggleIncluded}
                uses={uses}
                usesTipThis="group"
                usesTipThat="mode"
                menuItems={menuItems}
                {...props}>
                <Box
                    flex
                    direction="row">
                </Box>
            </ItemRow>
}

/**
 * Option row
 */
interface OptionRowProps extends BoxExtendedProps {
    page: PageData
    selectedOg: OptionGroupData
    option: OptionData
    isSelected: boolean
    setPageData: ( page: PageData ) => void
}

const OptionRow:  React.FC<OptionRowProps> = ( props ) => {
    const isIncluded = !!props.selectedOg?.options.includes(
        props.option.id
    )

    const toggleIncluded = () => {
        const includedOptions = props.selectedOg?.options.slice() || []
        const thisIndex = includedOptions.findIndex(
            ( id ) => id == props.option.id
        )
        if( thisIndex >= 0 ) {
            includedOptions.splice( thisIndex, 1 )
        }
        else {
            includedOptions.push( props.option.id )
        }
        editOptionGroup(
            props.page,
            props.setPageData,
            props.selectedOg.id,
            { options: includedOptions }
        )
    }

    const toggleDisabled = () => {
        editOption(
            props.page,
            props.setPageData,
            props.option.id,
            { disabled: !props.option.disabled }
        )
    }

    const menuItems = [
        { label: props.option.disabled? "Enable" : "Disable", onClick: toggleDisabled }
    ]

    const uses = Array.from( props.page.optionGroups.values() ).filter( ( og ) => (
        og.options.includes( props.option.id )
    ) ).length

    return  <ItemRow
                canDelete={true}
                item={props.option}
                editFn={editOptionGroup}
                checked={isIncluded}
                toggleChecked={toggleIncluded}
                menuItems={menuItems}
                uses={uses}
                usesTipThis="option"
                usesTipThat="group"
                {...props}>
                <Box
                    flex
                    direction="row">
                </Box>
            </ItemRow>
}


/**
 * Manage Page
 */
const ManagePage: React.FC<Props> = ( props ) => {
    const firebase = React.useContext( FirebaseContext )

    const [ pageState, setPageState ] = React.useState( copyPage( props.data, props.owner ) )
    React.useEffect( () => setPageState( copyPage( props.data, props.owner ) ), [ props.data ] )

    const [ selectedMode, setSelectedMode ] = React.useState( pageState.defaultMode )
    React.useEffect( () => setSelectedMode( pageState.defaultMode ), [ pageState.defaultMode ] )

    const [ selectedOg, setSelectedOg ] = React.useState(
        Array.from( pageState.optionGroups.values() )[ 0 ]?.id
    )
    React.useEffect( () => {
        setSelectedOg( Array.from( pageState.optionGroups.values() )[ 0 ]?.id )
    }, [ props.data ] )

    const [ selectedO, setSelectedO ] = React.useState(
        Array.from( pageState.options.values() )[ 0 ]?.id
    )
    React.useEffect( () => {
        setSelectedO( Array.from( pageState.options.values() )[ 0 ]?.id )
    }, [ props.data ] )

    const [ showModal, setShowModal ] = React.useState( false )
    const [ changes, setChanges ] = React.useState( false )
    const [ saving, setSaving ] = React.useState( false )
    const [ toastVisible, setToastVisible ] = React.useState( false )

    const setPageData = ( d: PageData ) => {
        setPageState( d )
        setChanges( true )
    }

    /**
     * Track when changes have been made to toggle save button
     */
    const [ hasChanges, setHasChanges ] = React.useState( false )

    React.useEffect( () => {
        if( !hasChanges ) {
            setHasChanges( true )
        }
    }, [ pageState ] )

    const toggleModal = () => {
        setShowModal( !showModal )
    }

    const user = firebase.getCurrentUser()?.displayName
    if( user !== props.owner
     && user !== "MeekRhino" ) {
        return <Text>
            Please verify that you are the owner of this page
        </Text>
    }

    if( !props.data ) {
        return <Button
            onClick={() => commitChanges(
                props.owner,
                firebase,
                pageState,
                () => {}
            )}>
            Create Page
        </Button>
    }

    return <Box fill height={{ min: "100vh", max: "100vh" }}>
        <ReactTooltip
            id="tooltip"
            effect="solid"
            delayShow={500}/>
        <Header>
            {`Managing ${props.owner}'s page`}
        </Header>
        <OptionImportModal
            show={showModal}
            confirmOptions={( text ) =>
                importOptions( pageState, setPageData,  selectedOg, text )}
            confirmOptionsTooltips={( text ) => (
                importOptionsWithTooltips( pageState, setPageData, selectedOg, text )
            )}
            closeFn={toggleModal}/>
        {saving && <Layer background={{opacity: 0}}>
            <RingLoader size={200}/>
        </Layer>}
        {toastVisible && <Notification
            toast
            title="Changes Saved"
            message="All changes have been committed to the database. You can safely close the tab."
            onClose={() => setToastVisible( false )}/>}
        <Box
            flex
            direction="row"
            margin="large"
            round
            border={{ size: "2px", color: "tile-border" }}
            style={{ overflow: "hidden" }}>
            <ColumnSection
                header1={
                    <PageSectionHeader
                        owner={props.owner}
                        page={pageState}
                        firebase={firebase}
                        changes={changes}
                        setSaving={setSaving}
                        showToast={() => setToastVisible( true )}
                        clearChanges={() => setChanges( false )}/>}
                section1={
                    <PageDataSection
                        owner={props.owner}
                        page={pageState}
                        setPageData={setPageData}/>}
                header2={
                    <ItemSectionHeader
                        title="Modes"
                        button="Add Mode"
                        page={pageState}
                        selectedParent={undefined}
                        setPageData={setPageData}
                        setSelectedItem={setSelectedMode}
                        newItem={newMode}/>}
                section2={
                    <ModesSection
                        page={pageState}
                        setPageData={setPageData}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}/>}/>
            <ColumnSection
                header1={
                    <ModeDataHeader
                        modeName={`(${pageState.modes.get( selectedMode )?.displayName})`}/>}
                section1={
                    <ModeDataSection
                        page={pageState}
                        setPageData={setPageData}
                        mode={pageState.modes.get( selectedMode )}/>}
                header2={
                    <ItemSectionHeader
                        title="Option Groups"
                        button="Add Group"
                        page={pageState}
                        setPageData={setPageData}
                        selectedParent={selectedMode}
                        setSelectedItem={setSelectedOg}
                        newItem={newOptionGroup}/>}
                section2={
                    <OptionGroupsSection
                        page={pageState}
                        setPageData={setPageData}
                        selectedMode={selectedMode}
                        selectedOg={selectedOg}
                        setSelectedOg={setSelectedOg}/>}/>
            <ColumnSection
                header1={
                    <ItemSectionHeader
                        title="Options"
                        button="Add Option"
                        page={pageState}
                        setPageData={setPageData}
                        selectedParent={selectedOg}
                        setSelectedItem={setSelectedO}
                        newItem={newOption}
                        menuItems={[
                            { label: "Import Options", onClick: toggleModal }
                        ]}/>}
                section1={
                    <OptionsSection
                        page={pageState}
                        setPageData={setPageData}
                        selectedOg={selectedOg}
                        selectedOption={selectedO}
                        setSelectedOption={setSelectedO}/>}/>
            <BodySection
                page={pageState}
                setPageData={setPageData}
                selectedOption={selectedO}/>
        </Box>
    </Box>
}

interface PageSectionHeaderProps {
    owner: string
    firebase: Firebase
    page: PageData
    setSaving: ( saving: boolean ) => void
    changes: boolean
    clearChanges: () => void
    showToast: () => void
    menuItems?: MenuItem[]
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ( props ) => {
    const save = () => {
        props.setSaving( true )
        commitChanges(
            props.owner,
            props.firebase,
            props.page,
            saveCb
        )
    }

    const saveCb = () => {
        props.clearChanges()
        props.setSaving( false )
        props.showToast()
    }

    return  <Box flex direction="row" justify="between" align="center">
                <Box width={{ min: defaultLabelWidth }} justify="center">
                    <Text>Page</Text>
                </Box>
                <Button
                    icon={<Database/>}
                    label="Save Changes"
                    color="confirm"
                    disabled={!props.changes}
                    onClick={save}/>
                {props.menuItems && <Menu
                    dropAlign={{ right: "right", top: "bottom" }}
                    hoverIndicator
                    items={props.menuItems}>
                    <MoreVertical />
                </Menu>}
            </Box>
}

/**
 * Render page data editing section
 */
interface PageDataSectionProps {
    owner: string
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
                        placeholder={props.owner}
                        value={root}
                        onChange={( e ) => setRoot( e.target.value )}
                        onBlur={() => editPage( props.page, props.setPageData, { root: root })}/>
                </Labeled>
                <Labeled
                    label="Link Text">
                    <TextInput
                        size="small"
                        placeholder={`Rules & Glossary`}
                        value={linkText}
                        onChange={( e ) => setLinkText( e.target.value )}
                        onBlur={() => editPage( props.page, props.setPageData, { externalLinkText: linkText })}/>
                </Labeled>
                <Labeled
                    label="Link Location"
                    rtl>
                    <TextInputRTL
                        size="small"
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
interface ItemHeaderProps {
    title: string
    button: string
    page: PageData
    setPageData: ( d: PageData ) => void
    selectedParent: string
    setSelectedItem: ( id: string ) => void
    newItem: newItemFn
    menuItems?: MenuItem[]
}

const ItemSectionHeader: React.FC<ItemHeaderProps> = ( props ) => {
    const [ adding, setAdding ] = React.useState( false )
    const [ addingName, setAddingName ] = React.useState( "" )

    const onBlur = () => {
        setAdding( false )
        setAddingName( "" )
    }

    const onConfirm = () => {
        if( addingName ) {
            const newItem = props.newItem(
                props.page,
                props.setPageData,
                props.selectedParent,
                addingName
            )
            props.setSelectedItem( newItem.id )
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
                    label={props.button}
                    color="brand"
                    style={{ display: "inherit", padding: "8px" }}/>
    })()

    return  <Box
                direction="row"
                justify="between"
                align="center">
                <Box width={{ min: defaultLabelWidth }} justify="center">
                    <Text>{props.title}</Text>
                </Box>
                {addElement}
                {props.menuItems && <Menu
                    dropAlign={{ right: "right", top: "bottom" }}
                    hoverIndicator
                    items={props.menuItems}>
                    <MoreVertical />
                </Menu>}
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

const ModesSection: React.FC<ModesSectionProps> = ( props ) => {
    const modesList = ( Array.from( props.page.modes ) || [] )
        .sort( ( [ aId, a ], [ bId, b ] ) => {
            if( a.displayName < b.displayName ) {
                return -1;
            }
            if( a.displayName > b.displayName ) {
                return 1;
            }
            return 0;
        }
    )

    return  <ColumnSubsection gap="small">
                {modesList.map( ( [ id, m ] ) => (
                    <ModeRow
                        key={`mode-row-${id}`}
                        page={props.page}
                        setPageData={props.setPageData}
                        mode={m}
                        isSelected={m.id == props.selectedMode}
                        onClick={() => props.setSelectedMode( m.id )}/>
                ) )}
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
    const [ title, setTitle ] = React.useState( props.mode?.title || "" )

    React.useEffect( () => {
        setTitle( props.mode?.title || "" )
    }, [ props.mode?.id ] )

    if( !props.mode ) {
        return null
    }

    return  <ColumnSubsection>
                <Labeled
                    label="Title">
                    <TextInput
                        size="small"
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
interface OptionGroupsSectionProps {
    page: PageData
    setPageData: ( d: PageData ) => void
    selectedMode: string
    selectedOg: string
    setSelectedOg: ( ogId: string ) => void
}

const OptionGroupsSection: React.FC<OptionGroupsSectionProps> = ( props ) => {
    const mode = props.page.modes.get( props.selectedMode )

    const ogList = ( Array.from( props.page.optionGroups.values() ) || [] )
        .sort( ( a, b ) => {
            const aIsIncluded = !!mode?.optionGroups.includes( a.id )
            const bIsIncluded = !!mode?.optionGroups.includes( b.id )

            if( aIsIncluded && !bIsIncluded ) {
                return -1
            }
            if( !aIsIncluded && bIsIncluded ) {
                return 1
            }
            if( a.displayName < b.displayName ) {
                return -1
            }
            if( a.displayName > b.displayName ) {
                return 1
            }
            return 0
        } )

    const lastIncluded = ( () => {
        const idx = ogList.findIndex( og => !mode?.optionGroups.includes( og.id ) ) - 1
        return idx == ogList.length? -1 : idx
    } )()

    return  <ColumnSubsection gap="small">
                {ogList.map( ( og, idx ) => {
                    return  <Box gap="small" key={`og-row-${og.id}`}>
                        <OptionGroupRow
                            page={props.page}
                            setPageData={props.setPageData}
                            selectedMode={props.page.modes.get( props.selectedMode )}
                            optionGroup={og}
                            isSelected={og.id == props.selectedOg}
                            onClick={() => props.setSelectedOg( og.id )}/>
                        {lastIncluded == idx && <Box flex direction="row" align="center">
                            <Box flex height="0px" border={{ side: "top" }} margin={{ horizontal: "5px" }}/>
                            <Text>Not Included</Text>
                            <Box flex height="0px" border={{ side: "top" }} margin={{ horizontal: "5px" }}/>
                        </Box>}
                    </Box>
                } )}
            </ColumnSubsection>
}

/**
 * Render option selection section
 */
interface OptionsSectionProps {
    page: PageData
    setPageData: ( d: PageData ) => void
    selectedOg: string
    selectedOption: string
    setSelectedOption: ( oId: string ) => void
}

const OptionsSection: React.FC<OptionsSectionProps> = ( props ) => {
    const og = props.page.optionGroups.get( props.selectedOg )

    const oList = ( Array.from( props.page.options.values() ) || [] )
        .sort( ( a, b ) => {
            const aIsIncluded = !!og?.options.includes( a.id )
            const bIsIncluded = !!og?.options.includes( b.id )

            if( aIsIncluded && !bIsIncluded ) {
                return -1
            }
            if( !aIsIncluded && bIsIncluded ) {
                return 1
            }
            if( a.displayName < b.displayName ) {
                return -1
            }
            if( a.displayName > b.displayName ) {
                return 1
            }
            return 0
        } )

    const lastIncluded = ( () => {
        const idx = oList.findIndex( o => !og?.options.includes( o.id ) ) - 1
        return idx == oList.length? -1 : idx
    } )()

    return  <ColumnSubsection
                gap="small"
                flex
                height="200px"
                overflow="auto">
                {oList.map( ( o, idx ) => {
                    return  <Box gap="small" key={`o-row-${o.id}`} flex={{ grow: 0, shrink: 0 }}>
                        <OptionRow
                            page={props.page}
                            setPageData={props.setPageData}
                            selectedOg={props.page.optionGroups.get( props.selectedOg )}
                            option={o}
                            isSelected={o.id == props.selectedOption}
                            onClick={() => props.setSelectedOption( o.id )}/>
                        {lastIncluded == idx && <Box flex direction="row" align="center">
                            <Box flex height="0px" border={{ side: "top" }} margin={{ horizontal: "5px" }}/>
                            <Text>Not Included</Text>
                            <Box flex height="0px" border={{ side: "top" }} margin={{ horizontal: "5px" }}/>
                        </Box>}
                    </Box>
                } )}
            </ColumnSubsection>
}

/**
 * Body Section
 */
interface BodySectionProps extends BoxExtendedProps {
    page: PageData
    setPageData: ( d: PageData ) => void
    selectedOption: string
}

const BodySection: React.FC<BodySectionProps> = ( props ) => {
    const option = props.page.options.get( props.selectedOption )

    const [ text, setText ] = React.useState( option?.displayName || "" )
    const [ tooltip, setTooltip ] = React.useState( option?.tooltip || "" )
    const [ optionMarked, setOptionMarked ] = React.useState( false )

    React.useEffect( () => {
        setText( option?.displayName || "" )
        setTooltip( option?.tooltip || "" )
        setOptionMarked( false )
    }, [ props.selectedOption ] )

    if( !option ) {
        return null
    }

    return  <Box
                flex
                fill
                direction="column"
                pad="25px">
                <Labeled
                    label="Title">
                    <Box width="240px">
                        <TextInput
                            placeholder={`Option text`}
                            value={text}
                            onChange={( e ) => setText( e.target.value )}
                            onBlur={() => editOption(
                                props.page,
                                props.setPageData,
                                props.selectedOption,
                                { displayName: text }
                            )}/>
                    </Box>
                </Labeled>
                <Labeled
                    label="Tooltip">
                    <TextInput
                        size="small"
                        style={{ textOverflow: "ellipsis" }}
                        placeholder={`Detailed explanation for option text`}
                        value={tooltip}
                        onChange={( e ) => setTooltip( e.target.value )}
                        onBlur={() => editOption(
                            props.page,
                            props.setPageData,
                            props.selectedOption,
                            { tooltip: tooltip }
                        )}/>
                </Labeled>
                <Box
                    align="center"
                    margin={{ top: "100px" }}>
                    <Text size="large">Option Preview</Text>
                    <Box height="25px">
                        <Text color="error">{option.deleted && "(Deleted)"}</Text>
                    </Box>
                    <Box
                        flex={{ shrink: 0, grow: 0 }}
                        width={{ min: "300px" }}
                        height={{ min: "300px" }}
                        border={{
                            size: "2px",
                            style: "dashed",
                            color: option.deleted? "error" : "tile-border" }}
                        justify="center"
                        align="center"
                        margin="20px">
                        <BingoCell
                            text={option.displayName}
                            tooltip={option.tooltip}
                            marked={optionMarked}
                            squareSize={120}
                            toggleCell={() => setOptionMarked( !optionMarked )}/>
                    </Box>
                </Box>
            </Box>
}


/**
 * Create page copy
 */
const copyPage = ( page: PageData, owner?: string ): PageData => {
    if( !page ) {
        return {
            root: owner || "",
            tier: Tier.FREE,
            defaultMode: "",
            externalLink: "",
            externalLinkText: "",
            modes: new Map(),
            optionGroups: new Map(),
            options: new Map()
        }
    }
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
const commitChanges = (
    owner: string,
    firebase: Firebase,
    page: PageData,
    saveToast?: () => void
) => {
    firebase.writePageData( owner, page ).then( saveToast )
}


/**
 * Delete function
 */
const toggleDeletion = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    deletable: ItemData
) => {
    const newState = copyPage( page )

    deletable.deleted = !deletable.deleted

    setPageData( newState )
}


/**
 * New functions
 */
type newItemFn = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    container: string,
    name: string
) => ItemData

const newMode: newItemFn = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    container: string,
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

const newOptionGroup: newItemFn = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    addToMode: string,
    name: string
) => {
    const newState = copyPage( page )

    const newId = uid()
    const newOg: OptionGroupData = {
        id: newId,
        displayName: name,
        disabled: false,
        options: []
    }
    newState.optionGroups.set( newId, newOg )

    if( addToMode ) {
        newState.modes.get( addToMode ).optionGroups.push( newId )
    }

    setPageData( newState )
    return newOg
}

const newOption = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    addToGroup: string,
    name: string,
    noSet?: boolean
): OptionData => {
    const newId = uid()
    const newO: OptionData = {
        id: newId,
        displayName: name,
        tooltip: "",
        disabled: false
    }

    if( !noSet ) {
        const newState = copyPage( page )
        newState.options.set( newId, newO )
        setPageData( newState )

        if( addToGroup ) {
            newState.optionGroups.get( addToGroup ).options.push( newId )
        }
    }

    return newO
}

const newOptionWithTooltip = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    addToGroup: string,
    name: string,
    tooltip: string,
    noSet?: boolean
) => {

    const newId = uid()
    const newO: OptionData = {
        id: newId,
        displayName: name,
        tooltip: tooltip,
        disabled: false
    }

    if( !noSet ) {
        const newState = copyPage( page )
        newState.options.set( newId, newO )
        setPageData( newState )

        if( addToGroup ) {
            newState.optionGroups.get( addToGroup ).options.push( newId )
        }
    }

    return newO
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

/**
 * Helper functions
 */
const importOptions = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    selectedOptionGroup: string,
    optionsData: string
) => {
    const options = optionsData.split( "," )?.map( ( o ) =>
        newOption( page, setPageData, selectedOptionGroup, o.trim() )
    )

    const newState = copyPage( page )
    const og = newState.optionGroups.get( selectedOptionGroup )
    options.forEach( ( o ) => {
        newState.options.set( o.id, o )
        og.options.push( o.id )
    } )
    setPageData( newState )
}

const importOptionsWithTooltips = (
    page: PageData,
    setPageData: ( d: PageData ) => void,
    selectedOptionGroup: string,
    optionsData: string
) => {
    const items = optionsData.split( "," )
    const options = items.filter( ( i, idx ) => idx % 2 == 0 )
    const optionTooltips = items.filter( ( i, idx ) => idx % 2 == 1 )

    const newOptions = options.map( ( o, idx ) =>
        newOptionWithTooltip(
            page,
            setPageData,
            selectedOptionGroup,
            o.trim(),
            optionTooltips[ idx ]
        )
    )

    const newState = copyPage( page )
    const og = newState.optionGroups.get( selectedOptionGroup )
    newOptions.forEach( ( o ) => {
        newState.options.set( o.id, o )
        og.options.push( o.id )
    } )
    setPageData( newState )
}


export default ManagePage
