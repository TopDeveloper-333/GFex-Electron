<template>
  <div>
    <loading :active.sync="isLoading" 
             :is-full-page="fullPage"></loading>
    <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Relative Permeability Data via Corey Function</u></p>

    <div>
      <label class="btn btn-primary gf-button" style="float:right;margin-left:10px" v-on:click="onPlot">{{plotLabel}}</label>
      <label class="btn btn-primary gf-button" style="float:right" v-on:click="onCalculate" v-show="bShowPlot == false">Calculate</label>
    </div>

    <div style="display:flex;margin-bottom:6px;text-align:center" class="row" v-show="bShowPlot == false">
      <div id="relativePermeabilitySheet"></div>
      <!-- <div id="responseKGKOSheet" v-show="bCalculate == true"></div> -->
      <div id="responseKGKOSheet" v-show="resKGKO!=null && resKGKO.length != 0"></div>
    </div>

    <div style="height:50px" v-show="bShowPlot == true">
    </div>

    <hr class="gf-line" v-show="bShowPlot == true">
    <div style="display:flex;margin-bottom:6px;text-align:center;min-height:600px" class="row" v-show="bShowPlot == true">
      <div class="col-3">
        <label class="typo__label gf-item">Axis X:</label>
        <multiselect v-model="axisX" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select X axis."></multiselect>
        <label class="typo__label gf-item">Axis Y:</label>
        <multiselect v-model="axisY" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select Y axis."></multiselect>
        <label class="typo__label gf-item">Axis Y2:</label>
        <multiselect v-model="axisY2" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select Y2 axis."></multiselect>

        <div style="margin-top:32px;display:flex;text-align:left">
            <input type="color" style="height:50px;margin-right:20px;" id="axisColor" name="axisColor" v-model="axisColor" @change="onApplyColor($event)">
            <label for="axisColor" class="typo__label gf-item">Axis Color</label>
        </div>

        <div style="margin-top:32px;display:flex;text-align:left">
            <input type="color" style="height:50px;margin-right:20px;" id="graphColor" name="graphColor" v-model="graphColor" @change="onApplyColor($event)">
            <label for="graphColor" class="typo__label gf-item">Curve1 Color</label>
        </div>

        <div style="margin-top:32px;display:flex;text-align:left">
            <input type="color" style="height:50px;margin-right:20px;" id="graph1Color" name="graph1Color" v-model="graph1Color" @change="onApplyColor($event)">
            <label for="graph1Color" class="typo__label gf-item">Curve2 Color</label>
        </div>

      </div>
      <div class="col-2">
        <label class="btn btn-primary gf-button" style="margin-top:48px" v-on:click="onShow">Graph</label>
        <label class="btn btn-primary gf-button" style="margin-top:32px" v-on:click="onPrintGraph">Print Graph</label>
      </div>
      <div id="plot2" class="col-7" ref="plot2">
      </div>
    </div>

    <div id="plotModal2" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close" id="plot-gf-close2">&times;</span>
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
<script>
import store from '~/store'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import html2canvas from 'html2canvas';

