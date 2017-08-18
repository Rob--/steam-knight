import Vue from 'vue';
import Router from 'vue-router';
import 'bulma/css/bulma.css';

import vmodal from 'vue-js-modal';

Vue.use(vmodal);
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/master-password',
      name: 'master-password',
      component: require('@/components/MasterPassword'),
    },
    {
      path: '/add-account',
      name: 'add-account',
      component: require('@/components/AddAccount'),
    },
    {
      path: '/account/:username',
      component: require('@/components/AccountPage'),
      children: [
        {
          path: 'offers',
          name: 'offers',
          component: require('@/components/AccountPage/Offers'),
        },
        {
          path: 'history',
          name: 'history',
          component: require('@/components/AccountPage/History'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: require('@/components/AccountPage/Profile'),
        },
      ],
    },
    {
      path: '*',
      redirect: '/master-password',
    },
  ],
});
