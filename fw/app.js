const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const nPath = require('path');

exports = module.exports = class App {
    constructor(manifestPath) {
        let manifest = this._trimManifest(manifestPath);

        this.name = manifest.name;
        this.routes = manifest.routes;
        this.services = manifest.services;
        this.init = manifest.init || (() => {
            Promise.resolve();
        });
    }

    start(server) {
        return this._registerRoute(this.routes, server);
    }

    serviceCall(serviceName) {
        let service = _.find(this.services, item => item.name === serviceName);

        if (_.isEmpty(service)) {
            return Promise.reject(`service not found, ${serviceName}`);
        }

        let args = Array.prototype.slice.call(arguments);

        return service.impl.apply(null, _.slice(args, 1));
    }

    _trimManifest(path) {
        let manifest = JSON.parse(fs.readFileSync(path));

        let controller = require(nPath.join(nPath.dirname(path), 'controller'));
        let service = require(nPath.join(nPath.dirname(path), 'service'));
        let init = require(nPath.join(nPath.dirname(path), 'init'));

        manifest.routes = _.map(manifest.routes, item => ({
            path: item.path,
            method: item.method,
            impl: _.get(controller, item.impl)
        }));

        manifest.services = _.map(manifest.services, item => ({
            name: item.name,
            impl: _.get(service, item.impl)
        }));

        manifest.init = _.get(init, manifest.init);
        return manifest;
    }

    _registerRoute(routes, server) {
        _.each(routes, item => {
            server.registerRoute(item.method, item.path, item.impl);
        });

        return Promise.resolve();
    }
};