export default {
  name: 'RelativePermeability',
  middleware: 'auth',

  props: ['isHidden'],
  
  components: {
    Multiselect,
    Loading
  },

  data() {
    return {
      relativePermeabilitySheet: null,
      responseKGKOSheet: null,
      isRelPermValidate: true,
      bCalculate: false,
      bShowPlot : false,
      plotLabel: "Plot",
      axisX: null,
      axisY: null,
      axisY2: null,
      plot: null,
      axisColor: '#ffffff',
      graphColor: '#ffbb78',
      graph1Color: '#b9ff78',
      options: [
        { name: "Sg", column: 'A'}, 
        { name: "Krg", column: 'B'},
        { name: "Kro", column: 'C'}, 
      ],
      isLoading: false,
      fullPage: true,
      myRelPerm: {},
      myResKGKO: {}
    }
  },

  watch: {
    isRelPermValidate: function(val, oldVal) {
      if (this.isHidden == true)
        this.$emit('changedValidate', true)
      else  
        this.$emit('changedValidate', val)
    }
  },

  computed: {
    ...mapState({
      projectName : state => state.project.projectName,
      resKGKO : state => state.project.resKGKO,
      relPerm: state => state.project.relPerm,
    }),
  },

  methods: {
    onSavePage: async function(event) {
      console.log("RelPerm's onSavePage() is called")

      this.myRelPerm = {
        Sgi: 0, Krgl: 0, Kroi: 0, Sor : 0, Lambda: 2
      }

      this.myRelPerm.Sgi = this.relativePermeabilitySheet.getValue('A1')
      this.myRelPerm.Krgl = this.relativePermeabilitySheet.getValue('B1')
      this.myRelPerm.Kroi = this.relativePermeabilitySheet.getValue('C1')
      this.myRelPerm.Sor = this.relativePermeabilitySheet.getValue('D1')
      this.myRelPerm.Lambda = this.relativePermeabilitySheet.getValue('E1')

      this.myResKGKO = []
      var numRows = this.responseKGKOSheet.options.data.length;
      for (var i =0; i < numRows; i++) {
        this.myResKGKO[i] = [0, 0, 0];
        this.myResKGKO[i][0] = this.responseKGKOSheet.getValue('A' + (i+1));
        this.myResKGKO[i][1] = this.responseKGKOSheet.getValue('B' + (i+1));
        this.myResKGKO[i][2] = this.responseKGKOSheet.getValue('C' + (i+1));
      }

      await store.dispatch('project/saveRelPerm', this.myRelPerm)
      await store.dispatch('project/saveResKGKO', this.myResKGKO)

    },
    onOK: function(event) {
        var modal = document.getElementById("plotModal2");
        modal.style.display = "none";
    },
    onShow: function(event) {

      // ----------------------------------------------------------
      // Validation
      // ----------------------------------------------------------
      if (this.axisX == null || (this.axisY == null && this.axisY2 == null)) {
        var modal = document.getElementById("plotModal2");
        modal.style.display = "block";
        return;
      }

      // ----------------------------------------------------------
      // Initialize variables
      // ----------------------------------------------------------
      document.documentElement.style.setProperty('--axis-color', this.axisColor);
      document.documentElement.style.setProperty('--secondary-color', this.graphColor);

      var axisX = this.axisX.name
      var columns = []
      var axes = {}
      var ylabel = null
      var ylabel2 = null

      // ----------------------------------------------------------
      // Start HERE
      // ----------------------------------------------------------
      var numRows = this.responseKGKOSheet.options.data.length;

      // ----------------------------------------------------------------
      // add x data
      debugger
      columns[0] = []
      columns[0][0] = this.axisX.name
      for (let index = 1; index <= numRows; index++) {
        columns[0][index] = this.responseKGKOSheet.getValue(this.axisX.column + '' + index)        
      }

      // ----------------------------------------------------------------
      // add y data
      columns[1] = []
      columns[1][0] = this.axisX.name + " vs " + this.axisY.name
      for (let index = 1; index <= numRows; index++) {
        columns[1][index] = this.responseKGKOSheet.getValue(this.axisY.column + '' + index)        
      }
      ylabel = this.axisY.name

      // ----------------------------------------------------------------
      // add y2 data : removed axis Y2
      // ----------------------------------------------------------------
      if (this.axisY2 != null) {
        columns[2] = []
        columns[2][0] = this.axisX.name + " vs " + this.axisY2.name
        for (let j = 1; j <= numRows; j++) {
          columns[2][j] = this.responseKGKOSheet.getValue(this.axisY2.column + '' + j)
        }

        axes[this.axisY.name] = 'y'
        axes[this.axisY2.name] = 'y2'
        ylabel2 = this.axisY2.name
      }
      
      this.updatePlot(axisX, columns, axes, ylabel, ylabel2);

    },
    updatePlot: function(_axisX, _columns, _axes, _ylabel, _ylabel2) {
      debugger
      let plotOptions = {
          bindto: '#plot2',
          size: {
              height: 800,
          },
          data: {
            x: _axisX,
            columns: _columns,
            axes: _axes,
          },
          color: {
            pattern: [this.graphColor, this.graph1Color]
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
              max: 1,
              min: 0,
              padding: 0,
              label: {
                text: _ylabel,
                position: 'outer-middle'
              }
            },
            y2: {
              max: 1,
              min: 0,
              padding: 0,
              show: _ylabel2 != null, // ADD
              label: {
                text: _ylabel2,
                position: 'outer-middle'
              }
            }
          }
      }
      this.plot = c3.generate(plotOptions);
    },
    onPrintGraph: async function(event) {
      console.log("printing..");
      this.isLoading = true
      // svg.saveSvgAsPng(document.getElementById('plot').firstChild, 'diagram.png');

      const el = document.getElementById('plot2');
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
      document.documentElement.style.setProperty('--graph1-color', this.graph1Color);
      this.onShow(null);
    },
    onCalculate: async function(event) {

      this.isLoading = true

      let corey = {}
      corey.sgi = this.relativePermeabilitySheet.getValue('A1');
      corey.krgl = this.relativePermeabilitySheet.getValue('B1');
      corey.kroi = this.relativePermeabilitySheet.getValue('C1');
      corey.sor = this.relativePermeabilitySheet.getValue('D1');
      corey.lambda = this.relativePermeabilitySheet.getValue('E1');

      await store.dispatch('project/fetchKGKO', corey)

      this.responseKGKOSheet.setData(this.resKGKO)
      this.responseKGKOSheet.refresh()

      this.bCalculate = true
      this.isLoading = false

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
    validateRelPerm: function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)

      if (cellName == 'A1') {
        // this means start to update table
        this.isRelPermValidate = true
      }

      if ((isNaN(value) == true) || (value < 0) || 
          (col < 4 && !(value >=0 && value <=1) )) 
      {
        this.markInvalidCell(cell)
        this.isRelPermValidate = false
      }
      else {
        this.markNormalCell(cell)
      }

    },
  },

  mounted() {
    this.myRelPerm = this.relPerm
    this.myResKGKO = this.resKGKO

    // var relativePermeabilityData = [
    //   // [,],
    //   [0, 0.0, 1.0, 0.35, 2.0]
    // ];

    let relativePermeabilityData = []
    if (this.myRelPerm != null)
      relativePermeabilityData.push(this.myRelPerm)
    else
      relativePermeabilityData.push([,,,,])

    this.relativePermeabilitySheet = jspreadsheet(document.getElementById('relativePermeabilitySheet'), {
        data:relativePermeabilityData,
        allowInsertRow:false,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:false,
        allowDeleteColumn:false,
        columns: [
            {
                type: 'numeric',
                title:'Sgi',
                width: 90,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Krgl',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Kroi',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Sor',
                width: 100,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Lambda',
                width: 140,
                decimal:','
            },
        ],
        updateTable: this.validateRelPerm
    });
    this.relativePermeabilitySheet.hideIndex();

    let resKGKOData = []
    if (this.myResKGKO != null) {
      this.myResKGKO.forEach(element => {
        resKGKOData.push(element)      
      });
    }
    else
      resKGKOData.push([],[],[])

    this.responseKGKOSheet = jspreadsheet(document.getElementById('responseKGKOSheet'), {
        data:resKGKOData,
        allowInsertRow:true,
        allowManualInsertRow:false,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:true,
        allowDeleteColumn:false,
        tableOverflow: true,
        columns: [
            {
                type: 'numeric',
                title:'Sg',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Krg',
                width: 120,
                decimal:','
            },
            {
                type: 'numeric',
                title:'Kro',
                width: 120,
                decimal:','
            },
        ],
    });
    this.responseKGKOSheet.hideIndex();



    mountPlotDialog();
  }

}

function mountPlotDialog() {

  // Get the modal
  var modal = document.getElementById("plotModal2");

  // Get the <span> element that closes the modal
  var span = document.getElementById("plot-gf-close2");

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
#plot2 {
  background: green;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
