<template>
  <div id="wrapper">
    <main class="container">
      <h1 class="title is-1 has-text-centered">Steam Knight</h1>
      <hr>
      <div class="box">
        <div class="field">
          <label class="label">Username</label>
          <p class="control has-icons-left">
            <input v-model="username" class="input is-primary" type="text" placeholder="Username">
            <span class="icon is-small is-left">
              <i class="fa fa-user"></i>
            </span>
          </p>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <p class="control has-icons-left">
            <input v-model="password" class="input is-primary" type="password" placeholder="Password">
            <span class="icon is-small is-left">
              <i class="fa fa-lock"></i>
            </span>
          </p>
        </div>

        <div class="field">
          <label class="label">Identity Secret (optional) <span class="title is-6">- allows the app to handle offer confirmations</span></label>
          <p class="control has-icons-left">
            <input v-model="identitySecret" class="input is-primary" type="text" placeholder="Identity Secret">
            <span class="icon is-small is-left">
              <i class="fa fa-key"></i>
            </span>
          </p>
        </div>

        <div class="field">
          <label class="label">Shared Secret (optional) <span class="title is-6">- eliminates the need for a two factor code</span></label>
          <p class="control has-icons-left">
            <input v-model="sharedSecret" class="input is-primary" type="text" placeholder="Shared Secret">
            <span class="icon is-small is-left">
              <i class="fa fa-key"></i>
            </span>
          </p>
        </div>

        <hr>
        <div class="has-text-centered">
          <a class="button is-primary" v-on:click="twoFactorCheck()" v-bind:class="{ 'is-loading': busy }">Add User</a>
        </div>

        <modal name="two-factor-modal" :adaptive="true" :width="1200" :height="400" @opened="busy = true" @closed="busy = false">
          <section class="section modal-box">
            <h1 class="title is-1">Two Factor Code</h1>
            <hr>
            <h2 class="subtitle is-6">As you have not provided a shared secret, a two factor code generated
              by the Steam mobile application is required to log into the account. It is a 5 digit code.</h2>
            <div class="field">
              <label class="label">Two Factor Code</label>
              <p class="control has-icons-left">
                <input v-model="twoFactorCode" class="input is-primary" type="text" placeholder="XXXXX" maxlength="5">
              </p>
            </div>
            <hr>
            <a v-bind:disabled="twoFactorCode.length != 5" v-on:click="addAccount()" class="button is-primary">Continue</a>
          </section>
        </modal>

        <modal name="account-modal" :adaptive="true" :width="1200" @opened="busy = true" @closed="busy = false">
          <section class="section modal-box">
            <h1 class="title is-1">Add Account</h1>
            <hr>
            <scale-loader v-if="!accountReady(username)"></scale-loader>
            <p class="subtitle is-3 has-text-centered">{{ accountStatus(username) }}</p>
          </section>
        </modal>

        <modal name="error-modal" :adaptive="true" :width="1200">
          <section class="section modal-box">
            <h1 class="title is-1">Error</h1>
            <hr>
            <p class="subtitle is-3 has-text-centered">{{ errorMessage }}</p>
          </section>
        </modal>
      </div>
    </main>
  </div>
</template>

<script>
  import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'add-account',
    components: { ScaleLoader },
    data() {
      return {
        username: '',
        password: '',
        identitySecret: '',
        sharedSecret: '',
        twoFactorCode: '',
        errorMessage: '',
        busy: false,
      };
    },
    computed: {
      ...mapGetters([
        'steamAccounts',
        'steamAccount',
        'accountExists',
        'accountStatus',
        'accountReady',
      ]),
    },
    methods: {
      twoFactorCheck() {
        if (!this.username) {
          this.showError('You need to provide a valid username.');
          return;
        }

        if (!this.password) {
          this.showError('You need to provide a valid password.');
          return;
        }

        if (this.accountExists(this.username)) {
          this.showError('This account has already been added.');
          return;
        }

        if (!this.sharedSecret || this.sharedSecret.length === 0) {
          this.$modal.show('two-factor-modal');
        } else {
          this.addAccount();
        }
      },
      addAccount() {
        this.$modal.hide('two-factor-modal');
        this.$modal.show('account-modal');

        this.$store.dispatch('loginUser', {
          username: this.username,
          password: this.password,
          sharedSecret: this.sharedSecret,
          identitySecret: this.identitySecret,
          twoFactorCode: this.twoFactorCode,
        });
      },
      showError(message) {
        this.errorMessage = message;
        this.$modal.show('error-modal');
      },
    },
  };
</script>

<style src="font-awesome/css/font-awesome.min.css"></style>
<style scoped>
  .modal-box {
    height: 100%;
    overflow-y: scroll;
  }
</style>
<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /*body { font-family: 'Source Sans Pro', sans-serif; }*/

  #wrapper {
    padding: 20px 0px;
  }

  html {
    height: 100%;
    background-color: #f8f8f8;
  }
</style>
