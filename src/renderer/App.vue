<template>
  <div id="app">
    <div class="main-layout">
      <navbar />
      <div class="mt-2">
        <Transition mode="out-in" name="slide-up">
          <!-- <keep-alive> -->
          <RouterView />
          <!-- </keep-alive> -->
        </Transition>
      </div>
    </div>
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
