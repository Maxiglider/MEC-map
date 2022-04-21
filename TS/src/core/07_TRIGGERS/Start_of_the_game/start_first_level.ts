import { getUdgLevels } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'

export const init_startFirstLevel = () => {
    createTimer(0, false, () => {
        getUdgLevels().get(0)?.activate(true)
    })
}
