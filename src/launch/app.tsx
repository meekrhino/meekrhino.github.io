import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Grommet } from 'grommet'
import { Pages } from '../utils/constants'
import { THEME } from '../utils/theme'
import LydiaPage from '../pages/LydiaPage'

/**
 * App component wraps everything in an AppWrapper
 * and Routes to desired views through the URL
 */
const App = () => {

    /* Return App */
    return (
        <Grommet theme={THEME} style={{ height: '100%' }}>
            <BrowserRouter basename='/'>
                <Switch>
                    <Route
                        exact
                        component={LydiaPage}
                        path={`/`}
                    />
                    <Route
                        exact
                        component={null}
                        path={`${Pages.DIGIMON}`}
                    />
                    <Route path={Pages.ERROR} component={null} />
                </Switch>
            </BrowserRouter>
        </Grommet>
    )
}

export default App