/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    return [...arr].sort( (str1, str2) => {
        let direction = 1;
        if (param === 'desc') direction = -1;
        else if (param != 'asc') return arr;
        return direction * str1.localeCompare(str2, ['ru', 'en'], {caseFirst: 'upper'}); 
    } );
}