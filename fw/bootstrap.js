const AppManage = require('./appManage');

exports = module.exports = (config, server) => {
    let manage = new AppManage(config.appPath, config.apps);

    return manage.init().then(() => {
        return manage.start(server);
    }).then(() => manage);
};
