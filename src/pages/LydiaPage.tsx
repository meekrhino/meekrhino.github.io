import * as React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { BingoOption } from '../components/BingoBoard'
import { Pages } from '../utils/constants'
import { Page } from '../utils/models'
import BingoPage from './BingoPage'

interface LydiaPageParams {
    seed: string
}

const LydiaPage: Page = ( props ) => {
    const { seed } = useParams<LydiaPageParams>()

    const history = useHistory()

    if( seed ) {
        return <BingoPage
            {...props}
            root={Pages.LYDIA}
            title="lydlbutton stream bingo"
            options={lydiaOptionsPie}
            seed={seed}/>
    }
    else {
        const newSeed = Math.floor( Math.random() * 1000 * 1000)
        history.push( `${Pages.LYDIA}/seed=${newSeed}` )
        return null
    }

}

const lydiaOptionsPie: BingoOption[] = [
    { text: `"Barkin in bed"`, tooltip: `someone mentions Pie's bedtime preferences` },
    { text: `“Finished” hehe`, tooltip: `Someone laughs at getting "finished"` },
    { text: `“Fuck You” Pie`, tooltip: `Lydia tells Pie "Fuck You"` },
    { text: `< 2 Min Game`, tooltip: `game that lasts a minute or less` },
    { text: `> 12 Shield Cells`, tooltip: `lydia hordes more than 12 cells` },
    { text: `> 300 Ammo`, tooltip: `lydia hordes more than 300 ammo for one gun` },
    { text: `Agent Lydia`, tooltip: `lydia is not with the team for the beginning of the fight... so she embarks on a secret quest to retrieve her teammates` },
    { text: `APEX LAST`, tooltip: `they finish last` },
    { text: `APEX WIN`, tooltip: `they get a win` },
    { text: `Care Package isn't Sneaky`, tooltip: `lydia calls a care package when we're sneaking up on someone` },
    { text: `English is Hard`, tooltip: `someone says "purpleh" or another word incorrectly on purpose` },
    { text: `Ew / Cringe`, tooltip: `Pie or Will say "ew/cringe" at a compliment or something in the game` },
    { text: `Finisher`, tooltip: `Lydia uses her finisher move successfully (an animation to kill a knocked person)` },
    { text: `Flatline This Patch`, tooltip: `someone (probably Pie) mentions that the flatline is really good this patch` },
    { text: `Friendly Fire`, tooltip: `someone accidentally shoots at teammate & probably subsequently complains about how teammates' names disappear sometimes` },
    { text: `Fuck Storm Point`, tooltip: `someone complains about storm point` },
    { text: `GLOD`, tooltip: `we get GOLD ARMOR or GOLD knockdown` },
    { text: `Grenade Oops!`, tooltip: `Lydia Throws Grenade on herself` },
    { text: `Kill Leader`, tooltip: `Lydia gets kill leader (announced on screen)` },
    { text: `Kraber Acquired`, tooltip: `kraber acquired` },
    { text: `Lydia “Steals” Pie's Loot`, tooltip: `Pie pretends to be upset lydia "took" his loot` },
    { text: `Lydia 0 Damage`, tooltip: `Lydia Ends Game with 0 Damage` },
    { text: `Lydia 690+ Damage`, tooltip: `Lydia Ends Game with Over 690 Damage` },
    { text: `Lydia Lies`, tooltip: `Pie insists that Lydia is a liar or… Lydia lies` },
    { text: `Nice. Damage`, tooltip: `someone on the team got 69 damage exactly` },
    { text: `Pie 0 Damage`, tooltip: `Pie Ends Game with 0 Damage` },
    { text: `Pie 690+ Damage`, tooltip: `Pie Ends Game with Over 690 Damage` },
    { text: `Pie Doesn't Lie`, tooltip: `Pie says he never lies and/or asks for an example of his lying` },
    { text: `Pie Loot Goblin`, tooltip: `Pie takes Lydia's loot` },
    { text: `Punch knock`, tooltip: `Lydia gets a knock with a punch` },
    { text: `PURPLEH on drop`, tooltip: `purple acquired on drop (found in crate or on ground)` },
    { text: `Respawn`, tooltip: `someone on the team is respawned` },
    { text: `Rez Fail`, tooltip: `Lydia uses her resurrect ability and the person dies before it completes` },
    { text: `RIP Coco's Bdollas`, tooltip: `coco loses a bet` },
    { text: `Someone's Here! (not)`, tooltip: `"someone's here" but no one was there` },
    { text: `Tech Issues`, tooltip: `tech issues (audio) or will disconnect` },
    { text: `That's Not an Enemy`, tooltip: `lydia gets startled at nothing or her own teammates` },
    { text: `This Gun Is…`, tooltip: `Someone mentions a buff/nerf for a gun (excluding flatline)` },
    { text: `To Dog or Not Dog`, tooltip: `they have to decide whether to run around dog area` },
    { text: `Top 3`, tooltip: `get to top 3 situation` },
    { text: `Top Ten No Squads`, tooltip: `get to top 10 without finding any squads` },
    { text: `Ultimate Accelerant Ope!`, tooltip: `lydia cancels ultimate accelerant` },
    { text: `Your Refrigerator is Running`, tooltip: `someone makes a joke about a literal misinterpretation of a word` },
    { text: `I HATE MIRAGE`, tooltip: `Lydia complains about how much she hates Mirage` }
]

