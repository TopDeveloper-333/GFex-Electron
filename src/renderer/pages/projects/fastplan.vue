<template>
  <div class="row">
    <div class="m-auto">
    <loading :active.sync="isLoading" 
             :is-full-page="fullPage"></loading>
    <form>
      <div class="card mb-3">
        <div class="card-header gf-header">
          <img src="../../assets/image/LOGO_GFEX.png" style="max-width:150px;max-height:180px;margin-left:-7px;float:left">
          FastPlan* Gas & Gas Condensate<br>
          <p style="font-size:3rem !important">Conventional and Shale Reservoirs</p>
        </div>
        <div class="row g-0" style="background-color:#fdf500;">
          <!-- <div class="col-md-4" style="display:flex; justify-content:center;">
            <img src="../../assets/image/LOGO_GFEX.png" class="img-fluid rounded-start" style="opacity:0.6;max-width:250px;max-height:300px">
          </div> -->
          <div class="col-md-10 offset-md-1">
            <div class="card-body">
              <h3 class="card-title gf-title text-wrap" ><{{projectName}}> Field Project</h3>
              <p class="card-text gf-comment">FDP or FIELD MONITORING PROJECT (Economics ONLY with FDP) <br>
              DRY GAS or GAS CONDENSATE PROJECT</p>
              <hr class="gf-line">

              <div style="display:flex;align-items:center;margin-bottom:6px">
                <label class="gf-item">SEPARATOR PROCESSING / OPTIMIZER
                </label>
                <label class="switch" style="margin: 0 0 auto auto">
                  <input type="checkbox" v-model="bSeparatorOptimizer">
                  <span class="slider round"></span>
                </label>
              </div>

              <div style="display:flex;align-items:center;margin-bottom:6px" v-show="bSeparatorOptimizer==false">
                <label class="gf-item">FDP (Field Development Planning) 
                </label>
                <label class="switch" style="margin: 0 0 auto auto">
                  <input type="checkbox" v-model="bFDP" false-value=0 true-value=1>
                  <span class="slider round"></span>
                </label>
              </div>

              <div style="display:flex;align-items:center;margin-bottom:6px" v-show="bSeparatorOptimizer==false">
                <label class="gf-item">FIELD MONITORING / DRILLING / WORKOVER 
                </label>
                <label class="switch" style="margin: 0 0 auto auto">
                  <input type="checkbox" v-model="bFDP" false-value=1 true-value=0>
                  <span class="slider round"></span>
                </label>
              </div>

              <div style="display:flex;align-items:center;margin-bottom:6px" v-show="bSeparatorOptimizer==false">
                <label class="gf-item">DRY/WET GAS FIELD
                </label>
                <label class="switch" style="margin: 0 0 auto auto">
                  <input type="checkbox" v-model="bCondensate" false-value=1 true-value=0 :disabled="bFDP!='1'">
                  <span class="slider round"></span>
                </label>
              </div>

              <div style="display:flex;align-items:center;margin-bottom:6px" v-show="bSeparatorOptimizer==false">
                <label class="gf-item">GAS CONDENSATE FIELD
                </label>
                <label class="switch" style="margin: 0 0 auto auto">
                  <input type="checkbox" v-model="bCondensate" false-value=0 true-value=1 :disabled="bFDP!='1'">
                  <span class="slider round"></span>
                </label>
              </div>

              <div style="display:flex;align-items:center;margin-bottom:6px" v-show="bSeparatorOptimizer==false && bFDP=='1'">
                <label class="gf-item">ECONOMICS ANALYSIS
                </label>
                <label class="switch" style="margin: 0 0 auto auto">
                  <input type="checkbox" v-model="bEconomics">
                  <span class="slider round"></span>
                </label>
              </div>

              <div class="d-flex justify-content-between">
                <label class="btn btn-primary gf-button" v-on:click="onPrevPage">Previous</label>
                <div>
                  <label class="btn btn-primary gf-button " v-on:click="onNextPage">Next</label>
                  <label class="btn btn-primary gf-button " v-on:click="onExitPage">Exit</label>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>

    </div>

    <div id="exitModal" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close">&times;</span>
        </div>
        <p class="gf-comment" style="margin-top:6px !important; margin-bottom:6px !important;"><{{projectName}}> Field Project</p>
        <span style="font-size: 1.25rem" v-show="isSaveAs==false">Do you want to save this project?</span>
        <div v-show="isSaveAs==true">
          <span style="font-size: 1.25rem">Project Name: </span>
          <input style="font-size: 1.25rem" maxlength="20" v-model="newProjectName" placeholder="Please input new project name">
        </div>
        <div style="margin-bottom:16px;margin-top:16px">
          <label class="btn btn-primary gf-button" v-on:click="onSaveAs" v-show="hideSaveAsButton==false">Save As</label>
          <label class="btn btn-primary gf-button" v-on:click="onYes">Yes</label>
          <label class="btn btn-primary gf-button" v-on:click="onNo">No</label>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import store from '~/store'
