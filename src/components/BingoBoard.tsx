import {
    Box,
    CheckBox,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableRow,
    Text
} from 'grommet'
import * as React from 'react'
import styled from 'styled-components'
import { COLORS } from '../utils/constants'
import { Textfit } from 'react-textfit';
import ReactTooltip from 'react-tooltip';
import { newRand } from '../utils/rng';

interface Props {
    title: string
    seed: string
    options?: BingoOption[]
}

interface BingoSquare {
    marked: boolean
    content: string
    tooltip?: string
    image?: string
}

type Row = [BingoSquare, BingoSquare, BingoSquare, BingoSquare, BingoSquare]

type Board = [Row, Row, Row, Row, Row]

interface TooltippedOption {
    text: string
    tooltip: string
}

export type BingoOption = string | TooltippedOption

interface StyledCellProps extends TableCellProps {
    marked: boolean
}

const size = "7rem"

const StyledCell = styled( TableCell )<StyledCellProps>`
    border: ${COLORS['grey-1']} solid 2px;
    border-radius: 2px;
    overflow: hidden;
    width: ${size};
    height: ${size};
    line-height: 1.3em;
    padding: 10px;
    background: ${props => props.marked? COLORS['blue'] : undefined};
    color: ${props => props.marked? COLORS['grey-5'] : COLORS[ 'black' ]};
    :hover {
        background: ${props => props.marked? COLORS['light-blue'] : COLORS['very-light-blue']};
        cursor: pointer;
    }
    > div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        > div {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            > div {
                width: 100%;
                height: 100%;
                display: flex !important;
                align-items: center;
                justify-content: center;
                user-select: none;
            }
        }
    }
`

const StyledLink = styled.a`
    margin: 20px;
    font-size: 16pt;
`

const StyledText = styled( Text )`
    font-size: 24pt;
    font-weight: 800;
    margin: 20px;
`


const BingoBoard: React.FC<Props> = ( props ) => {
    const [ board, setBoard ] = React.useState( newBoard( props.options || [], props.seed ) )

    const [ info, setInfo ] = React.useState( false )

    const toggleCell = ( row: number, col: number ) => {
        const newBoard = board.slice() as Board


        newBoard[ row ] = newBoard[ row ].slice() as Row
        newBoard[ row ][ col ].marked = !newBoard[ row ][ col ].marked

        setBoard( newBoard )
    }

    return (
        <Box align='center' direction="column">
            <StyledText>
                {props.title}
            </StyledText>
            <CheckBox
                checked={info}
                onChange={( e ) => setInfo( e.target.checked )}
                label="Show Detailed Info" />
            <ReactTooltip
                id="tooltip"
                effect="solid"
                delayShow={350}/>
            <Table style={{ borderCollapse: "separate", borderSpacing: "2px" }}>
                <TableBody>
                    {board.map( ( row, rowIndex ) =>
                        <TableRow key={`bingo_row_${rowIndex}`}>
                            {row.map( ( cell, cellIndex ) => {
                                const text = ( info && cell?.tooltip )? cell.tooltip : cell?.content
                                const tooltip = cell?.tooltip? cell.tooltip: undefined

                                return <StyledCell
                                    key={`bingo_cell_${cellIndex}`}
                                    scope="row"
                                    marked={cell?.marked}
                                    align="center"
                                    onClick={() => toggleCell( rowIndex, cellIndex )}
                                    onMouseDown={( event: React.MouseEvent ) => event.preventDefault()}
                                    data-for={tooltip? "tooltip" : undefined}
                                    data-tip={tooltip}>
                                    <Textfit
                                        mode="multi"
                                        max={25}>
                                        {text}
                                    </Textfit>
                                </StyledCell>
                            } )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <StyledLink href="https://docs.google.com/document/d/1Waefod2BSDOGfPOZQGCF1payGVe54fT8zIHIoMsuOog/edit?usp=sharing">
                Rules and Glossary
            </StyledLink>
        </Box>
    )
}

const newBoard = ( options: BingoOption[], seed: string ): Board => {
    console.log( `generating from ${seed}` )
    const rand = newRand( seed )

    if( options.length < 24 ) {
        console.error( "Provided less than 25 options.  Using random values" )
        options = options.concat( Array.from( Array( 24 - options.length ).keys() ).map( i => ""+i ) )
    }

    console.log( `test vals: ${rand()}, ${rand()}, ${rand()}` )

    options = options.sort( () => 0.5 - rand() ).slice( 0, 24 )
    options.splice( 12, 0, "Free Space" )
    const squares: BingoSquare[] = options.map( ( s ) => {

        if( typeof s === "string" ) {
            return { marked: false, content: s }
        }
        else {
            return { marked: false, content: s.text, tooltip: s.tooltip }
        }
    } )

    const board: Board = [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]

    squares.forEach( ( square, idx ) => {
        const row = Math.floor( idx / 5 )
        const col = idx % 5

        board[ row ][ col ] = square
    } )

    return board
}

export default BingoBoard
