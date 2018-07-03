const Promise = require('bluebird');

exports.hello = hello;

function hello() {
    return Promise.resolve('demo hello');
}
