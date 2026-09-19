import { Constants } from 'core/01_libraries/Constants'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { getUdgEscapers } from '../../../../globals'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { KEY_AND_DOOR_NEAR_DISTANCE } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'

/** -getDoorAndKeyInfo: a click on a key, or near a door or a key, of the making level shows the pair's info */
export class MakeGetDoorAndKeyInfo extends Make {
    constructor(maker: unit) {
        super(maker, 'getDoorAndKeyInfo', false)
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const keyAndDoors = this.escaper.getMakingLevel().keyAndDoors
            const keyItem = GetOrderTargetItem()
            const kad = (keyItem && keyAndDoors.getByKeyItem(keyItem)) || keyAndDoors.getNear(this.orderX, this.orderY)

            if (!kad) {
                Text.erP(
                    this.makerOwner,
                    'No door or key found near click location (max range: ' + KEY_AND_DOOR_NEAR_DISTANCE + ')'
                )
                return
            }

            const show = (line: string) => Text.P_timed(this.makerOwner, Constants.TERRAIN_DATA_DISPLAY_TIME, line)
            const grey = udg_colorCode[Constants.GREY]
            const red = udg_colorCode[Constants.RED]
            const space = '   '
            const at = (x: number, y: number) => I2S(R2I(x)) + ' ' + I2S(R2I(y))

            Text.DisplayLineToPlayer(this.makerOwner)
            show(udg_colorCode[Constants.TEAL] + '--- Door and Key Info ---')

            const door = kad.doorType
            show(red + 'Door: ' + door.label + (door.alias !== '' ? ' (' + door.alias + ')' : ''))
            show(
                grey +
                    "Destructable: '" +
                    door.destructableTypeId +
                    "'" +
                    space +
                    'Kill rect: ' +
                    door.killRectWidth +
                    ' x ' +
                    door.killRectHeight
            )
            show(
                grey +
                    'ID: ' +
                    kad.getId() +
                    space +
                    'Position: ' +
                    at(kad.doorX, kad.doorY) +
                    space +
                    'Angle: ' +
                    (kad.doorAngle === -1 ? 'random' : I2S(R2I(kad.doorAngle))) +
                    space +
                    (!kad.isOnMap() ? 'Not on the map' : kad.isOpened() ? 'Opened' : 'Closed')
            )

            const key = kad.keyType
            if (!key) {
                show(red + 'Key: ' + grey + 'none (opened by a map trigger)')
                return
            }

            show(red + 'Key: ' + key.label + (key.alias !== '' ? ' (' + key.alias + ')' : ''))
            const carrierId = kad.getCarrierId()
            const carrier = carrierId !== null ? getUdgEscapers().get(carrierId) : null
            show(
                grey +
                    "Item: '" +
                    key.itemTypeId +
                    "'" +
                    space +
                    'Start position: ' +
                    at(kad.keyX, kad.keyY) +
                    (carrier ? space + 'Carried by: ' + carrier.getDisplayName() : '')
            )
        }
    }
}
