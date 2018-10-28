'use strict';

const DAY_MILLIS = 24 * 60 * 60 * 1000;

function getCurrentDateWithoutTime () {
    const currentTime = new Date().getTime();
    const correctedTime = currentTime - currentTime % DAY_MILLIS;
    return new Date(correctedTime);
}

function addDays (date, days) {
    const dateTime = date.getTime();
    const correctedTime = dateTime + days * DAY_MILLIS;
    return new Date(correctedTime);
}

module.exports = {
    getCurrentDateWithoutTime: getCurrentDateWithoutTime,
    addDays: addDays
};
