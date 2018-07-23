const FTP = require('./services/rgo/ftp');
const config = require('config');

let ftp = new FTP(config.get('ftp_username'), config.get('ftp_password'));

ftp.listFiles().then(dirs => {
  dirs.forEach(dir => {
    if (/^(pet|org)s_/.test(dir.name))
      ftp.getFile(dir.name).then(contents => {
        let x = 0;
      });
  });
});

// download files via ftp
// unzip files
// iterate through files
// save records in the db
