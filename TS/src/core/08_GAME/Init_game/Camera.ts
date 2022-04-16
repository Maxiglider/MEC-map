import { DEFAULT_CAMERA_FIELD } from 'core/01_libraries/Constants'
import { createEvent } from 'Utils/mapUtils'

export const InitTrig_Camera = () => {
    createEvent({
        events: [],
        actions: [() => SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, DEFAULT_CAMERA_FIELD, 0)],
    })
}
