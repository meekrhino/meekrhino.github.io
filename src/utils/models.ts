import { Tier } from "./constants";

export interface PageProps {
    darkMode: boolean
    setDarkMode: ( active: boolean ) => void
}

export interface PageData {
    root: string
    tier: Tier
    defaultMode: string
    externalLink: string
    externalLinkText: string
    modes?: Map<string, ModeData>
    optionGroups?: Map<string, OptionGroupData>
    options?: Map<string, OptionData>
}

export interface ModeData {
    id: string
    title: string
    displayName: string
    useFreeSpace: boolean
    groupPerColumn: boolean
    optionGroups: string[]
}

export interface OptionGroupData {
    id: string
    displayName: string
    options: string[]
}

export interface OptionData {
    id: string
    text: string
    tooltip: string
    disabled: boolean
}