const lydiaOptionsCoco: BingoOption[] = [
    { text: `“Finished” hehe`, tooltip: `Someone laughs at getting "finished"` },
    { text: `LYDIAAA`, tooltip: `Coco Yells Lydia's Name` },
    { text: `< 2 Min Game`, tooltip: `game that lasts a minute or less` },
    { text: `12 Shield Cells`, tooltip: `lydia hordes more than 12 cells` },
    { text: `300 Ammo`, tooltip: `lydia hordes more than 300 ammo for one gun` },
    { text: `Agent Lydia`, tooltip: `lydia is not with the team for the beginning of the fight... so she embarks on a secret quest to retrieve her teammates` },
    { text: `APEX LAST`, tooltip: `they finish last` },
    { text: `APEX WIN`, tooltip: `they get a win` },
    { text: `Care Package isn't Sneaky`, tooltip: `lydia calls a care package when we're sneaking up on someone` },
    { text: `Finisher`, tooltip: `Lydia uses her finisher move successfully (an animation to kill a knocked person)` },
    { text: `Friendly Fire`, tooltip: `someone accidentally shoots at teammate & probably subsequently complains about how teammates' names disappear sometimes` },
    { text: `Fuck Storm Point`, tooltip: `someone complains about storm point` },
    { text: `GLOD`, tooltip: `we get GOLD ARMOR or GOLD knockdown` },
    { text: `Grenade Oops!`, tooltip: `Lydia Throws Grenade on herself` },
    { text: `Kill Leader`, tooltip: `Lydia gets kill leader (announced on screen)` },
    { text: `Kraber Acquired`, tooltip: `kraber acquired :lydlbuPog:` },
    { text: `Lydia 0 Damage`, tooltip: `Lydia Ends Game with 0 Damage` },
    { text: `Lydia 690+ Damage`, tooltip: `Lydia Ends Game with Over 690 Damage` },
    { text: `Nice. Damage`, tooltip: `someone on the team got 69 damage exactly` },
    { text: `Coco 0 Damage`, tooltip: `Coco Ends Game with 0 Damage` },
    { text: `Coco 690+ Damage`, tooltip: `Coco Ends Game with Over 690 Damage` },
    { text: `Coco Loot Goblin`, tooltip: `Coco calls herself a loot goblin` },
    { text: `Punch knock`, tooltip: `Lydia gets a knock with a punch` },
    { text: `PURPLEH`, tooltip: `someone DECLARES they've found PURPLEH` },
    { text: `Red`, tooltip: `someone EARNS red (does damage to make it tick over)` },
    { text: `Respawn`, tooltip: `someone on the team is respawned` },
    { text: `Rez Fail`, tooltip: `Lydia uses her resurrect ability and the person dies before it completes` },
    { text: `RIP Coco's Bdollas`, tooltip: `coco loses a bet` },
    { text: `Someone's Here! (not)`, tooltip: `"someone's here" but no one was there` },
    { text: `Tech Issues`, tooltip: `tech issues (audio) or will disconnect` },
    { text: `That's Not an Enemy`, tooltip: `lydia gets startled at nothing or her own teammates` },
    { text: `To Dog or Not Dog`, tooltip: `they have to decide whether to run around dog area` },
    { text: `Top 3`, tooltip: `get to top 3 situation` },
    { text: `Top Ten No Squads`, tooltip: `get to top 10 without finding any squads` },
    { text: `Ultimate Accelerant Ope!`, tooltip: `lydia cancels ultimate accelerant` },
    { text: `Charge Rifle`, tooltip: `Coco gets a charge rifle` }
]

export default LydiaPage
