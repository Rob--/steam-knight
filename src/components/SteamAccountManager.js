import crypto from 'crypto';
import storage from 'electron-json-storage';
import store from '../renderer/store';

const SECRET = '}PJx{z+g>(YC<uHQB+Q~-3dmt:uZj&4N';

function encrypt(data, key) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(key, SECRET, 10000, 16, 'sha512', (error, key) => {
      if (error) {
        reject();
        return;
      }

      const hashedKey = key.toString('hex');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(hashedKey), iv);
      let encrypted = cipher.update(data);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      resolve(`${iv.toString('hex')}:${encrypted.toString('hex')}`);
    });
  });
}

function decrypt(data, key) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(key, SECRET, 10000, 16, 'sha512', (error, key) => {
      if (error) {
        reject();
        return;
      }

      const hashedKey = key.toString('hex');
      const [hexIV, hexEncryption] = data.split(':');
      const iv = new Buffer(hexIV, 'hex');
      const encrypted = new Buffer(hexEncryption, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(hashedKey), iv);
      let decrypted = decipher.update(encrypted);

      try {
        decrypted = Buffer.concat([decrypted, decipher.final()]);
      } catch (e) {
        // Key is incorrect
        reject(e);
        return;
      }

      resolve(decrypted.toString());
    });
  });
}

class SteamAccountManager {

  constructor() {
    this.accounts = {};
  }

  setKey(key) {
    this.key = key;
    this.loadAccounts();
  }

  loadAccounts() {
    storage.get('accounts', (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      Object.entries(data).forEach(([usernameHash, encryption]) => {
        decrypt(encryption, this.key)
          .then((decryption) => {
            const details = JSON.parse(decryption);
            console.log(usernameHash, details);
            store.dispatch('loginUser', details);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  }

  async add(username, account) {
    this.accounts[username] = account;

    const details = {
      username: account.username,
      password: account.password,
      sharedSecret: account.sharedSecret,
      identitySecret: account.identitySecret,
    };

    const secure = await encrypt(JSON.stringify(details), this.key);
    storage.get('accounts', (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      const hash = crypto.createHmac('sha512', SECRET).update(username).digest('hex');
      if (!Object.hasOwnProperty.call(data, hash)) {
        data[hash] = secure;
        storage.set('accounts', data, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  }

  get(username) {
    return this.accounts[username];
  }
}

export default new SteamAccountManager();
