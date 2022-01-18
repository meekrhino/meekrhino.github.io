import * as React from 'react'
import { isMobile } from 'react-device-detect'
import { useHistory, useParams } from 'react-router-dom'
import { BingoOption } from '../components/BingoBoard'
import { FirebaseContext } from '../launch/app'
import { Pages } from '../utils/constants'
import { PageData, PageProps } from '../utils/models'
import { xmur3 } from '../utils/rng'
import BingoPage from './BingoPage'
import ManagePage from './ManagePage'

interface PageParams {
    page: string
    seed?: string
}

const Page: React.FC<PageProps> = ( props ) => {
    const { page, seed } = useParams<PageParams>()
    const firebase = React.useContext( FirebaseContext )
    const history = useHistory()
    const [ pageData, setPageData ] = React.useState( null as PageData )

    React.useEffect(() => {
        firebase.getPageData( "lydlbutton" ).then( d => setPageData( d ) )
    }, [] )

    if( props.manage && pageData ) {
        if( isMobile ) {
            return null
        }
        return <ManagePage
                    data={pageData}
                    darkMode={props.darkMode}
                    setDarkMode={props.setDarkMode} />
    }

    if( props.manage ) {
        return null
    }

    if( seed ) {
        switch( page ) {
            case Pages.LYDIA:
                return <BingoPage
                    {...props}
                    root={page}
                    title="lydlbutton stream bingo"
                    options={lydiaOptionsPie}
                    seed={seed}/>

            case Pages.DIGIMON:
                return <BingoPage
                    {...props}
                    root={page}
                    title="digimon world rando bingo"
                    seed={seed}/>

            default:
                return pageData && <BingoPage
                    {...props}
                    root={pageData.root}
                    title={pageData.modes.get( pageData.defaultMode ).title}
                    options={Array.from( pageData.options.values() )}
                    seed={seed}/>
        }
    }
    else {
        const newSeed = xmur3( ""+Math.random() )()
        history.replace( `${page}&seed=${newSeed}` )
        return null
    }

}
const lydiaOptionsPie: BingoOption[] = [
    { displayName: `"Barkin in bed"`, tooltip: `someone mentions Pie's bedtime preferences` },
    { displayName: `“Finished” hehe`, tooltip: `Someone laughs at getting "finished"` },
    { displayName: `“Fuck You” Pie`, tooltip: `Lydia tells Pie "Fuck You"` },
    { displayName: `< 2 Min Game`, tooltip: `game that lasts a minute or less` },
    { displayName: `> 12 Shield Cells`, tooltip: `lydia hordes more than 12 cells` },
    { displayName: `> 300 Ammo`, tooltip: `lydia hordes more than 300 ammo for one gun` },
    { displayName: `Agent Lydia`, tooltip: `lydia is not with the team for the beginning of the fight... so she embarks on a secret quest to retrieve her teammates` },
    { displayName: `APEX LAST`, tooltip: `they finish last` },
    { displayName: `APEX WIN`, tooltip: `they get a win` },
    { displayName: `Care Package isn't Sneaky`, tooltip: `lydia calls a care package when we're sneaking up on someone` },
    { displayName: `English is Hard`, tooltip: `someone says "purpleh" or another word incorrectly on purpose` },
    { displayName: `Ew / Cringe`, tooltip: `Pie or Will say "ew/cringe" at a compliment or something in the game` },
    { displayName: `Finisher`, tooltip: `Lydia uses her finisher move successfully (an animation to kill a knocked person)` },
    { displayName: `Flatline This Patch`, tooltip: `someone (probably Pie) mentions that the flatline is really good this patch` },
    { displayName: `Friendly Fire`, tooltip: `someone accidentally shoots at teammate & probably subsequently complains about how teammates' names disappear sometimes` },
    { displayName: `Fuck Storm Point`, tooltip: `someone complains about storm point` },
    { displayName: `GLOD`, tooltip: `we get GOLD ARMOR or GOLD knockdown` },
    { displayName: `Grenade Oops!`, tooltip: `Lydia Throws Grenade on herself` },
    { displayName: `Kill Leader`, tooltip: `Lydia gets kill leader (announced on screen)` },
    { displayName: `Kraber Acquired`, tooltip: `kraber acquired` },
    { displayName: `Lydia “Steals” Pie's Loot`, tooltip: `Pie pretends to be upset lydia "took" his loot` },
    { displayName: `Lydia 0 Damage`, tooltip: `Lydia Ends Game with 0 Damage` },
    { displayName: `Lydia 690+ Damage`, tooltip: `Lydia Ends Game with Over 690 Damage` },
    { displayName: `Lydia Lies`, tooltip: `Pie insists that Lydia is a liar or… Lydia lies` },
    { displayName: `Nice. Damage`, tooltip: `someone on the team got 69 damage exactly` },
    { displayName: `Pie 0 Damage`, tooltip: `Pie Ends Game with 0 Damage` },
    { displayName: `Pie 690+ Damage`, tooltip: `Pie Ends Game with Over 690 Damage` },
    { displayName: `Pie Doesn't Lie`, tooltip: `Pie says he never lies and/or asks for an example of his lying` },
    { displayName: `Pie Loot Goblin`, tooltip: `Pie takes Lydia's loot` },
    { displayName: `Punch knock`, tooltip: `Lydia gets a knock with a punch` },
    { displayName: `PURPLEH on drop`, tooltip: `purple acquired on drop (found in crate or on ground)` },
    { displayName: `Respawn`, tooltip: `someone on the team is respawned` },
    { displayName: `Rez Fail`, tooltip: `Lydia uses her resurrect ability and the person dies before it completes` },
    { displayName: `RIP Coco's Bdollas`, tooltip: `coco loses a bet` },
    { displayName: `Someone's Here! (not)`, tooltip: `"someone's here" but no one was there` },
    { displayName: `Tech Issues`, tooltip: `tech issues (audio) or will disconnect` },
    { displayName: `That's Not an Enemy`, tooltip: `lydia gets startled at nothing or her own teammates` },
    { displayName: `This Gun Is…`, tooltip: `Someone mentions a buff/nerf for a gun (excluding flatline)` },
    { displayName: `To Dog or Not Dog`, tooltip: `they have to decide whether to run around dog area` },
    { displayName: `Top 3`, tooltip: `get to top 3 situation` },
    { displayName: `Top Ten No Squads`, tooltip: `get to top 10 without finding any squads` },
    { displayName: `Ultimate Accelerant Ope!`, tooltip: `lydia cancels ultimate accelerant` },
    { displayName: `Your Refrigerator is Running`, tooltip: `someone makes a joke about a literal misinterpretation of a word` },
    { displayName: `I HATE MIRAGE`, tooltip: `Lydia complains about how much she hates Mirage` }
]

