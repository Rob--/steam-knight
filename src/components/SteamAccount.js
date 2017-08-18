import SteamUser from 'steam-user';
import SteamCommunity from 'steamcommunity';
import SteamTotp from 'steam-totp';
import TradeOfferManager from 'steam-tradeoffer-manager';
import request from 'request';
import store from '../renderer/store';
import Helpers from '../components/Helpers';

const STATUSES = {
  LOGGING_IN: 0,
  LOGGED_IN: 1,
  DISCONNECTED: 2,
  NEED_CODE: 3,
  READY: 4,
};

const MESSAGES = {
  [STATUSES.LOGGING_IN]: 'Logging in...',
  [STATUSES.LOGGED_IN]: 'Logged in successfully...',
  [STATUSES.DISCONNECTED]: 'Disconnected...',
  [STATUSES.ERROR]: 'Steam guard code required...',
  [STATUSES.READY]: 'Your account has been logged in and is ready!',
};

class SteamAccount {

  constructor({ username, password, sharedSecret, identitySecret, twoFactorCode }) {
    this.username = username;
    this.password = password;
    this.sharedSecret = sharedSecret;
    this.identitySecret = identitySecret;
    this.twoFactorCode = twoFactorCode;

    if (this.sharedSecret) {
      this.twoFactorCode = SteamTotp.getAuthCode(this.sharedSecret);
    }

    this.community = new SteamCommunity();
    this.setupClient();
    this.setupOfferManager();

    this.logOn();
  }

  logOn() {
    this.client.logOn({
      accountName: this.username,
      password: this.password,
      rememberPassword: true,
      twoFactorCode: this.twoFactorCode,
    });
  }

  setupClient() {
    const client = new SteamUser({
      promptSteamGuardCode: false,
    });

    client.on('steamGuard', (domain, callback, lastCodeWrong) => {
      this.log(`steamGuard: ${domain}, ${lastCodeWrong}`);
    });

    client.on('sessionExpired', () => {
      this.log('session expired');
    });

    client.on('loggedOn', (details) => {
      this.log('logged on', JSON.stringify(details));
      this.setStatus(STATUSES.LOGGED_IN);
    });

    client.on('disconnected', () => {
      this.log('disconnected');
      this.setStatus(STATUSES.DISCONNECTED);
    });

    client.on('error', (error) => {
      this.log('error');
      console.log(error);
    });

    client.on('webSession', (sessionID, cookies) => {
      this.log('setting cookies');
      this.cookies = cookies;
      this.community.setCookies(cookies);
      this.tradeOfferManager.setCookies(cookies, (error) => {
        if (error) {
          this.log('error saving trade offer manager cookies');
        } else {
          this.log('saved trade offer manager cookies');
          this.setStatus(STATUSES.READY);
        }
      });
    });

    this.client = client;
  }

  setupOfferManager() {
    const tradeOfferManager = new TradeOfferManager({
      steam: this.client,
      language: 'en',
      pollInterval: 2000,
    });

    tradeOfferManager.on('newOffer', (offer) => {
      this.log(`received new trade offer #${offer.id}`);
    });

    this.tradeOfferManager = tradeOfferManager;
  }

  getOffers() {
    return new Promise((resolve, reject) => {
      const callback = async (error, sent, received) => {
        if (error) {
          this.log('an error occurred fetching offers');
          reject(error);
          return;
        }

        const offerMapping = async (offer) => {
          const details = await Helpers.getUserDetails(offer);
          const filtered = Helpers.filterOffer(offer, this.client.steamID);
          return {
            details, ...filtered,
          };
        };

        const mapped = await Promise.all([
          ...received.map(offerMapping),
          ...sent.map(offerMapping),
        ]);

        resolve({
          received: mapped.slice(0, received.length),
          sent: mapped.slice(received.length),
        });
      };

      this.tradeOfferManager.getOffers(TradeOfferManager.EOfferFilter.ActiveOnly, callback);
    });
  }

  getHistory() {
    return new Promise((resolve, reject) => {
      const callback = async (error, history) => {
        console.log(history);

        if (error) {
          this.log('an error occurred fetching history');
          console.log(error);
          reject(error);
          return;
        }

        resolve(history.trades.map(Helpers.filterHistory));
      };

      this.community.getInventoryHistory({ resolveVanityURLs: true }, callback);
    });
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      const callback = async (error, user) => {
        console.log(user);

        if (error) {
          this.log('an error occurred fetching profile data');
          console.log(error);
          reject(error);
          return;
        }

        resolve(user);
      };

      this.community.getSteamUser(this.community.steamID, callback);
    });
  }

  getStates(country) {
    return new Promise((resolve, reject) => {
      request.post({
        url: `http://steamcommunity.com/actions/EditProcess?sId=${this.community.steamID.getSteamID64()}`,
        json: true,
        headers: {
          Cookie: this.cookies.join(';'),
        },
        // /* eslint-disable no-underscore-dangle */
        // jar: Object.assign({}, this.community._jar),
        form: {
          country,
          json: 1,
          type: 'locationUpdate',
        },
      }, (error, response, body) => {
        if (body.results !== 'OK') {
          reject(body);
          return;
        }

        resolve(body.state.map(element => ({
          name: element.val,
          value: element.attribs.key,
        })));
      });
    });
  }

  getWallet() {
    if (!this.client.wallet) {
      return { loaded: false };
    }

    return {
      loaded: true,
      ...this.client.wallet,
    };
  }

  getEmail() {
    if (!this.client.emailInfo) {
      return { loaded: false };
    }

    return {
      loaded: true,
      ...this.client.emailInfo,
    };
  }

  acceptOffer(id) {
    return new Promise((resolve, reject) => {
      this.tradeOfferManager.getOffer(id, (offerError, offer) => {
        if (offerError) {
          reject();
          return;
        }

        offer.accept((error) => {
          if (error) {
            reject();
            return;
          }

          resolve();
        });
      });
    });
  }

  log(message) {
    console.log(`${this.username}: ${message}`);
  }

  setStatus(status) {
    store.dispatch('setAccountStatus', {
      username: this.username,
      status,
    });
  }

}

export {
  SteamAccount,
  STATUSES,
  MESSAGES,
};
