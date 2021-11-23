<template>
  <div class="row">
    <div class="m-auto">
    <form>
      <loading :active.sync="isLoading" 
             :is-full-page="fullPage"></loading>
      <div class="card mb-3">
        <div class="card-header gf-header">
          <img src="../../assets/image/LOGO_GFEX.png" style="max-width:150px;max-height:180px;margin-left:-7px;float:left">
          FastPlan* Gas & Gas Condensate<br>
          <p style="font-size:3rem !important">Conventional and Shale Reservoirs</p>
        </div>
        <div class="row g-0" style="background-color:#fdf500;">
          <!-- <div class="col-md-2" style="display:flex; justify-content:center;">
            <img src="../..assets/image/LOGO_GFEX.png" class="img-fluid rounded-start" style="opacity:0.6;max-width:250px;max-height:300px">
          </div> -->
          <div class="col-md-10 offset-md-1">
            <div class="card-body">
              <h3 class="card-title gf-title"><{{projectName}}> Field Project
              </h3>
              <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Stream PVT & Separator Data</u></p>
              

              <div style="display:flex;margin-bottom:6px;text-align:center" class="row">
                <p class="gf-item">Original Stream Composition</p>
                <div id="originalStreamComposition1"></div>
                <div id="originalStreamComposition2"></div>
              </div>

              <div style="display:flex;margin-bottom:6px;text-align:center" class="row">
                <p class="gf-item">Saturated Reservoir Conditions</p>
                <div id="saturatedReservoirConditions"></div>
              </div>

              <div style="display:flex;margin-bottom:6px;text-align:center" class="row">
                <p class="gf-item">Separator Conditions <span>(Input 2 or 3 stages)</span></p>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 1</p>
                  <div id="setNumber1Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 2</p>
                  <div id="setNumber2Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 3</p>
                  <div id="setNumber3Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 4</p>
                  <div id="setNumber4Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 5</p>
                  <div id="setNumber5Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 6</p>
                  <div id="setNumber6Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 7</p>
                  <div id="setNumber7Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 8</p>
                  <div id="setNumber8Sheet"></div>
                </div>
                <div class="col-md-6" style="text-align:center">
                  <p class="gf-subitem">Set Number 9</p>
                  <div id="setNumber9Sheet"></div>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <label class="btn btn-primary gf-button" v-on:click="onPrevPage">Previous</label>
                <div>
                  <label class="btn gf-button" v-bind:class="executeButtonClass" v-on:click="onNextPage">Execute</label>
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
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

