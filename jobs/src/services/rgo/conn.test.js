const config = require('config');
const Client = require('ftp');


test('rgo ftp connection', done => {
  expect.assertions(1);

  let client = new Client();

  client.on('greeting', msg => {
    expect(msg).toBeTruthy();
    done();
  });

  client.connect({
    host: 'ftp.rescuegroups.org',
    user: config.get('ftp_username'),
    password: config.get('ftp_password')
  });
});
