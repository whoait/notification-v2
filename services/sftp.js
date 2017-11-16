const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/bind_version_config.json`)[env];
const Client = require('ssh2-sftp-client');
const sftp = new Client();

function doConnect() {
    return sftp.connect(
        {
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password
        }
    ).catch((err) => {
        console.log(`Error: err`);
    });
}


exports.sendImage = (imagePath, imageFileName) => {
    return sftp.put(imagePath, config.imagePath + imageFileName);
};

exports.sendNotificationFile = (srcPath, destPath) => {
    return doConnect().then(() => {
        return sftp.put(srcPath, destPath);
    });
};

