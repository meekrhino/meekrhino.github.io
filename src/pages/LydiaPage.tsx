import * as React from 'react'
import BingoBoard from '../components/BingoBoard'

const LydiaPage: React.FC = () => {
    return <BingoBoard
                title="lydlbutton stream bingo"
                options={lydiaOptions}/>
}

const lydiaOptions: string[] = [
    "Lydia Ends Game with 0 Damage",
    "Pie Ends Game with 0 Damage",
    "Lydia Ends Game with Over 690 Damage",
    "Pie Ends Game with Over 690 Damage",
    "Lydia Throws Grenade on herself",
    "Pie takes Lydia's loot",
    "Pie pretends to be upset lydia 'took' his loot",
    "Pie says he never lies",
    "Lydia tells Pie 'Fuck You'",
    "Pie says 'ew/cringe' at a compliment",
    "they get a win",
    "they finish last",
    "Lydia lies Kappa",
    "Someone laughs at getting 'finished'",
    "game that lasts a minute or less",
    "get to top 10 without finding any squads",
    "get to top 3 situation",
    "lydia hordes more than 12 cells",
    "lydia hordes more than 300 ammo",
    "pie mentions that the flatline is really good this patch",
    "someone complains about storm point ",
    "lydia calls a care package when we're sneaking up on someone",
    "coco loses a bet",
    "tech issues (audio) or will disconnect",
    "kraber headshot",
    "someone makes a joke about a literal misinterpretation of a word",
    "they have to decide whether to run around dog area",
    "we get GOLD ARMOR or GOLD knockdown",
    "respawn bingo of some sort?",
    "purple on drop",
    "someone says 'purpleh' or another word incorrectly on purpose",
    "lydia cancels ultimate accelerant",
    "'someone's here' but no one was there",
    "lydia gets startled at nothing",
    "69 damage exactly",
    "friendly fire (accidentally shooting at teammate)",
    "'barkin in bed'",
    "lydia is not with the team for the beginning of the fight... so she has to ninja revive people",
]

export default LydiaPage
