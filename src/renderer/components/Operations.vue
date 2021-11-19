<template>
  <div>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Operations</u></p>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Operational Constraints</p>
      <div id="operationalConstraintsSheet"></div>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">Gas Delivery Requirements</p>
      <div id="gasDeliveryReqSheet"></div>
    </div>

  </div>
</template>

<script>
import store from '~/store'
import { mapState } from 'vuex'


export default {
  name: 'Oprations',
  
  middleware: 'auth',
  
  props: ['isHidden'],

  data() {
    return {
      operationalConstraintsSheet: null,
      gasDeliveryReqSheet: null,
      isOperationalValidate: true,
      isGasDeliveryValidate: true,
      myOperations: {}
    }
  },

  watch: {
    isDataValidate: function(val, oldVal) {
      this.$emit('changedValidate', val)
    }
  },

  computed: {
    ...mapState({
      operations : state => state.project.operations,
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true
        
      return this.isOperationalValidate & this.isGasDeliveryValidate
    }
  },

  methods: {
    validateOperational:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isOperationalValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isOperationalValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    validateGasDelivery:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isGasDeliveryValidate = true
      }
      
      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isGasDeliveryValidate = false
      }
      else {
        this.markNormalCell(cell)
      }
    },
    onSavePage: async function(event) {
      console.log("Operations's onSavePage() is called")

      this.myOperations = {
        operationalConstraints: {
          StartOfOperations: 0, EndOfContract: 0, MaximumNumberOfWells: 0, RigSchedule:0,
        },
        gasDeliveryRequirements: {
          SalesPressuire: 0, TargetRate: 0, PressureLimit: 0, EconomicsRate:0, MaxFieldRecovery: 0,
        }
      }

      this.myOperations.operationalConstraints.StartOfOperations = this.operationalConstraintsSheet.getValue('A1')
      this.myOperations.operationalConstraints.EndOfContract = this.operationalConstraintsSheet.getValue('B1')
      this.myOperations.operationalConstraints.MaximumNumberOfWells = this.operationalConstraintsSheet.getValue('C1')
      this.myOperations.operationalConstraints.RigSchedule = this.operationalConstraintsSheet.getValue('D1')

      this.myOperations.gasDeliveryRequirements.SalesPressuire = this.gasDeliveryReqSheet.getValue('A1')
      this.myOperations.gasDeliveryRequirements.TargetRate = this.gasDeliveryReqSheet.getValue('B1')
      this.myOperations.gasDeliveryRequirements.PressureLimit = this.gasDeliveryReqSheet.getValue('C1')
      this.myOperations.gasDeliveryRequirements.EconomicsRate = this.gasDeliveryReqSheet.getValue('D1')
      this.myOperations.gasDeliveryRequirements.MaxFieldRecovery = this.gasDeliveryReqSheet.getValue('E1')

      await store.dispatch('project/saveOperations', this.myOperations)
    }
  },

  mounted() {
    this.myOperations = this.operations

    // ----------------------------------------------------
    // Operational Constraints
    // var operationalConstraintsData = [
    //   [2020, 0, 100, 4]
    // ];

    let operationalConstraintsData = []
    if (this.myOperations != null && this.myOperations.operationalConstraints != null)
      operationalConstraintsData.push(this.myOperations.operationalConstraints)
    else
      operationalConstraintsData.push([,,,])

    this.operationalConstraintsSheet = jspreadsheet(document.getElementById('operationalConstraintsSheet'), {
        data:operationalConstraintsData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Start of Operations',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'End of Contract',
                width: 200,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Maximum Number of Wells',
                width: 330,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Rig Schedule (Infill Wells per Year)',
                width: 420,
                decimal:','
            },
        ],
        updateTable: this.validateOperational
    });
    this.operationalConstraintsSheet.hideIndex();

    // ----------------------------------------------------
    // Gas Delivery Requirements
    // var gasDeliveryReqData = [
    //   [100, 300, 800, 2.0, 0.85]
    // ];

    let gasDeliveryReqData = []
    if (this.myOperations != null && this.myOperations.gasDeliveryRequirements != null)
      gasDeliveryReqData.push(this.myOperations.gasDeliveryRequirements)
    else
      gasDeliveryReqData.push([,,,,])

    this.gasDeliveryReqSheet = jspreadsheet(document.getElementById('gasDeliveryReqSheet'), {
        data:gasDeliveryReqData,
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
                title:'Target Rate (MMscf/day)',
                width: 300,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Pressure Limit (psia)',
                width: 280,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Economics Rate (MMscf/day)',
                width: 360,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Max Field Recovery',
                width: 260,
                decimal:','
            },
        ],
        updateTable: this.validateGasDelivery
    });
    this.gasDeliveryReqSheet.hideIndex();
  }
}
</script>
