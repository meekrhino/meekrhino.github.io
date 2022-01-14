import * as React from 'react'

export interface PageProps {
    darkMode: boolean
    setDarkMode: ( active: boolean ) => void
}

export interface PageComponent extends React.FC<PageProps> {}
