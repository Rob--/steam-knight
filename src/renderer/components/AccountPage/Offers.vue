<template>
    <div>
        <div v-if="!loadingOffers">
            <a class="button is-primary" v-on:click="loadOffers()">Refresh Offers</a>
            <hr>
        </div>
        <div class="container">
            <div v-if="loadingOffers">
                <h2 class="title is-2 has-text-centered">Loading offers...</h2>
                <scale-loader></scale-loader>
                <hr>
            </div>
            <h2 v-if="!loadingOffers && receivedOffers($route.params.username).length === 0" class="title is-2 has-text-centered">You currently have no active trade offers!</h2>
            <div v-for="offer in receivedOffers($route.params.username)" class="box">
                <article class="media">
                    <figure class="media-left">
                        <p class="image is-64x64"><img :src="offer.details.them.avatar"></p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <span class="title is-4">{{ offer.details.them.name }}</span>
                                <span class="icon is-small external-link" v-on:click="openProfile(offer.partner)">
                                    <i class="fa fa-link"></i>
                                </span>
                                <small></small>
                                <br>
                                <span class="subtitle is-6">
                                    Created at {{ offer.created }}, expires at {{ offer.expires }}.
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="media-right">
                        <!--<button class="delete"></button>-->
                        <span class="subtitle is-6">#{{ offer.id }}</span>
                    </div>
                </article>
                <hr>
                <h3 class="title is-3">Their items <span class="subtitle is-5">({{ offer.itemsReceive.length }})</span></h3>
                <div class="items">
                    <h5 v-if="offer.itemsReceive.length === 0" class="subtitle is-5">You will not receive any items from this offer.</h5>
                    <div class="item" v-for="item in offer.itemsReceive" v-bind:style="item.style">
                        <div class="item-image"
                             v-bind:style="{ 'background-image': `url(https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/125fx85f)`}"></div>
                    </div>
                </div>
                <hr>
                <h3 class="title is-3">My items <span class="subtitle is-5">({{ offer.itemsGive.length }})</span></h3>
                <div class="items">
                    <h5 v-if="offer.itemsGive.length === 0" class="subtitle is-5">You are not giving away any items in this offer.</h5>
                    <div class="item" v-for="item in offer.itemsGive" v-bind:style="item.style">
                        <div class="item-image"
                             v-bind:style="{ 'background-image': `url(https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/125fx85f)`}"></div>
                        <span v-if="item.inspect" v-on:click="inspect(item.inspect)" class="inspect icon is-small">
                            <i class="fa fa-eye"></i>
                        </span>
                    </div>
                </div>
                <hr>
                <div class="columns">
                    <div class="column has-text-left">
                        <a class="button is-primary" v-on:click="quickAccept(offer)">Quick Accept</a>
                    </div>
                    <div class="column has-text-right">
                        <a class="button is-primary" v-on:click="accept(offer)">Accept Offer</a>
                    </div>
                </div>
            </div>
        </div>

        <modal name="offer-modal" :adaptive="false" :width="1200" :height="550">
            <section class="section modal-box" v-if="Object.keys(selectedOffer).length > 0">
                <h1 class="title is-1">Accept {{ selectedOffer.details.them.name }}'s offer?</h1>
                <hr>
                <div v-if="selectedOffer.itemsGive.length > 0">
                    <p class="subtitle is-5">
                        You will give away the following:
                    </p>
                    <ul class="menu-list item-list">
                        <li>
                            <ul>
                                <li class="subtitle is-6" v-for="item in selectedOffer.itemsGive">{{ item.name }}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div v-if="selectedOffer.itemsReceive.length > 0">
                    <br v-if="selectedOffer.itemsGive.length > 0">
                    <p class="subtitle is-5">
                        You will receive away the following:
                    </p>
                    <ul class="menu-list item-list">
                        <li>
                            <ul>
                                <li class="subtitle is-6" v-for="item in selectedOffer.itemsReceive">{{ item.name }}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <hr>
                <a v-if="!acceptOfferState.failed" class="button is-primary" v-on:click="quickAccept(selectedOffer)" v-bind:class="{ 'is-loading': acceptOfferState.busy }">
                    <span v-if="!acceptOfferState.accepted">
                        Sure, accept!
                    </span>
                    <div v-if="acceptOfferState.accepted">
                        <span class="icon is-small">
                            <i class="fa fa-check"></i>
                        </span>
                        <span>Accepted!</span>
                        <span v-if="selectedOffer.itemsGive.length > 0">Mobile confirmation needed.</span>
                    </div>
                </a>
                <a v-if="acceptOfferState.failed" class="button is-primary is-danger">
                    <span class="icon is-small">
                      <i class="fa fa-times"></i>
                    </span>
                    <span>Error accepting!</span>
                </a>
                <br>
                <span class="subtitle is-6">Note: this will not mobile confirm the offer.</span>
            </section>
        </modal>
    </div>
</template>

<script>
  import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
  import { mapGetters } from 'vuex';
  import SteamAccountManager from '../../../components/SteamAccountManager';

  export default {
    components: { ScaleLoader },
    name: 'offers',
    mounted() {
      if (!this.alreadyLoadedOffers(this.$route.params.username)) {
        this.loadOffers();
      } else {
        this.loadingOffers = false;
      }
    },
    methods: {
      openProfile(id) {
        this.$electron.shell.openExternal(`https://steamcommunity.com/profiles/${id}`);
      },
      inspect(url) {
        console.log(url);
        this.$electron.shell.openExternal(url);
      },
      loadOffers() {
        this.loadingOffers = true;
        this.$store.dispatch('getOffers', this.$route.params.username).then(() => {
          this.loadingOffers = false;
        });
      },
      accept(offer) {
        this.selectedOffer = offer;

        this.acceptOfferState = {
          busy: false, accepted: false, failed: false,
        };

        this.$modal.show('offer-modal');
      },
      quickAccept(offer) {
        this.acceptOfferState = {
          busy: true, accepted: false, failed: false,
        };

        SteamAccountManager.get(this.$route.params.username).acceptOffer(offer.id)
          .then(() => {
            this.acceptOfferState = {
              busy: false, accepted: true, failed: false,
            };
          })
          .catch(() => {
            this.acceptOfferState = {
              busy: false, accepted: false, failed: true,
            };
          });
      },
    },
    data() {
      return {
        loadingOffers: true,
        selectedOffer: {},
        acceptOfferState: {
          busy: false, accepted: false, failed: false,
        },
      };
    },
    computed: {
      ...mapGetters([
        'sentOffers',
        'receivedOffers',
        'alreadyLoadedOffers',
      ]),
    },
  };
</script>

<style src="font-awesome/css/font-awesome.min.css"></style>
<style scoped>
    .modal-box .item-list {
        max-height: 150px;
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
