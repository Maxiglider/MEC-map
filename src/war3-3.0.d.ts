/**
 * Natives and constants of Warcraft III 3.0 (build 24268) that war3-types-strict, stuck at 1.33.0, does not
 * declare yet: only the ones MEC may use, taken from the common.j of 3.0
 * (https://github.com/Luashine/jass-history/commit/a392fc3d5e6c37980accbfc560b28387fc7d01bc), written the
 * way war3-types-strict writes its own.
 *
 * Not declarable here: 3.0 makes framehandle an agent (it was a handle), which an interface merge cannot
 * change. What it means still holds: a frame made or destroyed by one machine alone can desync the game.
 */

// Keyboard and mouse, read on this machine alone, at once: nothing crosses the network, so never feed
// what they read to anything the game plays out

/** The sum of METAKEY_* for the modifiers to test, all of them pressed */
declare function BlzIsMetaKeyPressed(metakey: number): boolean

declare function BlzIsKeyPressed(key: oskeytype): boolean

declare function BlzIsMouseButtonPressed(mouseButtonType: mousebuttontype): boolean

/** In pixels of the game window */
declare function BlzGetMouseScreenPosX(): number

/** In pixels of the game window */
declare function BlzGetMouseScreenPosY(): number

declare function BlzPixelToFrameX(pixelX: number): number

declare function BlzPixelToFrameY(pixelY: number): number

declare function BlzFrameToPixelX(frameX: number): number

declare function BlzFrameToPixelY(frameY: number): number

declare const METAKEY_NONE: number
declare const METAKEY_SHIFT: number
declare const METAKEY_CTRL: number
declare const METAKEY_ALT: number
declare const METAKEY_WINKEYS: number

// Camera

declare const CAMERA_FIELD_DEPTH_OF_FIELD_DISTANCE: camerafield
declare const CAMERA_FIELD_DEPTH_OF_FIELD_SCALE: camerafield
declare const CAMERA_FIELD_ZABSOLUTE: camerafield

/** Whether the player's own input (mouse wheel, keys) may change that field, on this machine */
declare function SetCameraFieldControlledByInput(whichField: camerafield, controlled: boolean): void

declare function GetCameraFieldControlledByInput(whichField: camerafield): boolean

declare function SetCameraFieldControlledByInputForPlayer(
    whichPlayer: player,
    whichField: camerafield,
    controlled: boolean
): void

// Special effects and animations

declare function BlzSetSpecialEffectAnimation(whichEffect: effect, whichAnimation: string): void

declare function BlzQueueSpecialEffectAnimation(whichEffect: effect, whichAnimation: string): void

declare function BlzSetSpecialEffectAnimationBlendTime(whichEffect: effect, blendTime: number): void

declare function BlzGetUnitAnimationDuration(whichUnit: unit, whichAnimation: string): number

declare function BlzGetUnitAnimationDurationByIndex(whichUnit: unit, index: number): number

// Terrain

declare function BlzIsTerrainPathableEx(x: number, y: number, t: pathingtype): boolean
