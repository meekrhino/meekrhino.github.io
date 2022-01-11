import * as React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Grommet } from 'grommet'
import { Pages } from '../utils/constants'
import { THEME } from '../utils/theme'
import LydiaPage from '../pages/LydiaPage'
import DWPage from '../pages/DWPage'

/**
 * App component wraps everything in an AppWrapper
 * and Routes to desired views through the URL
 */
const App = () => {
    const [ darkMode, setDarkMode ] = React.useState( false )

    /* Return App */
    return (
        <Grommet
            themeMode={darkMode? "dark" : "light"}
            theme={THEME}
            style={{ height: '100%', display: 'flex', justifyContent: "center" }}>
            <HashRouter>
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
            </HashRouter>
        </Grommet>
    )
}

export default App