// import axios from 'axios'
export default {
  middleware: 'auth',

  // async asyncData () {
  //   const { data: projects } = await axios.get('/api/projects')

  //   return {
  //     projects
  //   }
  // },

  metaInfo () {
    return { title: this.$t('Separtor Processing / Optimizer') }
  },

  components: {
    Loading
  },

  data() {
    return {
      originalStreamComposition1: null,
      originalStreamComposition2: null,
      saturatedReservoirConditions : null,
      separatorConditions: null,
      mySEP : {},
      isSaveAs : false,
      hideSaveAsButton: false,
      newProjectName: "",
      isOriginalStreamValidate: true,
      isOriginalStream1Validate: true,
      isSaturatedReservoirValidate: true,
      isSeparatorConditionValidate1: true,
      isSeparatorConditionValidate2: true,
      isSeparatorConditionValidate3: true,
      isSeparatorConditionValidate4: true,
      isSeparatorConditionValidate5: true,
      isSeparatorConditionValidate6: true,
      isSeparatorConditionValidate7: true,
      isSeparatorConditionValidate8: true,
      isSeparatorConditionValidate9: true,
      isLoading: false,
      fullPage: true,
      setNumber1Sheet: null,
      setNumber2Sheet: null,
      setNumber3Sheet: null,
      setNumber4Sheet: null,
      setNumber5Sheet: null,
      setNumber6Sheet: null,
      setNumber7Sheet: null,
      setNumber8Sheet: null,
      setNumber9Sheet: null,
    }
  },

  watch: {
    isDataValidate: function(val, oldVal) {
      this.$emit('changedValidate', val)
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
    isDataValidate: function() {
      return this.isOriginalStreamValidate & this.isOriginalStream1Validate & 
            this.isSaturatedReservoirValidate & this.isSeparatorConditionValidate1 &
            this.isSeparatorConditionValidate2 & this.isSeparatorConditionValidate3 &
            this.isSeparatorConditionValidate4 & this.isSeparatorConditionValidate5 &
            this.isSeparatorConditionValidate6 & this.isSeparatorConditionValidate7 &
            this.isSeparatorConditionValidate8 & this.isSeparatorConditionValidate9
    },
    executeButtonClass: function() {
      if (this.isDataValidate == true) return {'btn-outline-primary': true}
      else return {'btn-outline-primary': true, 'disabled': true}
    },
  },

  methods: {
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
    markInvalidCell: function(cell) {
      cell.style.backgroundColor = '#f46e42'
      cell.style.color = 'white'
    },
    markNormalCell: function(cell) {
      cell.style.backgroundColor = 'green'
      cell.style.color = 'white'
    },
    validateOriginalStream1:function(instance, cell, col, row, val, label, cellName) {
      let value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isOriginalStreamValidate = true
      }
      
      if ((cellName != 'M1') && ((isNaN(value) == true) || (value < 0)) )
      {
        this.markInvalidCell(cell)
        this.isOriginalStreamValidate = false
      }
      else {
        this.markNormalCell(cell)
      }

      if (cellName == 'M1') {
        let total = parseFloat(cell.innerText)
        if (total != 1.00) {
          this.markInvalidCell(cell)
          this.isOriginalStreamValidate = false
        }
        else {
          this.markNormalCell(cell)
        }
      }
    },
    validateOriginalStream2:function(instance, cell, col, row, val, label, cellName) {
      let value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isOriginalStream1Validate = true
      }
      
      if((isNaN(value) == true) || (value < 0))
      {
        this.markInvalidCell(cell)
        this.isOriginalStream1Validate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateSaturatedReservoir:function(instance, cell, col, row, val, label, cellName) {
      let value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isSaturatedReservoirValidate = true
      }
      
      if((isNaN(value) == true) || (value < 0))
      {
        this.markInvalidCell(cell)
        this.isSaturatedReservoirValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    updateNumberValidate: function(instance, state) {
      if (instance.id == 'setNumber1Sheet') {
        this.isSeparatorConditionValidate1 = state
      }
      else if (instance.id == 'setNumber2Sheet') {
        this.isSeparatorConditionValidate2 = state
      }
      else if (instance.id == 'setNumber3Sheet') {
        this.isSeparatorConditionValidate3 = state
      }
      else if (instance.id == 'setNumber4Sheet') {
        this.isSeparatorConditionValidate4 = state
      }
      else if (instance.id == 'setNumber5Sheet') {
        this.isSeparatorConditionValidate5 = state
      }
      else if (instance.id == 'setNumber6Sheet') {
        this.isSeparatorConditionValidate6 = state
      }
      else if (instance.id == 'setNumber7Sheet') {
        this.isSeparatorConditionValidate7 = state
      }
      else if (instance.id == 'setNumber8Sheet') {
        this.isSeparatorConditionValidate8 = state
      }
      else if (instance.id == 'setNumber9Sheet') {
        this.isSeparatorConditionValidate9 = state
      }
    },
    validateNumberProps: function(instance, cell, col, row, val, label, cellName) {
      let value = parseFloat(val)

      if (cellName == 'A1') {
        this.updateNumberValidate(instance, true)
      }

      if((isNaN(value) != true) && (value < 0))
      {
        this.markInvalidCell(cell)
        this.updateNumberValidate(instance, false)
      }
      else {
        this.markNormalCell(cell)
      }

      if (cellName == 'A2') {
        if ((isNaN(value) != true) && instance.jspreadsheet.getValue('A1') == '') {
          this.markInvalidCell(instance.jspreadsheet.getCell('A1'))
          this.markInvalidCell(instance.jspreadsheet.getCell('B1'))
          this.updateNumberValidate(instance, false)
        }
      }

      if (cellName == 'A3') {
        if ((isNaN(value) != true) && instance.jspreadsheet.getValue('A1') == '') {
          this.markInvalidCell(instance.jspreadsheet.getCell('A1'))
          this.markInvalidCell(instance.jspreadsheet.getCell('B1'))
          this.updateNumberValidate(instance, false)
        }
        if ((isNaN(value) != true) && instance.jspreadsheet.getValue('A2') == '') {
          this.markInvalidCell(instance.jspreadsheet.getCell('A2'))
          this.markInvalidCell(instance.jspreadsheet.getCell('B2'))
          this.updateNumberValidate(instance, false)
        }
      }

      if (cellName == 'B1') {
        if ((isNaN(value) == true) && instance.jspreadsheet.getValue('A1') != '') {
          this.markInvalidCell(instance.jspreadsheet.getCell('B1'))
          this.updateNumberValidate(instance, false)
        }
      }

      if (cellName == 'B2') {
        if ((isNaN(value) == true) && instance.jspreadsheet.getValue('A2') != '') {
          this.markInvalidCell(instance.jspreadsheet.getCell('B2'))
          this.updateNumberValidate(instance, false)
        }
      }

      if (cellName == 'B3') { 
        if ((isNaN(value) == true) && instance.jspreadsheet.getValue('A3') != '') {
          this.markInvalidCell(instance.jspreadsheet.getCell('B3'))
          this.updateNumberValidate(instance, false)
        }
      }

      if (cellName == 'B3') 
      {
        if (instance.jspreadsheet.getValue('A1') != '' || instance.jspreadsheet.getValue('B1') != '' ||
            instance.jspreadsheet.getValue('A2') != '' || instance.jspreadsheet.getValue('B2') != '' ||
            instance.jspreadsheet.getValue('A3') != '' || instance.jspreadsheet.getValue('B3') != '') 
        {
          if (instance.jspreadsheet.getValue('A2') == '') {
            this.markInvalidCell(instance.jspreadsheet.getCell('A2'))
            this.updateNumberValidate(instance, false)
          }
          if (instance.jspreadsheet.getValue('A3') != '' && instance.jspreadsheet.getValue('A3') != '14.7') {
            this.markInvalidCell(instance.jspreadsheet.getCell('A3'))
            this.updateNumberValidate(instance, false)
          }
          if (instance.jspreadsheet.getValue('A3') == '' && instance.jspreadsheet.getValue('B3') != '') {
            this.markInvalidCell(instance.jspreadsheet.getCell('B3'))
            this.updateNumberValidate(instance, false)
          }
          if (instance.jspreadsheet.getValue('A3') == '' && 
              instance.jspreadsheet.getValue('A2') != '' &&
              instance.jspreadsheet.getValue('A2') != '14.7') 
          {
            this.markInvalidCell(instance.jspreadsheet.getCell('A2'))
            this.updateNumberValidate(instance, false)
          }

          if (instance.jspreadsheet.getValue('A3') != '' && this.setNumber1Sheet.getValue('A3') == '') {
            this.markInvalidCell(instance.jspreadsheet.getCell('A3'))
            this.markInvalidCell(instance.jspreadsheet.getCell('B3'))
            this.updateNumberValidate(instance, false)
          }

          // compare with setnumber1sheet
          if (this.setNumber1Sheet!=null && this.setNumber1Sheet.getValue('A3') != '' && instance.jspreadsheet.getValue('A3') == '') {
            this.markInvalidCell(instance.jspreadsheet.getCell('A3'))
            this.markInvalidCell(instance.jspreadsheet.getCell('B3'))
            this.updateNumberValidate(instance, false)
          }
          if (this.setNumber1Sheet!=null && this.setNumber1Sheet.getValue('A3') == '' && instance.jspreadsheet.getValue('A3') != '') {
            this.markInvalidCell(instance.jspreadsheet.getCell('A3'))
            this.markInvalidCell(instance.jspreadsheet.getCell('B3'))
            this.updateNumberValidate(instance, false)
          }

          // update other tables
          if (instance.id == 'setNumber1Sheet')
          {
            if (this.setNumber2Sheet != null)  // skip init
            {
              this.setNumber2Sheet.setValue('A1', this.setNumber2Sheet.getValue('A1'), true)
              this.setNumber3Sheet.setValue('A1', this.setNumber3Sheet.getValue('A1'), true)
              this.setNumber4Sheet.setValue('A1', this.setNumber4Sheet.getValue('A1'), true)
              this.setNumber5Sheet.setValue('A1', this.setNumber5Sheet.getValue('A1'), true)
              this.setNumber6Sheet.setValue('A1', this.setNumber6Sheet.getValue('A1'), true)
              this.setNumber7Sheet.setValue('A1', this.setNumber7Sheet.getValue('A1'), true)
              this.setNumber8Sheet.setValue('A1', this.setNumber8Sheet.getValue('A1'), true)
              this.setNumber9Sheet.setValue('A1', this.setNumber9Sheet.getValue('A1'), true)
            }
            
          }
        }
        else {
          if (instance.id == 'setNumber1Sheet'){
            this.markInvalidCell(instance.jspreadsheet.getCell('A1'))
            this.markInvalidCell(instance.jspreadsheet.getCell('B1'))
            this.markInvalidCell(instance.jspreadsheet.getCell('A2'))
            this.markInvalidCell(instance.jspreadsheet.getCell('B2'))
            this.updateNumberValidate(instance, false)
          }
        }

      }

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
      this.$router.replace('home')
    },
    onNo: function(event) {
      // hide exit dialog
      var modal = document.getElementById("exitModal");
      modal.style.display = "none";

      // go to home vue
      this.$router.replace('home')
    },
    onExitPage: function (event) {
      this.isSaveAs = false
      this.hideSaveAsButton = false

      var modal = document.getElementById("exitModal");
      modal.style.display = "block";
    },
    onSavePage: async function() {
      this.mySEP = { 
        originalStreamComposition1: {
          N2:0, CO2:0, H2S:0, C1:0, C2:0, C3:0, iC4:0, nC4:0, iC5:0, nC5:0, C6:0, C7:0,
        },
        originalStreamComposition2: {
          MolecularWeight:0, SpecificGravity:0
        },
        saturatedReservoirConditions: {
          PSAT:0, TRES:0,
        },
        separatorConditions: {
          setNumber1: [ [0, 0], [0, 0], [0, 0]],
          setNumber2: [ [0, 0], [0, 0], [0, 0]],
          setNumber3: [ [0, 0], [0, 0], [0, 0]],
          setNumber4: [ [0, 0], [0, 0], [0, 0]],
          setNumber5: [ [0, 0], [0, 0], [0, 0]],
          setNumber6: [ [0, 0], [0, 0], [0, 0]],
          setNumber7: [ [0, 0], [0, 0], [0, 0]],
          setNumber8: [ [0, 0], [0, 0], [0, 0]],
          setNumber9: [ [0, 0], [0, 0], [0, 0]],
        }
      }
      this.mySEP.originalStreamComposition1.N2 = this.originalStreamComposition1.getValue('A1');
      this.mySEP.originalStreamComposition1.CO2 = this.originalStreamComposition1.getValue('B1');
      this.mySEP.originalStreamComposition1.H2S = this.originalStreamComposition1.getValue('C1');
      this.mySEP.originalStreamComposition1.C1 = this.originalStreamComposition1.getValue('D1');
      this.mySEP.originalStreamComposition1.C2 = this.originalStreamComposition1.getValue('E1');
      this.mySEP.originalStreamComposition1.C3 = this.originalStreamComposition1.getValue('F1');
      this.mySEP.originalStreamComposition1.iC4 = this.originalStreamComposition1.getValue('G1');
      this.mySEP.originalStreamComposition1.nC4 = this.originalStreamComposition1.getValue('H1');
      this.mySEP.originalStreamComposition1.iC5 = this.originalStreamComposition1.getValue('I1');
      this.mySEP.originalStreamComposition1.nC5 = this.originalStreamComposition1.getValue('J1');
      this.mySEP.originalStreamComposition1.C6 = this.originalStreamComposition1.getValue('K1');
      this.mySEP.originalStreamComposition1.C7 = this.originalStreamComposition1.getValue('L1');
      this.mySEP.originalStreamComposition1.total = this.originalStreamComposition1.getValue('M1');
      this.mySEP.originalStreamComposition2.MolecularWeight = this.originalStreamComposition2.getValue('A1');
      this.mySEP.originalStreamComposition2.SpecificGravity = this.originalStreamComposition2.getValue('B1');
      this.mySEP.saturatedReservoirConditions.PSAT = this.saturatedReservoirConditions.getValue('A1');
      this.mySEP.saturatedReservoirConditions.TRES = this.saturatedReservoirConditions.getValue('B1');

      this.mySEP.separatorConditions.setNumber1[0][0] = this.setNumber1Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber1[0][1] = this.setNumber1Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber1[1][0] = this.setNumber1Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber1[1][1] = this.setNumber1Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber1[2][0] = this.setNumber1Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber1[2][1] = this.setNumber1Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber2[0][0] = this.setNumber2Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber2[0][1] = this.setNumber2Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber2[1][0] = this.setNumber2Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber2[1][1] = this.setNumber2Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber2[2][0] = this.setNumber2Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber2[2][1] = this.setNumber2Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber3[0][0] = this.setNumber3Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber3[0][1] = this.setNumber3Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber3[1][0] = this.setNumber3Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber3[1][1] = this.setNumber3Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber3[2][0] = this.setNumber3Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber3[2][1] = this.setNumber3Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber4[0][0] = this.setNumber4Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber4[0][1] = this.setNumber4Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber4[1][0] = this.setNumber4Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber4[1][1] = this.setNumber4Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber4[2][0] = this.setNumber4Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber4[2][1] = this.setNumber4Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber5[0][0] = this.setNumber5Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber5[0][1] = this.setNumber5Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber5[1][0] = this.setNumber5Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber5[1][1] = this.setNumber5Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber5[2][0] = this.setNumber5Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber5[2][1] = this.setNumber5Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber6[0][0] = this.setNumber6Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber6[0][1] = this.setNumber6Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber6[1][0] = this.setNumber6Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber6[1][1] = this.setNumber6Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber6[2][0] = this.setNumber6Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber6[2][1] = this.setNumber6Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber7[0][0] = this.setNumber7Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber7[0][1] = this.setNumber7Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber7[1][0] = this.setNumber7Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber7[1][1] = this.setNumber7Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber7[2][0] = this.setNumber7Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber7[2][1] = this.setNumber7Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber8[0][0] = this.setNumber8Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber8[0][1] = this.setNumber8Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber8[1][0] = this.setNumber8Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber8[1][1] = this.setNumber8Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber8[2][0] = this.setNumber8Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber8[2][1] = this.setNumber8Sheet.getValue('B3');

      this.mySEP.separatorConditions.setNumber9[0][0] = this.setNumber9Sheet.getValue('A1');
      this.mySEP.separatorConditions.setNumber9[0][1] = this.setNumber9Sheet.getValue('B1');
      this.mySEP.separatorConditions.setNumber9[1][0] = this.setNumber9Sheet.getValue('A2');
      this.mySEP.separatorConditions.setNumber9[1][1] = this.setNumber9Sheet.getValue('B2');
      this.mySEP.separatorConditions.setNumber9[2][0] = this.setNumber9Sheet.getValue('A3');
      this.mySEP.separatorConditions.setNumber9[2][1] = this.setNumber9Sheet.getValue('B3');
      await store.dispatch('project/saveSEP', this.mySEP)

    },
    onPrevPage: async function(event) {
      await this.onSavePage()
      this.$router.replace('fastplan')
    },
    onNextPage: async function(event) {

      this.isLoading = true;
      await this.onSavePage()
      await this.onSaveProject()

      await store.dispatch('project/fetchSEP', this.mySEP)

      this.isLoading = false
      this.$router.replace('separatorresult')
    }
  },
  mounted() {

    this.mySEP = this.sep

    // Original Stream Composition
    // var originalStreamComposition1Data = [
    //   [0.00875, 0.00211, 0.000, 0.36723, 0.03873, 0.02982, 0.01152, 0.01741, 0.01608, 0.01909, 0.03825, 0.420094, '=ROUND(SUM(A1:L1), 2)'],
    // ];

    let originalStreamComposition1Data = []
    if (this.mySEP != null && this.mySEP.originalStreamComposition1 != null)
      originalStreamComposition1Data.push(this.mySEP.originalStreamComposition1)
    else
      originalStreamComposition1Data.push([,,,,,,,,,,,, '=ROUND(SUM(A1:L1), 2)'])
    
    this.originalStreamComposition1 = jspreadsheet(document.getElementById('originalStreamComposition1'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:originalStreamComposition1Data,
        columns: [
            {
                type: 'numeric',
                title:'N2',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'CO2',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'H2S',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'C1',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'C2',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'C3',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'iC4',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'nC4',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'iC5',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'nC5',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'C6',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'C7+',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Total',
                width: 120,
                decimal:','
            },
        ],
        updateTable: this.validateOriginalStream1
    });
    this.originalStreamComposition1.hideIndex();

    // 
    // var originalStreamComposition2Data = [
    //   [194.4143, 0.8277],
    //   // [,],
    // ];

    let originalStreamComposition2Data = []
    if (this.mySEP != null && this.mySEP.originalStreamComposition2 != null)
      originalStreamComposition2Data.push(this.mySEP.originalStreamComposition2)
    else
      originalStreamComposition2Data.push([])
    
    this.originalStreamComposition2 = jspreadsheet(document.getElementById('originalStreamComposition2'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:originalStreamComposition2Data,
        columns: [
            {
                type: 'numeric',
                title:'Molecular Weight',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Specific Gravity',
                width: 220,
            },
        ],
        updateTable: this.validateOriginalStream2
    });
    this.originalStreamComposition2.hideIndex();

    // Saturated Reservoir Conditions
    // var saturatedReservoirConditionsData = [
    //   [2677, 244]
    //   // [,],
    // ];

    let saturatedReservoirConditionsData = []
    if (this.mySEP != null && this.mySEP.saturatedReservoirConditions != null)
      saturatedReservoirConditionsData.push(this.mySEP.saturatedReservoirConditions)
    else
      saturatedReservoirConditionsData.push([])

    this.saturatedReservoirConditions = jspreadsheet(document.getElementById('saturatedReservoirConditions'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:saturatedReservoirConditionsData,
        columns: [
            {
                type: 'numeric',
                title:'PSAT (psia)',
                width: 180,
                decimal:','
            },
            {
                type: 'numeric',
                title:'TRES (Deg F)',
                width: 240,
            },
        ],
        updateTable: this.validateSaturatedReservoir
    });
    this.saturatedReservoirConditions.hideIndex();

    // Saparator Conditions
    var setNumberProps = {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Pressure (psia)',
                width: 210,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Temperature (Deg F)',
                width: 250,
            },
        ],
        // updateTable: this.validateNumberProps
    }
    
    // var setNumber1Data = [
    //   [1000, 72],
    //   [14.7, 60.0],
    //   [,],
    //   // [,],
    //   // [,],
    // ];
    let setNumber1Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber1 != null && 
        this.mySEP.separatorConditions.setNumber1.length > 0) {
      this.mySEP.separatorConditions.setNumber1.forEach(element => {
        setNumber1Data.push(element)      
      });
    }
    else
      setNumber1Data.push([],[],[])

    setNumberProps.data = setNumber1Data;
    this.setNumber1Sheet = jspreadsheet(document.getElementById('setNumber1Sheet'), setNumberProps);
    this.setNumber1Sheet.hideIndex();

    // var setNumber2Data = [
    //   [800, 72],
    //   [14.7, 60.0],
    //   [,],
    //   // [,],
    //   // [,]
    // ];
    let setNumber2Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber2 != null && 
        this.mySEP.separatorConditions.setNumber2.length > 0){
      this.mySEP.separatorConditions.setNumber2.forEach(element => {
        setNumber2Data.push(element)
      });
    }
    else
      setNumber2Data.push([],[],[])

    setNumberProps.data = setNumber2Data;
    this.setNumber2Sheet = jspreadsheet(document.getElementById('setNumber2Sheet'), setNumberProps);
    this.setNumber2Sheet.hideIndex();

    // var setNumber3Data = [
    //   [600, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber3Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber3 != null && 
        this.mySEP.separatorConditions.setNumber3.length > 0) {
      this.mySEP.separatorConditions.setNumber3.forEach(element => {
        setNumber3Data.push(element)
      });
    }
    else
      setNumber3Data.push([],[],[])

    setNumberProps.data = setNumber3Data;
    this.setNumber3Sheet = jspreadsheet(document.getElementById('setNumber3Sheet'), setNumberProps);
    this.setNumber3Sheet.hideIndex();

    // var setNumber4Data = [
    //   [400, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber4Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber4 != null && 
        this.mySEP.separatorConditions.setNumber4.length > 0) {
      this.mySEP.separatorConditions.setNumber4.forEach(element => {
        setNumber4Data.push(element)
      });
    }
    else
      setNumber4Data.push([],[],[])

    setNumberProps.data = setNumber4Data;
    this.setNumber4Sheet = jspreadsheet(document.getElementById('setNumber4Sheet'), setNumberProps);
    this.setNumber4Sheet.hideIndex();

    // var setNumber5Data = [
    //   [100, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber5Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null &&   
        this.mySEP.separatorConditions.setNumber5 != null && 
        this.mySEP.separatorConditions.setNumber5.length > 0){
      this.mySEP.separatorConditions.setNumber5.forEach(element => {
        setNumber5Data.push(element)
      });
    }
    else
      setNumber5Data.push([],[],[])

    setNumberProps.data = setNumber5Data;
    this.setNumber5Sheet = jspreadsheet(document.getElementById('setNumber5Sheet'), setNumberProps);
    this.setNumber5Sheet.hideIndex();

    // var setNumber6Data = [
    //   [80, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber6Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber6 != null && 
        this.mySEP.separatorConditions.setNumber6.length > 0){
      this.mySEP.separatorConditions.setNumber6.forEach(element => {
        setNumber6Data.push(element)
      });
    }
    else
      setNumber6Data.push([],[],[])

    setNumberProps.data = setNumber6Data;
    this.setNumber6Sheet = jspreadsheet(document.getElementById('setNumber6Sheet'), setNumberProps);
    this.setNumber6Sheet.hideIndex();

    // var setNumber7Data = [
    //   [60, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber7Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber7 != null && 
        this.mySEP.separatorConditions.setNumber7.length > 0){
      this.mySEP.separatorConditions.setNumber7.forEach(element => {
        setNumber7Data.push(element)
      });
    }
    else
      setNumber7Data.push([],[],[])
    
    setNumberProps.data = setNumber7Data;
    this.setNumber7Sheet = jspreadsheet(document.getElementById('setNumber7Sheet'), setNumberProps);
    this.setNumber7Sheet.hideIndex();

    // var setNumber8Data = [
    //   [50, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber8Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber8 != null && 
        this.mySEP.separatorConditions.setNumber8.length > 0){
      this.mySEP.separatorConditions.setNumber8.forEach(element => {
        setNumber8Data.push(element)
      });
    }
    else
      setNumber8Data.push([],[],[])

    setNumberProps.data = setNumber8Data;
    this.setNumber8Sheet = jspreadsheet(document.getElementById('setNumber8Sheet'), setNumberProps);
    this.setNumber8Sheet.hideIndex();

    // var setNumber9Data = [
    //   [20, 72],
    //   [14.7, 60],
    //   [, ],
    // ];
    let setNumber9Data = []
    if (this.mySEP != null && this.mySEP.separatorConditions != null && 
        this.mySEP.separatorConditions.setNumber9 != null && 
        this.mySEP.separatorConditions.setNumber9.length > 0) {
      this.mySEP.separatorConditions.setNumber9.forEach(element => {
        setNumber9Data.push(element)
      });
    }
    else
      setNumber9Data.push([],[],[])

    setNumberProps.data = setNumber9Data;
    this.setNumber9Sheet = jspreadsheet(document.getElementById('setNumber9Sheet'), setNumberProps);
    this.setNumber9Sheet.hideIndex();

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
