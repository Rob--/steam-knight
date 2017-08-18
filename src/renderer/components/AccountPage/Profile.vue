<template>
    <div>
        <div class="container">
            <div v-if="loadingProfile">
                <h2 class="title is-2 has-text-centered">Loading profile...</h2>
                <scale-loader></scale-loader>
                <hr>
            </div>
            <div class="box">
                <h1 class="title is-1 has-text-centered">{{ $route.params.username }}</h1>
                <h6 class="subtitle is-6 has-text-centered" v-if="email.loaded">{{ email.address }}</h6>
                <hr>
                <nav class="level">
                    <div class="level-item has-text-centered" v-if="wallet.loaded && wallet.hasWallet">
                        <div>
                            <p class="heading">WALLET</p>
                            <p class="title">{{ balance }}</p>
                        </div>
                    </div>
                    <div class="level-item has-text-centered" v-if="friendCount">
                        <div>
                            <p class="heading">FRIENDS</p>
                            <p class="title">{{ friendCount }}</p>
                        </div>
                    </div>
                    <div class="level-item has-text-centered" v-if="groupCount">
                        <div>
                            <p class="heading">GROUPS</p>
                            <p class="title">{{ groupCount }}</p>
                        </div>
                    </div>
                </nav>
            </div>
            <hr>
            <div class="box" v-for="profile in profileData($route.params.username)">
                <article class="media">
                    <figure class="media-left">
                        <p class="image">
                            <img :src="profile.getAvatarURL('full')">
                        </p>
                    </figure>
                    <div class="media-content">
                        <h1 class="title is-1 no-margin">{{ profile.name }} <span class="subtitle is-5">({{ profile.onlineState }})</span></h1>
                        <h6 class="subtitle is-6 no-margin">{{ profile.stateMessage }}</h6>
                        <hr class="small-margin">
                        <div class="content">
                            <!--<p>-->
                                <!--<strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>-->
                                <!--<br>-->
                                <!--Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.-->
                            <!--</p>-->
                            <div class="summary" v-html="profile.summary"></div>
                        </div>
                    </div>
                </article>
                <hr>
                <div class="container is-fluid">
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label class="label">Name</label>
                                <p class="control">
                                    <input class="input is-primary" placeholder="Name" v-model="settings.name">
                                </p>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Real Name</label>
                                <p class="control">
                                    <input class="input is-primary" placeholder="Real Name" :value="profile.realName">
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Custom URL</label>
                        <p class="control">
                            <input class="input is-primary" placeholder="Custom URL" :value="profile.customURL">
                        </p>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label class="label">Country</label>
                                <p class="control">
                                    <span class="select">
                                        <select v-model="settings.country" @change="loadStates($event.target.value)">
                                            <option value="" selected="selected">(Do not display)</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="AF">Afghanistan</option>
                                            <option value="AX">Aland Islands</option>
                                            <option value="AL">Albania</option>
                                            <option value="DZ">Algeria</option>
                                            <option value="AS">American Samoa</option>
                                            <option value="AD">Andorra</option>
                                            <option value="AO">Angola</option>
                                            <option value="AI">Anguilla</option>
                                            <option value="AQ">Antarctica</option>
                                            <option value="AG">Antigua & Barbuda</option>
                                            <option value="AR">Argentina</option>
                                            <option value="AM">Armenia</option>
                                            <option value="AW">Aruba</option>
                                            <option value="AU">Australia</option>
                                            <option value="AT">Austria</option>
                                            <option value="AZ">Azerbaijan</option>
                                            <option value="BS">Bahamas</option>
                                            <option value="BH">Bahrain</option>
                                            <option value="BD">Bangladesh</option>
                                            <option value="BB">Barbados</option>
                                            <option value="BY">Belarus</option>
                                            <option value="BE">Belgium</option>
                                            <option value="BZ">Belize</option>
                                            <option value="BJ">Benin</option>
                                            <option value="BM">Bermuda</option>
                                            <option value="BT">Bhutan</option>
                                            <option value="BO">Bolivia</option>
                                            <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                            <option value="BA">Bosnia and Herzegovina</option>
                                            <option value="BW">Botswana</option>
                                            <option value="BV">Bouvet Island</option>
                                            <option value="BR">Brazil</option>
                                            <option value="IO">British Indian Ocean Territory</option>
                                            <option value="VG">British Virgin Islands</option>
                                            <option value="BN">Brunei Darussalam</option>
                                            <option value="BG">Bulgaria</option>
                                            <option value="BF">Burkina Faso</option>
                                            <option value="BI">Burundi</option>
                                            <option value="KH">Cambodia</option>
                                            <option value="CM">Cameroon</option>
                                            <option value="CV">Cape Verde</option>
                                            <option value="KY">Cayman Islands</option>
                                            <option value="CF">Central African Republic</option>
                                            <option value="TD">Chad</option>
                                            <option value="CL">Chile</option>
                                            <option value="CN">China</option>
                                            <option value="CX">Christmas Island</option>
                                            <option value="CC">Cocos (Keeling) Islands</option>
                                            <option value="CO">Colombia</option>
                                            <option value="KM">Comoros</option>
                                            <option value="CG">Congo</option>
                                            <option value="CD">Congo, the Democratic Republic of the</option>
                                            <option value="CK">Cook Islands</option>
                                            <option value="CR">Costa Rica</option>
                                            <option value="CI">Cote D'ivoire (Ivory Coast)</option>
                                            <option value="HR">Croatia</option>
                                            <option value="CU">Cuba</option>
                                            <option value="CW">Curacao</option>
                                            <option value="CY">Cyprus</option>
                                            <option value="CZ">Czech Republic</option>
                                            <option value="DK">Denmark</option>
                                            <option value="DJ">Djibouti</option>
                                            <option value="DM">Dominica</option>
                                            <option value="DO">Dominican Republic</option>
                                            <option value="EC">Ecuador</option>
                                            <option value="EG">Egypt</option>
                                            <option value="SV">El Salvador</option>
                                            <option value="GQ">Equatorial Guinea</option>
                                            <option value="ER">Eritrea</option>
                                            <option value="EE">Estonia</option>
                                            <option value="ET">Ethiopia</option>
                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                            <option value="FO">Faroe Islands</option>
                                            <option value="FJ">Fiji</option>
                                            <option value="FI">Finland</option>
                                            <option value="FR">France</option>
                                            <option value="GF">French Guiana</option>
                                            <option value="PF">French Polynesia</option>
                                            <option value="TF">French Southern Territories</option>
                                            <option value="GA">Gabon</option>
                                            <option value="GM">Gambia</option>
                                            <option value="GE">Georgia</option>
                                            <option value="DE">Germany</option>
                                            <option value="GH">Ghana</option>
                                            <option value="GI">Gibraltar</option>
                                            <option value="GR">Greece</option>
                                            <option value="GL">Greenland</option>
                                            <option value="GD">Grenada</option>
                                            <option value="GP">Guadeloupe</option>
                                            <option value="GU">Guam</option>
                                            <option value="GT">Guatemala</option>
                                            <option value="GG">Guernsey</option>
                                            <option value="GN">Guinea</option>
                                            <option value="GW">Guinea-Bissau</option>
                                            <option value="GY">Guyana</option>
                                            <option value="HT">Haiti</option>
                                            <option value="HM">Heard & McDonald Islands</option>
                                            <option value="HN">Honduras</option>
                                            <option value="HK">Hong Kong</option>
                                            <option value="HU">Hungary</option>
                                            <option value="IS">Iceland</option>
                                            <option value="IN">India</option>
                                            <option value="ID">Indonesia</option>
                                            <option value="IQ">Iraq</option>
                                            <option value="IE">Ireland</option>
                                            <option value="IR">Islamic Republic of Iran</option>
                                            <option value="IM">Isle of Man</option>
                                            <option value="IL">Israel</option>
                                            <option value="IT">Italy</option>
                                            <option value="JM">Jamaica</option>
                                            <option value="JP">Japan</option>
                                            <option value="JE">Jersey</option>
                                            <option value="JO">Jordan</option>
                                            <option value="KZ">Kazakhstan</option>
                                            <option value="KE">Kenya</option>
                                            <option value="KI">Kiribati</option>
                                            <option value="KP">Korea, Democratic People's Republic of</option>
                                            <option value="KR">Korea, Republic of</option>
                                            <option value="XK">Kosovo</option>
                                            <option value="KW">Kuwait</option>
                                            <option value="KG">Kyrgyzstan</option>
                                            <option value="LA">Laos</option>
                                            <option value="LV">Latvia</option>
                                            <option value="LB">Lebanon</option>
                                            <option value="LS">Lesotho</option>
                                            <option value="LR">Liberia</option>
                                            <option value="LY">Libya</option>
                                            <option value="LI">Liechtenstein</option>
                                            <option value="LT">Lithuania</option>
                                            <option value="LU">Luxembourg</option>
                                            <option value="MO">Macau</option>
                                            <option value="MK">Macedonia, The Former Yugoslav Republic of</option>
                                            <option value="MG">Madagascar</option>
                                            <option value="MW">Malawi</option>
                                            <option value="MY">Malaysia</option>
                                            <option value="MV">Maldives</option>
                                            <option value="ML">Mali</option>
                                            <option value="MT">Malta</option>
                                            <option value="MH">Marshall Islands</option>
                                            <option value="MQ">Martinique</option>
                                            <option value="MR">Mauritania</option>
                                            <option value="MU">Mauritius</option>
                                            <option value="YT">Mayotte</option>
                                            <option value="MX">Mexico</option>
                                            <option value="FM">Micronesia</option>
                                            <option value="MD">Moldova, Republic of </option>
                                            <option value="MC">Monaco</option>
                                            <option value="MN">Mongolia</option>
                                            <option value="MS">Monserrat</option>
                                            <option value="ME">Montenegro</option>
                                            <option value="MA">Morocco</option>
                                            <option value="MZ">Mozambique</option>
                                            <option value="MM">Myanmar</option>
                                            <option value="NA">Namibia</option>
                                            <option value="NR">Nauru</option>
                                            <option value="NP">Nepal</option>
                                            <option value="NL">Netherlands</option>
                                            <option value="NC">New Caledonia</option>
                                            <option value="NZ">New Zealand</option>
                                            <option value="NI">Nicaragua</option>
                                            <option value="NE">Niger</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="NU">Niue</option>
                                            <option value="NF">Norfolk Island</option>
                                            <option value="MP">Northern Mariana Islands</option>
                                            <option value="NO">Norway</option>
                                            <option value="OM">Oman</option>
                                            <option value="PK">Pakistan</option>
                                            <option value="PW">Palau</option>
                                            <option value="PS">Palestinian Territory, Occupied</option>
                                            <option value="PA">Panama</option>
                                            <option value="PG">Papua New Guinea</option>
                                            <option value="PY">Paraguay</option>
                                            <option value="PE">Peru</option>
                                            <option value="PH">Philippines</option>
                                            <option value="PN">Pitcairn</option>
                                            <option value="PL">Poland</option>
                                            <option value="PT">Portugal</option>
                                            <option value="PR">Puerto Rico</option>
                                            <option value="QA">Qatar</option>
                                            <option value="RE">Reunion</option>
                                            <option value="RO">Romania</option>
                                            <option value="RU">Russian Federation</option>
                                            <option value="RW">Rwanda</option>
                                            <option value="BL">Saint Barthelemy</option>
                                            <option value="LC">Saint Lucia</option>
                                            <option value="MF">Saint Martin (French part)</option>
                                            <option value="WS">Samoa</option>
                                            <option value="SM">San Marino</option>
                                            <option value="ST">Sao Tome & Principe</option>
                                            <option value="SA">Saudi Arabia</option>
                                            <option value="SN">Senegal</option>
                                            <option value="RS">Serbia</option>
                                            <option value="SC">Seychelles</option>
                                            <option value="SL">Sierra Leone</option>
                                            <option value="SG">Singapore</option>
                                            <option value="SX">Sint Maarten (Dutch part)</option>
                                            <option value="SK">Slovakia</option>
                                            <option value="SI">Slovenia</option>
                                            <option value="SB">Solomon Islands</option>
                                            <option value="SO">Somalia</option>
                                            <option value="ZA">South Africa</option>
                                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                                            <option value="SS">South Sudan</option>
                                            <option value="ES">Spain</option>
                                            <option value="LK">Sri Lanka</option>
                                            <option value="SH">St. Helena</option>
                                            <option value="KN">St. Kitts and Nevis</option>
                                            <option value="PM">St. Pierre & Miquelon</option>
                                            <option value="VC">St. Vincent & the Grenadines</option>
                                            <option value="SD">Sudan</option>
                                            <option value="SR">Suriname</option>
                                            <option value="SJ">Svalbard & Jan Mayen Islands</option>
                                            <option value="SZ">Swaziland</option>
                                            <option value="SE">Sweden</option>
                                            <option value="CH">Switzerland</option>
                                            <option value="SY">Syrian Arab Republic</option>
                                            <option value="TW">Taiwan</option>
                                            <option value="TJ">Tajikistan</option>
                                            <option value="TZ">Tanzania, United Republic of</option>
                                            <option value="TH">Thailand</option>
                                            <option value="TL">Timor-Leste</option>
                                            <option value="TG">Togo</option>
                                            <option value="TK">Tokelau</option>
                                            <option value="TO">Tonga</option>
                                            <option value="TT">Trinidad & Tobago</option>
                                            <option value="TN">Tunisia</option>
                                            <option value="TR">Turkey</option>
                                            <option value="TM">Turkmenistan</option>
                                            <option value="TC">Turks & Caicos Islands</option>
                                            <option value="TV">Tuvalu</option>
                                            <option value="UG">Uganda</option>
                                            <option value="UA">Ukraine</option>
                                            <option value="AE">United Arab Emirates</option>
                                            <option value="GB">United Kingdom (Great Britain)</option>
                                            <option value="UM">United States Minor Outlying</option>
                                            <option value="VI">United States Virgin Islands</option>
                                            <option value="UY">Uruguay</option>
                                            <option value="UZ">Uzbekistan</option>
                                            <option value="VU">Vanuatu</option>
                                            <option value="VA">Vatican City State (Holy See)</option>
                                            <option value="VE">Venezuela</option>
                                            <option value="VN">Viet Nam</option>
                                            <option value="WF">Wallis & Futuna Islands</option>
                                            <option value="EH">Western Sahara</option>
                                            <option value="YE">Yemen</option>
                                            <option value="ZM">Zambia</option>
                                            <option value="ZW">Zimbabwe</option>
                                        </select>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">State / Province</label>
                                <p class="control">
                                    <span class="select">
                                        <select v-model="settings.state">
                                            <option v-for="city in cities" :value="city.value" :selected="city.value='' ? 'selected' : ''">
                                                {{ city.name }}
                                            </option>
                                        </select>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="field summary-edit">
                                <label class="label">Summary</label>
                                <span class="icon is-small" v-on:click="formatSummary('b')">
                                    <i class="fa fa-bold" aria-hidden="true"></i>
                                </span>
                                <span class="icon is-small" v-on:click="formatSummary('i')">
                                    <i class="fa fa-italic" aria-hidden="true"></i>
                                </span>
                                <span class="icon is-small" v-on:click="formatSummary('strike')">
                                    <i class="fa fa-strikethrough" aria-hidden="true"></i>
                                </span>
                                <p class="control">
                                    <textarea ref="summary" class="textarea" placeholder="Summary" v-model="settings.summary"></textarea>
                                </p>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Summary</label>
                                <div v-html="toHTML"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="has-text-right">
                    <a class="button is-primary" v-on:click="$modal.show('confirm')">Save Profile</a>
                </div>
            </div>
        </div>

        <modal name="confirm" :adaptive="false" :width="1200" :height="370">
            <section class="section modal-box">
                <h1 class="title is-1">Profile Update</h1>
                <hr>
                <p class="subtitle is-4">
                    Are you sure you want to update your profile?
                    <br>
                    Currently this app is not able to determine previous backgrounds and showcases,
                    therefore they will be reset when updating the profile.
                </p>
                <hr>
                <a class="button is-primary" v-on:click="updateProfile()">Yes, save!</a>
            </section>
        </modal>
    </div>
