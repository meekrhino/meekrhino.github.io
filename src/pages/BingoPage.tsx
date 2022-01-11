import * as React from 'react'
import styled from "styled-components";
import BingoBoard, { BingoOption } from "../components/BingoBoard";
import { Box, Button, CheckBox, Text } from "grommet"
import { useHistory } from 'react-router-dom';

interface Props {
    root: string
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

const StyledRow = styled( Box )`
    display: flex;
    flex-direction: row;
`

const StyledLink = styled.a`
    font-size: 16pt;
`

const BingoPage: React.FC<Props> = ( props ) => {
    const [ info, setInfo ] = React.useState( false )
    const history = useHistory()

    const resetSeed = ( () => {
        history.push( props.root )
    } )

    const anyTooltip = !!props.options.find( o => typeof o !== "string" && o.tooltip )

    return  <Box align='center' direction="column" gap="15px">
                <StyledHeader>
                    {props.title}
                </StyledHeader>
                <StyledRow
                    width="100%"
                    justify="evenly"
                    align="center">
                    <Button primary style={{ padding: "5px" }}>
                        Toggle Dark Mode
                    </Button>
                    {anyTooltip && <CheckBox
                        checked={info}
                        onChange={( e ) => setInfo( e.target.checked )}
                        label="Show Detailed Info" />}
                    <Button primary onClick={resetSeed} style={{ padding: "5px" }}>
                        New Card
                    </Button>
                </StyledRow>
                <BingoBoard
                    detailed={info}
                    {...props}/>
                <StyledLink href="https://docs.google.com/document/d/1Waefod2BSDOGfPOZQGCF1payGVe54fT8zIHIoMsuOog/edit?usp=sharing">
                    Rules and Glossary
                </StyledLink>
            </Box>
}

export default BingoPage
