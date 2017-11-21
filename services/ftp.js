const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/bind_version_config.json`)[env];
const PromiseFtp = require('promise-ftp');
const ftp = new PromiseFtp();

function doConnect() {
    console.log('do connect');
    return ftp.connect(
        {
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password
        }
    ).catch((err) => {
        console.log(`${err}`);
    });
}

exports.sendNotificationFile = (srcPath, destPath) => {
    return doConnect().then((data) => {
        return ftp.put(srcPath, destPath);
    })
};