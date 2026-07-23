import { createTimer } from '../../../Utils/mapUtils'
import { Constants } from '../../01_libraries/Constants'
import { EstChiffre } from '../../01_libraries/Functions_on_numbers'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import type { TerrainSave } from '../../04_STRUCTURES/TerrainSave/TerrainSave'

// WC3 chat text interprets "|" as the start of a color code (e.g. "|r" resets color) - a literal "|" must
// be doubled ("||") to display as-is. strings().replaceAll runs on Lua's string.gsub, a single pass over the
// original string, so (unlike a naive replace-and-loop) it never re-matches the "|" it just inserted.
const escapePipes = (str: string): string => strings().replaceAll('|', '||', str)

// Builds a "Usage: -commandName <argDescription>" error message from the same argDescription string passed
// to registerCommand, so the two can never drift out of sync.
export const usageMessage = (commandName: string, argDescription: string): string =>
    `Usage: -${commandName} ${escapePipes(argDescription)}`

// For -saveTerrain
export const isNewTerrainSaveLabelValid = (label: string): boolean => {
    if (label.length === 0) {
        return false
    }

    const firstChar = SubString(label, 0, 1) ?? ''
    return !EstChiffre(firstChar) && firstChar !== '-'
}

export const formatTerrainSaveSummaryLine = (terrainSave: TerrainSave): string => {
    const level = terrainSave.getLevel()
    const levelText = level === null ? 'global' : `level ${level.id}`
    const zoneText = terrainSave.isWholeMap() ? 'whole map' : 'zone'

    return (
        udg_colorCode[Constants.RED] +
        terrainSave.getLabel() +
        udg_colorCode[Constants.GREY] +
        ` (${levelText}, ${zoneText})|r`
    )
}

export const displayTerrainSaveDetail = (terrainSave: TerrainSave, p: player) => {
    const level = terrainSave.getLevel()
    const levelText = level === null ? 'global' : `level ${level.id}`

    let text =
        udg_colorCode[Constants.RED] + terrainSave.getLabel() + udg_colorCode[Constants.GREY] + ` (${levelText})|r\n`

    const zone = terrainSave.getZone()
    if (zone === null) {
        text += '    whole map\n'
    } else {
        text += `    ${zone.getSurface()} tiles (${zone.getSurfacePercent()}%)\n`
    }

    text += `    applied: ${terrainSave.isApplied() ? 'yes' : 'no'}`

    Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, text)

    if (zone !== null) {
        SetCameraPositionForPlayer(p, zone.getCenterX(), zone.getCenterY())
        zone.debugRects(true)
        createTimer(Constants.TERRAIN_DATA_DISPLAY_TIME, false, () => zone.debugRects(false))
    }
}
