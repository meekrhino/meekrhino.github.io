import { Tier } from "./constants";

export interface PageProps {
    darkMode: boolean
    setDarkMode: ( active: boolean ) => void
    manage?: boolean
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

export interface Deletable {
    deleted?: boolean
}

export interface ModeData extends Deletable {
    id: string
    title: string
    displayName: string
    useFreeSpace: boolean
    groupPerColumn: boolean
    disabled: boolean
    optionGroups: string[]
}

export interface OptionGroupData extends Deletable {
    id: string
    displayName: string
    options: string[]
}

export interface OptionData extends Deletable {
    id: string
    text: string
    tooltip: string
    disabled: boolean
}