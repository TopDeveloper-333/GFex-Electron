<template>
  <div>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Economics for the FDP</u></p>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <div id="economics1Sheet"></div>
      <div id="economics2Sheet"></div>
      <div id="economics3Sheet"></div>
      <div id="economicsDataSheet"></div>
    </div>

  </div>  
</template>

<script>
import store from '~/store'
import { mapState } from 'vuex'

export default {
  name: 'Economics',
  
  middleware: 'auth',
  
  props: ['isHidden'],

  data() {
    return {
      economics1Sheet: null,
      economics2Sheet: null,
      economics3Sheet: null,
      economicsDataSheet: null,
      myEconomics: {},
      isEconomics1Validate: true,
      isEconomics2Validate: true,
      isEconomics3Validate: true,
      isEconomicsDataValidate: true
    }
  },

  watch: {
    isDataValidate: function(val, oldVal) {
      this.$emit('changedValidate', val)
    }
  },

  computed: {
    ...mapState({
      economics : state => state.project.economics,
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true

      return this.isEconomics1Validate & this.isEconomics2Validate & 
             this.isEconomics3Validate & this.isEconomicsDataValidate
    }
  },

  methods: {
    validateEconomics1:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isEconomics1Validate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isEconomics1Validate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateEconomics2:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isEconomics2Validate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isEconomics2Validate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateEconomics3:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isEconomics3Validate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isEconomics3Validate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateEconomicsData:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isEconomicsDataValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isEconomicsDataValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    onSavePage: async function(event) {
      console.log("Economics's onSavePage() is called")

      this.myEconomics = {
        economics1: {
          PriceOfGas: 0, PriceOfCondensate: 0, PriceOfCompression:0, Life:0, SalvageRateOfCAPEX: 0,
        },
        economics2: {
          Investment: 0, ROR: 0, Royalty: 0, Tax: 0,
        },
        economics3: {
          FirstYearOfProject: 0, FirstYearOfProduction:0,
        },
        economics: []
      }

      this.myEconomics.economics1.PriceOfGas = this.economics1Sheet.getValue('A1')
      this.myEconomics.economics1.PriceOfCondensate = this.economics1Sheet.getValue('B1')
      this.myEconomics.economics1.PriceOfCompression = this.economics1Sheet.getValue('C1')
      this.myEconomics.economics1.Life = this.economics1Sheet.getValue('D1')
      this.myEconomics.economics1.SalvageRateOfCAPEX = this.economics1Sheet.getValue('E1')

      this.myEconomics.economics2.Investment = this.economics2Sheet.getValue('A1')
      this.myEconomics.economics2.ROR = this.economics2Sheet.getValue('B1')
      this.myEconomics.economics2.Royalty = this.economics2Sheet.getValue('C1')
      this.myEconomics.economics2.Tax = this.economics2Sheet.getValue('D1')

      this.myEconomics.economics3.FirstYearOfProject = this.economics3Sheet.getValue('A1')
      this.myEconomics.economics3.FirstYearOfProduction = this.economics3Sheet.getValue('B1')

      let numRows = this.economicsDataSheet.options.data.length;
      for (var i =0; i < numRows; i++) {
        this.myEconomics.economics[i] = [0, 0, 0];
        this.myEconomics.economics[i][0] = this.economicsDataSheet.getValue('A' + (i+1));
        this.myEconomics.economics[i][1] = this.economicsDataSheet.getValue('B' + (i+1));
        this.myEconomics.economics[i][2] = this.economicsDataSheet.getValue('C' + (i+1));
      }

      await store.dispatch('project/saveEconomics', this.myEconomics)
    }
  },

  mounted() {

    this.myEconomics = this.economics

    // Economics 1 data
    // var economics1Data = [
    //   [3.00, 40, 0.50, 50, 0.60]
    // ];

    let economics1Data = []
    if (this.myEconomics != null && this.myEconomics.economics1 != null)
      economics1Data.push(this.myEconomics.economics1)
    else
      economics1Data.push([,,,,])

    this.economics1Sheet = jspreadsheet(document.getElementById('economics1Sheet'), {
        data:economics1Data,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Price of Gas ($/MMBTU)',
                width: 300,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Price of Condensate ($/barrels)',
                width: 380,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Price of Compression ($/MMscf/psi)',
                width: 430,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Life',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Salvage rate of the CAPEX',
                width: 320,
                decimal:','
            },
        ],
        updateTable: this.validateEconomics1
    });
    this.economics1Sheet.hideIndex();
    
    // Economics 2 data
    // var economics2Data = [
    //   [2500, 0.12, 0.20, 0.40]
    // ];

    let economics2Data = []
    if (this.myEconomics != null && this.myEconomics.economics2 != null)
      economics2Data.push(this.myEconomics.economics2)
    else
      economics2Data.push([,,,])

    this.economics2Sheet = jspreadsheet(document.getElementById('economics2Sheet'), {
        data:economics2Data,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Investment (Budget $MM)',
                width: 330,
                decimal:','
            },
            {
                type: 'numeric',
                title:'ROR',
                width: 90,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Royalty (% of Revenues)',
                width: 320,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Tax (% of Taxable Revenues)',
                width: 350,
                decimal:','
            },
        ],
        updateTable: this.validateEconomics2
    });
    this.economics2Sheet.hideIndex();

    // Economics 3 data
    // var economics3Data = [
    //   [2020, 2020]
    // ];

    let economics3Data = []
    if (this.myEconomics != null && this.myEconomics.economics3 != null)
      economics3Data.push(this.myEconomics.economics3)
    else
      economics3Data.push([,])

    this.economics3Sheet = jspreadsheet(document.getElementById('economics3Sheet'), {
        data:economics3Data,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'1st Year of Project',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'1st Year of Production',
                width: 380,
                decimal:','
            },
        ],
        updateTable: this.validateEconomics3
    });
    this.economics3Sheet.hideIndex();

    // Economics data
    // var economicsData = [
    //   [1, 100, 0.0],
    //   [2, 100, 0.0],
    //   [3, 100, 0.0],
    //   [4, 100, 0.0],
    //   [5, 100, 0.0],
    //   [6, 100, 0.0],
    //   [7, 0, 30.0],
    //   [8, 0, 30.0],
    //   [9, 0, 30.0],
    //   [10, 0, 30.0],
    //   [11, 0, 30.0],
    //   [12, 0, 30.0],
    //   [13, 0, 30.0],
    //   [14, 0, 30.0],
    //   [15, 0, 30.0],
    //   [16, 0, 30.0],
    //   [17, 0, 30.0],
    //   [18, 0, 30.0],
    //   [19, 0, 30.0],
    //   [20, 0, 30.0],
    //   [21, 0, 30.0],
    // ];

    let economicsData = []
    if (this.myEconomics != null && this.myEconomics.economics != null){
      this.myEconomics.economics.forEach(element => {
        economicsData.push(element)
      });
    }
    else
      economicsData.push([,,])

    this.economicsDataSheet = jspreadsheet(document.getElementById('economicsDataSheet'), {
        data:economicsData,
        allowInsertRow:true,
        allowManualInsertRow:true,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:true,
        allowDeleteColumn:false,
        tableOverflow: true,
        columns: [
            {
                type: 'numeric',
                title:'Year',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'CAPEX (MM $)',
                width: 200,
                decimal:','
            },
            {
                type: 'numeric',
                title:'OPEX (MM $)',
                width: 180,
                decimal:','
            },
        ],
        updateTable: this.validateEconomicsData
    });
    this.economicsDataSheet.hideIndex();
  }
}
</script>
