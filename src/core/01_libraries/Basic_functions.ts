import { getUdgEscapers, globals } from '../../../globals'
import { IPoint } from '../../Utils/Point'
import { Natives } from '../wc3_natives_unsecured/Natives'
import { Constants } from './Constants'

let udg_currentMonsterPlayerId = 0

export const IsUnitBetweenLocs = (u: unit, x1: number, y1: number, x2: number, y2: number): boolean => {
    let minX = RMinBJ(x1, x2)
    let maxX = RMaxBJ(x1, x2)
    let minY = RMinBJ(y1, y2)
    let maxY = RMaxBJ(y1, y2)

    let x = GetUnitX(u)
    let y = GetUnitY(u)

    return minX < x && maxX > x && minY < y && maxY > y
}

export const IsItemBetweenLocs = (i: item, x1: number, y1: number, x2: number, y2: number): boolean => {
    let minX = RMinBJ(x1, x2)
    let maxX = RMaxBJ(x1, x2)
    let minY = RMinBJ(y1, y2)
    let maxY = RMaxBJ(y1, y2)

    let x = GetItemX(i)
    let y = GetItemY(i)

    return minX < x && maxX > x && minY < y && maxY > y
}

export const EscaperIdToPlayer = (escaperId: number): player => {
    if (escaperId > Constants.NB_PLAYERS_MAX - 1) {
        escaperId = escaperId - Constants.NB_PLAYERS_MAX
    }

    return Natives.UPlayer(escaperId)
}

export const IsEscaperInGame = (escaperId: number): boolean => {
    let p = EscaperIdToPlayer(escaperId)
    return GetPlayerController(p) === MAP_CONTROL_USER && GetPlayerSlotState(p) === PLAYER_SLOT_STATE_PLAYING
}

export const IsIssuedOrder = (orderString: string): boolean => {
    return GetIssuedOrderId() === OrderId(orderString)
}

export const IsLastOrderPause = (): boolean => {
    return GetIssuedOrderId() === 851973
}

export const GetLocDist = (x1: number, y1: number, x2: number, y2: number): number => {
    let diffX = x2 - x1
    let diffY = y2 - y1
    return SquareRoot(diffX * diffX + diffY * diffY)
}

export const GetCurrentMonsterPlayer = (): player => {
    if (udg_currentMonsterPlayerId >= Constants.NB_PLAYERS_MAX - 1) {
        udg_currentMonsterPlayerId = 0
    } else {
        udg_currentMonsterPlayerId = udg_currentMonsterPlayerId + 1
    }
    return Natives.UPlayer(udg_currentMonsterPlayerId)
}

export const IsUnitInvulnerable = (u: unit): boolean => {
    let life = GetUnitState(u, UNIT_STATE_LIFE)
    let damages: number
    UnitDamageTarget(u, u, 0.01, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNIVERSAL, WEAPON_TYPE_WHOKNOWS)
    damages = life - GetUnitState(u, UNIT_STATE_LIFE)
    SetUnitState(u, UNIT_STATE_LIFE, life)
    return damages === 0
}

export const StopUnit = (U: unit) => {
    PauseUnit(U, true)
    IssueImmediateOrder(U, 'stop')
    PauseUnit(U, false)
}

export const ClearTextForPlayer = (p: player) => {
    if (GetLocalPlayer() === p) {
        ClearTextMessages()
    }
}

export const IsBoolString = (S: string): boolean => {
    return S === 'true' || S === 'false' || S === 'on' || S === 'off' || S === '1' || S === '0'
}

export const S2B = (S: string): boolean => {
    return S === 'true' || S === 'on' || S === '1'
}

export const B2S = (b: boolean): string => {
    if (b) {
        return 'true'
    }
    return 'false'
}

export const IsOnGround = (slider: unit): boolean => {
    return GetUnitFlyHeight(slider) < 1
}

export const IsNearBounds = (x: number, y: number): boolean => {
    return (
        y >= globals.MAP_MAX_Y - Constants.LARGEUR_CASE * 2 ||
        x >= globals.MAP_MAX_X - Constants.LARGEUR_CASE * 2 ||
        x <= globals.MAP_MIN_X + Constants.LARGEUR_CASE * 2 ||
        y <= globals.MAP_MIN_Y + Constants.LARGEUR_CASE * 2
    )
}

