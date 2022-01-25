<template>
  <div>
    <div class="text-center">
      <div>
        <p style="font-size:7rem !important;font-weight:600;color:#4172c4">FastPlan*</p>
        <p style="font-size:3rem !important;font-weight:600;color:#4172c4;line-height:3.6rem">FIELD DEVELOPMENT SCREENING / PLANNING / ECONOMICS<br/>
        &<br/>
        SYSTEM MONITORING / WORK-OVER / DRILLING <br/>
        PLATFORM</p>

        <img class="titleImage" src="../assets/image/LOGO_GFEX.png" style="width:450px; height:450px">

        <p style="font-size:1.5rem !important;font-weight:600;color:#4172c4;margin-top:-20px">gfex@gfex-us.com</p>
        <p style="font-size:1.5rem !important;font-weight:600;color:#4172c4;margin-bottom:0px">GFeX, LLC</p>
        <p style="font-size:1rem !important;font-weight:600;color:#4172c4">
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

<script lang="ts">
import Vue from 'vue'

enum TEST {}

export default Vue.extend({
  name: 'Welcome',

  mounted () {
    console.log('Welcome is mounted')
  }
})
</script>

<style>
.hero-body {
  height: 100vh;
}
</style>
