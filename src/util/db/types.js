var types = require('pg').types;

types.setTypeParser(20, val => {
    return parseInt(val);
});