import { mapState } from 'vuex'
import Loading from 'vue-loading-overlay';

// import axios from 'axios'
export default {
  middleware: 'auth',

  components: {
    Loading
  },

  metaInfo () {
    return { title: this.$t('Project Setting') }
  },

  data() {
    return {
      bFDP : "1",
      bCondensate: "1",
      bEconomics : "1",
      bSeparatorOptimizer: false,
      isSaveAs : false,
      hideSaveAsButton: false,
      newProjectName: "",
      isLoading: false,
      fullPage: true,
    }
  },

  computed: {
    ...mapState({
      projectName : state => state.project.projectName,
      projectId: state => state.project.projectId,
      isFDP: state => state.project.isFDP,
      isCondensate: state => state.project.isCondensate,
      isEconomics: state => state.project.isEconomics,
      isSeparatorOptimizer: state => state.project.isSeparatorOptimizer,
      sep : state => state.project.sep,
      drygas : state => state.project.drygas,
      surface: state => state.project.surface,
      reservoir: state => state.project.reservoir,
      wellhistory: state => state.project.wellhistory,
      economics: state => state.project.economics,
      operations: state => state.project.operations,
      relPerm: state => state.project.relPerm,
      gascondensate : state => state.project.gascondensate,
    }),
  },

  watch: {
    bFDP: function(val, oldval) {
      if (this.bFDP != '1') {
        this.bCondensate = '0'
      }
    }
  },
  
  methods: {
    onSaveAs: function(event) {
      this.isSaveAs = true
      this.hideSaveAsButton = true
    },
    onYes: async function(event) {
      // hide exit dialog
      var modal = document.getElementById("exitModal");
      modal.style.display = "none";

      this.isLoading = true
      await this.onSavePage()
      await this.onSaveProject()
      this.isLoading = false

      // go to home vue
      this.$router.replace('home')
    },
    onNo: function(event) {
      // hide exit dialog
      var modal = document.getElementById("exitModal");
      modal.style.display = "none";

      // go to home vue
      this.$router.replace('home')
    },
    onSavePage: async function() {
      
      if (this.bFDP != '1')
        this.bEconomics = false

      let payload = {}
      payload.isFDP = this.bFDP
      payload.isCondensate = this.bCondensate
      payload.isEconomics = this.bEconomics
      payload.isSeparatorOptimizer = this.bSeparatorOptimizer
      await store.dispatch('project/saveFastPlan', payload)
    },
    onPrevPage: function(event) {    
      this.onExitPage();
    },
    onNextPage: async function(event) {
      await this.onSavePage()

      if (this.isSeparatorOptimizer == true) {
        this.$router.replace({ name: 'separator' })
      }
      else if (this.isCondensate == "1") {
        this.$router.replace({ name: 'condensate' })
      }
      else {
        this.$router.replace({ name: 'drygas'})
      }
    },
    onExitPage: function(event) {
      this.isSaveAs = false
      this.hideSaveAsButton = false

      var modal = document.getElementById("exitModal");
      modal.style.display = "block";
    },
  },

  async mounted() {
    this.bFDP = this.isFDP
    this.bCondensate = this.isCondensate
    this.bEconomics = this.isEconomics
    this.bSeparatorOptimizer = this.isSeparatorOptimizer

    mountExitDialog();
  }
}

function mountExitDialog() {

  // Get the modal
  var modal = document.getElementById("exitModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("gf-close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }      
}

</script>
