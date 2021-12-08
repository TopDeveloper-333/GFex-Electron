<template>
  <div class="row">
    <div class="m-auto">
    <form>
      <loading :active.sync="isLoading" 
             :is-full-page="fullPage"></loading>
      <div class="card mb-3">
        <div class="card-header gf-header">
          <img src="../../assets/image/LOGO_GFEX.png" style="max-width:150px;max-height:180px;margin-left:-7px;float:left">
          <div style="margin:auto">FastPlan* Gas & Gas Condensate<br>
            <p style="font-size:3rem !important">Conventional and Shale Reservoirs</p>
          </div>
        </div>
        <div class="row g-0" style="background-color:var(--background-color);">
          <!-- <div class="col-md-3" style="display:flex; justify-content:center;">
            <img src="../../assets/image/LOGO_GFEX.png" class="img-fluid rounded-start" style="opacity:0.6;max-width:250px;max-height:300px">
          </div> -->
          <div class="col-md-10 offset-md-1">
            <div class="card-body">
              <h3 class="card-title gf-title"><{{projectName}}> Field Project
              </h3>

              <drygas-pvt v-show="screenType==='PVT_SCREEN'" ref="drygasControl" 
                          v-bind:isHidden="false"
                          @changedValidate="updatePVTValidate($event)">
              </drygas-pvt>
              <surface v-show="screenType==='SURFACE_SCREEN'" ref="surfaceControl" 
                          v-bind:isHidden="false"
                          @changedValidate="updateSurfaceValidate($event)">
              </surface>
              <reservoir v-show="screenType==='RESERVOIR_SCREEN'" ref="reservoirControl" 
                         @changedValidate="updateReservoirValidate($event)">
              </reservoir>
              <well-history v-show="screenType==='WELLHISTORY_SCREEN'" ref="wellHistoryControl" 
                            v-bind:isHidden="!(isEconomics != true && isCondensate!='1' && isFDP =='0')"
                         @changedValidate="updateWellHistoryValidate($event)">
              </well-history>
              <economics v-show="screenType==='ECONOMICS_SCREEN'" ref="economicsControl" 
                          v-bind:isHidden="!(isEconomics == true && isFDP =='1')"
                        @changedValidate="updateEconomicsValidate($event)">
              </economics>
              <operations v-show="screenType==='OPERATIONS_SCREEN'" ref="operationsControl" 
                          v-bind:isHidden="!(isFDP=='1')"
                        @changedValidate="updateOperationsValidate($event)">
              </operations>

              <div class="d-flex justify-content-between">
                <div style="text-align:center">
                  <label class="btn btn-primary gf-button " v-on:click="onPrevPage">Previous</label>
                </div>

                <!-- <div style="text-align:center" class="btn-group" role="group"> -->
                <div style="text-align:center">
                  <label class="btn gf-button" v-on:click="onPVTPage" v-bind:class="pvtButtonClass">PVT</label>
                  <label class="btn gf-button" v-on:click="onSurfacePage" v-bind:class="surfaceButtonClass">Surface</label>
                  <label class="btn gf-button" v-on:click="onReservoirPage" v-bind:class="reservoirButtonClass">Reservoir</label>
                  <label class="btn gf-button" v-on:click="onWellHistoryPage" v-bind:class="wellHistoryButtonClass" v-show="isEconomics != true && isCondensate!='1' && isFDP =='0'">Well History / Matching</label>
                  <label class="btn gf-button" v-on:click="onEconomicsPage" v-bind:class="economicsButtonClass" v-show="isEconomics == true && isFDP =='1'">Economics</label>
                  <label class="btn gf-button" v-on:click="onOperationPage" v-bind:class="operationButtonClass" v-show="isFDP=='1'">Operations</label>
                </div>

                <div style="text-align:center">
                  <label class="btn btn-outline-primary gf-button" v-bind:class="executeButtonClass" v-on:click="onNextPage">Execute</label>
                  <label class="btn btn-primary gf-button" v-on:click="onExitPage(false)">Save</label>
                  <label class="btn btn-primary gf-button" v-on:click="onExitPage(true)">Exit</label>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </form>

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
          <label class="btn btn-primary gf-button" v-on:click="onSaveAs" v-show="hideSaveAsButton==false && isLeavePage == true">Save As</label>
          <label class="btn btn-primary gf-button" v-on:click="onYes">Yes</label>
          <label class="btn btn-primary gf-button" v-on:click="onNo">No</label>
        </div>
      </div>
    </div>

    </div>
  </div>


