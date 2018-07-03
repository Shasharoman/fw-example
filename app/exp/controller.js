const Promise = require('bluebird');
const fw = require(process.env.fw);

exports.hello = hello;
exports.random = random;

function hello(ctx) {
    console.log(ctx.req.url);
    return Promise.resolve('exp hello');
}

function random() {
    return fw.serviceCall('demo', 'echo', Math.random());
}