</template>

<script>
  import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
  import { mapGetters } from 'vuex';
//  import { htmlToMarkdown, markdownToHtml } from '../../../components/Helpers';
  import EFriendRelationship from 'steam-user/enums/EFriendRelationship';
  import EClanRelationship from 'steam-user/enums/EClanRelationship';
  import Helpers from '../../../components/Helpers';
  import SteamAccountManager from '../../../components/SteamAccountManager';

  export default {
    components: { ScaleLoader },
    name: 'profile',
    mounted() {
      if (!this.alreadyLoadedProfile(this.$route.params.username)) {
        this.loadProfile();
      } else {
        this.loadingProfile = false;
      }
    },
    methods: {
      updateProfile() {
        console.log(this.settings);
        const data = {
          name: this.settings.name,
          realName: this.settings.realName,
          summary: this.settings.summary,
          country: this.settings.country,
          state: this.settings.state,
          customURL: this.settings.customURL,
        };

        console.log(data);
        SteamAccountManager.get(this.$route.params.username).community
          .editProfile(Object.assign({}, data), (error) => {
            if (error) console.log(error);
          });
      },
      loadStates(country) {
        SteamAccountManager.get(this.$route.params.username).getStates(country).then((cities) => {
          this.cities = cities;
        });
      },
      formatSummary(tag) {
        const field = this.$refs.summary[0];

        if (field.selectionStart === field.selectionEnd) return;

        const selectedText = field.value.substring(field.selectionStart, field.selectionEnd);
        const before = field.value.substring(0, field.selectionStart);
        const after = field.value.substring(field.selectionEnd, field.value.length);
        field.value = `${before}[${tag}]${selectedText}[/${tag}]${after}`;
//        this.settings.summary = field.value;
      },
      loadProfile() {
        this.loadingProfile = true;
        this.$store.dispatch('getProfile', this.$route.params.username).then(() => {
          this.loadingProfile = false;
          this.settings = Object.assign({}, this.profileData(this.$route.params.username)[0]);
          console.log('cloned', this.settings);

          this.settings.summary = Helpers.htmlToMarkdown(this.settings.summary);
        });
      },
    },
    data() {
      return {
        loadingProfile: true,
        settings: {},
        cities: [],
      };
    },
    computed: {
      balance() {
        const wallet = SteamAccountManager.get(this.$route.params.username).getWallet();
        return `${Helpers.currencies[wallet.currency]}${wallet.balance}`;
      },
      friendCount() {
        const client = SteamAccountManager.get(this.$route.params.username).client;
        if (Object.hasOwnProperty.call(client, 'myFriends')) {
          return Object
            .values(client.myFriends)
            .filter(status => status === EFriendRelationship.Friend)
            .length.toLocaleString();
        }
        return false;
      },
      groupCount() {
        const client = SteamAccountManager.get(this.$route.params.username).client;
        if (Object.hasOwnProperty.call(client, 'myGroups')) {
          return Object
            .values(client.myGroups)
            .filter(status => status === EClanRelationship.Member)
            .length.toLocaleString();
        }
        return false;
      },
      email() {
        return SteamAccountManager.get(this.$route.params.username).getEmail();
      },
      wallet() {
        return SteamAccountManager.get(this.$route.params.username).getWallet();
      },
      toHTML() {
        if (Object.hasOwnProperty.call(this.settings, 'summary')) {
          return Helpers.markdownToHtml(this.settings.summary);
        }
        return '';
      },
      ...mapGetters([
        'profileData',
        'alreadyLoadedProfile',
      ]),
    },
  };
