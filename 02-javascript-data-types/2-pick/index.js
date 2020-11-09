/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const arrFromObj = Object.entries(obj);
    const newObj = [];
	
    arrFromObj.forEach( (item, index) => {
        if ( !fields.includes(item[0]) ) return;
		newObj.push(item);        		
    } );

    return Object.fromEntries(newObj);
};
