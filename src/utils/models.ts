import * as React from 'react'

export interface PageProps {
    darkMode: boolean
    setDarkMode: ( active: boolean ) => void
}

export interface Page extends React.FC<PageProps> {}