export const tileset2tilesetChar = (tileset: string): string => {
    if (tileset === 'auto') {
        return 'auto'
    } else if (tileset === 'A' || tileset === 'a' || tileset === 'Ashenvale') {
        return 'A'
    } else if (tileset === 'B' || tileset === 'b' || tileset === 'Barrens') {
        return 'B'
    } else if (tileset === 'C' || tileset === 'c' || tileset === 'Felwood') {
        return 'C'
    } else if (tileset === 'D' || tileset === 'd' || tileset === 'Dungeon') {
        return 'D'
    } else if (tileset === 'F' || tileset === 'f' || tileset === 'Lordaeron Fall') {
        return 'F'
    } else if (tileset === 'G' || tileset === 'g' || tileset === 'Underground') {
        return 'G'
    } else if (tileset === 'L' || tileset === 'l' || tileset === 'Lordaeron Summer') {
        return 'L'
    } else if (tileset === 'N' || tileset === 'n' || tileset === 'Northrend') {
        return 'N'
    } else if (tileset === 'Q' || tileset === 'q' || tileset === 'Village Fall') {
        return 'Q'
    } else if (tileset === 'V' || tileset === 'v' || tileset === 'Village') {
        return 'V'
    } else if (tileset === 'W' || tileset === 'w' || tileset === 'Lordaeron Winter') {
        return 'W'
    } else if (tileset === 'X' || tileset === 'x' || tileset === 'Dalaran') {
        return 'X'
    } else if (tileset === 'Y' || tileset === 'y' || tileset === 'Cityscape') {
        return 'Y'
    } else if (tileset === 'Z' || tileset === 'z' || tileset === 'Sunken Ruins') {
        return 'Z'
    } else if (tileset === 'I' || tileset === 'i' || tileset === 'Icecrown') {
        return 'I'
    } else if (tileset === 'J' || tileset === 'j' || tileset === 'Dalaran Ruins') {
        return 'J'
    } else if (tileset === 'O' || tileset === 'o' || tileset === 'Outland') {
        return 'O'
    } else if (tileset === 'K' || tileset === 'k' || tileset === 'Black Citadel') {
        return 'K'
    }

    return ''
}

export const tileset2tilesetString = (tileset: string): string => {
    if (tileset === 'auto') {
        return 'auto'
    } else if (tileset === 'A' || tileset === 'a' || tileset === 'Ashenvale') {
        return 'Ashenvale'
    } else if (tileset === 'B' || tileset === 'b' || tileset === 'Barrens') {
        return 'Barrens'
    } else if (tileset === 'C' || tileset === 'c' || tileset === 'Felwood') {
        return 'Felwood'
    } else if (tileset === 'D' || tileset === 'd' || tileset === 'Dungeon') {
        return 'Dungeon'
    } else if (tileset === 'F' || tileset === 'f' || tileset === 'Lordaeron Fall') {
        return 'Lordaeron Fall'
    } else if (tileset === 'G' || tileset === 'g' || tileset === 'Underground') {
        return 'Underground'
    } else if (tileset === 'L' || tileset === 'l' || tileset === 'Lordaeron Summer') {
        return 'Lordaeron Summer'
    } else if (tileset === 'N' || tileset === 'n' || tileset === 'Northrend') {
        return 'Northrend'
    } else if (tileset === 'Q' || tileset === 'q' || tileset === 'Village Fall') {
        return 'Village Fall'
    } else if (tileset === 'V' || tileset === 'v' || tileset === 'Village') {
        return 'Village'
    } else if (tileset === 'W' || tileset === 'w' || tileset === 'Lordaeron Winter') {
        return 'Lordaeron Winter'
    } else if (tileset === 'X' || tileset === 'x' || tileset === 'Dalaran') {
        return 'Dalaran'
    } else if (tileset === 'Y' || tileset === 'y' || tileset === 'Cityscape') {
        return 'Cityscape'
    } else if (tileset === 'Z' || tileset === 'z' || tileset === 'Sunken Ruins') {
        return 'Sunken Ruins'
    } else if (tileset === 'I' || tileset === 'i' || tileset === 'Icecrown') {
        return 'Icecrown'
    } else if (tileset === 'J' || tileset === 'j' || tileset === 'Dalaran Ruins') {
        return 'Dalaran Ruins'
    } else if (tileset === 'O' || tileset === 'o' || tileset === 'Outland') {
        return 'Outland'
    } else if (tileset === 'K' || tileset === 'k' || tileset === 'Black Citadel') {
        return 'Black Citadel'
    }

    return ''
}

export const ApplyAngleSymmetry = (previousAngle: number, symmetryAngle: number): number => {
    return -(previousAngle - symmetryAngle) + symmetryAngle
}

export const stringReplaceAll = (toReplace: string, replacement: string, str: string) => {
    let str2: string = str
    do {
        str = str2
        str2 = str.replace(toReplace, replacement)
    } while (str != str2)

    return str2
}

// WC3 chat text interprets "|" as the start of a color code (e.g. "|r" resets color) - a literal "|" must
// be doubled ("||") to display as-is. strings().replaceAll runs on Lua's string.gsub, a single pass over the
// original string, so (unlike stringReplaceAll's loop-until-stable above) it never re-matches the "|" it
// just inserted - which a doubling replacement like this one would otherwise cause to grow forever.
export const escapePipes = (str: string): string => strings().replaceAll('|', '||', str)

