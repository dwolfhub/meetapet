const FTP = require('./ftp');
const Client = require('ftp');
const { Readable } = require('stream');

jest.mock('ftp');

const implementMockClient = methods => {
  Client.mockImplementation(() =>
    Object.assign(methods, {
      connect: () => {},
      end: () => {},
      on: (_, callback) => {
        process.nextTick(() => {
          callback();
        });
      }
    })
  );
};

describe('listFiles', () => {
  it('returns array with contents of root directory', () => {
    const dirs = ['dir1', 'dir2'];

    implementMockClient({
      list: callback => {
        process.nextTick(() => {
          callback(null, dirs);
        });
      }
    });

    let instance = new FTP('someuser', 'somepass');

    expect.assertions(1);
    return expect(instance.listFiles()).resolves.toBe(dirs);
  });

  it('rejects with err', () => {
    const err = new Error('123');
    implementMockClient({
      list: callback => {
        process.nextTick(() => {
          callback(err, []);
        });
      }
    });

    let instance = new FTP('someuser', 'somepass');

    expect.assertions(1);
    return expect(instance.listFiles()).rejects.toBe(err);
  });
});

describe('getFile', () => {
  it('returns file contents', () => {
    const fileContents = ['part1', 'part2', 'part3'];
    let i = 0;
    const stream = new Readable({
      read: function() {
        this.push(fileContents[i++] || null);
      }
    });

    implementMockClient({
      get: (fileName, callback) => {
        process.nextTick(() => {
          callback(null, stream);
        });
      }
    });

    let instance = new FTP('someuser', 'somepass');

    expect.assertions(1);
    return expect(instance.getFile('anyfile.txt')).resolves.toEqual(
      fileContents.join('')
    );
  });

  it('rejects with err', () => {
    const err = new Error('123');

    implementMockClient({
      get: (fileName, callback) => {
        process.nextTick(() => {
          callback(err, null);
        });
      }
    });

    let instance = new FTP('someuser', 'somepass');

    expect.assertions(1);
    return expect(instance.getFile('somefile')).rejects.toBe(err);
  });
});
