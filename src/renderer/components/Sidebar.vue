<template>
    <div class="sidebar">
        <div class="account"
             v-bind:class="{ selected: selected === 'add' }"
             v-on:click="addAccount()">
            <h2>
                <span class="icon is-small">
                    <i class="fa fa-plus"></i>
                </span>
                <span>Add account</span>
            </h2>
        </div>
        <div v-for="account in steamAccounts" class="account"
             v-bind:class="{ selected: `username-${$route.params.username}` === `username-${account.username}` }"
             v-on:click="accountClicked(account.username)">
            <h2 class="title is-2">{{ account.username }}<!-- <span class="status subtitle is-6 has-text-right">{{ onlineStatus() }}</span>--></h2>
            <div class="info">
                <p>Trade Offers</p>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'sidebar',
    data() {
      return {
        selected: 'add',
      };
    },
    methods: {
      addAccount() {
        this.$router.push('/add-account');
        this.selected = 'add';
      },
      accountClicked(username) {
        this.$router.push({
          name: 'offers',
          params: {
            username,
          },
        });
        this.selected = `username-${username}`;
      },
    },
    computed: {
      ...mapGetters([
        'steamAccounts',
      ]),
    },
  };
</script>

<style src="font-awesome/css/font-awesome.min.css"></style>
<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .sidebar {
        min-width: 300px;
        background-color: white;
        border-right: 1px solid #dbdbdb;
        border-bottom: 1px solid #dbdbdb;
    }

    .account {
        cursor: pointer;
        padding: 10px 25px 10px 25px;
        border-bottom: 1px solid #dbdbdb;
    }

    .account:hover {
        background-color: #f8f8f8;
    }

    .account > .title {
        position: relative;
        margin-bottom: 1rem;
    }

    .account > .info {
        padding-left: 20px;
        border-left: 1px solid #dbdbdb;
    }

    .status {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .selected {
        border-left: 5px solid #23d160;
        /*background-color: rgba(35, 209, 96, 0.1);*/
        box-shadow: inset 0px 0px 10px -6px black;
    }

</style>
