const { ResourceNotFoundError } = require('../errors');

function getOnly (results) {
    if (results.length === 0) {
        throw new ResourceNotFoundError();
    }
    return results[0];
}

function mapUnderscoreToCamelForString (string) {
    let newString = '';
    let i = 0;
    while (i < string.length) {
        if (string.charAt(i) === '_') {
            newString += string.charAt(i + 1).toUpperCase();
            i += 2;
        } else {
            newString += string.charAt(i);
            i++;
        }
    }
    return newString;
}

function mapCamelToUnderscoreForString (string) {
    let newString = '';
    string.split('').forEach(symbol => {
        const lowerSymbol = symbol.toLowerCase();
        if (symbol === lowerSymbol) {
            newString += symbol;
        } else {
            newString += '_' + lowerSymbol;
        }
    });
    return newString;
}

function mapObjectFields (object, mapper) {
    const newObject = {};
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            const correctedKey = mapper(key);
            newObject[correctedKey] = object[key];
        }
    }
    return newObject;
}

function mapUnderscoreToCamelForObject (object) {
    return mapObjectFields(object, mapUnderscoreToCamelForString);
}

function mapCamelToUnderscoreForObject (object) {
    return mapObjectFields(object, mapCamelToUnderscoreForString);
}

module.exports = {
    getOnly: getOnly,
    mapFieldsToCamel: mapUnderscoreToCamelForObject,
    mapFieldsToUnderscore: mapCamelToUnderscoreForObject
};
