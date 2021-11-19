<template>
  <div>
    <loading :active.sync="isLoading" 
             :is-full-page="fullPage"></loading>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Constant Volume Depletion</u></p>


    <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="bShowPlot == false">
      <div id="cvdData1Sheet"></div>
      <div id="cvdData2Sheet"></div>
    </div>

    <div>
      <hr class="gf-line" v-show="bShowPlot == false">
      <label class="btn btn-primary gf-button" style="float:right;margin-left:10px" v-on:click="onPlotPage">{{plotLabel}}</label>
      <label class="btn btn-primary gf-button" style="float:right" v-on:click="onCalculate" v-show="bShowPlot == false">CALCULATE</label>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row" v-show="bShowPlot == false">
      <div id="gasCondensate1Sheet" style="text-align:center"></div>
      <div id="gasCondensate2Sheet"></div>
    </div>

    <div style="height:50px" v-show="bShowPlot == true">
    </div>

    <hr class="gf-line" v-show="bShowPlot == true">
    <div style="display:flex;margin-bottom:6px;text-align:center;min-height:600px" class="row" v-show="bShowPlot == true">
      <div class="col-3">
        <label class="typo__label gf-item">Axis X:</label>
        <multiselect v-model="axisX" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select X axis."></multiselect>
        <label class="typo__label gf-item">Axis Y:</label>
        <multiselect v-model="axisY" :options="options" track-by="name" label="name" :maxHeight="250" :taggable="true" placeholder="Select Y axis."></multiselect>

        <div style="margin-top:32px;display:flex;text-align:left">
            <input type="color" style="height:50px;margin-right:20px;" id="axisColor" name="axisColor" v-model="axisColor" @change="onApplyColor($event)">
            <label for="axisColor" class="typo__label gf-item">Axis Color</label>
        </div>

        <div style="margin-top:32px;display:flex;text-align:left">
            <input type="color" style="height:50px;margin-right:20px;" id="graphColor" name="graphColor" v-model="graphColor" @change="onApplyColor($event)">
            <label for="graphColor" class="typo__label gf-item">Curve Color</label>
        </div>

        <!-- <multiselect v-model="axisY" :options="options" track-by="name" label="name" :close-on-select="false" :maxHeight="250" :multiple="true" :taggable="true" placeholder="Select multiple Y axis."></multiselect> -->
        <!-- <label class="typo__label gf-item">Axis Y2:</label>
        <multiselect v-model="axisY2" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select Y2 axis."></multiselect> -->
      </div>
      <div class="col-2">
        <label class="btn btn-primary gf-button" style="margin-top:48px" v-on:click="onShow">Graph</label>
        <label class="btn btn-primary gf-button" style="margin-top:32px" v-on:click="onPrintGraph">Print Graph</label>
      </div>
      <div id="plot" class="col-7" ref="plot">
      </div>
    </div>

    <div id="plotModal" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close" id="plot-gf-close">&times;</span>
        </div>
        <p class="gf-comment" style="margin-top:6px !important; margin-bottom:6px !important;"><{{projectName}}> Field Project</p>
        <span style="font-size: 1.25rem">Please select all X, Y axes</span>
        <div style="margin-bottom:16px;margin-top:16px">
          <label class="btn btn-primary gf-button" v-on:click="onOK">OK</label>
        </div>
      </div>
    </div>

  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import store from '~/store'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import * as svg from 'save-svg-as-png';
import html2canvas from 'html2canvas';
import Loading from 'vue-loading-overlay';

