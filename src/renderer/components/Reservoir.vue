<template>
  <div>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Reservoir</u></p>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Reservoir PVT</p>
      <div id="reservoirPVTSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Reservoir Parameters</p>
      <div id="reservoirParametersSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Dual-Porosity</p>
      <multiselect v-model="dualPorosity" :options="dualPorosityOptions" track-by="name" label="name" placeholder="Select option"></multiselect>
      <div id="dualPorositySheet" style="margin-top:1rem"  v-show="dualPorosity != null && dualPorosity.value ==1"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" v-show="isFDP=='1'" class="row">
      <p class="gf-item">Well-Test Data</p>
      <multiselect v-model="testWellData" :options="testWellDataOptions" track-by="name" label="name" placeholder="Select option"></multiselect>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="isFDP == '1' && testWellData != null && testWellData.value == 1 ">
      <p class="gf-item">C & n Model</p>
      <div id="cnModelSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="isFDP == '1' && testWellData != null && testWellData.value == 2">
      <p class="gf-item">Vertical Model</p>
      <div id="verticalModelSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="isFDP == '1' && testWellData != null && testWellData.value == 3">
      <p class="gf-item">Horizontal Model</p>
      <div id="horizontalModelSheet"></div>
    </div>

  </div>  
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.multiselect {
  max-width: 370px;
  /* margin: auto; */
}
</style>

