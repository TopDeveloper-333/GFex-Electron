<template>
  <div>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Dry Gas PVT Data</u></p>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Standard Conditions</p>
      <div id="standardConditionSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Gas Properties</p>
      <div id="gasPVTSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Rock Properties</p>
      <div id="rockPropertiesSheet"></div>
    </div>

  </div>
</template>
<script>

import store from '~/store'
import { mapState } from 'vuex'

export default {
  middleware: 'auth',

  data() {
    return {
      myDryGas: {},
      standardConditionSheet: null,
      rockPropertiesSheet: null,
      gasPVTSheet: null,
      selectedOptionPage : null,
      isStandardConditionValidate: true,
      isGasPropertiesValidate: true,
      isRockPropertiesValidate: true
    }
  },

  props: ['isHidden'],

  watch: {
    isDataValidate: function(val, oldVal) {
      this.$emit('changedValidate', val)
    }
  },

  computed: {
    ...mapState({
      drygas : state => state.project.drygas,
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true;

      return this.isStandardConditionValidate & this.isGasPropertiesValidate & this.isRockPropertiesValidate
    }
  },

  methods: {
    validateStandardConditions:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isStandardConditionValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isStandardConditionValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateGasProperties:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isGasPropertiesValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isGasPropertiesValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateRockProperties:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isRockPropertiesValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isRockPropertiesValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    onSavePage: async function(event) {
      console.log("DrygasPVT's onSavePage() is called")
      
      this.myDryGas = {
        standardConditions: {
          Psc: 0, Tsc : 0
        },
        gasProperties: {
          gasCompressibility: "", gasViscosity:0, specificGravity: 0, resTemp: 0, N2:0, CO2:0, H2S:0
        },
        rockProperties: {
          conateWaterSaturation:0, waterCompressibility: "", rockCompressibility: ""
        }
      }

      this.myDryGas.standardConditions.Psc = this.standardConditionSheet.getValue('A1');
      this.myDryGas.standardConditions.Tsc = this.standardConditionSheet.getValue('B1');
      this.myDryGas.gasProperties.gasCompressibility = this.gasPVTSheet.getValue('A1');
      this.myDryGas.gasProperties.gasViscosity = this.gasPVTSheet.getValue('B1');
      this.myDryGas.gasProperties.specificGravity = this.gasPVTSheet.getValue('C1');
      this.myDryGas.gasProperties.resTemp = this.gasPVTSheet.getValue('D1');
      this.myDryGas.gasProperties.N2 = this.gasPVTSheet.getValue('E1');
      this.myDryGas.gasProperties.CO2 = this.gasPVTSheet.getValue('F1');
      this.myDryGas.gasProperties.H2S = this.gasPVTSheet.getValue('G1');
      this.myDryGas.rockProperties.conateWaterSaturation = this.rockPropertiesSheet.getValue('A1');
      this.myDryGas.rockProperties.waterCompressibility = this.rockPropertiesSheet.getValue('B1');
      this.myDryGas.rockProperties.rockCompressibility = this.rockPropertiesSheet.getValue('C1');

      await store.dispatch('project/saveDryGas', this.myDryGas)
    }
  },

  mounted() {
    this.myDryGas = this.drygas

    if (this.selectedOptionPage == null || this.selectedOptionPage == undefined)
      this.selectedOptionPage = "PVT_PAGE"

    // Standard Conditions
    // var standardConditionsData = [
    //   // [,],
    //   [14.7, 60],
    // ];

    let standardConditionsData = []
    if (this.myDryGas != null && this.myDryGas.standardConditions != null)
      standardConditionsData.push(this.myDryGas.standardConditions)
    else
      standardConditionsData.push([,])
    
    this.standardConditionSheet = jspreadsheet(document.getElementById('standardConditionSheet'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:standardConditionsData,
        columns: [
            {
                type: 'numeric',
                title:'Psc (psia)',
                width: 150,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Tsc (Deg F)',
                width: 170,
                decimal:','
            },
        ],
        updateTable: this.validateStandardConditions
    });
    this.standardConditionSheet.hideIndex();

    // GAS PVT
    // var gasPVTData = [
    //   // [,,,,,,],
    //   ["35.D-05", 0.025, 0.6, 300, 0.03, 0.06, 0.02]
    // ];

    let gasPVTData = []
    if (this.myDryGas != null && this.myDryGas.gasProperties != null)
      gasPVTData.push(this.myDryGas.gasProperties)
    else
      gasPVTData.push([,,,,,,])

    this.gasPVTSheet = jspreadsheet(document.getElementById('gasPVTSheet'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:gasPVTData,
        columns: [
            {
                type: 'text',
                title:'GAS COMPRESSIBILITY (1/psi)',
                width: 350,
                decimal:','
            },
            {
                type: 'numeric',
                title:'GAS VISCOSITY (cp)',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'SPECIFIC GRAVITY',
                width: 220,
                decimal:','
            },
            {
                type: 'numeric',
                title:'RES. TEMP. (Deg F)',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'N2 (decimal)',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'CO2 (decimal)',
                width: 180,
                decimal:','
            },
            {
                type: 'numeric',
                title:'H2S (decimal)',
                width: 180,
                decimal:','
            },
        ],
        updateTable: this.validateGasProperties
    });
    this.gasPVTSheet.hideIndex();

    // ROCK PROPERTIES
    // var rockPropertiesData = [
    //   // [,,],
    //   [0.30, "3.D-06", "3.D-06"],
    // ];
    let rockPropertiesData = []
    if (this.myDryGas != null && this.myDryGas.rockProperties != null)
      rockPropertiesData.push(this.myDryGas.rockProperties)
    else
      rockPropertiesData.push([,,])
    
    this.rockPropertiesSheet = jspreadsheet(document.getElementById('rockPropertiesSheet'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:rockPropertiesData,
        columns: [
            {
                type: 'numeric',
                title:'Connate Water Saturation',
                width: 320,
                decimal:','
            },
            {
                type: 'text',
                title:'Water Compressibility (1/psi)',
                width: 360,
            },
            {
                type: 'numeric',
                title:'Rock Compressibility (1/psi)',
                width: 360,
            },
        ],
        updateTable: this.validateRockProperties
    });
    this.rockPropertiesSheet.hideIndex();    
  }
}
</script>
