async function getVersion() {
    // todo: get version from package.json file
    return Promise.resolve({
        version: '0.1.0'
    });
}

const controller = {
    url: '/version',
    endPoints: [
        {
            url: '',
            method: 'get',
            version: 1,
            handler: getVersion
        }
    ]
};

module.exports = controller;
