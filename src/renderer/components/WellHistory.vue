<template>
  <div>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Historical / Forecast Runs</u></p>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">History & Forecast Runs</p>
      <div id="historyForecastSheet"></div>
    </div>
    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Operations Data</p>
      <div id="operationsDataSheet"></div>
    </div>

    <!-- <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Reservoir Data</p>
      <div id="reservoirDataHSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Dual-Porosity</p>
      <multiselect v-model="dualPorosity" :options="dualPorosityOptions" track-by="name" label="name" placeholder="Select option"></multiselect>
      <div id="dualPorosityHSheet" style="margin-top:1rem" v-show="dualPorosity != null && dualPorosity.value ==1"></div>
    </div> -->

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <hr class="gf-line">
      <p class="gf-item">Matching</p>
      <multiselect v-model="matching" :options="matchingOptions" track-by="name" label="name" placeholder="Select matching option"></multiselect>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="matching != null && matching.value ==1">
      <p class="gf-item">Number Of Rates to Match</p>
      <input class="form-control gf-control" style="width:500px; margin-left:10px; margin-bottom:20px" type="number"
          maxlength="20" v-model="numberOfRates" placeholder="Please input numbers of Rates">
      <p class="gf-item">Gas Flow Rates (mmscf/day)</p>
      <div id="gasFlowRatesSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Number of Wells in Network (Present & Futures)</p>
      <input class="form-control gf-control" style="width:500px; margin-left:10px; margin-bottom:20px" type="number"
          maxlength="20" v-model="numberOfWells" placeholder="Please input numbers of Wells">
    </div>

    <div v-for="entry in wellsNetwork" :key="entry.id"
      style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <!-- {{entry.id}} : {{ entry.option }} : {{entry.data}} -->
      <hr class="gf-line">

      <div class="row" style="margin-bottom:24px">
        <span class="gf-item" style="width:200px">Well #{{entry.id + 1}} :</span>
        <input class="form-control gf-control" v-model="entry.name" style="width:300px;background:yellow;border-color:black" type="text">
      </div>

      <multiselect v-model="entry.option" :options="testWellDataOptions"  style="width:460px" @select="onChangedOption"
        @remove="onRemovedOption" track-by="name" label="name" placeholder="Select option" :id="'option-' + entry.id"></multiselect>

      <div :id="'networkSheet-' + entry.id" style="margin-top:20px"></div>
      <div :id="'networkSheet1-' + entry.id" style="margin-top:20px"></div>
    </div>

  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.multiselect {
  max-width: 480px;
  /* margin: auto; */
}
</style>

<script>
import store from '~/store'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'


