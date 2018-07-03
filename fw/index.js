process.env.fw = __dirname;

const nPath = require('path');
const HttpServer = require('./httpServer');

const server = new HttpServer();

const config = _parseConfig();

require('./bootstrap')(config, server).then((appManage) => {
    exports.serviceCall = appManage.serviceCall.bind(appManage);

    server.listen(config.port, config.host);
    console.log(`listen on ${config.host}:${config.port}`);
});

// 此处为了快速实现，省略了从命令行解析和读取配置文件的过程
function _parseConfig() {
    return {
        appPath: nPath.resolve(__dirname, '../app'),
        apps: [
            'demo',
            'exp'
        ],
        host: '127.0.0.1',
        port: 10000
    };
}
