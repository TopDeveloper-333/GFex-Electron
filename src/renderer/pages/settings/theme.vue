<template>
  <div class="row">
    <div class="m-auto">
    <form>
      <div class="card mb-3">
        <div class="card-header gf-header">
          <img src="../../assets/image/LOGO_GFEX.png" style="max-width:150px;max-height:180px;margin-left:-7px;float:left">
          <div style="margin:auto">FastPlan* Gas & Gas Condensate<br>
            <p style="font-size:3rem !important">Conventional and Shale Reservoirs</p>
          </div>
        </div>
        <div class="row g-0" style="background-color:var(--background-color);">
          <div class="col-md-10 offset-md-1">
            <div class="card-body">

              <vue-confirm-dialog></vue-confirm-dialog>
              <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
              
                <p class="gf-item">Change theme colors</p>
                
                <div style="margin-top:32px;display:flex;text-align:left">
                  <input type="color" style="min-width:50px;height:50px;margin-right:20px;" id="  " name="myBgColor" v-model="myBgColor" >
                  <label for="myBgColor" class="typo__label gf-item">Background color</label>
                </div>

                <div style="margin-top:32px;display:flex;text-align:left">
                  <input type="color" style="min-width:50px;height:50px;margin-right:20px;" id="myPrimaryColor" name="myPrimaryColor" v-model="myPrimaryColor" >
                  <label for="myPrimaryColor" class="typo__label gf-item">Primary color</label>
                </div>

                <div style="margin-top:32px;display:flex;text-align:left">
                  <input type="color" style="min-width:50px;height:50px;margin-right:20px;" id="mySecondaryColor" name="mySecondaryColor" v-model="mySecondaryColor" >
                  <label for="mySecondaryColor" class="typo__label gf-item">Secondary color</label>
                </div>

                <div style="margin-top:32px;display:flex;text-align:left">
                  <label class="btn btn-primary gf-button" style="margin-top:48px" v-on:click="onApply">Apply</label>
                  <label class="btn btn-primary gf-button" style="float:right;margin-left:12px;margin-top:48px" v-on:click="onGoHome">Home</label>
                </div>

              </div>



            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  </div>


</template>

<script>
import Form from 'vform'
import store from '~/store'
import { mapState } from 'vuex'

export default {
  middleware: 'auth',

  components: {
  },

  metaInfo () {
    return { title: this.$t('settings') }
  },

  data() {
    return {
      myBgColor: '#000000',
      myPrimaryColor: '#000000',
      mySecondaryColor: '#000000',
    }
  },
  computed:{
    ...mapState({
      backgroundColor : state => state.project.backgroundColor,
      primaryColor : state => state.project.primaryColor,
      secondaryColor : state => state.project.secondaryColor,
    }),
  },

  async mounted () {
    debugger
    this.myBgColor = this.backgroundColor
    this.myPrimaryColor = this.primaryColor
    this.mySecondaryColor = this.secondaryColor

    if (this.myBgColor == null || this.myBgColor == undefined || this.myBgColor == '') {
      this.myBgColor = '#f0f000'
    }
    if (this.myPrimaryColor == null || this.myPrimaryColor == undefined || this.myPrimaryColor == '') {
      this.myPrimaryColor = '#0d6efd'
    }
    if (this.mySecondaryColor == null || this.mySecondaryColor == undefined || this.mySecondaryColor == '') {
      this.mySecondaryColor = '#00FF00'
    }

  },

  methods: {
    onGoHome() {
      this.$router.replace('home')
    },
    onApply(event) {
      let colors = {
        backgroundColor : this.myBgColor,
        primaryColor: this.myPrimaryColor,
        secondaryColor: this.mySecondaryColor
      }
      document.documentElement.style.setProperty('--background-color', this.myBgColor);
      document.documentElement.style.setProperty('--primary-color', this.myPrimaryColor);
      document.documentElement.style.setProperty('--secondary-color', this.mySecondaryColor);

      store.dispatch('project/saveThemeColors', colors)
      this.$router.replace({ name: 'home'})
    }
  }
}

</script>