export default {
  name: 'WellHistory',
  
  middleware: 'auth',
  
  props: ['isHidden'],

  components: {
    Multiselect
  },

  data() {
    return {
      myWellHistory: {},
      // reservoirDataHSheet: null,
      // dualPorosityHSheet: null,
      historyForecastSheet: null,
      operationsDataSheet: null,
      // dualPorosity: {name: "No", value: 0},
      // dualPorosityOptions: [
      //   {name: "Yes", value: 1},
      //   {name: "No", value: 0}
      // ],
      matching: null,
      matchingOptions: [
        {name: "Yes", value: 1},
        {name: "No", value: 0},
      ],
      numberOfRates: 1,
      gasFlowRatesSheet: null,
      numberOfWells: 0,
      wellsNetwork: [],
      testWellDataOptions: [
        { name: "C & n MODEL", value : 1 },
        { name: "VERTICAL MODEL", value: 2 },
        { name: "HORIZONTAL MODEL", value: 3 }
      ],
      isHistoryForecastValidate: true,
      isOperationsDataValidate: true,
      isGasFlowRatesValidate: true,
      isWellsNetworkSheetValidate: [],
      isWellsNetworkSheet1Validate: []
    }
  },

  computed: {
    ...mapState({
      wellhistory: state => state.project.wellhistory,
      reservoir : state => state.project.reservoir,
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true

      let c = true
      let d = true
      // for (let i = 0; i < this.isWellsNetworkSheetValidate.length; i++) {
      //   c = c & this.isWellsNetworkSheetValidate[i]
      //   d = d & this.isWellsNetworkSheet1Validate[i]
      // }

      return this.isHistoryForecastValidate & this.isOperationsDataValidate & this.isGasFlowRatesValidate &
              c & d
    }
  },

  watch: {
    isDataValidate: function(val, oldVal) {
      this.$emit('changedValidate', val)
    },
    matching: function(val, oldVal) {
      this.matching = val

      if (this.matching.value == 1)
        this.numberOfWells = 1
      // else if (this.matching.value == 0 && this.numberOfWells < 4)
      //   this.numberOfWells = 4
    },
    numberOfRates: function(val, oldVal) {
      if (val < 1)
        val = 1;
      if (oldVal < 0)
        oldVal = 0;

      this.numberOfRates = val
      this.createGasFlowRateSheet(this.numberOfRates, this.myWellHistory.gasFlowRates)
    },
    numberOfWells: function(val, oldVal) {
      if (val < 0)
        val = 0;
      if (oldVal < 0)
        oldVal = 0;

      if (this.matching.value == 1 && this.reservoir.hasDualPorosity == 0)
        val = 1

      this.numberOfWells = val;
      this.createWellsNetwork(this.numberOfWells, this.myWellHistory.wellsNetwork)

      // update wellNetwork in Watched function more....
      this.$nextTick(function () {
        let min = this.numberOfWells;
        if (this.myWellHistory.wellsNetwork.length < min)
          min = this.myWellHistory.wellsNetwork.length

        for (let index = 0; index < min; index++) {
          this.onUpdateWellNetwork(this.myWellHistory.wellsNetwork[index].wellTestData, index)
        }
      })

    },
  },

  methods: {
    validateWellsNetworkSheet:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)
      var id = instance.id.replace('networkSheet-','');

      if (cellName == 'A1') {
        // this means start to update table
        this.isWellsNetworkSheetValidate[id] = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ) 
      {
        this.markInvalidCell(cell)
        this.isWellsNetworkSheetValidate[id] = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateWellsNetworkSheet1:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)
      var id = instance.id.replace('networkSheet1-','');

      if (cellName == 'A1') {
        // this means start to update table
        this.isWellsNetworkSheet1Validate[id] = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ) 
      {
        this.markInvalidCell(cell)
        this.isWellsNetworkSheet1Validate[id] = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateHistoryForecast:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isHistoryForecastValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ) 
      {
        this.markInvalidCell(cell)
        this.isHistoryForecastValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateOperationsData:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isOperationsDataValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ) 
      {
        this.markInvalidCell(cell)
        this.isOperationsDataValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateGasFlowRates:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isGasFlowRatesValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ) 
      {
        this.markInvalidCell(cell)
        this.isGasFlowRatesValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    createWellsNetwork: function(numberOfWells, wellsNetwork) {

      this.wellsNetwork = []
      this.isWellsNetworkSheetValidate = []
      this.isWellsNetworkSheet1Validate = []

      debugger
      for (let index = 0; index < numberOfWells; index++) {
        this.wellsNetwork.push({
          id: index, 
          name: null,
          option: null,
          sheet: null,
          sheet1: null
        })
        this.isWellsNetworkSheetValidate[index] = false
        this.isWellsNetworkSheet1Validate[index] = false
      }

      let min = numberOfWells
      if (wellsNetwork != null) {
        if (wellsNetwork.length < min) min = wellsNetwork.length

        for (let i =0; i < min; i++) {
          this.wellsNetwork[i] = {
            id: this.wellsNetwork[i].id,
            name: wellsNetwork[i].name,
            option: this.testWellDataOptions[wellsNetwork[i].wellTestData - 1],
            sheet: null,
            sheet1: null
          }
        }
      }

    },
    createGasFlowRateSheet: function (numberOfRates, gasFlowRates) {

      let gasFlowRatesData = []
      for (let index = 0; index < numberOfRates; index++) {
        gasFlowRatesData.push([])
      }

      let min = numberOfRates

      if (gasFlowRates != null) {
        if (gasFlowRates.length < min) min = gasFlowRates.length
        for (let i = 0; i < min; i++) {
          gasFlowRatesData[i][0] = gasFlowRates[i]
        }
      }

      document.getElementById('gasFlowRatesSheet').innerHTML = '';
      this.gasFlowRatesSheet = jspreadsheet(document.getElementById('gasFlowRatesSheet'), {
          data:gasFlowRatesData,
          allowInsertRow:false,
          allowManualInsertRow:false,
          allowInsertColumn:false,
          allowManualInsertColumn:false,
          allowDeleteRow:false,
          allowDeleteColumn:false,
          columns: [
              {
                  type: 'numeric',
                  title:'Gas Flow Rates (mmscf/day)',
                  width: 350,
                  decimal:','
              },
          ],
          updateTable: this.validateGasFlowRates
      });
      this.gasFlowRatesSheet.hideIndex();
    },
    onSavePage: async function(event) {
      console.log("WellHistory's onSavePage() is called ")
    
      this.myWellHistory = {
        // reservoirParameters: {
        //   GIIP: 0, Pr : 0,
        // },
        // hasDualPorosity: 0,
        // dualPorosity: {
        //   km: 0, hm: 0, ShapeFactorSigma: 0, MatrixGIIP: 0,
        // },
        historyForecastRun: {
          FirstYearOfProduction: 0, LifeOfTheField: 0,
        },
        operationsData: {
          SalesPressure:0, PressureLimit: 0, EconomicsRate: 0, QgtotInitial: 0, 
        },
        matching: 0,
        numberOfRates: 0,
        gasFlowRates: [],
        numberOfWells: 0,
        wellsNetwork: [

        ]
      }

      // this.myWellHistory.reservoirParameters.GIIP = this.reservoirDataHSheet.getValue('A1')
      // this.myWellHistory.reservoirParameters.Pr = this.reservoirDataHSheet.getValue('B1')

      // this.myWellHistory.hasDualPorosity = this.dualPorosity.value

      // this.myWellHistory.dualPorosity.km = this.dualPorosityHSheet.getValue('A1')
      // this.myWellHistory.dualPorosity.hm = this.dualPorosityHSheet.getValue('B1')
      // this.myWellHistory.dualPorosity.ShapeFactorSigma = this.dualPorosityHSheet.getValue('C1')
      // this.myWellHistory.dualPorosity.MatrixGIIP = this.dualPorosityHSheet.getValue('D1')

      this.myWellHistory.matching = this.matching.value
      this.myWellHistory.numberOfRates = this.numberOfRates

      for (let i = 0; i < this.numberOfRates; i++) {
        this.myWellHistory.gasFlowRates[i] = this.gasFlowRatesSheet.getValue('A' + (i + 1));
      }

      this.myWellHistory.historyForecastRun.FirstYearOfProduction = this.historyForecastSheet.getValue('A1')
      this.myWellHistory.historyForecastRun.LifeOfTheField = this.historyForecastSheet.getValue('B1')

      this.myWellHistory.operationsData.SalesPressure = this.operationsDataSheet.getValue('A1')
      this.myWellHistory.operationsData.PressureLimit = this.operationsDataSheet.getValue('B1')
      this.myWellHistory.operationsData.EconomicsRate = this.operationsDataSheet.getValue('C1')
      this.myWellHistory.operationsData.QgtotInitial = this.operationsDataSheet.getValue('D1')

      this.myWellHistory.numberOfWells = this.numberOfWells

      for (let index = 0; index < this.numberOfWells; index++) {
        this.myWellHistory.wellsNetwork[index] = {}
        this.myWellHistory.wellsNetwork[index].wellTestData = this.wellsNetwork[index].option.value
        this.myWellHistory.wellsNetwork[index].name = this.wellsNetwork[index].name

        if (this.myWellHistory.wellsNetwork[index].wellTestData == 1) {
          this.myWellHistory.wellsNetwork[index].cnModel = {}
          this.myWellHistory.wellsNetwork[index].cnModel.C = this.wellsNetwork[index].sheet.getValue('A1')
          this.myWellHistory.wellsNetwork[index].cnModel.n = this.wellsNetwork[index].sheet.getValue('B1')
          this.myWellHistory.wellsNetwork[index].cnModel.WellToTiePoint = this.wellsNetwork[index].sheet.getValue('C1')
          
          this.myWellHistory.wellsNetwork[index].cnModel1 = {}
          this.myWellHistory.wellsNetwork[index].cnModel1.PressureAtShutIn = this.wellsNetwork[index].sheet1.getValue('A1')
          this.myWellHistory.wellsNetwork[index].cnModel1.PressureAtReOpening = this.wellsNetwork[index].sheet1.getValue('B1')
        }
        else if (this.myWellHistory.wellsNetwork[index].wellTestData == 2) {
          this.myWellHistory.wellsNetwork[index].verticalModel = {}
          this.myWellHistory.wellsNetwork[index].verticalModel.k = this.wellsNetwork[index].sheet.getValue('A1')
          this.myWellHistory.wellsNetwork[index].verticalModel.Porosity = this.wellsNetwork[index].sheet.getValue('B1')
          this.myWellHistory.wellsNetwork[index].verticalModel.NetPay = this.wellsNetwork[index].sheet.getValue('C1')
          this.myWellHistory.wellsNetwork[index].verticalModel.DrainageArea = this.wellsNetwork[index].sheet.getValue('D1')
          this.myWellHistory.wellsNetwork[index].verticalModel.WellboreID = this.wellsNetwork[index].sheet.getValue('E1')
          this.myWellHistory.wellsNetwork[index].verticalModel.Skin = this.wellsNetwork[index].sheet.getValue('F1')
          this.myWellHistory.wellsNetwork[index].verticalModel.WellToTiePoint = this.wellsNetwork[index].sheet.getValue('G1')

          this.myWellHistory.wellsNetwork[index].verticalModel1 = {}
          this.myWellHistory.wellsNetwork[index].verticalModel1.PressureAtShutIn = this.wellsNetwork[index].sheet1.getValue('A1')
          this.myWellHistory.wellsNetwork[index].verticalModel1.PressureAtReOpening = this.wellsNetwork[index].sheet1.getValue('B1')
        }
        else if (this.myWellHistory.wellsNetwork[index].wellTestData == 3) {
          this.myWellHistory.wellsNetwork[index].horizontalModel = {}
          this.myWellHistory.wellsNetwork[index].horizontalModel.k = this.wellsNetwork[index].sheet.getValue('A1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.Porosity = this.wellsNetwork[index].sheet.getValue('B1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.NetPay = this.wellsNetwork[index].sheet.getValue('C1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.DrainageArea = this.wellsNetwork[index].sheet.getValue('D1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.WellboreID = this.wellsNetwork[index].sheet.getValue('E1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.Skin = this.wellsNetwork[index].sheet.getValue('F1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.WellLength = this.wellsNetwork[index].sheet.getValue('G1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.KvKh = this.wellsNetwork[index].sheet.getValue('H1')
          this.myWellHistory.wellsNetwork[index].horizontalModel.WellToTiePoint = this.wellsNetwork[index].sheet.getValue('I1')

          this.myWellHistory.wellsNetwork[index].horizontalModel1 = {}
          this.myWellHistory.wellsNetwork[index].horizontalModel1.PressureAtShutIn = this.wellsNetwork[index].sheet1.getValue('A1')
          this.myWellHistory.wellsNetwork[index].horizontalModel1.PressureAtReOpening = this.wellsNetwork[index].sheet1.getValue('B1')
        }
      }

      await store.dispatch('project/saveWellHistory', this.myWellHistory)

    },
    onRemovedOption: function(selectedOption, id) {
      var index = id.replace('option-','');

      if (index >= this.wellsNetwork.length) {
        alert('Selected Id is out of number.')
        return;
      }

      this.onUpdateWellNetwork(null, index)
    },
    onChangedOption: function(selectedOption, id) {

      var index = id.replace('option-','');

      if (index >= this.wellsNetwork.length) {
        alert('Selected Id is out of number.')
        return;
      }

      this.onUpdateWellNetwork(selectedOption.value, index)
    },
    onUpdateWellNetwork: function (optionValue, index) {
      let divId = 'networkSheet-' + index ;
      let div1Id = 'networkSheet1-' + index;
      var columns = []
      var columns1 = []
      if (optionValue == 1) {
        columns = [
            {
                type: 'numeric',
                title:'C (Mscf/day/psia2)',
                width: 260,
                decimal:','
            },
            {
                type: 'numeric',
                title:'n',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Well to Tie-Point (miles)',
                width: 330,
                decimal:','
            },
        ]
        columns1 =[
          {
              type: 'numeric',
              title:'Pressure at Shut-in (psia)',
              width: 320,
              decimal:','
          },
          {
              type: 'numeric',
              title:'Pressure at Re-opening (psia)',
              width: 360,
              decimal:','
          },
        ]
      }
      else if (optionValue == 2) {
        columns = [
            {
                type: 'numeric',
                title:'k (md)',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Porosity',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Net Pay (ft)',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Drainage Area (acres)',
                width: 260,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Wellbore ID (in)',
                width: 220,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Skin',
                width: 90,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Well to Tie-Point (miles)',
                width: 300,
                decimal:','
            },
        ],
        columns1 =[
          {
              type: 'numeric',
              title:'Pressure at Shut-in (psia)',
              width: 320,
              decimal:','
          },
          {
              type: 'numeric',
              title:'Pressure at Re-opening (psia)',
              width: 360,
              decimal:','
          },
        ]
      }
      else if (optionValue == 3) {
        // Horizontal Well Model
        columns = [
            {
                type: 'numeric',
                title:'k (md)',
                width: 110,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Porosity',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Net Pay (ft)',
                width: 150,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Drainage Area (acres)',
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Wellbore ID (in)',
                width: 220,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Skin',
                width: 90,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Well Length',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Kv/Kh',
                width: 90,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Well to Tie-point (miles)',
                width: 300,
                decimal:','
            },
        ]
        columns1 =[
          {
              type: 'numeric',
              title:'Pressure at Shut-in (psia)',
              width: 320,
              decimal:','
          },
          {
              type: 'numeric',
              title:'Pressure at Re-opening (psia)',
              width: 360,
              decimal:','
          },
        ]
      }

      let data = []
      let data1 = []
      if (optionValue == 1 && this.myWellHistory.wellsNetwork!= null &&
         this.myWellHistory.wellsNetwork[index] != null && this.myWellHistory.wellsNetwork[index].cnModel != null) {
        data.push(this.myWellHistory.wellsNetwork[index].cnModel)
        data1.push(this.myWellHistory.wellsNetwork[index].cnModel1)
      }
      else if (optionValue == 1) {
        data.push([,,])
        data1.push([,])
      }

      else if (optionValue == 2 && this.myWellHistory.wellsNetwork!= null && 
              this.myWellHistory.wellsNetwork[index] != null && this.myWellHistory.wellsNetwork[index].verticalModel) {
        data.push(this.myWellHistory.wellsNetwork[index].verticalModel)
        data1.push(this.myWellHistory.wellsNetwork[index].verticalModel1)
      }
      else if (optionValue == 2) {
        data.push([,,,,,,])
        data1.push([,])
      }

      else if (optionValue == 3 && this.myWellHistory.wellsNetwork!= null &&
               this.myWellHistory.wellsNetwork[index] != null && this.myWellHistory.wellsNetwork[index].horizontalModel) {
        data.push(this.myWellHistory.wellsNetwork[index].horizontalModel)
        data1.push(this.myWellHistory.wellsNetwork[index].horizontalModel1)
      }
      else if (optionValue == 3) {
        data.push([,,,,,,,,])
        data1.push([,])
      }

      document.getElementById(divId).innerHTML = '';
      document.getElementById(div1Id).innerHTML = '';

      if (optionValue != null) {
        this.wellsNetwork[index].sheet = jspreadsheet(document.getElementById(divId), {
            data:data,
            allowInsertRow:false,
            allowManualInsertRow:false,
            allowInsertColumn:false,
            allowManualInsertColumn:false,
            allowDeleteRow:false,
            allowDeleteColumn:false,
            columns: columns,
            updateTable: this.validateWellsNetworkSheet
        });
        this.wellsNetwork[index].sheet.hideIndex();

        {
          this.wellsNetwork[index].sheet1 = jspreadsheet(document.getElementById(div1Id), {
              data:data1,
              allowInsertRow:false,
              allowManualInsertRow:false,
              allowInsertColumn:false,
              allowManualInsertColumn:false,
              allowDeleteRow:false,
              allowDeleteColumn:false,
              columns: columns1,
              updateTable: this.validateWellsNetworkSheet1
          });
          this.wellsNetwork[index].sheet1.hideIndex();
        }
      }
    },
  },

  mounted() {
    this.myWellHistory = this.wellhistory

    // Reservoir Data (Well History)
    // var reservoirHData = [
    //   [10000, 5114]
    // ];   
    // let reservoirHData = []
    // if (this.myWellHistory != null && this.myWellHistory.reservoirParameters != null)
    //   reservoirHData.push(this.myWellHistory.reservoirParameters)
    // else
    //   reservoirHData.push([,])

    // this.reservoirDataHSheet = jspreadsheet(document.getElementById('reservoirDataHSheet'), {
    //     data:reservoirHData,
    //     allowInsertRow:false,
    //     allowManualInsertRow:false,
    //     allowInsertColumn:false,
    //     allowManualInsertColumn:false,
    //     allowDeleteRow:false,
    //     allowDeleteColumn:false,
    //     columns: [
    //         {
    //             type: 'numeric',
    //             title:'GIIP (Bcf)',
    //             width: 140,
    //             decimal:','
    //         },
    //         {
    //             type: 'numeric',
    //             title:'Pr (psia)',
    //             width: 140,
    //             decimal:','
    //         },
    //     ],
    //     updateTable: this.validationTable
    // });
    // this.reservoirDataHSheet.hideIndex();

    // dualPorosity data
    // var dualPorosityData = [
    //   [1, 300, 0.00001, 15000]
    // ];

    // let dualPorosityData = []
    // if (this.myWellHistory != null && this.myWellHistory.dualPorosity != null)
    //   dualPorosityData.push(this.myWellHistory.dualPorosity)
    // else
    //   dualPorosityData.push([,,,])

    // this.dualPorosityHSheet = jspreadsheet(document.getElementById('dualPorosityHSheet'), {
    //     data:dualPorosityData,
    //     allowInsertRow:false,
    //     allowManualInsertRow:false,
    //     allowInsertColumn:false,
    //     allowManualInsertColumn:false,
    //     allowDeleteRow:false,
    //     allowDeleteColumn:false,
    //     columns: [
    //         {
    //             type: 'numeric',
    //             title:'km (md)',
    //             width: 120,
    //             decimal:','
    //         },
    //         {
    //             type: 'numeric',
    //             title:'hm (ft)',
    //             width: 120,
    //             decimal:','
    //         },
    //         {
    //             type: 'numeric',
    //             title:'Sigma',
    //             width: 120,
    //             decimal:','
    //         },
    //         {
    //             type: 'numeric',
    //             title:'Matrix GIIP (bcf)',
    //             width: 220,
    //             decimal:','
    //         },
    //     ],
    //     updateTable: this.validationTable
    // });
    // this.dualPorosityHSheet.hideIndex();

    // Gas Flow Rates
    if (this.myWellHistory.matching != null && this.myWellHistory.matching == 1) {
      this.matching = {name: 'Yes', value: 1}
    }
    else {
      this.matching = {name: 'No', value: 0}
    }
    this.numberOfRates = this.myWellHistory.numberOfRates
    this.createGasFlowRateSheet(this.myWellHistory.numberOfRates, this.myWellHistory.gasFlowRates);

    // History & Broadcast data
    // var historyForecastData = [
    //   [2020, 50]
    // ];
    let historyForecastData = []
    if (this.myWellHistory != null && this.myWellHistory.historyForecastRun != null)
      historyForecastData.push(this.myWellHistory.historyForecastRun)
    else
      historyForecastData.push([,])

    this.historyForecastSheet = jspreadsheet(document.getElementById('historyForecastSheet'), {
        data:historyForecastData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'First Year of Production',
                width: 290,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Life of the Field',
                width: 220,
                decimal:','
            },
        ],
        updateTable: this.validateHistoryForecast
    });
    this.historyForecastSheet.hideIndex();

    // Operations Data
    // var operationsData = [
    //   [100, 800, 0.01, 70]
    // ];
    let operationsData = []
    if (this.myWellHistory != null && this.myWellHistory.operationsData != null)
      operationsData.push(this.myWellHistory.operationsData)
    else
      operationsData.push([,,,])

    this.operationsDataSheet = jspreadsheet(document.getElementById('operationsDataSheet'), {
        data:operationsData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Sales Pressure (psia)',
                width: 260,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Pressure Limit (psia)',
                width: 260,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Economic Rate (MMscf/day)',
                width: 340,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Qgtot initial (MMscf/day)',
                width: 340,
                decimal:','
            },
        ],
        updateTable: this.validateOperationsData
    });
    this.operationsDataSheet.hideIndex();

    this.numberOfWells = this.myWellHistory.numberOfWells

    // update wellNetwork in Watched function more....
    this.$nextTick(function () {
      let min = this.numberOfWells;
      if (this.myWellHistory.wellsNetwork.length < min)
        min = this.myWellHistory.wellsNetwork.length

      for (let index = 0; index < min; index++) {
        this.onUpdateWellNetwork(this.myWellHistory.wellsNetwork[index].wellTestData, index)
      }
    })
  }
}
</script>
