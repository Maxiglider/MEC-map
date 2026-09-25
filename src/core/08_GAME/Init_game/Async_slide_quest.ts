const TITLE = 'New slide gameplay - async'

/** An icon of the game itself, no import: the boots of speed, for a slide with no delay */
const ICON = 'ReplaceableTextures\\CommandButtons\\BTNBootsOfSpeed.blp'

const Y = '|cffffcc00'
const R = '|r'

const DESCRIPTION = [
    `Your hero can now slide in ${Y}async${R} mode: your own machine moves it, without waiting for the network. Feature brought by MEC core v2.3.`,
    '',
    '|cff00ff00Advantages|r',
    '- No delay: your hero turns the very moment you ask it to.',
    `- In the ${Y}async${R} mode, your hero follows your mouse in real time while sliding, with no click needed. Right click to start steering, left click to stop.`,
    '',
    '|cffff4040Drawbacks|r',
    '- Instead of lagging yourself, you may see the other heroes lag.',
    "- You don't see the other heroes exactly where they are: each player's machine moves their own hero, and you see its new position a little later.",
    '',
    `${Y}asyncClicks${R} is the default mode: your hero slides async and turns towards your right clicks.`,
    `We strongly advise you to try the ${Y}async${R} mode: type ${Y}-slideMode async${R} (or ${Y}-sm a${R}). Back to the default: ${Y}-sm ac${R}.`,
    '',
    `The ${Y}legacy${R} mode is the slide as it always was: your hero turns towards your right clicks through the network, with its delay, and everyone sees every hero where it really is. Type ${Y}-sm l${R}.`,
].join('\n')

/**
 * An optional quest about the async slide, in every MEC map. Created as the core starts - the first global init of the
 * map - so it comes before every other quest: the map's own, an old map's kept by a conversion, and MEC's version one.
 */
export const initAsyncSlideQuest = () => {
    const q = CreateQuest()
    if (!q) {
        return
    }
    QuestSetIconPath(q, ICON)
    QuestSetTitle(q, TITLE)
    QuestSetDescription(q, DESCRIPTION)
    QuestSetDiscovered(q, true)
    QuestSetRequired(q, false)
}
