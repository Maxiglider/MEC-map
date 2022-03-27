import { DEFAULT_CAMERA_FIELD } from 'core/01_libraries/Constants'
import { createEvent } from 'Utils/mapUtils'

// TODO; Trigger has no events and no external calls..?

export const InitTrig_Camera = () => {
    createEvent({
        events: [],
        actions: [() => SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, DEFAULT_CAMERA_FIELD, 0)],
    })
}
