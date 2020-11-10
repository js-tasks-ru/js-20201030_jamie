/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    let count = 1;
    const arrFromString = string.split('');

    for (let i = 0; i < arrFromString.length; i++) {
        if (count > size) {
            arrFromString.splice(i, 1);
            count -= 1;
            i -= 1;
        }
        if (arrFromString[i] === arrFromString[i + 1]) count +=1;
        else count = 1;
    }

    return arrFromString.join('');
}
