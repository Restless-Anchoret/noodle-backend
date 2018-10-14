async function getTags(context) {
    // todo
}

const controller = {
    url: '/tags',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            secured: true,
            validationSchema: {}, // todo: add schema
            handler: getTags
        }
    ]
};

module.exports = controller;
