<template>
  <div>
    <p class="card-text" style="font-size: 2.6rem !important;text-align: center !important;"><u>Surface Data</u></p>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Tubing Properties</p>
      <div id="tubingPropertiesSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Pipeline Wellhead to Tie-Point/Manifold</p>
      <div id="wellaheadToManifoldSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Pipeline Tie-Point/Manifold to Compression Station</p>
      <div id="manifoldToCompressionSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Pipeline Compression Station to Sales Point</p>
      <div id="compressionToSalesSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Compression Discharge Ratio & Pressure Differential to Start Compression</p>
      <div id="compressionToStartSheet"></div>
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
      tubingPropertiesSheet: null,
      wellaheadToManifoldSheet: null,
      manifoldToCompressionSheet: null,
      compressionToSalesSheet: null,
      compressionToStartSheet: null,
      mySurface : {},
      isTubingPropertiesValidate: true,
      isWellHeadToTieValidate: true,
      isTieToCompressionValidate: true,
      isCompressionToSalesValidate: true,
      isCompressionAndPressureValidate: true,
      mySurface: {}
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
      surface : state => state.project.surface,
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true
        
      return this.isTubingPropertiesValidate & this.isWellHeadToTieValidate &
          this.isTieToCompressionValidate & this.isCompressionToSalesValidate &
          this.isCompressionAndPressureValidate
    }
  },

  methods: {
    onSavePage: async function(event) {
      console.log("Surface's onSavePage() is called")

      this.mySurface = {
        tubingProperties: {
          Length: 0, Size: 0, Perfs: 0, SSSV_ID: 0, SSSV_Depth: 0, Temperature: 0, GasZFactor: 0,
        },
        wellaheadToManifold: {
          Length: 0, Size: 0, Temperature: 0, GasZFactor: 0,
        },
        manifoldToCompression: {
          Length: 0, Size: 0, Temperature: 0, GasZFactor: 0,
        },
        compressionToSales: {
          Length: 0, Size: 0, Temperature: 0, GasZFactor: 0,
        },
        compressionToStart: {
          CompressionDischargeRatio: 0, DELTA_P_MIN:0
        }
      }

      this.mySurface.tubingProperties.Length = this.tubingPropertiesSheet.getValue('A1')
      this.mySurface.tubingProperties.Size = this.tubingPropertiesSheet.getValue('B1')
      this.mySurface.tubingProperties.Perfs = this.tubingPropertiesSheet.getValue('C1')
      this.mySurface.tubingProperties.SSSV_ID = this.tubingPropertiesSheet.getValue('D1')
      this.mySurface.tubingProperties.SSSV_Depth = this.tubingPropertiesSheet.getValue('E1')
      this.mySurface.tubingProperties.Temperature = this.tubingPropertiesSheet.getValue('F1')
      this.mySurface.tubingProperties.GasZFactor = this.tubingPropertiesSheet.getValue('G1')

      this.mySurface.wellaheadToManifold.Length = this.wellaheadToManifoldSheet.getValue('A1')
      this.mySurface.wellaheadToManifold.Size = this.wellaheadToManifoldSheet.getValue('B1')
      this.mySurface.wellaheadToManifold.Temperature = this.wellaheadToManifoldSheet.getValue('C1')
      this.mySurface.wellaheadToManifold.GasZFactor = this.wellaheadToManifoldSheet.getValue('D1')

      this.mySurface.manifoldToCompression.Length = this.manifoldToCompressionSheet.getValue('A1')
      this.mySurface.manifoldToCompression.Size = this.manifoldToCompressionSheet.getValue('B1')
      this.mySurface.manifoldToCompression.Temperature = this.manifoldToCompressionSheet.getValue('C1')
      this.mySurface.manifoldToCompression.GasZFactor = this.manifoldToCompressionSheet.getValue('D1')

      this.mySurface.compressionToSales.Length = this.compressionToSalesSheet.getValue('A1')
      this.mySurface.compressionToSales.Size = this.compressionToSalesSheet.getValue('B1')
      this.mySurface.compressionToSales.Temperature = this.compressionToSalesSheet.getValue('C1')
      this.mySurface.compressionToSales.GasZFactor = this.compressionToSalesSheet.getValue('D1')

      this.mySurface.compressionToStart.CompressionDischargeRatio = this.compressionToStartSheet.getValue('A1')
      this.mySurface.compressionToStart.DELTA_P_MIN = this.compressionToStartSheet.getValue('B1')

      await store.dispatch('project/saveSurface', this.mySurface)

    },
    validateTubingProperties:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isTubingPropertiesValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) || 
          (col == 6 && !(value >=0 && value <=1)) ) 
      {
        this.markInvalidCell(cell)
        this.isTubingPropertiesValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateWellHeadToTie:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isWellHeadToTieValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ||
          (col == 3 && !(value >=0 && value <=1)) ) 
      {
        this.markInvalidCell(cell)
        this.isWellHeadToTieValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateTieToCompression:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isTieToCompressionValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ||
          (col == 3 && !(value >=0 && value <=1)) ) 
      {
        this.markInvalidCell(cell)
        this.isTieToCompressionValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateCompressionToSales:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isCompressionToSalesValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0) ||
          (col == 3 && !(value >=0 && value <=1)) ) 
      {
        this.markInvalidCell(cell)
        this.isCompressionToSalesValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateCompressionAndPressure:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isCompressionAndPressureValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) {
        this.markInvalidCell(cell)
        this.isCompressionAndPressureValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
  },

  mounted() {

    this.mySurface = this.surface

    // Tubing Properties
    // var tubingPropertiesData = [
    //   [10000, 4.5, 8500, 3, 500, 140, 0.98]
    // ];

    let tubingPropertiesData = []
    if (this.mySurface != null && this.mySurface.tubingProperties != null)
      tubingPropertiesData.push(this.mySurface.tubingProperties)
    else
      tubingPropertiesData.push([,,,,,,])

    this.tubingPropertiesSheet = jspreadsheet(document.getElementById('tubingPropertiesSheet'), {
        data:tubingPropertiesData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Length (ft)',
                width: 190,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Size (in)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Perfs (ft)',
                width: 130,
                decimal:','
            },
            {
                type: 'numeric',
                title:'SSSV_ID (in)',
                width: 170,
                decimal:','
            },
            {
                type: 'numeric',
                title:'SSSV_Depth (ft)',
                width: 230,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Temperature (Deg F)',
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gas Z-Factor',
                width: 190,
                decimal:','
            },
        ],
        updateTable: this.validateTubingProperties
    });
    this.tubingPropertiesSheet.hideIndex();

    // WELLAHEAD -> Manifold
    // var wellaheadToManifoldData = [
    //   [10000, 10, 60, 0.93]
    // ];

    let wellaheadToManifoldData = []
    if (this.mySurface != null && this.mySurface.wellaheadToManifold != null)
      wellaheadToManifoldData.push(this.mySurface.wellaheadToManifold)
    else
      wellaheadToManifoldData.push([,,,])

    this.wellaheadToManifoldSheet = jspreadsheet(document.getElementById('wellaheadToManifoldSheet'), {
        data:wellaheadToManifoldData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Length (miles)',
                width: 190,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Size (in)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Temperature (Deg F)',
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gas Z-Factor',
                width: 180,
                decimal:','
            },
        ],
        updateTable: this.validateWellHeadToTie
    });
    this.wellaheadToManifoldSheet.hideIndex();

    // Manifold -> Compression
    // var manifoldToCompressionData = [
    //   [18.94, 10, 60, 0.93]
    // ];

    let manifoldToCompressionData = []
    if (this.mySurface != null && this.mySurface.manifoldToCompression != null)
      manifoldToCompressionData.push(this.mySurface.manifoldToCompression)
    else
      manifoldToCompressionData.push([,,,])

    this.manifoldToCompressionSheet = jspreadsheet(document.getElementById('manifoldToCompressionSheet'), {
        data:manifoldToCompressionData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Length (miles)',
                width: 190,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Size (in)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Temperature (Deg F)',
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gas Z-Factor',
                width: 180,
                decimal:','
            },
        ],
        updateTable: this.validateTieToCompression
    });
    this.manifoldToCompressionSheet.hideIndex();

    // Compression -> Sales
    // var compressionToSalesData = [
    //   [0.1894, 10, 60, 0.93]
    // ];

    let compressionToSalesData = []
    if (this.mySurface != null && this.mySurface.compressionToSales != null)
      compressionToSalesData.push(this.mySurface.compressionToSales)
    else
      compressionToSalesData.push([,,,])

    this.compressionToSalesSheet = jspreadsheet(document.getElementById('compressionToSalesSheet'), {
        data:compressionToSalesData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Length (miles)',
                width: 190,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Size (in)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Temperature (Deg F)',
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gas Z-Factor',
                width: 180,
                decimal:','
            },
        ],
        updateTable: this.validateCompressionToSales
    });
    this.compressionToSalesSheet.hideIndex();

    // Compression -> Start
    // var compressionToStartData = [
    //   [1, 100]
    // ];

    let compressionToStartData = []
    if (this.mySurface != null && this.mySurface.compressionToStart != null)
      compressionToStartData.push(this.mySurface.compressionToStart)
    else
      compressionToStartData.push([,])

    this.compressionToStartSheet = jspreadsheet(document.getElementById('compressionToStartSheet'), {
        data:compressionToStartData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Compression Discharge Ratio',
                width: 370,
                decimal:','
            },
            {
                type: 'numeric',
                title:'DELTA_P_MIN (psia)',
                width: 270,
                decimal:','
            },
        ],
        updateTable: this.validateCompressionAndPressure
    });
    this.compressionToStartSheet.hideIndex();

  }

}
</script>
