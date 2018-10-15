async function getLists (context) {
    // todo
}

const controller = {
    url: '/lists',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: {}, // todo: add schema
            handler: getLists
        }
    ]
};

module.exports = controller;
