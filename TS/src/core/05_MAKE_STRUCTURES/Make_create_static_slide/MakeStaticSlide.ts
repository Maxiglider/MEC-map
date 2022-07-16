import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { StaticSlide } from 'core/04_STRUCTURES/Level/StaticSlide'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { createPoint, IPoint } from 'Utils/Point'

export class MakeStaticSlide extends Make {
    private staticSlide?: StaticSlide

    private points: IPoint[] = []
    private angle: number
    private speed: number

    constructor(maker: unit, angle: number, speed: number) {
        super(maker, 'createStaticSlide')
        this.angle = angle
        this.speed = speed
    }

    private createStaticSlide = () => {
        if (
            this.points[0]?.[0] &&
            this.points[0]?.[1] &&
            this.points[1]?.[0] &&
            this.points[1]?.[1] &&
            this.points[2]?.[0] &&
            this.points[2]?.[1] &&
            this.points[3]?.[0] &&
            this.points[3]?.[1]
        ) {
            this.staticSlide = this.escaper
                .getMakingLevel()
                .staticSlides.new(
                    this.points[0][0],
                    this.points[0][1],
                    this.points[1][0],
                    this.points[1][1],
                    this.points[2][0],
                    this.points[2][1],
                    this.points[3][0],
                    this.points[3][1],
                    this.angle,
                    this.speed
                )

            this.staticSlide.activate(true)
        }
    }

    clickMade = () => {
        Text.mkP(this.makerOwner, 'point added')
        arrayPush(this.points, createPoint(this.orderX, this.orderY))

        if (this.points.length === 4) {
            this.createStaticSlide()
            Text.mkP(this.makerOwner, 'static slide made')
            this.escaper.destroyMake()
        }
    }

    doActions = () => {
        if (super.doBaseActions()) {
            this.clickMade()
        }
    }
}
