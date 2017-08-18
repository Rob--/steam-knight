<template>
    <div class="wrapper">
        <div v-if="isReady">
            <div class="tabs is-centered">
                <ul>
                    <li v-bind:class="{ 'is-active': isActive('offers') }"><router-link :to="{ name: 'offers' }">Trade Offers</router-link></li>
                    <li v-bind:class="{ 'is-active': isActive('history') }"><router-link :to="{ name: 'history' }">Trade History</router-link></li>
                    <li v-bind:class="{ 'is-active': isActive('profile') }"><router-link :to="{ name: 'profile' }">Profile</router-link></li>
                </ul>
            </div>
            <div class="router-view">
                <router-view></router-view>
            </div>
        </div>
        <div v-if="!isReady">
            <h1 class="title is-1 has-text-centered">{{ this.$route.params.username }}</h1>
            <hr><br>
            <h2 class="title is-2 has-text-centered">{{ accountStatus(this.$route.params.username) }}</h2>
            <scale-loader></scale-loader>
        </div>
    </div>
</template>

<script>
  import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
  import { mapGetters } from 'vuex';
  import { STATUSES } from '../../components/SteamAccount';

  export default {
    name: 'account',
    components: { ScaleLoader },
    methods: {
      isActive(route) {
        return this.$route.name === route;
      },
    },
    computed: {
      isReady() {
        return this.steamAccount(this.$route.params.username).STATUS === STATUSES.READY;
      },
      ...mapGetters([
        'steamAccount',
        'accountStatus',
      ]),
    },
  };
</script>

<style src="font-awesome/css/font-awesome.min.css"></style>
<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .wrapper {
        overflow-y: scroll;
        height: 100%;
    }

    .router-view {
        padding: 0px 5px 15px 5px;
    }

</style>
