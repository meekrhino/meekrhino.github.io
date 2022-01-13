import * as React from 'react'
import { FirebaseContext } from '../launch/app'

/**
 * Props for the Component
 */
interface Props {
    children: JSX.Element
}

/**
 * Top level component to delay rendering
 */
const FirebaseInitializer = ( props: Props ) => {
    /* Firebase context */
    const firebase = React.useContext( FirebaseContext )

    /* State to determine whether Firebase is initialized */
    const [ initialized, setInitialized ] = React.useState( false )

    /* On auth state change, set initialized to true */
    firebase.setAuthStateUpdate( () => setInitialized( true ) )

    /* Return null until initialized */
    return initialized ? props.children : null
}

export default FirebaseInitializer