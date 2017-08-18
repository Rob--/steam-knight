<template>
  <div id="app">
    <sidebar v-if="$route.name != 'master-password'"></sidebar>
    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar.vue';

  export default {
    name: 'steam-knight',
    components: { Sidebar },
  };
</script>

<style>
  #app {
    display: flex;
    flex-direction: row;
  }

  body, #app {
    height: 100%;
  }

  .router-view {
    margin: 1rem 2rem 0px 2rem;
    width: 100%;
  }
</style>
