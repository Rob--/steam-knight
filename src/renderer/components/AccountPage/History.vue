<template>
    <div>
        <div v-if="!loadingHistory">
            <a class="button is-primary" v-on:click="loadHistory()">Refresh History</a>
            <hr>
        </div>
        <div class="container">
            <div v-if="loadingHistory">
                <h2 class="title is-2 has-text-centered">Loading history...</h2>
                <scale-loader></scale-loader>
                <hr>
            </div>
            <h2 v-if="!loadingHistory && offerHistory($route.params.username).length === 0" class="title is-2 has-text-centered">You currently have no trade history!</h2>
            <div v-for="offer in offerHistory($route.params.username)" class="box">
                <article class="media">
                    <!--<figure class="media-left">-->
                        <!--<p class="image is-64x64"><img :src="offer.details.them.avatar"></p>-->
                    <!--</figure>-->
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <span class="title is-4">{{ offer.name }}</span>
                                <span class="icon is-small external-link" v-on:click="openProfile(offer.url)">
                                    <i class="fa fa-link"></i>
                                </span>
                                <small></small>
                                <br>
                                <span class="subtitle is-6">
                                    {{ offer.date }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="media-right">
                        <button class="delete"></button>
                    </div>
                </article>
                <hr>
                <h3 class="title is-3">Their items <span class="subtitle is-5">({{ offer.itemsReceived.length }})</span></h3>
                <div class="items">
                    <h5 v-if="offer.itemsReceived.length === 0" class="subtitle is-5">You did not receive any items in this offer.</h5>
                    <div class="item" v-for="item in offer.itemsReceived" v-bind:style="item.style">
                        <div class="item-image"
                             v-bind:style="{ 'background-image': `url(https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/125fx85f)`}"></div>
                    </div>
                </div>
                <hr>
                <h3 class="title is-3">My items <span class="subtitle is-5">({{ offer.itemsGiven.length }})</span></h3>
                <div class="items">
                    <h5 v-if="offer.itemsGiven.length === 0" class="subtitle is-5">You did not give away any items in this offer.</h5>
                    <div class="item" v-for="item in offer.itemsGiven" v-bind:style="item.style">
                        <div class="item-image"
                             v-bind:style="{ 'background-image': `url(https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/125fx85f)`}"></div>
                        <span v-if="item.inspect" v-on:click="inspect(item.inspect)" class="inspect icon is-small">
                            <i class="fa fa-eye"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: { ScaleLoader },
    name: 'history',
    mounted() {
      if (!this.alreadyLoadedHistory(this.$route.params.username)) {
        this.loadHistory();
      } else {
        this.loadingHistory = false;
      }
    },
    methods: {
      openProfile(url) {
        this.$electron.shell.openExternal(`https://steamcommunity.com/${url}`);
      },
      inspect(url) {
        console.log(url);
        this.$electron.shell.openExternal(url);
      },
      loadHistory() {
        this.loadingHistory = true;
        this.$store.dispatch('getHistory', this.$route.params.username).then(() => {
          this.loadingHistory = false;
        });
      },
    },
    data() {
      return {
        loadingHistory: true,
      };
    },
    computed: {
      ...mapGetters([
        'offerHistory',
        'alreadyLoadedHistory',
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

    .external-link {
        cursor: pointer;
        vertical-align: text-top;
    }

    .items {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .item {
        background-color: #f8f8f8;
        flex: 1 0 10rem;
        display: block;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        flex-direction: column;
        background-color: rgba(26,188,156,.02);
        margin: 0 1rem 1rem 0!important;
        max-width: 165px;
        box-shadow: inset 0px 0px 10px -4px #000;

        -webkit-transition: all 0.2s linear;
        -moz-transition: all 0.2s linear;
        -ms-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
        transition: all 0.2s linear;
        /* box-shadow stylings from Bulma's `box` class */
        /*-webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);*/
        /*box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);*/
    }

    .item:hover {
        background-color: rgba(219, 219, 219, 0.45);
        box-shadow: inset 0px 0px 20px -6px #000;
    }

    .item-image {
        padding-bottom: 50%;
        background-position: 50%;
        background-repeat: no-repeat;
        filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.5));

        -webkit-transition: all 0.2s linear;
        -moz-transition: all 0.2s linear;
        -ms-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
        transition: all 2s linear;
    }

    .item-image:hover {
        filter: saturate(150%) drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.5));
    }

    .inspect {
        cursor: pointer;
        position: absolute;
        right: 5px;
        bottom: 5px;
        color: rgba(0, 0, 0, 0.40);

        -webkit-transition: all 0.1s linear;
        -moz-transition: all 0.1s linear;
        -ms-transition: all 0.1s linear;
        -o-transition: all 0.1s linear;
        transition: all 0.1s linear;
    }

    .inspect:hover {
        /*color: rgb(0, 209, 178);*/
        color: #4a4a4a;
    }

</style>
