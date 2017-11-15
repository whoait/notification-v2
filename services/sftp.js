const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
    host: '192.168.252.105',
    username: 'dsadmin',
    password: 'DSP@ssw0rd'
};

function connect() {
    return sftp.connect(config)
        .catch((err) => {
            console.log(err, 'catch error');
        });
};

exports.sendImage = (imagePath) => {
    return connect().then(() => {
        return sftp.put(imagePath, '/share/work/bindcld/sitetheater/images/test.png');
    });
};