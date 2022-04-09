export class ArrayHandler {
    private static tArrays: any[] = []
    private static freedArrays: any[] = []

    public static getNewArray(){
        const len = ArrayHandler.tArrays.length;
        let arrHandler = ArrayHandler.freedArrays.shift()
        if(arrHandler){
            ArrayHandler.tArrays[len] = arrHandler
            return arrHandler
        }else{
            return ArrayHandler.tArrays[len] = []
        }
    }

    public static clearArray(arr: any[]){
        //remove from tArrays
        const len = ArrayHandler.tArrays.length;
        for(let i = 0; i <= len; i++){
            if(arr === ArrayHandler.tArrays[i]){
                //delete content of the array
                const arrLen = arr.length
                for(let j = 0; j < arrLen; j++){
                    arr[j] = null
                }
                arr.length = 0

                //remove the array from the active ones
                table.remove(arr, i)

                //add the array to the freed ones
                const freedLen = ArrayHandler.freedArrays.length
                ArrayHandler.freedArrays[freedLen] = arr

                return
            }
        }
    }
}