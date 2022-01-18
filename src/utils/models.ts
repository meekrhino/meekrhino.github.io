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

export interface ItemData {
    id: string
    displayName: string
    disabled: boolean
    deleted?: boolean
}

export interface ModeData extends ItemData {
    title: string
    useFreeSpace: boolean
    groupPerColumn: boolean
    optionGroups: string[]
}

export interface OptionGroupData extends ItemData {
    options: string[]
}

export interface OptionData extends ItemData {
    tooltip: string
}