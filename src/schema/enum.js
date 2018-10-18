const taskStatus = {
    toDo: 'TO_DO',
    inProgress: 'IN_PROGRESS',
    done: 'DONE'
};

const taskStatusValues = [
    taskStatus.toDo,
    taskStatus.inProgress,
    taskStatus.done
];

const taskFilter = {
    all: 'ALL',
    doneLessThen10Days: 'DONE_LESS_THAN_10_DAYS_AGO',
    onlyUndone: 'ONLY_UNDONE'
};

const taskFilterValues = [
    taskFilter.all,
    taskFilter.doneLessThen10Days,
    taskFilter.onlyUndone
];

module.exports = {
    taskStatus: taskStatus,
    taskStatusValues: taskStatusValues,
    taskFilter: taskFilter,
    taskFilterValues: taskFilterValues
};
