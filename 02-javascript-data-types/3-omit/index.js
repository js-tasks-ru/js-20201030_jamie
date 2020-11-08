/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    const arrFromObj = Object.entries(obj);
    const newObj = [];

    arrFromObj.forEach( (item, index) => {
        if ( fields.includes(item[0]) ) return;
        newObj.push(item);
    } )

    return Object.fromEntries(newObj);
};
