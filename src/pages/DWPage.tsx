import * as React from 'react'
import { Pages } from '../utils/constants'
import BingoPage from './BingoPage'

const DWPage: React.FC = () => {
    return <BingoPage
                root={Pages.DIGIMON}
                title="digimon world rando bingo"
                seed="123"/>
}

export default DWPage