export function ucfirst(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function arrayPush<T>(arr: T[], value: T) {
    arr[arr.length] = value
}

export function jsonEncode<T>(v: T): string {
    return json().encode(v)
}

export function jsonDecode<T>(v: string): T | undefined {
    return json().decode(v)
}

export function arrayValuesRound(values: number[]) {
    return values.map(value => R2I(value))
}

const sortTwoObjectsById = (a: { [x: string | number]: any }, b: { [x: string | number]: any }) => {
    if (a.getId !== undefined) {
        return a.getId() < b.getId()
    } else {
        return a.id < b.id
    }
}

export function sortArrayOfObjectsByIds(array: { [x: string | number]: any }[]) {
    if (array.length == 0 || (array[0].getId === undefined && array[0].id === undefined)) {
        return array
    }

    table.sort(array, sortTwoObjectsById)
    return array
}

export const roundCoordinateToCenterOfTile = (coord: number) => {
    return Math.round(coord / Constants.LARGEUR_CASE) * Constants.LARGEUR_CASE
}

export const outOfBounds = (x: number, y: number) => {
    let out = false
    out ||= x < globals.MAP_MIN_X || x > globals.MAP_MAX_X
    out ||= y < globals.MAP_MIN_Y || y > globals.MAP_MAX_Y
    return out
}

export const genstr = (len: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export const Player2Escaper = (p: player) => {
    return getUdgEscapers().get(GetPlayerId(p))
}

export function ForceAngleBetween0And360(angle: number) {
    while (angle < 0) angle += 360
    while (angle >= 360) angle -= 360
    return angle
}

export function AnglesDiff(endAngle: number, startAngle: number) {
    endAngle = ForceAngleBetween0And360(endAngle)
    startAngle = ForceAngleBetween0And360(startAngle)

    let anglesDiff = endAngle - startAngle
    if (anglesDiff < -180) anglesDiff += 360
    if (anglesDiff > 180) anglesDiff -= 360

    return anglesDiff
}

export function areNumberSameSens(a: number, b: number) {
    return (a < 0 && b < 0) || (a >= 0 && b >= 0)
}

export function addObjectContents(myObj: {}, additionalObj: {}) {
    for (const [key, val] of pairs(additionalObj)) {
        myObj[key] = val
    }
}

export function emptyOject(myObj: {}) {
    for (const [key] of pairs(myObj)) {
        delete myObj[key]
    }
}

export const convertTextToAngle = (param: string) => {
    if (param === 'leftToRight') {
        return 0
    } else if (param === 'upToDown') {
        return 270
    } else if (param === 'rightToLeft') {
        return 180
    } else if (param === 'downToUp') {
        return 90
    }

    const p = param
        .toLowerCase()
        .replace('leftto', '')
        .replace('upto', '')
        .replace('rightto', '')
        .replace('downto', '')
        .replace('lt', '')
        .replace('ut', '')
        .replace('rt', '')
        .replace('dt', '')

    const ups = ['up', 'top', 'north']
    const rights = ['right', 'east']
    const downs = ['down', 'bottom', 'south']
    const lefts = ['left', 'west']

    if (S2I(p) > 0 && S2I(p) <= 360) {
        return S2I(p)
    } else if (downs.find(u => rights.find(r => u + r === p || u[0] + r[0] === p))) {
        return 315
    } else if (downs.find(u => u === p || u[0] === p)) {
        return 270
    } else if (downs.find(u => lefts.find(l => u + l === p || u[0] + l[0] === p))) {
        return 225
    } else if (lefts.find(u => u === p || u[0] === p)) {
        return 180
    } else if (ups.find(u => lefts.find(l => u + l === p || u[0] + l[0] === p))) {
        return 135
    } else if (ups.find(u => u === p || u[0] === p)) {
        return 90
    } else if (ups.find(u => rights.find(r => u + r === p || u[0] + r[0] === p))) {
        return 45
    } else if (rights.find(u => u === p || u[0] === p)) {
        return 0
    }

    return undefined
}

const angleToDirectionMap = [
    'leftToRight',
    'bottomLeftToTopRight',
    'bottomToTop',
    'bottomRightToTopLeft',
    'rightToLeft',
    'topRightToBottomLeft',
    'topToBottom',
    'topLeftToBottomRight',
]

export const convertAngleToDirection = (angle: number): string => {
    const index = Math.round(angle / 45) % 8
    return angleToDirectionMap[index]
}

export function canPlayerControlUnit(player: player, u: unit): boolean {
    const owner = GetOwningPlayer(u)
    if (owner === player) return true
    return GetPlayerAlliance(owner, player, ALLIANCE_SHARED_CONTROL)
}

export function GetRandomAngle() {
    return Math.floor(Math.random() * 360)
}

// For WC3 Rects
export function Round32(num: number): number {
    return Math.round(num / 32) * 32
}

export const ApplyRotation = (anchorX: number, anchorY: number, angleDegrees: number, point: IPoint) => {
    const angleRads = Deg2Rad(angleDegrees)

    const cos = math.cos(angleRads)
    const sin = math.sin(angleRads)

    const newX = (point.x - anchorX) * cos - (point.y - anchorY) * sin + anchorX
    const newY = (point.x - anchorX) * sin + (point.y - anchorY) * cos + anchorY

    point.x = newX
    point.y = newY

    return point
}

export const ClearText = () => {
    getUdgEscapers().forMainEscapers(escaper => {
        ClearTextForPlayer(escaper.getPlayer())
    })
}

export const ReplaceBackslahsesInLinks = (str: string): string => {
    return strings().replaceBackslahsesInLinks(str)
}
