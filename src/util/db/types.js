'use strict';

const types = require('pg').types;

types.setTypeParser(20, val => {
    return parseInt(val);
});
