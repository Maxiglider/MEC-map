const initClearMob = () => {
    let htClearMob = InitHashtable()
    const CLEAR_MOB_MAX_DURATION = 300
    const TRIGGER_MOB = 0
    const TIMER_ACTIVATED = 1
    const TIMER_FRONT_MONTANT = 2
    // TODO; Used to be public
    const FRONT_MONTANT_DURATION = 0.03
    let udp_currentTimer: timer
    const MAX_NB_CLEAR_MOB_BY_LEVEL = 160
    const TRIGGER_MOB_PERMANENT_EFFECT = 'Abilities\\Spells\\Orc\\StasisTrap\\StasisTotemTarget.mdl'

    const ClearTriggerMobId2ClearMob = (triggerMobId: number): ClearMob => {
        return ClearMob(LoadInteger(htClearMob, 0, triggerMobId))
    }

    const ClearMobTimerExpires = () => {
        let clearMob = ClearMob(LoadInteger(htClearMob, TIMER_ACTIVATED, GetHandleId(GetExpiredTimer())))
        if (clearMob !== 0) {
            clearMob.initialize() //réinitialise la couleur du trigger mob
            udp_currentTimer = GetExpiredTimer()
            clearMob.getBlockMobs().executeForAll('TemporarilyEnableMonsterOrCasterEach')
        }
    }

    const ClearMobFrontMontantTimerExpires = () => {
        let clearMob = ClearMob(LoadInteger(htClearMob, TIMER_FRONT_MONTANT, GetHandleId(GetExpiredTimer())))
        if (clearMob !== 0) {
            if (clearMob.isBeingActivated()) {
                clearMob.getTriggerMob().setVertexColor(70, 100, 70)
            }
        }
    }

    const KillMonsterOrCasterEach = () => {
        GetEnumMoc().killUnit()
    }

    const TemporarilyDisableMonsterOrCasterEach = () => {
        GetEnumMoc().temporarilyDisable(udp_currentTimer)
    }

    const TemporarilyEnableMonsterOrCasterEach = () => {
        GetEnumMoc().temporarilyEnable(udp_currentTimer)
    }
}

export class ClearMob {
    //50 niveaux * 160

    level: Level
    arrayId: integer
    private triggerMob: MonsterOrCaster
    private blockMobs: MonsterOrCasterStack
    private disableDuration: real //0 = permanent
    private timerActivated: timer
    private timerFrontMontant: timer //le trigger mob reste en vert pêtant le temps du "front montant"
    enabled: boolean
    private triggerMobPermanentEffect: effect

    getDisableDuration = (): number => {
        return this.disableDuration
    }

    setDisableDuration = (disableDuration: number): boolean => {
        if (disableDuration > CLEAR_MOB_MAX_DURATION || disableDuration < FRONT_MONTANT_DURATION) {
            return false
        }
        this.disableDuration = disableDuration
        return true
    }

    getTriggerMob = (): MonsterOrCaster => {
        return this.triggerMob //return Monster
    }

    setTriggerMob = (newTriggerMob: MonsterOrCaster): boolean => {
        if (newTriggerMob === 0 || this.triggerMob === newTriggerMob) {
            return false
        }
        RemoveSavedInteger(htClearMob, TRIGGER_MOB, this.triggerMob.getId())
        SaveInteger(htClearMob, TRIGGER_MOB, newTriggerMob.getId(), integer(this))
        this.triggerMob = newTriggerMob
        return true
    }

    getBlockMobs = (): MonsterOrCasterStack => {
        return this.blockMobs
    }

    // TODO; Used to be static
    create = (triggerMobId: number /* todomax replace with Monster */, disableDuration: number): ClearMob => {
        let clearMob: ClearMob
        let triggerMob: MonsterOrCaster
        if (
            disableDuration !== 0 &&
            (disableDuration > CLEAR_MOB_MAX_DURATION || disableDuration < FRONT_MONTANT_DURATION)
        ) {
            return 0
        }
        triggerMob = new MonsterOrCaster(triggerMobId)
        if (triggerMob !== 0) {
            clearMob = ClearMob.allocate()
            clearMob.triggerMob = triggerMob
        } else {
            return 0
        }
        clearMob.blockMobs = 0
        clearMob.disableDuration = disableDuration
        clearMob.timerActivated = CreateTimer()
        clearMob.timerFrontMontant = CreateTimer()
        clearMob.triggerMobPermanentEffect = null
        clearMob.enabled = true
        SaveInteger(htClearMob, TRIGGER_MOB, triggerMobId, integer(clearMob))
        SaveInteger(htClearMob, TIMER_ACTIVATED, GetHandleId(clearMob.timerActivated), integer(clearMob))
        SaveInteger(htClearMob, TIMER_FRONT_MONTANT, GetHandleId(clearMob.timerFrontMontant), integer(clearMob))
        return clearMob
    }

