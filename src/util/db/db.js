const { Pool } = require('pg');
const appContext = require('../application-context');
const _ = require('lodash');
const dbUtils = require('./utils');
const loggerFactory = require('../logger-factory');

const log = loggerFactory.getLogger(__filename);

let pool;

function getPool () {
    if (pool) {
        return pool;
    }

    const config = appContext.config;
    pool = new Pool({
        user: config.db.user,
        host: config.db.host,
        database: config.db.database,
        password: config.db.password,
        port: config.db.port,
        min: config.db.minConnections,
        max: config.db.maxConnections
    });
    return pool;
}

function convert (result, mapper) {
    if (!mapper) {
        return result.rows;
    } else {
        return _.map(result.rows, mapper);
    }
}

class ClientWrapper {
    constructor (client) {
        this.client = client;
    }

    async query (query, params, mapper) {
        const result = await this.client.query(query, params);
        return convert(result, mapper);
    }

    async insert (entity, table, returnId) {
        await insertForClient(this.client, entity, table, returnId);
    }

    async findById (id, table) {
        return findByIdForClient(this.client, id, table);
    }
}

async function query (query, params, mapper) {
    const pool = getPool();
    const result = await pool.query(query, params);
    return convert(result, mapper);
}

async function transaction (code) {
    const pool = getPool();
    const client = await pool.connect();
    const clientWrapper = new ClientWrapper(client);

    try {
        await client.query('begin');
        const result = await code(clientWrapper);
        await client.query('commit');
        return result;
    } catch (err) {
        log.warn('Transaction rollback caused by:', err);
        await client.query('rollback');
        throw err;
    } finally {
        client.release();
    }
}

async function insert (entity, table, returnId) {
    const pool = getPool();
    await insertForClient(pool, entity, table, returnId);
}

async function findById (id, table) {
    const pool = getPool();
    return findByIdForClient(pool, id, table);
}

async function insertForClient (client, entity, table, returnId) {
    const correctedReturnId = (returnId === undefined ? true : returnId);

    const query = getInsertQuery(entity, table, correctedReturnId);
    const params = getInsertParams(entity);
    const result = await client.query(query, params);

    if (correctedReturnId) {
        entity.id = dbUtils.getOnly(result.rows).id;
    }
}

function getInsertQuery (entity, table, returnId) {
    const correctedEntity = dbUtils.mapFieldsToUnderscore(entity);

    const fields = [];
    for (let key in correctedEntity) {
        if (correctedEntity.hasOwnProperty(key)) {
            fields.push(key);
        }
    }

    const templates = _.map(fields, (field, index) => {
        return `$${index + 1}`;
    });

    const query = `insert into ${table} (${fields.join(', ')}) values (${templates.join(', ')})`;
    return (returnId ? query + ' returning id' : query);
}

function getInsertParams (entity) {
    const params = [];
    for (let key in entity) {
        if (entity.hasOwnProperty(key)) {
            params.push(entity[key]);
        }
    }
    return params;
}

async function findByIdForClient (client, id, table) {
    const query = `select * from ${table} where id = $1`;
    const result = await client.query(query, [id]);
    const convertedResults = convert(result, dbUtils.mapFieldsToCamel);
    return dbUtils.getOnly(convertedResults);
}

module.exports = {
    query: query,
    transaction: transaction,
    insert: insert,
    findById: findById
};
