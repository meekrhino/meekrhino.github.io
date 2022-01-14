import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Grommet } from 'grommet'
import { Pages } from '../utils/constants'
import { THEME } from '../utils/theme'
import LydiaPage from '../pages/LydiaPage'
import DWPage from '../pages/DWPage'
import Firebase from '../utils/firebase-utils'
import FirebaseInitializer from "../utils/firebase-initializer"

/* User Context */
const firebaseInstance = new Firebase()
export const FirebaseContext = React.createContext( firebaseInstance )

/**
 * App component wraps everything in an AppWrapper
 * and Routes to desired views through the URL
 */
const App = () => {
    const [ darkMode, setDarkMode ] = React.useState( false )

    /* Remove listeners after unmount */
    React.useEffect( () => {
        () => firebaseInstance.terminate()
    } )

    /* Return App */
    return (
        <Grommet
            full="min"
            themeMode={darkMode? "dark" : "light"}
            theme={THEME}
            style={{ height: '100%', display: 'flex', justifyContent: "center" }}>
            <BrowserRouter>
                <FirebaseContext.Provider value={firebaseInstance}>
                    <FirebaseInitializer>
                        <Switch>
                            <Route
                                exact
                                render={( props ) => (
                                    <LydiaPage darkMode={darkMode} setDarkMode={setDarkMode}/>
                                )}
                                path={`${Pages.LYDIA}/seed=:seed`}
                            />
                            <Route
                                exact
                                render={( props ) => (
                                    <LydiaPage darkMode setDarkMode={setDarkMode}/>
                                )}
                                path={`${Pages.LYDIA}`}
                            />
                            <Route
                                exact
                                component={DWPage}
                                path={`${Pages.DIGIMON}`}
                            />
                            <Route path={Pages.ERROR} component={null} />
                        </Switch>
                    </FirebaseInitializer>
                </FirebaseContext.Provider>
            </BrowserRouter>
        </Grommet>
    )
}

export default App