<script>
import store from '~/store'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  name: 'Reservoir',
  
  middleware: 'auth',

  components: {
    Multiselect
  },
  
  props: ['isHidden'],

  data() {
    return {
      reservoirPVTSheet: null,
      reservoirParametersSheet : null,
      dualPorositySheet: null,
      testWellDataSheet: null,
      cnModelSheet: null,
      verticalModelSheet: null,
      horizontalModelSheet: null,
      dualPorosity : null,
      testWellData : null,
      dualPorosityOptions: [
        { name: "Yes", value : 1 },
        { name: "No", value : 0} 
      ],
      testWellDataOptions: [
        { name: "C & n Model", value : 1 },
        { name: "Vertical Model", value: 2 },
        { name: "Horizontal Model", value: 3 }
      ],
      isPVTValidate: true,
      isParamValidate: true,
      isDualPorosityValidate: true,
      isCnModelValidate: true,
      isVerticalModelValidate: true,
      isHorizontalModelValidate: true,
      myReservoir: {}
    }
  },

  watch: {
    dualPorosity: function(val, oldVal) {
      debugger
      this.onSavePage(null)
    },
    isDataValidate: function(val, oldVal) {
      this.$emit('changedValidate', val)
    }
  },

  computed: {
    ...mapState({
      isFDP: state => state.project.isFDP,
      reservoir : state => state.project.reservoir,
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true

      var dualState = (this.dualPorosity == null || this.dualPorosity.value == 0) ? true : this.isDualPorosityValidate
      var wellTestState = (this.testWellData == null || this.testWellData.value == 0) ? true :
        (this.testWellData.value == 1 ? this.isCnModelValidate : 
        (this.testWellData.value == 2 ? this.isVerticalModelValidate: 
        (this.testWellData.value == 3 ? this.isHorizontalModelValidate : true)))

      return this.isPVTValidate & this.isParamValidate & dualState & wellTestState
    }
  },

  methods: {
    onSavePage: async function(event) {
      console.log("Reservoir's onSavePage() is called")
      
      this.myReservoir = {
        reservoirPVT: {
          Viscosity: 0, GasZFactor:0, SpecificGravity: 0, ReservoirTemperature: 0,
        },
        reservoirParameters: {
          GIIP: 0, ReservoirPressure:0,
        },
        hasDualPorosity: 0,
        dualPorosity: {
          km: 0, hm: 0, ShapeFactorSigma: 0, MatrixGIIP: 0,
        },
        wellTestData: 1,
        cnModel: {
          C: '', n : ''
        },
        verticalModel: {
          k: 0, Porosity: 0, NetPay: 0, DrainageArea: 0, WellboreID: 0, Skin: 0
        },
        horizontalModel: {
          k: 0, Porosity: 0, NetPay: 0, DrainageArea: 0, WellboreID: 0, Skin: 0, WellLength:0, KvKh: 0
        }
      }

      this.myReservoir.reservoirPVT.Viscosity = this.reservoirPVTSheet.getValue('A1')
      this.myReservoir.reservoirPVT.GasZFactor = this.reservoirPVTSheet.getValue('B1')
      this.myReservoir.reservoirPVT.SpecificGravity = this.reservoirPVTSheet.getValue('C1')
      this.myReservoir.reservoirPVT.ReservoirTemperature = this.reservoirPVTSheet.getValue('D1')

      this.myReservoir.reservoirParameters.GIIP = this.reservoirParametersSheet.getValue('A1')
      this.myReservoir.reservoirParameters.ReservoirPressure = this.reservoirParametersSheet.getValue('B1')

      this.myReservoir.hasDualPorosity = this.dualPorosity.value

      this.myReservoir.dualPorosity.km = this.dualPorositySheet.getValue('A1')
      this.myReservoir.dualPorosity.hm = this.dualPorositySheet.getValue('B1')
      this.myReservoir.dualPorosity.ShapeFactorSigma = this.dualPorositySheet.getValue('C1')
      this.myReservoir.dualPorosity.MatrixGIIP = this.dualPorositySheet.getValue('D1')

      this.myReservoir.wellTestData = this.testWellData.value

      this.myReservoir.cnModel.C = this.cnModelSheet.getValue('A1')
      this.myReservoir.cnModel.n = this.cnModelSheet.getValue('B1')

      this.myReservoir.verticalModel.k = this.verticalModelSheet.getValue('A1')
      this.myReservoir.verticalModel.Porosity = this.verticalModelSheet.getValue('B1')
      this.myReservoir.verticalModel.NetPay = this.verticalModelSheet.getValue('C1')
      this.myReservoir.verticalModel.DrainageArea = this.verticalModelSheet.getValue('D1')
      this.myReservoir.verticalModel.WellboreID = this.verticalModelSheet.getValue('E1')
      this.myReservoir.verticalModel.Skin = this.verticalModelSheet.getValue('F1')

      this.myReservoir.horizontalModel.k = this.horizontalModelSheet.getValue('A1')
      this.myReservoir.horizontalModel.Porosity = this.horizontalModelSheet.getValue('B1')
      this.myReservoir.horizontalModel.NetPay = this.horizontalModelSheet.getValue('C1')
      this.myReservoir.horizontalModel.DrainageArea = this.horizontalModelSheet.getValue('D1')
      this.myReservoir.horizontalModel.WellboreID = this.horizontalModelSheet.getValue('E1')
      this.myReservoir.horizontalModel.Skin = this.horizontalModelSheet.getValue('F1')
      this.myReservoir.horizontalModel.WellLength = this.horizontalModelSheet.getValue('G1')
      this.myReservoir.horizontalModel.KvKh = this.horizontalModelSheet.getValue('H1')

      await store.dispatch('project/saveReservoir', this.myReservoir)
    },
    validatePVT:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isPVTValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) || 
          (col < 3 && !(value >=0 && value <= 1))) 
      {
        this.markInvalidCell(cell)
        this.isPVTValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateParam:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isParamValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isParamValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateDualPorosity:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isDualPorosityValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isDualPorosityValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateCnModel:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (this.isFDP != '1') {
        this.isCnModelValidate = true
        return
      }
      
      if (cellName == 'A1') {
        // this means start to update table
        this.isCnModelValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isCnModelValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateVerticalModel:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (this.isFDP != '1') {
        this.isVerticalModelValidate = true
        return
      }

      if (cellName == 'A1') {
        // this means start to update table
        this.isVerticalModelValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isVerticalModelValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateHorizontalModel:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (this.isFDP != '1') {
        this.isHorizontalModelValidate = true
        return
      }

      if (cellName == 'A1') {
        // this means start to update table
        this.isHorizontalModelValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isHorizontalModelValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },

  },

  mounted() {
     
    this.myReservoir = this.reservoir 

    if (this.myReservoir.hasDualPorosity == 0)
      this.dualPorosity = { name: "No", value : 0}
    else if (this.myReservoir.hasDualPorosity == 1)
      this.dualPorosity = { name: "Yes", value : 1 }
    else 
      this.dualPorosity = null

    if (this.myReservoir.wellTestData == 1) {
      this.testWellData = { name: "C & n Model", value : 1 }
    }
    else if (this.myReservoir.wellTestData == 2) {
      this.testWellData = { name: "Vertical Model", value: 2 }
    }
    else if (this.myReservoir.wellTestData == 3) {
      this.testWellData = { name: "Horizontal Model", value: 3 }
    }
    else 
      this.testWellData = null

    // ----------------------------------------------------
    // Reservoir PVT sheet
    // var reservoirPVTData = [
    //   [0.019, 0.95, 0.6, 250]
    // ];

    let reservoirPVTData = []
    if (this.myReservoir != null && this.myReservoir.reservoirPVT != null)
      reservoirPVTData.push(this.myReservoir.reservoirPVT)
    else
      reservoirPVTData.push([,,,])


    this.reservoirPVTSheet = jspreadsheet(document.getElementById('reservoirPVTSheet'), {
        data:reservoirPVTData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Viscosity (psia)',
                width: 220,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gas Z-Factor',
                width: 190,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Specific Gravity',
                width: 220,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Reservoir Temperature (Deg F)',
                width: 360,
                decimal:','
            },
        ],
        updateTable: this.validatePVT
    });
    this.reservoirPVTSheet.hideIndex();

    // ----------------------------------------------------
    // Reservoir Data sheet
    // var reservoirData = [
    //   [15000, 5114]
    // ];

    let reservoirParametersData = []
    if (this.myReservoir != null && this.myReservoir.reservoirParameters != null)
      reservoirParametersData.push(this.myReservoir.reservoirParameters)
    else
      reservoirParametersData.push([,])

    this.reservoirParametersSheet = jspreadsheet(document.getElementById('reservoirParametersSheet'), {
        data:reservoirParametersData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'GIIP (Bcf)',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Reservoir Pressure (psia)',
                width: 320,
                decimal:','
            },
        ],
        updateTable: this.validateParam
    });
    this.reservoirParametersSheet.hideIndex();

    // ----------------------------------------------------
    // Dual Porosity Data sheet
    // var dualPorosityData = [
    //   [100, 300, 1.0, 5000]
    // ];

    let dualPorosityData = []
    if (this.myReservoir != null && this.myReservoir.dualPorosity != null)
      dualPorosityData.push(this.myReservoir.dualPorosity)
    else
      dualPorosityData.push([,,,])

    this.dualPorositySheet = jspreadsheet(document.getElementById('dualPorositySheet'), {
        data:dualPorosityData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'km (md)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'hm (ft)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Shape Factor Sigma',
                width: 260,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Matrix GIIP (bcf)',
                width: 240,
                decimal:','
            },
        ],
        updateTable: this.validateDualPorosity
    });
    this.dualPorositySheet.hideIndex();

    // ----------------------------------------------------
    // C & n Model
    // var cnMethodData = [
    //   [26.9, 0.537]
    // ];
    let cnModelData = []
    if (this.myReservoir != null && this.myReservoir.cnModel != null)
      cnModelData.push(this.myReservoir.cnModel)
    else
      cnModelData.push([,])    

    this.cnModelSheet = jspreadsheet(document.getElementById('cnModelSheet'), {
        data:cnModelData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'C (Mscf/day/psia2)',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'n',
                width: 120,
                decimal:','
            },
        ],
        updateTable: this.validateCnModel
    });
    this.cnModelSheet.hideIndex();

    // ----------------------------------------------------
    // Vertical Model
    // var verticalModelData = [
    //   [1, 0.2, 100, 72, 6, 0]
    // ];

    let verticalModelData = []
    if (this.myReservoir != null && this.myReservoir.verticalModel != null)
      verticalModelData.push(this.myReservoir.verticalModel)
    else
      verticalModelData.push([,,,,,])

    this.verticalModelSheet = jspreadsheet(document.getElementById('verticalModelSheet'), {
        data:verticalModelData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'k (md)',
                width: 110,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Porosity',
                width: 130,
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
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Wellbore ID (in)',
                width: 200,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Skin',
                width: 120,
                decimal:','
            },
        ],
        updateTable: this.validateVerticalModel
    });
    this.verticalModelSheet.hideIndex();

    // ----------------------------------------------------
    // Horizontal Model
    // var horizontalModelData = [
    //   [1, 0.2, 100, 72, 6, 0, 2000, 0.01]
    // ];

    let horizontalModelData = []
    if (this.myReservoir != null && this.myReservoir.horizontalModel != null)
      horizontalModelData.push(this.myReservoir.horizontalModel)
    else
      horizontalModelData.push([,,,,,,,])    

    this.horizontalModelSheet = jspreadsheet(document.getElementById('horizontalModelSheet'), {
        data:horizontalModelData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'k (md)',
                width: 110,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Porosity',
                width: 130,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Net Pay (ft)',
                width: 180,
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
                width: 200,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Skin',
                width: 120,
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
                width: 120,
                decimal:','
            },
        ],
        updateTable: this.validateHorizontalModel
    });
    this.horizontalModelSheet.hideIndex();
  }
}
</script>
