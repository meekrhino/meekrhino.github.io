import { Box, BoxExtendedProps, BoxProps } from 'grommet'
import * as React from 'react'
import styled from 'styled-components'
import { Colors, fillerData } from '../utils/constants'
import { Textfit } from 'react-textfit'
import ReactTooltip from 'react-tooltip'
import { newRand } from '../utils/rng'
import { isMobile } from 'react-device-detect'
import { OptionData } from '../utils/models'

interface Props {
    seed: string
    options: OptionData[]
    detailed?: boolean
    freeSpace?: string
}

interface BingoSquare {
    marked: boolean
    content: string
    tooltip?: string
    image?: string
}

type Row = [ BingoSquare, BingoSquare, BingoSquare, BingoSquare, BingoSquare ]

type Board = [ Row, Row, Row, Row, Row ]

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
    border-radius: 2px;
    overflow: hidden;
    width: ${props => props.dimension}px;
    height: ${props => props.dimension}px;
    line-height: 1.3em;
    text-align: center;
    overflow: hidden;
    :hover {
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

interface BingoCellProps extends BoxExtendedProps {
    squareSize: number
    marked: boolean
    toggleCell: () => void
    text: string
    tooltip: string
}

export const BingoCell: React.FC<BingoCellProps> = ( props ) => {
    return  <StyledCell
        dimension={props.squareSize * 0.9}
        pad={`${props.squareSize * 0.05}px`}
        marked={props.marked}
        align="center"
        justify="center"
        background={props.marked? Colors["tile-4"] : Colors["tile-1"]}
        hoverIndicator={props.marked? Colors["tile-3"] : Colors["tile-2"]}
        border={{ color: Colors["tile-border"], style: "solid", size: "2px" }}
        onClick={props.toggleCell}
        onMouseDown={( event: React.MouseEvent ) => event.preventDefault()}
        data-for={props.tooltip? "tooltip" : undefined}
        data-tip={props.tooltip}
        {...props}>
        <Textfit
            mode="multi"
            max={25}
            style={{ maxHeight: props.squareSize}}>
            {props.text}
        </Textfit>
    </StyledCell>
}


const BingoBoard: React.FC<Props> = ( props ) => {
    const resetBoard = () => {
        return newBoard(
            props.options || [],
            props.seed,
            props.freeSpace
        )
    }

    const [ board, setBoard ] = React.useState( resetBoard() )

    React.useEffect( () => {
        setBoard( resetBoard() )
    }, [ props.options ] )

    const borderSpacing = 2;
    const calcSize = () => {
        if( isMobile ) {
            return 100
        }
        return Math.min(
            window.innerWidth / 5 - ( borderSpacing * 4 ) - 20,
            120
        )
    }

    const [ size, setSize ] = React.useState( calcSize() )

    React.useEffect( () => {
        if( !isMobile ) {
            const handleResize = () => {
                setSize( calcSize() )
            }
            window.addEventListener( 'resize', handleResize )
        }
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

    return (
        <Box
            justify="start"
            gap="xxsmall">
            {hasTooltip && <ReactTooltip
                                id="tooltip"
                                effect="solid"
                                delayShow={500}/>}
            {board.map( ( row, rowIndex ) =>
                <Box
                    flex
                    direction="row"
                    gap="xxsmall"
                    key={`bingo_row_${rowIndex}`}
                    style={{ maxHeight: squareSize }}>
                    {row.map( ( cell, cellIndex ) => {
                        const text = ( props.detailed && cell?.tooltip )? cell.tooltip : cell?.content
                        const tooltip = cell?.tooltip? cell.tooltip: undefined

                        return <BingoCell
                            key={`bingo_cell_${cellIndex}`}
                            squareSize={size}
                            marked={!!cell?.marked}
                            toggleCell={() => toggleCell( rowIndex, cellIndex )}
                            text={text}
                            tooltip={tooltip}/>
                    } )}
                </Box>
            )}
        </Box>
    )
}

const newBoard = (
    options: OptionData[],
    seed: string,
    freeSpace: string
): Board => {
    const rand = newRand( seed )

    const numTiles = freeSpace? 24 : 25

    const newOptions = ( (): BingoOption[] => {
        const bingoOptions: BingoOption[] = options.filter( o => !o.disabled && o.displayName !== freeSpace ).map( o => {
            return {
                text: o.displayName,
                tooltip: o.tooltip
            }
        } )

        if( bingoOptions.length < numTiles ) {
            return bingoOptions.concat( fillerData.slice( 0, numTiles - bingoOptions.length ) ).slice()
        }
        return bingoOptions.slice()
    })().sort( () => 0.5 - rand() ).slice( 0, numTiles )

    if( freeSpace ) {
        const freeOption = options.find( o => o.displayName === freeSpace )
        newOptions.splice( 12, 0, { text: freeOption.displayName, tooltip: freeOption.tooltip } )
    }

    const squares: BingoSquare[] = newOptions.map( ( s ) => {

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
