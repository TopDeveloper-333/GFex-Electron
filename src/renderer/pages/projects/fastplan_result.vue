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
          <div class="col-md-10 offset-md-1">
            <div class="card-body">
              <h3 class="card-title gf-title"><{{projectName}}> Field Project
              </h3>
              <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Results</u></p>

              <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
                <div class="col-3">
                  <p class="gf-item">Output Files</p>
                  <multiselect v-model="outputFile" @input="onChange" :options="outputFileOptions" track-by="name" label="name" placeholder="Select OUTPUT files"></multiselect>
                </div>
                <div class="col-2" style="display:flex">
                  <label class="btn btn-primary gf-button" style="margin:auto auto 0 auto" v-on:click="onPlot">{{plotLabel}}</label>
                </div>
              </div>

              <hr class="gf-line">

              <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="bShowPlot == true">
                <graph v-bind:options="options"
                      v-bind:data="graphData"></graph>
              </div>

              <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="bShowPlot == false">
                <textarea v-model.lazy="dataContent" style="margin-left:10px;color:white;font-weight: 400;"></textarea>
              </div>


              <div class="d-flex justify-content-between">
                <label class="btn btn-primary gf-button" v-on:click="onPrevPage">Previous</label>
                <div>
                  <label class="btn btn-primary gf-button " v-on:click="onSavePlot">Save Plot</label>
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
          <span class="gf-close" id="gf-exit-cancel">&times;</span>
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

    <div id="savePlotModal" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close" id="gf-exit-cancel-plot">&times;</span>
        </div>
        <p class="gf-comment" style="margin-top:6px !important; margin-bottom:6px !important;"><{{projectName}}> Field Project</p>
        <div>
          <span style="font-size: 1.25rem">Plot Name: </span>
          <input style="font-size: 1.25rem" maxlength="20" v-model="newPlotName" :placeholder="'like as : ' + projectName + '_' + previousPage">
        </div>
        <div style="margin-bottom:16px;margin-top:16px">
          <label class="btn btn-primary gf-button" v-on:click="onYesForPlot">Yes</label>
          <label class="btn btn-primary gf-button" v-on:click="onNoForPlot">No</label>
        </div>
      </div>
    </div>

    <div id="messageModal" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close" id="gf-exit-cancel-message">&times;</span>
        </div>
        <p class="gf-comment" style="margin-top:6px !important; margin-bottom:6px !important;"><{{projectName}}> Field Project</p>
        <div>
          <span style="font-size: 1.25rem">{{messageName}} : </span>
          <span style="font-size: 1.25rem">{{messageDescription}}</span>
        </div>
        <div style="margin-bottom:16px;margin-top:16px">
          <label class="btn btn-primary gf-button" v-on:click="onYesForMessage">Ok</label>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import store from '~/store'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import html2canvas from 'html2canvas';
import Graph from '~/components/Graph.vue';


