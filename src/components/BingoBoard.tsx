import {
    Box,
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

interface Props {
    title: string
    options?: string[]
}

interface BingoSquare {
    marked: boolean
    content: string
    image?: string
}

type Row = [BingoSquare, BingoSquare, BingoSquare, BingoSquare, BingoSquare]

type Board = [Row, Row, Row, Row, Row]

interface StyledCellProps extends TableCellProps {
    marked: boolean
}

const StyledCell = styled( TableCell )<StyledCellProps>`
    border: ${COLORS['grey-1']} solid 2px;
    border-radius: 2px;
    overflow: hidden;
    width: 120px;
    height: 120px;
    padding: 0;
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
            }
        }
    }
`

const StyledText = styled( Text )`
    font-size: 24pt;
    font-weight: 800;
    margin: 20px;
`

const BingoBoard: React.FC<Props> = ( props ) => {
    const [ board, setBoard ] = React.useState( newBoard( props.options || [] ) )

    console.log( board )

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
            <Table style={{ borderCollapse: "separate", borderSpacing: "2px" }}>
                <TableBody>
                    {board.map( ( row, rowIndex ) =>
                        <TableRow key={`bingo_row_${rowIndex}`}>
                            {row.map( ( cell, cellIndex ) =>
                                <StyledCell
                                    key={`bingo_cell_${cellIndex}`}
                                    scope="row"
                                    marked={cell?.marked}
                                    align="center"
                                    onClick={() => toggleCell( rowIndex, cellIndex )}
                                    onMouseDown={( event: React.MouseEvent ) => event.preventDefault()}>
                                    <Textfit
                                        mode="multi"
                                        max={25}>
                                        {cell?.content}
                                    </Textfit>
                                    {/* {cell?.content} */}
                                </StyledCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    )
}

const newBoard = ( options: string[] ): Board => {
    console.log( "Creating new board." )
    if( options.length < 24 ) {
        console.error( "Provided less than 25 options.  Using random values" )
        options = options.concat( Array.from( Array( 24 - options.length ).keys() ).map( i => ""+i ) )
    }

    console.log( options )

    options = options.sort( () => 0.5 - Math.random() ).slice( 0, 24 )
    options.splice( 12, 0, "Free Space" )

    const squares: BingoSquare[] = options.map( ( s ) => {
        return { marked: false, content: s }
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

    console.log( board )

    return board
}

export default BingoBoard
