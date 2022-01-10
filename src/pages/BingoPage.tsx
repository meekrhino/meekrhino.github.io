import * as React from 'react'
import styled from "styled-components";
import BingoBoard, { BingoOption } from "../components/BingoBoard";
import { Box, CheckBox, Text } from "grommet"

interface Props {
    title: string
    seed: string
    options?: BingoOption[]
}

const StyledHeader = styled( Text )`
    font-size: 24pt;
    font-weight: 800;
    margin: 20px;
    text-align: center;
`

const StyledLink = styled.a`
    font-size: 16pt;
`

const BingoPage: React.FC<Props> = ( props ) => {
    const [ info, setInfo ] = React.useState( false )

    const anyTooltip = !!props.options.find( o => typeof o !== "string" && o.tooltip )

    return  <Box align='center' direction="column" gap="15px">
                <StyledHeader>
                    {props.title}
                </StyledHeader>
                {anyTooltip && <CheckBox
                    checked={info}
                    onChange={( e ) => setInfo( e.target.checked )}
                    label="Show Detailed Info" />}
                <BingoBoard
                    detailed={info}
                    {...props}/>
                <StyledLink href="https://docs.google.com/document/d/1Waefod2BSDOGfPOZQGCF1payGVe54fT8zIHIoMsuOog/edit?usp=sharing">
                    Rules and Glossary
                </StyledLink>
            </Box>
}

export default BingoPage
