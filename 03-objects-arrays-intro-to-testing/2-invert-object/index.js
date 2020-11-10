/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

    if (typeof obj === "object") {    
        const newObj = {};

        for(let prop in obj) {
            newObj[obj[prop]] = prop;
        }
        return newObj;
    } 
    else return obj;
}
