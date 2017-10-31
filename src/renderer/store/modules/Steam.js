import { SteamAccount, STATUSES, MESSAGES } from '../../../components/SteamAccount';
import Vue from '../../main';
import SteamAccountManager from '../../../components/SteamAccountManager';

const mutations = {
  INIT_ACCOUNT(state, details) {
    Vue.$set(state.accounts, details.username, {
      STATUS: STATUSES.LOGGING_IN,
      ...details,
    });
  },
  SET_ACCOUNT_STATUS(state, { username, status }) {
    Vue.$set(state.accounts[username], 'STATUS', status);
    console.log(`set ${username} account state to ${status}`);
  },
  SET_OFFERS(state, { username, offers }) {
    Vue.$set(state.accounts[username], 'offers', offers);
  },
  SET_HISTORY(state, { username, history }) {
    Vue.$set(state.accounts[username], 'history', history);
  },
  SET_PROFILE(state, { username, profile }) {
    Vue.$set(state.accounts[username], 'profile', profile);
  },
};

const actions = {
  loginUser(context, details) {
    const account = new SteamAccount(details);
    SteamAccountManager.add(details.username, account);
    context.commit('INIT_ACCOUNT', details);
  },
  setAccountStatus(context, data) {
    context.commit('SET_ACCOUNT_STATUS', data);
  },
  async getOffers(context, username) {
    if (!Object.hasOwnProperty.call(context.state.accounts, username)) {
      return Promise.resolve();
    }

    const offers = await SteamAccountManager.get(username).getOffers();
    context.commit('SET_OFFERS', { username, offers });

    return Promise.resolve();
  },
  async getHistory(context, username) {
    if (!Object.hasOwnProperty.call(context.state.accounts, username)) {
      return Promise.resolve();
    }

    const history = await SteamAccountManager.get(username).getHistory();
    context.commit('SET_HISTORY', { username, history });

    return Promise.resolve();
  },
  async getProfile(context, username) {
    if (!Object.hasOwnProperty.call(context.state.accounts, username)) {
      return Promise.resolve();
    }

    const profile = await SteamAccountManager.get(username).getProfile();
    context.commit('SET_PROFILE', { username, profile });

    return Promise.resolve();
  },
  async getConfirmations(context, username) {
    if (!Object.hasOwnProperty.call(context.state.accounts, username)) {
      return Promise.resolve();
    }

    await SteamAccountManager.get(username).getConfirmations();
    return [];
  },
};

const getters = {
  steamAccounts: state => Object
    .keys(state.accounts)
    // .filter(username => state.accounts[username].STATUS === STATUSES.READY)
    .reduce((result, username) => {
      result[username] = state.accounts[username];
      return result;
    }, {}),
  steamAccount: state => username => state.accounts[username],
  accountExists: state => username => Object.hasOwnProperty.call(state.accounts, username),
  accountStatus: (state, getters) => (username) => {
    if (!getters.accountExists(username)) {
      return '';
    }

    return MESSAGES[state.accounts[username].STATUS];
  },
  accountReady: (state, getters) => (username) => {
    if (!getters.accountExists(username)) {
      return false;
    }
    return state.accounts[username].STATUS === STATUSES.READY;
  },
  sentOffers: (state, getters) => (username) => {
    if (!getters.accountExists(username) || !getters.alreadyLoadedOffers(username)) {
      return [];
    }

    return state.accounts[username].offers.sent;
  },
  receivedOffers: (state, getters) => (username) => {
    if (!getters.accountExists(username) || !getters.alreadyLoadedOffers(username)) {
      return [];
    }

    return state.accounts[username].offers.received;
  },
  alreadyLoadedOffers: (state, getters) => (username) => {
    if (!getters.accountExists(username)) {
      return true;
    }

    return Object.prototype.hasOwnProperty.call(state.accounts[username], 'offers');
  },
  offerHistory: (state, getters) => (username) => {
    if (!getters.accountExists(username) || !getters.alreadyLoadedHistory(username)) {
      return [];
    }

    return state.accounts[username].history;
  },
  alreadyLoadedHistory: (state, getters) => (username) => {
    if (!getters.accountExists(username)) {
      return true;
    }

    return Object.prototype.hasOwnProperty.call(state.accounts[username], 'history');
  },
  profileData: (state, getters) => (username) => {
    if (!getters.accountExists(username) || !getters.alreadyLoadedProfile(username)) {
      return [];
    }

    // we return an array, so in our html we can do `for profile in profileData`,
    // this means if there is no profile data, no errors are returned as the loop is never entered
    return [state.accounts[username].profile];
  },
  alreadyLoadedProfile: (state, getters) => (username) => {
    if (!getters.accountExists(username)) {
      return true;
    }

    return Object.prototype.hasOwnProperty.call(state.accounts[username], 'profile');
  },
};

export default {
  state: {
    accounts: {},
  },
  mutations,
  actions,
  getters,
};
