import { createTimer } from '../../../Utils/mapUtils'
import { Constants } from '../../01_libraries/Constants'
import { EstChiffre } from '../../01_libraries/Functions_on_numbers'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import type { TerrainSave } from '../../04_STRUCTURES/TerrainSave/TerrainSave'
import type { TerrainSaveEvent, TerrainSaveEventCondition } from '../../04_STRUCTURES/TerrainSave/TerrainSaveEvent'

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

    text += `    applied: ${terrainSave.isApplied() ? 'yes' : 'no'}\n`
    text += `    events: ${terrainSave.getEvents().count()}`

    Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, text)

    if (zone !== null) {
        SetCameraPositionForPlayer(p, zone.getCenterX(), zone.getCenterY())
        zone.debugRects(true, true)
        createTimer(Constants.TERRAIN_DATA_DISPLAY_TIME, false, () => zone.debugRects(false))
    }
}

// For -createTerrainSaveEvent/-editTerrainSaveEvent's "delay=<seconds>"/"periodic=<seconds>" optional params.
export const parseKeyValueParam = (param: string): { key: string; value: string } | null => {
    const eqIndex = param.indexOf('=')
    if (eqIndex <= 0) {
        return null
    }

    return { key: param.substring(0, eqIndex), value: param.substring(eqIndex + 1) }
}

export const formatTerrainSaveEventConditionText = (condition: TerrainSaveEventCondition): string => {
    switch (condition.kind) {
        case 'levelStart':
        case 'levelEnd':
            return `${condition.kind} (level ${condition.levelNum})`
        case 'monsterTouch':
            return `monsterTouch (monster #${condition.monsterId})`
    }
}

const formatTerrainSaveEventTimingText = (event: TerrainSaveEvent): string => {
    let text = ''
    if (event.delay !== undefined) {
        text += `, delay ${event.delay}s`
    }
    if (event.periodicInterval !== undefined) {
        text += `, periodic ${event.periodicInterval}s`
    }
    return text
}

// withOwnerLabel: the "all events in the game" list prefixes each line with its owning TerrainSave's label;
// a per-TerrainSave list doesn't need to repeat it.
export const formatTerrainSaveEventSummaryLine = (event: TerrainSaveEvent, withOwnerLabel: boolean): string => {
    let text = udg_colorCode[Constants.GREY] + `#${event.getId()}|r `

    if (withOwnerLabel) {
        text += udg_colorCode[Constants.RED] + event.terrainSave.getLabel() + udg_colorCode[Constants.GREY] + ' - |r'
    }

    text += `${event.action} on ${formatTerrainSaveEventConditionText(event.condition)}${formatTerrainSaveEventTimingText(event)}`

    return text
}

export const displayTerrainSaveEventDetail = (event: TerrainSaveEvent, p: player) => {
    let text = udg_colorCode[Constants.GREY] + `Event #${event.getId()}|r\n`
    text += `    terrain save: ${event.terrainSave.getLabel()}\n`
    text += `    condition: ${formatTerrainSaveEventConditionText(event.condition)}\n`
    text += `    action: ${event.action}\n`
    text += `    delay: ${event.delay !== undefined ? event.delay + 's' : 'none'}\n`
    text += `    periodic: ${event.periodicInterval !== undefined ? event.periodicInterval + 's' : 'none'}`

    Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, text)
}
