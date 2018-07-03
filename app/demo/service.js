const Promise = require('bluebird');

exports.echo = echo;

function echo(msg) {
    return Promise.resolve(msg);
}
