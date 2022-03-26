import { Text } from 'core/01_libraries/Text'

const CACHE_SEPARATEUR_ITEM = '('
const CACHE_SEPARATEUR_PARAM = ','

// TODO; Used to be private
const MAX_STRING_LENGTH = 200
let stringArrayForCache = 0

const StringArrayForCache = (category: string, variableName: string, avecSeparateur: boolean) => {
    const stringArray: string[] = []
    const lastStringId = -1

    const nextString = () => {
        this.lastStringId = this.lastStringId + 1
        this.stringArray[this.lastStringId] = ''
    }

    const push = (str: string) => {
        let length: number
        let nbCharsDispoForCurrentString: number
        if (this.lastStringId === -1) {
            this.nextString()
        } else {
            if (StringLength(this.stringArray[this.lastStringId]) === MAX_STRING_LENGTH) {
                this.nextString()
            }
            if (this.avecSeparateur) {
                this.stringArray[this.lastStringId] = this.stringArray[this.lastStringId] + CACHE_SEPARATEUR_ITEM
            }
        }
        nbCharsDispoForCurrentString = MAX_STRING_LENGTH - StringLength(this.stringArray[this.lastStringId])
        length = StringLength(str)
        while (true) {
            if (length === 0) break
            if (length > nbCharsDispoForCurrentString) {
                this.stringArray[this.lastStringId] =
                    this.stringArray[this.lastStringId] + SubStringBJ(str, 1, nbCharsDispoForCurrentString)
                this.nextString()
                str = SubStringBJ(str, nbCharsDispoForCurrentString + 1, length)
            } else {
                this.stringArray[this.lastStringId] = this.stringArray[this.lastStringId] + str
                str = ''
            }
            nbCharsDispoForCurrentString = MAX_STRING_LENGTH - StringLength(this.stringArray[this.lastStringId])
            length = StringLength(str)
        }
    }

    const writeInCache = () => {
        let i: number
        if (this.lastStringId > 0) {
            i = 0
            while (true) {
                if (i > this.lastStringId) break
                StoreString(saveMap_cache, this.category, this.variableName + I2S(i), this.stringArray[i])
                //call Text.A(I2S(i) + " : " + this.stringArray[i])
                //call Text.A("longueur chaîne : " + I2S(StringLength(this.stringArray[i])))
                i = i + 1
            }
        } else {
            if (this.lastStringId === 0) {
                StoreString(saveMap_cache, this.category, this.variableName, this.stringArray[0])
                Text.A(this.stringArray[0])
                Text.A('longueur chaîne : ' + I2S(StringLength(this.stringArray[0])))
            }
        }
        Text.A(this.category + ', ' + this.variableName + ' : finish write in cache')
    }

    return { push, writeInCache }
}
