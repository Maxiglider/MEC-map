export class TerrainType {
    label: string
    theAlias: string
    kind: string
    terrainTypeId: number
    orderId: number //numéro du terrain (ordre des tilesets), de 1 à 16
    cliffClassId: number //cliff class 1 or 2, depending of the main tileset

    setOrderId = (orderId: number): TerrainType => {
        this.orderId = orderId
        return TerrainType(integer(this))
    }

    getOrderId = (): number => {
        return this.orderId
    }

    setCliffClassId = (cliffClassId: number): TerrainType => {
        if (cliffClassId === 1 || cliffClassId === 2) {
            this.cliffClassId = cliffClassId
        }
        return TerrainType(integer(this))
    }

    getCliffClassId = (): number => {
        return this.cliffClassId
    }

    setType = (terrainTypeId: number) => {
        this.terrainTypeId = terrainTypeId
    }

    setLabel = (label: string) => {
        this.label = label
    }

    setAlias = (theAlias: string): TerrainType => {
        this.theAlias = theAlias
        return TerrainType(integer(this))
    }

    getTerrainTypeId = (): number => {
        return this.terrainTypeId
    }

    setTerrainTypeId = (terrainTypeId: number): boolean => {
        if (!CanUseTerrain(terrainTypeId)) {
            return false
        }
        this.terrainTypeId = terrainTypeId
        return true
    }

    getKind = (): string => {
        return this.kind
    }

    destroy = () => {
        this.label = null
        this.theAlias = null
        this.kind = null
        this.terrainTypeId = 0
    }

    displayForPlayer = (p: player) => {
        let order: string
        let space = '   '
        let slide: TerrainTypeSlide
        let walk: TerrainTypeWalk
        let death: TerrainTypeDeath
        let displayCanTurn: string
        let display: string
        if (this.orderId !== 0) {
            order = ' (order ' + I2S(this.orderId) + ')'
        } else {
            order = ''
        }
        if (this.kind === 'slide') {
            slide = TerrainTypeSlide(integer(this))
            if (slide.getCanTurn()) {
                displayCanTurn = 'can turn'
            } else {
                displayCanTurn = "can't turn"
            }
            display =
                COLOR_TERRAIN_SLIDE +
                this.label +
                ' ' +
                this.theAlias +
                order +
                " : '" +
                Ascii2String(this.terrainTypeId) +
                "'" +
                space
            display = display + I2S(R2I(slide.getSlideSpeed() / SLIDE_PERIOD)) + space + displayCanTurn
        } else {
            if (this.kind === 'walk') {
                walk = TerrainTypeWalk(integer(this))
                display =
                    COLOR_TERRAIN_WALK +
                    this.label +
                    ' ' +
                    this.theAlias +
                    order +
                    " : '" +
                    Ascii2String(this.terrainTypeId) +
                    "'" +
                    space
                display = display + I2S(R2I(walk.getWalkSpeed()))
            } else {
                if (this.kind === 'death') {
                    death = TerrainTypeDeath(integer(this))
                    display =
                        COLOR_TERRAIN_DEATH +
                        this.label +
                        ' ' +
                        this.theAlias +
                        order +
                        " : '" +
                        Ascii2String(this.terrainTypeId) +
                        "'" +
                        space
                    display =
                        display +
                        R2S(death.getTimeToKill()) +
                        space +
                        death.getKillingEffectStr() +
                        space +
                        I2S(R2I(death.getToleranceDist()))
                }
            }
        }
        //display cliff class
        display = display + space + 'cliff' + I2S(this.cliffClassId)
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    toString = (): string => {
        let slide: TerrainTypeSlide
        let walk: TerrainTypeWalk
        let death: TerrainTypeDeath
        let str =
            this.label +
            CACHE_SEPARATEUR_PARAM +
            this.theAlias +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.orderId) +
            CACHE_SEPARATEUR_PARAM
        str =
            str +
            this.kind +
            CACHE_SEPARATEUR_PARAM +
            Ascii2String(this.terrainTypeId) +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.cliffClassId) +
            CACHE_SEPARATEUR_PARAM
        if (this.kind === 'slide') {
            slide = TerrainTypeSlide(integer(this))
            str =
                str + I2S(R2I(slide.getSlideSpeed() / SLIDE_PERIOD)) + CACHE_SEPARATEUR_PARAM + B2S(slide.getCanTurn())
        } else {
            if (this.kind === 'walk') {
                walk = TerrainTypeWalk(integer(this))
                str = str + I2S(R2I(walk.getWalkSpeed()))
            } else {
                if (this.kind === 'death') {
                    death = TerrainTypeDeath(integer(this))
                    str = str + death.getKillingEffectStr() + CACHE_SEPARATEUR_PARAM
                    str = str + R2S(death.getTimeToKill()) + CACHE_SEPARATEUR_PARAM
                    str = str + R2S(death.getToleranceDist())
                }
            }
        }
        return str
    }
}