</script>

<style src="font-awesome/css/font-awesome.min.css"></style>
<style scoped>

    .small-margin {
        margin: 0.5rem 0;
    }

    .no-margin {
        margin: 0 !important;
    }

    .summary {
        padding: 5px 5px;
        /*background-color: #f8f8f8;*/
        /*box-shadow: inset 0px 0px 10px -5px black;*/
        /*border: 1px solid #dbdbdb;*/
    }

    .summary-edit > .icon {
        background-color: #f8f8f8;
        border: 1px solid #dbdbdb;
        margin: 0 0.2rem 0.5rem 0;
        cursor: pointer;
        width: 2rem;
        height: 2rem;
    }

    .image img{
        box-shadow: 2px 2px 7px -2px black;
    }
</style>
<style>
    .bb_link_host {
        font-size: 10px;
        color: #888;
        padding: 4px;
        top: -1px;
    }

    span.bb_strike {
        text-decoration: line-through;
    }

    div.bb_h1 {
        font-size: 18px;
        color: #00d1b2;
        font-weight: normal;
        border-bottom: 1px dotted #666666;
    }

    span.bb_spoiler {
        color: #000000;
        background-color: #000000;
        padding: 0px 8px;
    }

    span.bb_spoiler:hover {
        color: #ffffff;
    }
</style>
