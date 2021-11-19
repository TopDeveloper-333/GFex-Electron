<template>
  <div id="app" class="container-fluid">
    <navbar />
    <Transition mode="out-in" name="slide-up">
      <!-- <keep-alive> -->
      <RouterView />
      <!-- </keep-alive> -->
    </Transition>
  </div>
</template>

<script>
import Vue from 'vue'
import Navbar from '~/components/Navbar.vue'

export default Vue.extend({
  name: 'MainApp',

  components: {
    Navbar
  },


})
</script>

<style lang="scss"></style>
