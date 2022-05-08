import {Text} from "../core/01_libraries/Text";
import {ArrayHandler} from "./ArrayHandler";
import {ObjectHandler} from "./ObjectHandler";

let nbArraysObjectsCleared = 0

export const getNbArraysObjectsCleared = function(){
    return nbArraysObjectsCleared
}

export const resetNbArraysObjectsCleared = function(){
    nbArraysObjectsCleared = 0
}

export const clearArrayOrObject = (item: {} | []) => {
    const meta = (getmetatable(item) as any)
    if(!meta) return

    const index = meta.__id
    const type = meta.__type

    if(!index || !type) return
    
    if(type == 'arr'){
        const arrayInMap = ArrayHandler.tArrays.get(index)

        if (!arrayInMap) {
            Text.erA(
                `clearArrayOrObject : Index: '${index}' not known in ArrayHandler. '${item?.constructor?.name || ''} '${
                    (item as any)?.[0]?.constructor?.name || ''
                }`
            )
        }else if (arrayInMap !== item) {
            Text.erA('clearArrayOrObject : Arrays different in ArrayHandler')
        }else {
            //delete content of the array
            for (const [k] of pairs(item)) {
                clearArrayOrObject(item[k])
                ;(item[k] as any) = null
            }

            //remove the array from the active ones
            ArrayHandler.tArrays.delete(index)

            //add the array to the freed ones
            const freedLen = ArrayHandler.freedArrays.length
            ArrayHandler.freedArrays[freedLen] = item

            nbArraysObjectsCleared++
        }
    }else if(type == 'obj'){
        const objectInMap = ObjectHandler.tObjects.get(index)

        if (!objectInMap) {
            Text.erA(`clearArrayOrObject : Index: '${index}' not known in ObjectHandler. '${item?.constructor?.name || ''}'`)
        }else if (objectInMap !== item) {
            Text.erA('clearArrayOrObject : Objects different in ObjectHandler')
        }else {
            //delete content of the object
            for (const [k] of pairs(item)) {
                clearArrayOrObject(item[k])
                ;(item[k] as any) = null
            }

            //remove the object from the active ones
            ObjectHandler.tObjects.delete(index)

            //add the object to the freed ones
            const freedLen = ObjectHandler.freedObjects.length
            ObjectHandler.freedObjects[freedLen] = item

            nbArraysObjectsCleared++
        }
    }else{
        Text.erA(`clearArrayOrObject : Index: '${index}' : type unknown`)
    }
}