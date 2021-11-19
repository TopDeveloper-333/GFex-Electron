<template>
  <div>
    <div class="top-right links">
      <template v-if="authenticated">
        <router-link :to="{ name: 'home' }">
          {{ $t('home') }}
        </router-link>
      </template>
      <template v-else>
        <router-link :to="{ name: 'login' }">
          {{ $t('login') }}
        </router-link>
        <!-- <router-link :to="{ name: 'register' }">
          {{ $t('register') }}
        </router-link> -->
      </template>
    </div>

    <div class="text-center">
      <div>
        <p style="font-size:7rem !important;font-weight:600;color:#4172c4">FastPlan*</p>
        <p style="font-size:3rem !important;font-weight:600;color:#4172c4">DEVELOPMENT SCREENING / PLANNING<br/>
        &<br/>
        FIELD MONITORING / DRILLING / WORKOVER <br/>
        PLATFORM</p>

        <img class="titleImage" src="/assets/image/LOGO_GFEX.png" width="450" height="450">

        <p style="font-size:1.5rem !important;font-weight:600;color:#4172c4">GFeX, LLC<br/>
        7302 Timberlake Dr<br/>
        Suga Land, Texas 77479<br/>
        USA<br/>
        +1 (713) 997-0356<br/>
        &<br/>
        36 Rue Gaultier<br/>
        Paris, 92400<br/>
        France<br/>
        +(33) 787-71-2503</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'basic',

  metaInfo () {
    return { title: this.$t('home') }
  },

  data: () => ({
    title: window.config.appName
  }),

  computed: mapGetters({
    authenticated: 'auth/check'
  })
}
</script>

<style scoped>
.top-right {
  position: absolute;
  right: 10px;
  top: 18px;
}

.title {
  font-size: 85px;
}
</style>