export default {
  name: 'CondensatePvt',
  middleware: 'auth',

  components: {
    Multiselect,
    Loading
  },

  props: ['isHidden'],
  
  data() {
    return {
      cvdData1Sheet: null,
      cvdData2Sheet: null,
      gasCondensate1Sheet: null,
      gasCondensate2Sheet: null,
      myGasCondensate : {},
      bShowPlot : false,
      options: [
        { name: "P (psia)", column: 'A'}, 
        { name: "Bo (rb/stb)", column: 'B'},
        { name: "Rs (scf/stb)", column: 'C'}, 
        { name: "Bg (rb/mscf)", column: 'D'},
        { name: "Rv (stb/mmscf)", column: 'E'}, 
        { name: "Oil Viscosity (cp)", column: 'F'}, 
        { name: "Gas Viscosity (cp)", column: 'G'},
        { name: "PV Inj (%)", column:'H'}
      ],
      axisX: null,
      axisY: [],
      axisY2: null,
      plot: null,
      plotLabel: "Plot",
      isCvd1Validate: true,
      isCvd2Validate: true,
      isGasCondensate1Validate: true,
      isGasCondensate2Validate: true,
      axisColor: '#ffffff',
      graphColor: '#ffbb78',
      isLoading: false,
      fullPage: true,
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
      gascondensate : state => state.project.gascondensate,
      isEconomics : state => state.project.isEconomics,
      isFDP: state => state.project.isFDP,
      resCvdOut: state => state.project.resCvdOut
    }),
    isDataValidate: function() {
      if (this.isHidden == true)
        return true
        
      return this.isGasCondensate1Validate & this.isGasCondensate2Validate
    }
  },

  methods: {
    onOK: function(event) {
        var modal = document.getElementById("plotModal");
        modal.style.display = "none";
    },
    onCalculate: async function(event) {
      this.isLoading = true
      await this.onSavePage(null)

      let cvd = {
        cvdData1: {
          Psc: 0, Tsc: 0, T: 0, Gi: 0, Rvi: 0, SpecificGravityOfOil:0, SpecificGravityOfGas:0, ZFactorOfGas:0,
        },
        cvdData2: [
        ],
      };

      cvd.cvdData1.Psc = this.cvdData1Sheet.getValue('A1')
      cvd.cvdData1.Tsc = this.cvdData1Sheet.getValue('B1')
      cvd.cvdData1.T = this.cvdData1Sheet.getValue('C1')
      cvd.cvdData1.Gi = this.cvdData1Sheet.getValue('D1')
      cvd.cvdData1.Rvi = this.cvdData1Sheet.getValue('E1')
      cvd.cvdData1.SpecificGravityOfOil = this.cvdData1Sheet.getValue('F1')
      cvd.cvdData1.SpecificGravityOfGas = this.cvdData1Sheet.getValue('G1')
      cvd.cvdData1.ZFactorOfGas = this.cvdData1Sheet.getValue('H1')

      let numRowsOfCVD = this.cvdData2Sheet.options.data.length;
      for (var i =0; i < numRowsOfCVD; i++) {
        cvd.cvdData2[i] = [0, 0, 0, 0, 0, 0];
        cvd.cvdData2[i][0] = this.cvdData2Sheet.getValue('A' + (i+1));
        cvd.cvdData2[i][1] = this.cvdData2Sheet.getValue('B' + (i+1));
        cvd.cvdData2[i][2] = this.cvdData2Sheet.getValue('C' + (i+1));
        cvd.cvdData2[i][3] = this.cvdData2Sheet.getValue('D' + (i+1));
        cvd.cvdData2[i][4] = this.cvdData2Sheet.getValue('E' + (i+1));
        cvd.cvdData2[i][5] = this.cvdData2Sheet.getValue('F' + (i+1));
      }
      
      await store.dispatch('project/fetchCvdOut', cvd)

      let gasCondensate2Data = []
      if (this.resCvdOut != null ) {
        this.resCvdOut.forEach(element => {
          gasCondensate2Data.push(element)      
        });
      }
      else
        gasCondensate2Data.push([],[],[])

      document.getElementById('gasCondensate2Sheet').innerHTML = '';
      this.gasCondensate2Sheet = jspreadsheet(document.getElementById('gasCondensate2Sheet'), {
          allowInsertRow:true,
          allowManualInsertRow:true,
          allowInsertColumn:false,
          allowManualInsertColumn:false,
          allowDeleteRow:true,
          allowDeleteColumn:false,
          data:gasCondensate2Data,
          columns: [
              {
                  type: 'numeric',
                  title:'P (psia)',
                  width: 140,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'Bo (rb/stb)',
                  width: 160,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'Rs (scf/stb)',
                  width: 180,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'Bg (rb/mscf)',
                  width: 200,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'Rv (stb/mmscf)',
                  width: 200,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'Oil Viscosity (cp)',
                  width: 240,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'Gas Viscosity (cp)',
                  width: 240,
                  decimal:','
              },
              {
                  type: 'numeric',
                  title:'PV Inj (%)',
                  width: 150,
                  decimal:','
              },
          ],
          updateTable: this.validateGasCondensate2,
      });
      this.gasCondensate2Sheet.hideIndex();

      this.isLoading = false

    },
    onPlotPage: function(event) {
      if(this.bShowPlot == false) {
        this.bShowPlot = true
        this.plotLabel = "Data"
      }
      else {
        this.bShowPlot = false
        this.plotLabel = "Plot"
      }
    },
    onSavePage: async function(event) {
      this.myGasCondensate = {
        cvdData1: {
          Psc: 0, Tsc: 0, T: 0, Gi: 0, Rvi: 0, SpecificGravityOfOil:0, SpecificGravityOfGas:0, ZFactorOfGas:0,
        },
        cvdData2: [

        ],
        gasCondensate1 : {
          Psat: 0, Swi : 0
        },
        gasCondensate2 : [
        ]
      };

      //
      // CVD Data
      //
      this.myGasCondensate.cvdData1.Psc = this.cvdData1Sheet.getValue('A1')
      this.myGasCondensate.cvdData1.Tsc = this.cvdData1Sheet.getValue('B1')
      this.myGasCondensate.cvdData1.T = this.cvdData1Sheet.getValue('C1')
      this.myGasCondensate.cvdData1.Gi = this.cvdData1Sheet.getValue('D1')
      this.myGasCondensate.cvdData1.Rvi = this.cvdData1Sheet.getValue('E1')
      this.myGasCondensate.cvdData1.SpecificGravityOfOil = this.cvdData1Sheet.getValue('F1')
      this.myGasCondensate.cvdData1.SpecificGravityOfGas = this.cvdData1Sheet.getValue('G1')
      this.myGasCondensate.cvdData1.ZFactorOfGas = this.cvdData1Sheet.getValue('H1')

      let numRowsOfCVD = this.cvdData2Sheet.options.data.length;
      for (var i =0; i < numRowsOfCVD; i++) {
        this.myGasCondensate.cvdData2[i] = [0, 0, 0, 0, 0, 0];
        this.myGasCondensate.cvdData2[i][0] = this.cvdData2Sheet.getValue('A' + (i+1));
        this.myGasCondensate.cvdData2[i][1] = this.cvdData2Sheet.getValue('B' + (i+1));
        this.myGasCondensate.cvdData2[i][2] = this.cvdData2Sheet.getValue('C' + (i+1));
        this.myGasCondensate.cvdData2[i][3] = this.cvdData2Sheet.getValue('D' + (i+1));
        this.myGasCondensate.cvdData2[i][4] = this.cvdData2Sheet.getValue('E' + (i+1));
        this.myGasCondensate.cvdData2[i][5] = this.cvdData2Sheet.getValue('F' + (i+1));
      }
      
      // 
      // Pine Data
      //
      this.myGasCondensate.gasCondensate1.Psat = this.gasCondensate1Sheet.getValue('A1');
      this.myGasCondensate.gasCondensate1.Swi = this.gasCondensate1Sheet.getValue('B1');

      var numRows = this.gasCondensate2Sheet.options.data.length;
      for (var i =0; i < numRows; i++) {
        this.myGasCondensate.gasCondensate2[i] = [0, 0, 0, 0, 0, 0, 0, 0];
        this.myGasCondensate.gasCondensate2[i][0] = this.gasCondensate2Sheet.getValue('A' + (i+1));
        this.myGasCondensate.gasCondensate2[i][1] = this.gasCondensate2Sheet.getValue('B' + (i+1));
        this.myGasCondensate.gasCondensate2[i][2] = this.gasCondensate2Sheet.getValue('C' + (i+1));
        this.myGasCondensate.gasCondensate2[i][3] = this.gasCondensate2Sheet.getValue('D' + (i+1));
        this.myGasCondensate.gasCondensate2[i][4] = this.gasCondensate2Sheet.getValue('E' + (i+1));
        this.myGasCondensate.gasCondensate2[i][5] = this.gasCondensate2Sheet.getValue('F' + (i+1));
        this.myGasCondensate.gasCondensate2[i][6] = this.gasCondensate2Sheet.getValue('G' + (i+1));
        this.myGasCondensate.gasCondensate2[i][7] = this.gasCondensate2Sheet.getValue('H' + (i+1));
      }

      await store.dispatch('project/saveGasCondensate', this.myGasCondensate)
    },
    onPrintGraph: async function(event) {
      console.log("printing..");
      this.isLoading = true
      // svg.saveSvgAsPng(document.getElementById('plot').firstChild, 'diagram.png');

      const el = document.getElementById('plot');
      const options = { type: "dataURL" };

      const printCanvas = await html2canvas(el, options);
      const link = document.createElement("a");
      link.setAttribute("download", "download.png");
      link.setAttribute(
        "href",
        printCanvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();

      this.isLoading = false
      console.log("done");
    },
    onApplyColor: function(event) {
      document.documentElement.style.setProperty('--axis-color', this.axisColor);
      document.documentElement.style.setProperty('--graph-color', this.graphColor);
      this.onShow(null);
    },
    onShow: function(event) {
      
      // ----------------------------------------------------------
      // Validation
      // ----------------------------------------------------------

      if (this.axisX == null || this.axisY.length == 0) {
        var modal = document.getElementById("plotModal");
        modal.style.display = "block";
        return;
      }

      // ----------------------------------------------------------
      // Initialize variables
      // ----------------------------------------------------------
      document.documentElement.style.setProperty('--axis-color', this.axisColor);
      document.documentElement.style.setProperty('--secondary-color', this.graphColor);

      var axisX = this.axisX.name
      var columns = [
              // ['P (psia)', 5114, 4000, 3000, 2000, 1000],
              // ['Bo (rb/stb)', 5.094, 5.094, 1.66, 1.409, 1.219],
              // ['Oil Viscosity (cp)', 0.062, 0.062, 0.4781, 0.7746, 1.0295],
              // ['RS (scf/stb)', 7479.4, 7479.4, 1778.9, 1075.8, 596.4],
              // ['Bg (rb/mscf)', 0.681, 0.681, 0.958, 1.376, 2.636],
            ]
      var axes = {}
      var ylabel = null
      var ylabel2 = null

      // ----------------------------------------------------------
      // Start HERE
      // ----------------------------------------------------------
      var numRows = this.gasCondensate2Sheet.options.data.length;
      
      // ----------------------------------------------------------------
      // add x data
      columns[0] = []
      columns[0][0] = this.axisX.name
      for (let index = 1; index <= numRows; index++) {
        columns[0][index] = this.gasCondensate2Sheet.getValue(this.axisX.column + '' + index)        
      }
      
      // ----------------------------------------------------------------
      // add y data
      const fWords = this.axisX.name.split('(');
      const bWords = this.axisY.name.split('(');

      columns[1] = []
      columns[1][0] = fWords[0] + " vs " + bWords[0]
      for (let index = 1; index <= numRows; index++) {
        columns[1][index] = this.gasCondensate2Sheet.getValue(this.axisY.column + '' + index)        
      }
      ylabel = this.axisY.name

      // ----------------------------------------------------------------
      // add y data : removed multiple axis Y
      // ----------------------------------------------------------------
      // var maxY = 0
      // for (let i = 0; i < this.axisY.length; i++) {

      //   columns[i+1] = []
      //   columns[i+1][0] = this.axisY[i].name
      //   for (let j = 1; j <= numRows; j++) {
      //     columns[i+1][j] = this.gasCondensate2Sheet.getValue(this.axisY[i].column + '' + j)

      //     if (maxY < columns[i+1][j]) {
      //       ylabel = this.axisY[i].name
      //       maxY = columns[i+1][j]
      //     }
      //   }
      // }

      // ----------------------------------------------------------------
      // add y2 data : removed axis Y2
      // ----------------------------------------------------------------
      // if (this.axisY2 != null) {
      //   columns[this.axisY.length+1] = []
      //   columns[this.axisY.length+1][0] = this.axisY2.name
      //   for (let j = 1; j <= numRows; j++) {
      //     columns[this.axisY.length+1][j] = this.gasCondensate2Sheet.getValue(this.axisY2.column + '' + j)
      //   }

      //   axes[this.axisY2.name] = 'y2'
      //   ylabel2 = this.axisY2.name
      // }

      this.updatePlot(axisX, columns, axes, ylabel, ylabel2);
    },
    updatePlot: function(_axisX, _columns, _axes, _ylabel, _ylabel2) {
      this.plot = c3.generate({
          bindto: '#plot',
          size: {
              height: 800,
          },
          data: {
            x: _axisX,
            columns: _columns,
            axes: _axes,
          },
          color: {
            pattern: [ this.graphColor]
          },
          legend: {
            position: 'inset',
            inset: {
              anchor: 'top-left',
              x: 20,
              y: 40,
            },
          },
          axis: {
            x: {
              height: 55,
              label: {
                text: _axisX,
                position: 'outer-center'
              }
            },
            y: {
              label: {
                text: _ylabel,
                position: 'outer-middle'
              }
            },
            y2: {
              show: _ylabel2 != null, // ADD
              label: {
                text: _ylabel2,
                position: 'outer-middle'
              }
            }
          }
      });
    },
    validateCvd1: function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isCvd1Validate = true
      }

      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isCvd1Validate = false
      }
      else {
        this.markNormalCell(cell)
      }

    },
    validateCvd2: function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isCvd2Validate = true
      }

      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isCvd2Validate = false
      }
      else {
        this.markNormalCell(cell)
      }

    },
    validateGasCondensate1: function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isGasCondensate1Validate = true
      }

      if ((isNaN(value) == true) || (value < 0) ||
          (cellName == 'B1' && (value > 1)) ) 
      {
        this.markInvalidCell(cell)
        this.isGasCondensate1Validate = false
      }
      else {
        this.markNormalCell(cell)
      }

    },
    validateGasCondensate2: function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isGasCondensate2Validate = true
      }

      if ((isNaN(value) == true) || (value < 0)) 
      {
        this.markInvalidCell(cell)
        this.isGasCondensate2Validate = false
      }
      // else if (col == 7 && value > 100) {
      //   this.markInvalidCell(cell)
      //   this.isGasCondensate2Validate = false
      // }
      else {
        this.markNormalCell(cell)
      }

    },
  },

  mounted() {
    this.myGasCondensate = this.gascondensate
    document.documentElement.style.setProperty('--axis-color', '#ffffff');
    document.documentElement.style.setProperty('--graph-color', '#ffbb78');

    //
    // CVD Data
    //
    let cvdSheetData1 = []
    if (this.myGasCondensate != null && this.myGasCondensate.cvdData1 != null)
      cvdSheetData1.push(this.myGasCondensate.cvdData1)
    else
      cvdSheetData1.push([,,,,,,,])

    this.cvdData1Sheet = jspreadsheet(document.getElementById('cvdData1Sheet'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:cvdSheetData1,
        columns: [
            {
                type: 'numeric',
                title:'Psc (psia)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Tsc (F)',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'T (F)',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gi (mscf)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Rvi (Stb/mmscf)',
                width: 220,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Specific Gravity Of Oil',
                width: 270,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Specific Gravity Of Gas',
                width: 270,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Z-Factor Of Gas',
                width: 200,
                decimal:','
            },
        ],
        updateTable: this.validateCvd1,
    });
    this.cvdData1Sheet.hideIndex();

    let cvdSheetData2 = []
    if (this.myGasCondensate != null && this.myGasCondensate.cvdData2 != null) {
      this.myGasCondensate.cvdData2.forEach(element => {
        cvdSheetData2.push(element)      
      });
    }
    else
      cvdSheetData2.push([])

    this.cvdData2Sheet = jspreadsheet(document.getElementById('cvdData2Sheet'), {
        allowInsertRow:true,
        allowManualInsertRow:true,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:true,
        allowDeleteColumn:false,
        data:cvdSheetData2,
        columns: [
            {
                type: 'numeric',
                title:'P (psia)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gp (mscf)',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Np (stb)',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Z',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Z-2 phase',
                width: 180,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Vo',
                width: 120,
                decimal:','
            },
        ],
        updateTable: this.validateCvd2,
    });
    this.cvdData2Sheet.hideIndex();


    // var gasCondensate1Data = [
    //   // [,],
    //   [5114.0, 0.1]
    // ];

    let gasCondensate1Data = []
    if (this.myGasCondensate != null && this.myGasCondensate.gasCondensate1 != null)
      gasCondensate1Data.push(this.myGasCondensate.gasCondensate1)
    else
      gasCondensate1Data.push([,])

    this.gasCondensate1Sheet = jspreadsheet(document.getElementById('gasCondensate1Sheet'), {
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        data:gasCondensate1Data,
        columns: [
            {
                type: 'numeric',
                title:'PSAT (psia)',
                width: 180,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Swi',
                width: 120,
                decimal:','
            },
        ],
        updateTable: this.validateGasCondensate1,
    });
    this.gasCondensate1Sheet.hideIndex();

    // var gasCondensate2Data = [
    //   // [,,,,,,,],
    //   // [,,,,,,,],
    //   // [,,,,,,,],
    //   // [,,,,,,,],
    //   // [,,,,,,,]
    //   [5114.0, 5.094, 7479.4, 0.681, 133.7, 0.0620, 0.0620, 0.0],
    //   [4000.0, 5.094, 7479.4, 0.681, 133.7, 0.0620, 0.0620, 0.0],
    //   [3000.0, 1.660, 1778.9, 0.958, 57.1,  0.4781, 0.0222, 0.0],
    //   [2000.0, 1.409, 1075.8, 1.376, 31.2,  0.7746, 0.0166, 0.0],
    //   [1000.0, 1.219, 596.4,  2.636, 25.8,  1.0295, 0.0148, 0.0]
    // ];

    let gasCondensate2Data = []
    if (this.myGasCondensate != null && this.myGasCondensate.gasCondensate2 != null) {
      this.myGasCondensate.gasCondensate2.forEach(element => {
        gasCondensate2Data.push(element)      
      });
    }
    else
      gasCondensate2Data.push([],[],[])


    this.gasCondensate2Sheet = jspreadsheet(document.getElementById('gasCondensate2Sheet'), {
        allowInsertRow:true,
        allowManualInsertRow:true,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:true,
        allowDeleteColumn:false,
        data:gasCondensate2Data,
        columns: [
            {
                type: 'numeric',
                title:'P (psia)',
                width: 140,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Bo (rb/stb)',
                width: 160,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Rs (scf/stb)',
                width: 180,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Bg (rb/mscf)',
                width: 200,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Rv (stb/mmscf)',
                width: 200,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Oil Viscosity (cp)',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Gas Viscosity (cp)',
                width: 240,
                decimal:','
            },
            {
                type: 'numeric',
                title:'PV Inj (%)',
                width: 150,
                decimal:','
            },
        ],
        updateTable: this.validateGasCondensate2,
    });
    this.gasCondensate2Sheet.hideIndex();

    mountPlotDialog();
  }

}

function mountPlotDialog() {

  // Get the modal
  var modal = document.getElementById("plotModal");

  // Get the <span> element that closes the modal
  var span = document.getElementById("plot-gf-close");

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

#plot {
  background: green;
}
</style>