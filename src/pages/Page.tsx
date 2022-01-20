import * as React from 'react'
import { isMobile } from 'react-device-detect'
import { useHistory, useParams } from 'react-router-dom'
import { BingoOption } from '../components/BingoBoard'
import { FirebaseContext } from '../launch/app'
import { Pages } from '../utils/constants'
import { PageData, PageProps } from '../utils/models'
import { xmur3 } from '../utils/rng'
import BingoPage from './BingoPage'
import ManagePage from './ManagePage'

interface PageParams {
    page: string
    seed?: string
}

const Page: React.FC<PageProps> = ( props ) => {
    const { page, seed } = useParams<PageParams>()
    const firebase = React.useContext( FirebaseContext )
    const history = useHistory()
    const [ pageData, setPageData ] = React.useState( null as PageData )

    React.useEffect(() => {
        firebase.getPageData( page ).then( d => setPageData( d ) )
    }, [] )

    if( props.manage && pageData ) {
        if( isMobile ) {
            return null
        }
        return <ManagePage
                    data={pageData}
                    darkMode={props.darkMode}
                    setDarkMode={props.setDarkMode} />
    }

    if( props.manage ) {
        return null
    }

    if( seed ) {
        switch( page ) {
            case Pages.DIGIMON:
                return <BingoPage
                    {...props}
                    root={page}
                    title="digimon world rando bingo"
                    seed={seed}/>

            default:
                return pageData && <BingoPage
                    {...props}
                    root={pageData.root}
                    title={pageData.modes.get( pageData.defaultMode ).title}
                    options={Array.from( pageData.options.values() )}
                    seed={seed}/>
        }
    }
    else {
        const newSeed = xmur3( ""+Math.random() )()
        history.replace( `${page}&seed=${newSeed}` )
        return null
    }
}

export default Page
