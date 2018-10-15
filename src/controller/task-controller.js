async function getTasks (context) {
    // todo
}

const controller = {
    url: '/tasks',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: {}, // todo: add schema
            handler: getTasks
        }
    ]
};

module.exports = controller;
