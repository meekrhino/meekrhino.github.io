import firebaseui = require('firebaseui')
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
        if( !props.manage ) {
            firebase.getPageData( page ).then( d => setPageData( d ) )
        }
        else {
            firebase.getPageData(
                page,
                firebase.getCurrentUser()?.displayName
            ).then( d => setPageData( d ) )
        }
    }, [ props.manage ] )

    if( props.manage ) {
        if( isMobile ) {
            return null
        }
        return <ManagePage
                    owner={page}
                    data={pageData}
                    darkMode={props.darkMode}
                    setDarkMode={props.setDarkMode}/>
    }

    if( seed ) {
        return pageData && <BingoPage
            {...props}
            owner={page}
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
