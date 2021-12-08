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
              <h3 class="card-title gf-title">Plots for Multiple Realisations
              </h3>
              <p class="card-text" style="font-size: 2.4rem !important;text-align: center !important;"><u>Select plots</u></p>

              <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
                <div id="plotSheet"></div>
              </div>

              <hr class="gf-line">

              <div style="display:flex;margin-bottom:6px;text-align:center" class="row">
                <div class="col-3">
                  <label class="typo__label gf-item">Axis X:</label>
                  <multiselect v-model="axisX" :options="optionsX" track-by="name" label="name" :taggable="true" placeholder="Select X axis."></multiselect>
                  <label class="typo__label gf-item">Axis Y:</label>
                  <multiselect v-model="axisY" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select Y axis."></multiselect>
                  <label class="typo__label gf-item">Axis Y2:</label>
                  <multiselect v-model="axisY2" :options="options" track-by="name" label="name" :taggable="true" placeholder="Select Y2 axis."></multiselect>

                  <div style="margin-top:32px;display:flex;text-align:left">
                      <input type="color" style="height:50px;margin-right:20px;" id="axisColor" name="axisColor" v-model="axisColor" @change="onApplyColor($event)">
                      <label for="axisColor" class="typo__label gf-item">Axis Color</label>
                  </div>

                <div style="margin-top:32px;max-height:200px;overflow-y:scroll;overflow-x:hidden">
                    <div style="display:flex;text-align:left;margin-bottom:4px" v-for="entry in selectedPlots" :key='entry[0]'>
                      <input v-show="entry!=undefined && entry != ''" type="color" style="min-width:50px;height:50px;margin-right:20px;" :id="'graphColor' + entry" 
                        :name="'graphColor' + entry" v-model="graphColor[entry[0]]" @change="onApplyColor($event)">
                      <label v-show="entry!=undefined && entry != ''" :for="'graphColor' + entry" class="typo__label gf-item">{{graphColorNames["" + entry[0]]}}</label>
                    </div>
                </div>

                </div>
                <div class="col-2">
                  <label class="btn btn-primary gf-button" style="margin-top:48px" v-on:click="onShow">Graph</label>
                  <label class="btn btn-primary gf-button" style="margin-top:32px" v-on:click="onPrintGraph">Print Graph</label>
                </div>
                <div id="plot4" class="col-7" ref="plot4">
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <label class="btn btn-primary gf-button" v-on:click="onPrevPage">Previous</label>
                <div>
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
        <p class="gf-comment" style="margin-top:6px !important; margin-bottom:6px !important;">Plots for past projects</p>
        <span style="font-size: 1.25rem">Do you want to exit?</span>
        <div style="margin-bottom:16px;margin-top:16px">
          <label class="btn btn-primary gf-button" v-on:click="onYes">Yes</label>
          <label class="btn btn-primary gf-button" v-on:click="onNo">No</label>
        </div>
      </div>
    </div>

    <div id="messageModal" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close" id="gf-exit-cancel-message">&times;</span>
        </div>
        <p class="gf-comment" style="margin-top:6px !important; margin-bottom:6px !important;">Plots for past projects</p>
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
  name: 'Plots',
  middleware: 'auth',

  metaInfo () {
    return { title: this.$t('Plots') }
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
      dataContent: '',
      axisX: { name: "Time (Year)", index: 0},
      axisY: null,
      axisY2: null,
      axisColor: '#ffffff',
      plotSheet: null,
      selectedPlots: [[]],
      allPlotNames : [],
      graphColor: [],
      graphColorNames: [],
      optionsX: [
        { name: "Time (Year)", index: 0}, 
      ],
      options: [
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
      ],
      graphData: [],
      previousPage: '',
      messageName: '',
      messageDescription: ''
    }
  },

  computed: {
    ...mapState({
    }),
  },

  methods: {
    plotNameFromId: function(id) {
      let plotName = '';
      this.allPlotNames.forEach(element => {
        if (element.id == id)
          plotName = element.name;
      });
      return plotName;
    },
    onApplyColor: function(event) {
      this.onShow(null)
    },
    onShow: async function(event) {

      let isEmpty = true
      this.selectedPlots.forEach(element => {
        if (element[0] != '')
          isEmpty = false
      })

      if (isEmpty == true) {
        this.messageName = 'Warning'
        this.messageDescription = 'Please choose plots'
        this.showDialog('messageModal', true);
        return;
      }

      if (this.axisX == null || this.axisY == null || this.axisY2 == null) {
        this.messageName = 'Warning'
        this.messageDescription = 'Please select the axis X, Y or Y2.'
        this.showDialog('messageModal', true);
        return;
      }

      console.log(this.selectedPlots)
      console.log(this.axisX)
      console.log(this.axisY)

      this.isLoading = true
      const data = await store.dispatch('project/runMultiPlot', {
        selectedPlots: this.selectedPlots,
        axisX: this.axisX,
        axisY: this.axisY,
        axisY2: this.axisY2
      })
      this.isLoading = false

      console.log(data)

      // calculate plot color
      let plotColor = []
      // for Y, Y2 pair
      this.selectedPlots.forEach(element => {
        plotColor.push(this.graphColor[element[0]])
        plotColor.push(this.graphColor[element[0]])
      });
      
      // calculate axes
      let axes = {}
      for (const selectedPlot of this.selectedPlots) {
        const plotname = this.plotNameFromId(selectedPlot[0])
        axes[plotname + ':' + this.axisY2.name] =  'y2'
      }

      // calculate y2max value
      let _y2Max = 100
      if (data.length >= 3) {
        for (let j = 0; j < data.length / 2; j++) {
          for (let i = 1; i< data[j*2].length; i++) {
            if (_y2Max < data[j*2][i]) 
              _y2Max = data[j*2][i]
          }
        }
      }

      _y2Max = _y2Max * 1.2 // adjust height

      // calculate y2region
      let y2classes = {}
      for (const selectedPlot of this.selectedPlots) {
        const plotname = this.plotNameFromId(selectedPlot[0])
        y2classes[plotname + ':' + this.axisY2.name] =  'dotted'
      }

      this.updatePlot(this.axisX.name, data, axes, this.axisY.name, this.axisY2.name, plotColor, _y2Max, y2classes)
    },
    updatePlot: function(_axisX, _columns, _axes, _ylabel, _ylabel2, plotColor, _y2Max, _y2classes) {
      let plotOptions = {
          bindto: '#plot4',
          size: {
              height: 800,
          },
          data: {
            x: _axisX,
            columns: _columns,
            axes: _axes,
            type: this.type,
            classes: _y2classes
          },
          color: {
            pattern: plotColor
          },
          legend: {
            show: false,
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
              max: _y2Max,
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

      const el = document.getElementById('plot4');
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
    onYes: function(event) {
      // hide exit dialog
      this.showDialog('exitModal', false);

      // go to home vue
      this.$router.replace('home')
    },
    onNo: function(event) {
      // hide exit dialog
      this.showDialog('exitModal', false);

    },
    onExitPage: function (event) {
      this.isSaveAs = false
      this.hideSaveAsButton = false

      this.showDialog('exitModal', true);
    },
    onPrevPage: function(event) {
      this.$router.replace('home')
    },
    updatePlotSheet: function(instance, cell, x, y, value) {
      var numRows = this.plotSheet.options.data.length;
      if (y == numRows - 1) {
        instance.jexcel.insertRow()
      }

      this.selectedPlots = []
      this.plotSheet.options.data.forEach(element => {
        if (element != '') {
          this.selectedPlots.push(element)

          let randomColor = Math.floor(Math.random()*16777215).toString(16);
          this.graphColor[element[0]] = '#' + randomColor
        }
      })
    }
  },
  async mounted() {
    this.isLoading = true
    this.allPlotNames = await store.dispatch('project/listPlots')
    this.isLoading = false

    this.allPlotNames.forEach(element => {
      this.graphColorNames["" + element.id] = element.name
    })

    console.log(this.allPlotNames)
    console.log(this.graphColorNames)

    this.plotSheet = jspreadsheet(document.getElementById('plotSheet'), {
        allowInsertRow:true,
        allowManualInsertRow:true,
        allowInsertColumn:false,
        allowManualInsertColumn:false,
        allowDeleteRow:true,
        allowDeleteColumn:false,
        data: this.selectedPlots,
        columns: [
            {
                type: 'dropdown',
                title: 'Plots',
                source : this.allPlotNames,
                width: 350,
            }
        ],
        onchange: this.updatePlotSheet
    });
    this.plotSheet.hideIndex();

    mountExitDialog();
    mountMessageDialog();
  },
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
#plot4 {
  background: var(--secondary-color);
}

</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.multiselect {
  max-width: 370px;
  /* margin: auto; */
}
</style>
