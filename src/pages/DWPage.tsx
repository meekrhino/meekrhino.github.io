import * as React from 'react'
import { Pages } from '../utils/constants'
import { Page } from '../utils/models'
import BingoPage from './BingoPage'

const DWPage: Page = ( props ) => {
    return <BingoPage
                {...props}
                root={Pages.DIGIMON}
                title="digimon world rando bingo"
                seed="123"/>
}

export default DWPage