// import axios from 'axios'
export default {
  name: 'FastplanResult',
  middleware: 'auth',

  metaInfo () {
    return { title: this.$t('Fastplan Result') }
  },

  components: {
    Multiselect,
    Loading,
    Graph
  },

  data() {
    return {
      isLoading: false,
      fullPage: true,
      isSaveAs : false,
      hideSaveAsButton: false,
      newProjectName: "",
      newPlotName: "",
      plotLabel: "Data",
      bShowPlot : true,
      outputFile: null,
      outputFileOptions: [
        { name: 'PLOT_OF'},
        { name: 'ECONOMICS'},
        { name: 'RESULT_OF'},
      ],
      dataContent: '',
      options: [],
      graphData: [],
      previousPage: '',
      messageName: '',
      messageDescription: '',
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
      resFastPlan : state => state.project.resFastPlan
    }),
  },

  methods: {
    runSavePlot: async function() {
      let payload = {}

      payload.newPlotName = this.newPlotName

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
      payload.resKGKO = this.resKGKO
      payload.gascondensate = this.gascondensate
      payload.plot = this.resFastPlan.RES_PLOT_OF
      return await store.dispatch('project/runSavePlot', payload)
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
    onChange: function(event) {
      debugger
      if (this.outputFile != null && this.outputFile.name == 'PLOT_OF') {
        this.dataContent = this.resFastPlan.PLOT_OF
        this.options = [
          { name: "Time (Year)", index: 0}, 
          { name: "Gas Rate (MMSCF/D)", index: 1}, 
          { name: "Cond Rate (STB/D)", index: 2}, 
          { name: "Gas TOT (MMSCF/D)", index: 3}, 
          { name: "Cond TOT (MSTB/D)", index: 4}, 
          { name: "CGR (STB/MMSCF)", index: 5}, 
          { name: "GOR (SCF/STB)", index: 6}, 
          { name: "CUM.GAS (BCF)", index: 7}, 
          { name: "CUM.COND (MMSTB)", index: 8}, 
          { name: "# of WELLS", index: 9}, 
          { name: "Rate/AOF", index: 10}, 
          { name: "DP CHOKE (psia)", index: 11}, 
          { name: "Gas Recovery (%)", index: 12}, 
          { name: "Oil Recovery (%)", index: 13}, 
          { name: "Matrix-Fracture Transfer (MSCF/D)", index: 14}, 
          { name: "Matrix Contribution (BCF)", index: 15}, 
          { name: "Pr (psia)", index:16 }, 
          { name: "PWF (psia)", index: 17}, 
          { name: "PWH (psia)", index: 18}, 
          { name: "PMAN (psia)", index: 19}, 
          { name: "P_in (psia)", index: 20}, 
          { name: "P_out (psia)", index: 21}, 
          { name: "Sales_P (psia)", index: 22}, 
          { name: "Yearly Revenue Gas (MM $)", index: 23}, 
          { name: "CUM.Income Gas (MM $)", index: 24}, 
          { name: "Yearly Revenue Cond (M $)", index: 25}, 
          { name: "CUM.Income Cond (M $)", index: 26}, 
          { name: "Compression Cost (M $)", index: 27}, 
          { name: "P/Z", index:28 }, 
          { name: "Condensate Saturation (SO)", index: 29}, 
        ]
        this.graphData = this.resFastPlan.RES_PLOT_OF
      }
      else if (this.outputFile != null && this.outputFile.name == 'ECONOMICS') {
        this.dataContent = this.resFastPlan.ECONOMICS
        this.options = [
          { name: "Year", index: 0}, 
          { name: "Gas Production (mmscf/d)", index: 1}, 
          { name: "Condensate Rate (mstb/d)", index: 2}, 
          { name: "Revenue Gas ($MM)", index: 3}, 
          { name: "CUM.Revene Gass ($MM)", index: 4}, 
          { name: "Revenue Condensate ($MM)", index: 5}, 
          { name: "CUM.Revenue Condensate ($MM)", index: 6}, 
          { name: "CAPEX ($MM)", index: 7}, 
          { name: "OPEX ($MM)", index: 8}, 
          { name: "Tax ($MM)", index: 9}, 
          { name: "Royalty ($MM)", index: 10}, 
          { name: "Depreciation ($MM)", index: 11}, 
          { name: "CashFlow ($MM)", index: 12}, 
          { name: "Total Revenues ($MM)", index: 13}, 
          { name: "NPV ($ Billion)", index: 14}, 

        ]
        this.graphData = this.resFastPlan.RES_ECONOMICS
      }
      else if (this.outputFile != null && this.outputFile.name == 'RESULT_OF') {
        this.dataContent = this.resFastPlan.RESULT_OF
        this.options = []
        this.graphData = []
      }
    },
    onPlot: function(event) {
      if(this.bShowPlot == false) {
        this.bShowPlot = true
        this.plotLabel = "Data"
      }
      else {
        this.bShowPlot = false
        this.plotLabel = "Plot"
      }
    },
    onSaveAs: function(event) {
      this.isSaveAs = true
      this.hideSaveAsButton = true
    },
    showDialog(dialogId, isShow) {
      var modal = document.getElementById(dialogId);
      if (isShow == true)
        modal.style.display = 'block';
      else
        modal.style.display = 'none';
    },
    onYesForMessage: function (event){
      this.showDialog('messageModal', false);
    },
    onYesForPlot: async function(event) {

      if (this.newPlotName == '') {
        this.messageName = 'Warning'
        this.messageDescription = 'Please input the plot name'
        this.showDialog('messageModal', true);
        return;
      }

      // hide save plot dialog
      this.showDialog("savePlotModal", false)
      
      this.isLoading = true
      const data = await this.runSavePlot()
      this.isLoading = false

      if (data == undefined || data.id == undefined ) {
        this.messageName = 'Warning'
        this.messageDescription = 'Failed to save the plot {' + this.newPlotName + '}'
      }
      else {
        this.messageName = 'Success'
        this.messageDescription = 'Saved the plot {' + this.newPlotName + '}'
      }
      this.showDialog('messageModal', true);
    },
    onNoForPlot: function(event) {
      // hide save plot dialog
      this.showDialog('savePlotModal', false);
    },
    onYes: function(event) {
      // hide exit dialog
      this.showDialog("exitModal", false)

      this.isLoading = true
      this.onSaveProject()      
      this.isLoading = false

      // go to home vue
      this.$router.replace('home')
    },
    onNo: function(event) {
      // hide exit dialog
      this.showDialog("exitModal", false)

      // go to home vue
      this.$router.replace('home')
    },
    onExitPage: function (event) {
      this.isSaveAs = false
      this.hideSaveAsButton = false

      this.showDialog("exitModal", true)
    },
    onSavePlot: function(event) {
      this.showDialog('savePlotModal', true);
    },
    onPrevPage: function(event) {
      this.$router.replace(this.previousPage)
    },
  },
  mounted() {
    this.previousPage = this.$route.params.previous
    mountExitDialog();
    mountSavePlotDialog();
    mountMessageDialog();
  }

}

function mountExitDialog() {

  // Get the modal
  var modal = document.getElementById("exitModal");

  // Get the <span> element that closes the modal
  var span = document.getElementById("gf-exit-cancel");

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

function mountSavePlotDialog() {

  // Get the modal
  var modal = document.getElementById("savePlotModal");

  // Get the <span> element that closes the modal
  var span = document.getElementById("gf-exit-cancel-plot");

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

function mountMessageDialog() {

  // Get the modal
  var modal = document.getElementById("messageModal");

  // Get the <span> element that closes the modal
  var span = document.getElementById("gf-exit-cancel-message");

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

<style scoped>
.jexcel > thead > tr > td {
  font-size: 20px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.multiselect {
  max-width: 370px;
  /* margin: auto; */
}
textarea{
    width: 90%;
    height: 450px;
    white-space: nowrap;
    overflow-x: auto;
    resize: none;
    background-color: var(--secondary-color);
    font-family: monospace !important;
    font-size: 1.25rem !important;
}
</style>
