<template>
  <div>
    <router-link :to="{ name: 'home' }" class="nav-link gf-nav-item" style="float:right;color:#636b6f" active-class="active">
      Home
    </router-link>
  </div>
  <!-- <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container">
      <router-link :to="'home'" class="navbar-brand" style="font-size:2rem">
        <img class="titleImage" src="../assets/image/LOGO_GFEX.png" width="50" height="50">GFeX
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbar" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link gf-nav-item" active-class="active">
              Home
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav> -->
</template>

<script>
import { mapGetters } from 'vuex'
import LocaleDropdown from './LocaleDropdown'

export default {
  components: {
    LocaleDropdown
  },

  data: () => ({
  }),

  methods: {
  }
}
</script>

<style scoped>

.profile-photo {
  width: 2rem;
  height: 2rem;
  margin: -.375rem 0;
}

.container {
  max-width: 1100px;
}
</style>