const displayNameaOptionsCoco: BingoOption[] = [
    { displayName: `“Finished” hehe`, tooltip: `Someone laughs at getting "finished"` },
    { displayName: `LYDIAAA`, tooltip: `Coco Yells Lydia's Name` },
    { displayName: `< 2 Min Game`, tooltip: `game that lasts a minute or less` },
    { displayName: `12 Shield Cells`, tooltip: `lydia hordes more than 12 cells` },
    { displayName: `300 Ammo`, tooltip: `lydia hordes more than 300 ammo for one gun` },
    { displayName: `Agent Lydia`, tooltip: `lydia is not with the team for the beginning of the fight... so she embarks on a secret quest to retrieve her teammates` },
    { displayName: `APEX LAST`, tooltip: `they finish last` },
    { displayName: `APEX WIN`, tooltip: `they get a win` },
    { displayName: `Care Package isn't Sneaky`, tooltip: `lydia calls a care package when we're sneaking up on someone` },
    { displayName: `Finisher`, tooltip: `Lydia uses her finisher move successfully (an animation to kill a knocked person)` },
    { displayName: `Friendly Fire`, tooltip: `someone accidentally shoots at teammate & probably subsequently complains about how teammates' names disappear sometimes` },
    { displayName: `Fuck Storm Point`, tooltip: `someone complains about storm point` },
    { displayName: `GLOD`, tooltip: `we get GOLD ARMOR or GOLD knockdown` },
    { displayName: `Grenade Oops!`, tooltip: `Lydia Throws Grenade on herself` },
    { displayName: `Kill Leader`, tooltip: `Lydia gets kill leader (announced on screen)` },
    { displayName: `Kraber Acquired`, tooltip: `kraber acquired :lydlbuPog:` },
    { displayName: `Lydia 0 Damage`, tooltip: `Lydia Ends Game with 0 Damage` },
    { displayName: `Lydia 690+ Damage`, tooltip: `Lydia Ends Game with Over 690 Damage` },
    { displayName: `Nice. Damage`, tooltip: `someone on the team got 69 damage exactly` },
    { displayName: `Coco 0 Damage`, tooltip: `Coco Ends Game with 0 Damage` },
    { displayName: `Coco 690+ Damage`, tooltip: `Coco Ends Game with Over 690 Damage` },
    { displayName: `Coco Loot Goblin`, tooltip: `Coco calls herself a loot goblin` },
    { displayName: `Punch knock`, tooltip: `Lydia gets a knock with a punch` },
    { displayName: `PURPLEH`, tooltip: `someone DECLARES they've found PURPLEH` },
    { displayName: `Red`, tooltip: `someone EARNS red (does damage to make it tick over)` },
    { displayName: `Respawn`, tooltip: `someone on the team is respawned` },
    { displayName: `Rez Fail`, tooltip: `Lydia uses her resurrect ability and the person dies before it completes` },
    { displayName: `RIP Coco's Bdollas`, tooltip: `coco loses a bet` },
    { displayName: `Someone's Here! (not)`, tooltip: `"someone's here" but no one was there` },
    { displayName: `Tech Issues`, tooltip: `tech issues (audio) or will disconnect` },
    { displayName: `That's Not an Enemy`, tooltip: `lydia gets startled at nothing or her own teammates` },
    { displayName: `To Dog or Not Dog`, tooltip: `they have to decide whether to run around dog area` },
    { displayName: `Top 3`, tooltip: `get to top 3 situation` },
    { displayName: `Top Ten No Squads`, tooltip: `get to top 10 without finding any squads` },
    { displayName: `Ultimate Accelerant Ope!`, tooltip: `lydia cancels ultimate accelerant` },
    { displayName: `Charge Rifle`, tooltip: `Coco gets a charge rifle` }
]

export default Page
