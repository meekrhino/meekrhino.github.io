import { Box, BoxExtendedProps, Button, Layer, Paragraph, TextArea } from 'grommet'
import * as React from 'react'
import styled from 'styled-components'
import { PageData } from '../utils/models'

interface OptionImportModalProps {
    show: boolean
    confirmOptions: ( text: string ) => void
    confirmOptionsTooltips: ( text: string ) => void
    closeFn: () => void
}

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


const OptionImportModal: React.FC<OptionImportModalProps> = ( props ) => {
    const [ text, setText ] = React.useState( "" )

    const onConfirm = ( text: string, tooltips: boolean ) => {
        if( tooltips ) {
            props.confirmOptionsTooltips( text )
        }
        else {
            props.confirmOptions( text )
        }
        setText( "" )
        props.closeFn()
    }

    const infoText = `
        Enter any number of options in a comma separated
        list. To import options with tooltips, enter
        a comma separated list where the first item is an
        option, the second is that option's tooltip,
        and so on. Options will be added to the selected
        Option Group.
    `

    return props.show &&
        <Layer
            onEsc={props.closeFn}
            onClickOutside={props.closeFn}>
            <ModalBody>
                <Paragraph>
                    {infoText}
                </Paragraph>
                <TextArea
                    size="small"
                    placeholder="Enter options here"
                    value={text}
                    onChange={( e ) => setText( e.target.value )}/>
                <Box direction="row" gap="xsmall">
                    <Button
                        label="Cancel"
                        onClick={props.closeFn}/>
                    <Button
                        label="Import Options"
                        onClick={() => onConfirm( text, false )}/>
                    <Button
                        label="Import With Tooltips"
                        onClick={() => onConfirm( text, true )}/>
                </Box>
            </ModalBody>
        </Layer>
}

export default OptionImportModal