</template>

<script>
import store from '~/store'
import { mapState } from 'vuex'
import DrygasPvt from '~/components/DrygasPvt.vue'
import Surface from '~/components/Surface.vue'
import Reservoir from '~/components/Reservoir.vue'
import WellHistory from '~/components/WellHistory.vue'
import Economics from '~/components/Economics.vue'
import Operations from '~/components/Operations.vue'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

const PVT_SCREEN = "PVT_SCREEN"
const SURFACE_SCREEN = "SURFACE_SCREEN"
const RESERVOIR_SCREEN = "RESERVOIR_SCREEN"
const ECONOMICS_SCREEN = "ECONOMICS_SCREEN"
const WELLHISTORY_SCREEN = "WELLHISTORY_SCREEN"
const OPERATIONS_SCREEN = "OPERATIONS_SCREEN"


// import axios from 'axios'
export default {
  components: { 
    DrygasPvt,
    Surface,
    Reservoir,
    WellHistory,
    Economics,
    Operations,
    Loading
  },

  middleware: 'auth',

  // async asyncData () {
  //   const { data: projects } = await axios.get('/api/projects')

  //   return {
  //     projects
  //   }
  // },

  metaInfo () {
    return { title: this.$t('Dry GAS') }
  },

  data() {
    return {
      gasPVT : null,
      screenType: PVT_SCREEN,
      isSaveAs : false,
      hideSaveAsButton: false,
      newProjectName: "",
      isLoading: false,
      fullPage: true,
      isPVTValidate: true,
      isSurfaceValidate: true,
      isReservoirValidate: true,
      isWellHistoryValidate: true,
      isEconomicsValidate: true,
      isOperationValidate: true,
      isLeavePage: true
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
      resKGKO: state => state.project.resKGKO,
    }),
    pvtButtonClass: function() {
      if (this.isPVTValidate == false) return {'btn-danger': true}
      // else if (this.isDataValidate == false) return {'btn-outline-primary': true, 'disabled': true}
      else if (this.isDataValidate == false) return {'btn-outline-primary': true}
      else if (this.screenType === PVT_SCREEN) return {'btn-primary': true}
      else return {'btn-outline-primary': true}
    },
    surfaceButtonClass: function () {
      if (this.isSurfaceValidate == false) return {'btn-danger': true}
      else if (this.isDataValidate == false) return {'btn-outline-primary': true}
      else if (this.screenType === SURFACE_SCREEN) return {'btn-primary': true}
      else return {'btn-outline-primary': true}
    },
    reservoirButtonClass: function () {
      if (this.isReservoirValidate == false) return {'btn-danger': true}
      else if (this.isDataValidate == false) return {'btn-outline-primary': true}
      else if (this.screenType === RESERVOIR_SCREEN) return {'btn-primary': true}
      else return {'btn-outline-primary': true}
    },
    wellHistoryButtonClass: function () {
      if (this.isWellHistoryValidate == false) return {'btn-danger': true}
      else if (this.isDataValidate == false) return {'btn-outline-primary': true}
      else if (this.screenType === WELLHISTORY_SCREEN) return {'btn-primary': true}
      else return {'btn-outline-primary': true}
    },
    economicsButtonClass: function () {
      if (this.isEconomicsValidate == false) return {'btn-danger': true}
      else if (this.isDataValidate == false) return {'btn-outline-primary': true}
      else if (this.screenType === ECONOMICS_SCREEN) return {'btn-primary': true}
      else return {'btn-outline-primary': true}
    },
    operationButtonClass: function () {
      if (this.isOperationValidate == false) return {'btn-danger': true}
      else if (this.isDataValidate == false) return {'btn-outline-primary': true}
      else if (this.screenType === OPERATIONS_SCREEN) return {'btn-primary': true}
      else return {'btn-outline-primary': true}
    },
    executeButtonClass: function() {
      if (this.isDataValidate == true) return {'btn-outline-primary': true}
      else return {'btn-outline-primary': true, 'disabled': true}
    },
    isDataValidate: function() {
      return this.isPVTValidate & this.isSurfaceValidate & this.isReservoirValidate & 
            this.isWellHistoryValidate & this.isEconomicsValidate & this.isOperationValidate
    }
  },

  methods: {
    runMonitoringProject: async function() {
      let payload = {}

      payload.projectName = this.projectName

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      // payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      // payload.relPerm = this.relPerm 
      // payload.resKGKO = this.resKGKO
      // payload.gascondensate = this.gascondensate
      await store.dispatch('project/runMonitoringProject', payload)
    },
    runDryGasProject: async function() {
      let payload = {}

      payload.projectName = this.projectName

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      // payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      // payload.relPerm = this.relPerm 
      // payload.resKGKO = this.resKGKO
      // payload.gascondensate = this.gascondensate
      await store.dispatch('project/runDryGasProject', payload)
    },
    onSaveProject: async function() {
      
      let payload = {}

      if (this.newProjectName != "") {
        payload.projectName = this.newProjectName
        payload.isSaveAs = true
      }
      else {
        payload.projectName = this.projectName
        payload.isSaveAs = false
      }

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      payload.relPerm = this.relPerm 
      payload.gascondensate = this.gascondensate
      payload.resKGKO = this.resKGKO
      await store.dispatch('project/saveProject', payload)
    },
    updatePVTValidate (pvt) {
      this.isPVTValidate = pvt
    },
    updateSurfaceValidate(surface) {
      this.isSurfaceValidate = surface
    },
    updateReservoirValidate(reservoir) {
      this.isReservoirValidate = reservoir
    },
    updateWellHistoryValidate(wellHistory) {
      this.isWellHistoryValidate = wellHistory
    },
    updateEconomicsValidate(economics) {
      this.isEconomicsValidate = economics
    },
    updateOperationsValidate(operations) {
      this.isOperationValidate = operations
    },
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
      if (this.isLeavePage == true)
        this.$router.replace('home')
    },
    onNo: function(event) {
      // hide exit dialog
      var modal = document.getElementById("exitModal");
      modal.style.display = "none";

      // go to home vue
      if (this.isLeavePage == true)
        this.$router.replace('home')
    },
    updateOptionButtonStatus: function(optionPage) {
    },
    onPVTPage: function(event) {
      this.screenType = PVT_SCREEN
    },
    onSurfacePage: function(event) {
      this.screenType = SURFACE_SCREEN
    },
    onReservoirPage: function(event) {
      this.screenType = RESERVOIR_SCREEN
    },
    onWellHistoryPage: function(event) {
      this.screenType = WELLHISTORY_SCREEN
    },
    onEconomicsPage: function(event) {
      this.screenType = ECONOMICS_SCREEN
    },
    onOperationPage: function(event) {
      this.screenType = OPERATIONS_SCREEN
    },
    onExitPage: function(isLeave) {
      this.isSaveAs = false
      this.hideSaveAsButton = false
      this.isLeavePage = isLeave

      var modal = document.getElementById("exitModal");
      modal.style.display = "block";
    },
    onSavePage: async function() {
      await this.$refs.drygasControl.onSavePage()
      await this.$refs.surfaceControl.onSavePage()
      await this.$refs.reservoirControl.onSavePage()
      await this.$refs.wellHistoryControl.onSavePage()
      await this.$refs.economicsControl.onSavePage()
      await this.$refs.operationsControl.onSavePage()
    },
    onPrevPage: async function(event) {
      this.isLoading = true
      await this.onSavePage()
      this.isLoading = false

      this.$router.replace('fastplan')
    },
    onNextPage: async function(event) {
      this.isLoading = true
      await this.onSavePage()
      await this.onSaveProject()

      if (this.isFDP == '1') {
        this.isLoading = false
        await this.runDryGasProject()
        this.$router.replace({ name: 'fastplanresult', params: { previous: 'drygas' } });
      }
      else {
        this.isLoading = false
        await this.runMonitoringProject()
        this.$router.replace('monitoringresult');
      }
        
    }
  },
  mounted() {
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
