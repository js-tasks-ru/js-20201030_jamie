/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const objProperties = path.split('.');

    return (obj) => {
        let value = obj[objProperties[0]];

        for (let i = 1; i < objProperties.length; i++){
            if (value === undefined) return value;
            value = value[objProperties[i]];
        }
        return value;
    }
}