    initialize = () => {
        this.triggerMob.setBaseColor('blue')
        this.triggerMob.setVertexColor(30, 60, 100)
        if (this.triggerMobPermanentEffect === null) {
            this.triggerMobPermanentEffect = AddSpecialEffectTarget(
                TRIGGER_MOB_PERMANENT_EFFECT,
                this.triggerMob.getUnit(),
                'origin'
            )
        }
        this.enabled = true
    }

    close = () => {
        if (this.triggerMobPermanentEffect !== null) {
            DestroyEffect(this.triggerMobPermanentEffect)
            this.triggerMobPermanentEffect = null
        }
    }

    redoTriggerMobPermanentEffect = () => {
        if (this.triggerMobPermanentEffect !== null) {
            DestroyEffect(this.triggerMobPermanentEffect)
        }
        this.triggerMobPermanentEffect = AddSpecialEffectTarget(
            TRIGGER_MOB_PERMANENT_EFFECT,
            this.triggerMob.getUnit(),
            'origin'
        )
    }

    addBlockMob = (blockMobId: number): boolean => {
        if (this.blockMobs.containsMob(blockMobId)) {
            return false
        }
        if (this.blockMobs === 0) {
            this.blockMobs = new MonsterOrCasterStack(new MonsterOrCaster(blockMobId))
            return this.blockMobs !== 0
        } else {
            return this.blockMobs.addMonsterOrCaster(new MonsterOrCaster(blockMobId))
        }
    }

    removeLastBlockMob = (): boolean => {
        this.blockMobs.getLast().temporarilyEnable(this.timerActivated)
        return this.blockMobs.removeLast()
    }

    removeAllBlockMobs = () => {
        udp_currentTimer = this.timerActivated
        this.blockMobs.executeForAll('TemporarilyEnableMonsterOrCasterEach')
        this.blockMobs.destroy()
        this.blockMobs = 0
    }

    destroy = () => {
        RemoveSavedInteger(htClearMob, TRIGGER_MOB, this.triggerMob.getId())
        RemoveSavedInteger(htClearMob, TIMER_ACTIVATED, GetHandleId(this.timerActivated))
        RemoveSavedInteger(htClearMob, TIMER_FRONT_MONTANT, GetHandleId(this.timerFrontMontant))
        this.close()
        this.triggerMob.reinitColor()
        this.triggerMob.destroy()
        this.triggerMob = 0
        udp_currentTimer = this.timerActivated
        this.blockMobs.executeForAll('TemporarilyEnableMonsterOrCasterEach')
        this.blockMobs.destroy()
        DestroyTimer(this.timerActivated)
        this.timerActivated = null
        DestroyTimer(this.timerFrontMontant)
        this.timerFrontMontant = null
        this.level.clearMobs.setClearMobNull(this.arrayId)
    }

    isBeingActivated = (): boolean => {
        return TimerGetRemaining(this.timerActivated) > 0
    }

    activate = () => {
        if (!this.enabled) {
            return
        }
        if (this.disableDuration === 0) {
            this.blockMobs.executeForAll('KillMonsterOrCasterEach')
            this.enabled = false
        } else {
            udp_currentTimer = this.timerActivated
            TimerStart(this.timerActivated, this.disableDuration, false, ClearMobTimerExpires)
            this.blockMobs.executeForAll('TemporarilyDisableMonsterOrCasterEach')
            TimerStart(this.timerFrontMontant, FRONT_MONTANT_DURATION, false, ClearMobFrontMontantTimerExpires)
        }
        //dans tous les cas le trigger mob "s'active"
        this.triggerMob.setBaseColor('green')
        this.triggerMob.setVertexColor(40, 100, 40)
    }
}
