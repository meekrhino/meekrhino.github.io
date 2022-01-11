import { Box, BoxProps } from 'grommet'
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
    detailed?: boolean
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

interface StyledCellProps extends BoxProps {
    dimension: number
    marked: boolean
}

const StyledCell = styled( Box )<StyledCellProps>`
    border: ${COLORS['grey-1']} solid 2px;
    border-radius: 2px;
    overflow: hidden;
    width: ${props => props.dimension}px;
    height: ${props => props.dimension}px;
    line-height: 1.3em;
    background: ${props => props.marked? COLORS['blue'] : undefined};
    color: ${props => props.marked? COLORS['grey-5'] : COLORS[ 'black' ]};
    text-align: center;
    overflow: hidden;
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
            display: flex !important;
            align-items: center;
            justify-content: center;
            user-select: none;
        }
    }
`


const BingoBoard: React.FC<Props> = ( props ) => {
    const [ board, setBoard ] = React.useState( newBoard( props.options || [], props.seed ) )

    const borderSpacing = 2;
    const calcSize = () => Math.min(
        window.innerWidth / 5 - ( borderSpacing * 4 ) - 20,
        120
    )

    const [ size, setSize ] = React.useState( calcSize )

    React.useEffect( () => {
        const handleResize = () => {
            setSize( calcSize() )
        }
        window.addEventListener( 'resize', handleResize )
    } )

    const squareSize = size * 0.9
    const pad = ( size - squareSize ) / 2


    const toggleCell = ( row: number, col: number ) => {
        const newBoard = board.slice() as Board

        newBoard[ row ] = newBoard[ row ].slice() as Row
        newBoard[ row ][ col ].marked = !newBoard[ row ][ col ].marked

        setBoard( newBoard )
    }

    const hasTooltip = board.find( ( row => !!row.find( c => !!c.tooltip ) ) )

    return <>
        {hasTooltip &&
            <ReactTooltip
                id="tooltip"
                effect="solid"
                delayShow={500}/>}
        <Box
            flex
            direction="column"
            gap="xxsmall"
            style={{ borderCollapse: "separate", borderSpacing: `${borderSpacing}px` }}>
            {board.map( ( row, rowIndex ) =>
                <Box
                    flex
                    direction="row"
                    gap="xxsmall"
                    key={`bingo_row_${rowIndex}`}>
                    {row.map( ( cell, cellIndex ) => {
                        const text = ( props.detailed && cell?.tooltip )? cell.tooltip : cell?.content
                        const tooltip = cell?.tooltip? cell.tooltip: undefined

                        return <StyledCell
                            key={`bingo_cell_${cellIndex}`}
                            dimension={squareSize}
                            pad={`${pad}px`}
                            marked={cell?.marked}
                            align="center"
                            alignContent='center'
                            justify='center'
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
                </Box>
            )}
        </Box>
    </>
}

const newBoard = ( options: BingoOption[], seed: string ): Board => {
    const rand = newRand( seed )

    if( options.length < 24 ) {
        console.error( "Provided less than 25 options.  Using random values" )
        options = options.concat( Array.from( Array( 24 - options.length ).keys() ).map( i => ""+i ) )
    }

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
