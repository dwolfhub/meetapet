const Client = require('ftp');

/**
 * FTP class allows for listing and downloading file content from the RGO ftp server
 */
class FTP {
  /**
   * @param {String} user
   * @param {String} password
   */
  constructor(user, password) {
    this._user = user;
    this._password = password;
  }

  /**
   * @param {String} fileName
   * @returns {Promise<Array<Client.ListingElement>}
   */
  getFile(fileName) {
    return new Promise((resolve, reject) => {
      let client = new Client();

      client.on('ready', () => {
        client.get(fileName, (err, stream) => {
          if (err) return reject(err);

          let fileContents = '';

          stream.on('data', data => (fileContents += data));

          stream.once('end', () => {
            resolve(fileContents);

            client.end();
          });
        });
      });

      this._connect(client);
    });
  }

  /**
   * @returns {Promise<Array<String>>}
   */
  listFiles() {
    return new Promise((resolve, reject) => {
      let client = new Client();

      client.on('ready', () => {
        client.list((err, dirs) => {
          if (err) return reject(err);

          resolve(dirs);
          client.end();
        });
      });

      this._connect(client);
    });
  }

  _connect(client) {
    client.connect({
      host: 'ftp.rescuegroups.org',
      user: this._user,
      password: this._password,
      debug: console.log
    });
  }
}

module.exports = FTP;
