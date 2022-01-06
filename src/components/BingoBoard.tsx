import { Table, TableBody, TableCell, TableHeader, TableRow } from 'grommet'
import * as React from 'react'

interface Props {
    title: string
}

const BingoBoard: React.FC<Props> = ( props ) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {props.title}
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell scope="row">
                        <strong>Eric</strong>
                    </TableCell>
                    <TableCell>
                        Coconut
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">
                        <strong>Chris</strong>
                    </TableCell>
                    <TableCell>
                        Watermelon
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default BingoBoard
