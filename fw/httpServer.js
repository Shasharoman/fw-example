const _ = require('lodash');
const express = require('express');
const app = express();

exports = module.exports = class HttpServer {
    registerRoute(method, path, fn) {
        if (!_.includes(['get', 'post', 'put', 'delete'], method)) {
            throw new Error(`unsupport method ${method}`);
        }

        return app[method](path, (req, res) => {
            let ctx = {
                req,
                res
            };

            return fn(ctx).then(ret => {
                if (res.finished) {
                    return;
                }

                res.writeHead(200, {
                    'content-type': 'application/json'
                });

                return res.end(JSON.stringify({
                    code: 0,
                    result: ret
                }));
            }).catch(err => {
                res.writeHead(200, {
                    'content-type': 'application/json'
                });

                return res.end(JSON.stringify({
                    code: 1,
                    result: err.toString()
                }));
            });
        });
    }

    listen(host, port) {
        return app.listen(host, port);
    }
};
