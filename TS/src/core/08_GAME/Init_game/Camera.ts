const Trig_Camera_Actions = (): void => {
	SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, DEFAULT_CAMERA_FIELD, 0)
};

//===========================================================================
const InitTrig_Camera = (): void => {
	gg_trg_Camera = CreateTrigger();
	TriggerAddAction(gg_trg_Camera, Trig_Camera_Actions)
};

