const accountDao = require('../dao/account-dao');
const accountService = require('../service/account-service');
const listService = require('../service/list-service');
const taskDao = require('../dao/task-dao');
const taskService = require('../service/task-service');
const appContext = require('../util/application-context');
const db = require('../util/db/db');
const { env, taskStatus } = require('../schema/enum');
const loggerFactory = require('../util/logger-factory');

const log = loggerFactory.getLogger(__filename);

const ACCOUNT_LOGIN = 'login';
const ACCOUNT_PASSWORD = 'password123';
const ACCOUNT_NAME = 'Name';

const TAGS = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];
const ADDITIONAL_TAGS = ['!!!', '?'];

async function populateDebugData () {
    if (appContext.config.env !== env.dev) {
        return false;
    }

    log.debug('Debug data population started');
    if (!(await isNeededToPopulateData())) {
        log.debug('Debug data has been already populated earlier');
        return;
    }

    await populateAccount();
    const lists = await populateLists();

    for (const list of lists) {
        await populateTasks(list);
    }

    log.debug('Debug data population finished');
}

async function isNeededToPopulateData () {
    const account = await accountDao.getAccountByLogin(db, ACCOUNT_LOGIN);
    return account === null;
}

async function populateAccount () {
    return accountService.registerAccount({
        body: { login: ACCOUNT_LOGIN, password: ACCOUNT_PASSWORD, name: ACCOUNT_NAME }
    });
}

async function populateLists () {
    const listTitles = ['List 1', 'List 2'];
    const lists = [];
    for (const title of listTitles) {
        const list = await listService.createList(buildContext({
            body: { title: title }
        }));
        lists.push(list);
    }
    return lists;
}

async function populateTasks (list) {
    const taskTitles = ['Task 1', 'Task 2', 'Task 3'];
    for (const title of taskTitles) {
        await populateFirstLevelTask(list, title);
    }
}

async function populateFirstLevelTask (list, taskTitle) {
    const complexTitle = `${list.title} ~ ${taskTitle}`;
    const task = await taskService.createTask(buildContext({
        body: { title: complexTitle, listId: list.id }
    }));

    const subtaskTitles = ['Subtask 1', 'Subtask 2'];
    for (const title of subtaskTitles) {
        await populateSecondLevelTask(task, title);
    }
}

async function populateSecondLevelTask (firstLevelTask, taskTitle) {
    const complexTitle = `${firstLevelTask.title} ~ ${taskTitle}`;
    const task = await taskService.createTask(buildContext({
        body: { title: complexTitle, parentTaskId: firstLevelTask.id }
    }));

    const firstTag = TAGS[randomInt(5)];
    const secondTag = TAGS[randomInt(5)];
    const additionalTag = ADDITIONAL_TAGS[randomInt(2)];

    await populateThirdLevelTask(task, 'Subsubtask 1', taskStatus.inProgress, [firstTag]);
    await populateThirdLevelTask(task, 'Subsubtask 2', taskStatus.toDo, [additionalTag]);
    await populateThirdLevelTask(task, 'Subsubtask 3', taskStatus.done, [firstTag, additionalTag], 5);
    await populateThirdLevelTask(task, 'Subsubtask 4', taskStatus.toDo, [secondTag]);
    await populateThirdLevelTask(task, 'Subsubtask 5', taskStatus.inProgress, [secondTag]);
    await populateThirdLevelTask(task, 'Subsubtask 6', taskStatus.done, [], 15);
}

async function populateThirdLevelTask (secondLevelTask, taskTitle, status, tags, daysAfterEndDate) {
    const complexTitle = `${secondLevelTask.title} ~ ${taskTitle}`;
    const task = await taskService.createTask(buildContext({
        body: { title: complexTitle, parentTaskId: secondLevelTask.id }
    }));

    await taskService.updateTask(buildContext({
        params: { id: task.id },
        body: { status: status, tags: tags }
    }));

    await correctTaskDates(task, status, daysAfterEndDate);
}

async function correctTaskDates (task, status, daysAfterEndDate) {
    if (status === taskStatus.toDo) {
        return;
    }

    const currentDateTime = new Date().getTime();
    const dayMillis = 1000 * 60 * 60 * 24;
    const startDate = new Date(currentDateTime - currentDateTime % dayMillis);

    let endDate;
    if (daysAfterEndDate) {
        endDate = new Date(startDate.getTime() - dayMillis * daysAfterEndDate);
    }

    await taskDao.updateTask(db, task.id, undefined, undefined, undefined, startDate, endDate);
}

function buildContext (context) {
    context.jwtPayload = { id: 1 };
    return context;
}

function randomInt (bound) {
    return Math.floor(Math.random() * bound);
}

module.exports = {
    populateDebugData: populateDebugData
};
