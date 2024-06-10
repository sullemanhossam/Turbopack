const config = require('config');
const logger = require('./logger');



function getHost() {
    let SERVER_HOST = config.get('deployment_host');

    if (SERVER_HOST == 'AWS_VPS') {
        const execSync = require('child_process').execSync;
        SERVER_HOST = execSync('curl http://169.254.169.254/latest/meta-data/public-hostname', {encoding: 'utf-8'});  // the default is 'buffer'
        logger.info('AWS EXTERNAL IP IS :' + SERVER_HOST);
    }

    return SERVER_HOST;
}




module.exports = getHost;