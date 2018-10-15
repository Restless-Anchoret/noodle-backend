const fs = require('fs');
const path = require('path');

exports.up = function (db) {
    const filePath = path.join(__dirname, 'sqls', '20181012145200-create-tables-up.sql');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) return reject(err);
            console.log('received data: ' + data);

            resolve(data);
        });
    })
        .then(data => { return db.runSql(data); });
};

exports.down = function (db) {
    const filePath = path.join(__dirname, 'sqls', '20181012145200-create-tables-down.sql');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) return reject(err);
            console.log('received data: ' + data);

            resolve(data);
        });
    })
        .then(data => { return db.runSql(data); });
};

exports._meta = {
    'version': 1
};
