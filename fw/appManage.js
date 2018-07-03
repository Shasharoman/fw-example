const Promise = require('bluebird');
const _ = require('lodash');
const App = require('./app');
const nPath = require('path');

exports = module.exports = class AppManage {
    constructor(appPath, apps) {
        this.apps = _.map(apps, item => {
            return new App(nPath.join(appPath, item, 'manifest.json'));
        });
    }

    init() {
        return Promise.mapSeries(this.apps, item => item.init());
    }

    start(server) {
        return Promise.mapSeries(this.apps, item => item.start(server));
    }

    serviceCall(appName) {
        let app = _.find(this.apps, item => item.name === appName);
        if (_.isEmpty(app)) {
            return Promise.reject(`app not found, ${appName}`);
        }

        let args = Array.prototype.slice.call(arguments);

        return app.serviceCall.apply(app, _.slice(args, 1));
    }
};
