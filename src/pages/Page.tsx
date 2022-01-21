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

    if( props.manage ) {
        if( isMobile || !pageData ) {
            return null
        }
        return <ManagePage
                    data={pageData}
                    darkMode={props.darkMode}
                    setDarkMode={props.setDarkMode} />
    }

    if( seed ) {
        return pageData && <BingoPage
            {...props}
            data={pageData}
            seed={seed}/>
    }
    else {
        const newSeed = xmur3( ""+Math.random() )()
        history.replace( `${page}&seed=${newSeed}` )
        return null
    }
}

export default Page
