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

              <vue-confirm-dialog></vue-confirm-dialog>
              <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
              
                <p class="gf-item">Remove Projects and Plots</p>
                
                <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
                  <p class="gf-item">Project List</p>
                  <vue-good-table :columns="projectColumns" :rows="projectList" 
                                  max-height="300px"                      
                                  :search-options="{enabled: true}"
                                  :fixed-header="true"
                                  :pagination-options="{enabled: true,mode: 'pages'}">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'action'">
                        <label class="btn btn-danger" v-on:click="onDeleteProject(props.row)">Delete</label>
                      </span>
                    </template>
                  </vue-good-table>
                </div>

                <div style="display:flex;margin-bottom:6px;text-align:left;margin-top:20px" class="row">
                  <p class="gf-item">Plot List</p>
                  <vue-good-table :columns="plotColumns" :rows="allPlotNames" 
                                  max-height="300px"                      
                                  :search-options="{enabled: true}"
                                  :fixed-header="true"
                                  :pagination-options="{enabled: true,mode: 'pages'}">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'action'">
                        <label class="btn btn-danger" v-on:click="onDeletePlot(props.row)">Delete</label>
                      </span>
                    </template>
                  </vue-good-table>
                </div>

              </div>
              <div style="margin-top:32px;display:flex;text-align:left">
                <label class="btn btn-primary gf-button" style="margin-top:48px" v-on:click="onGoHome">Home</label>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  </div>


</template>

<script>
import Form from 'vform'
import store from '~/store'
import { mapState } from 'vuex'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  middleware: ['auth', 'theme'],

  components: {
    Loading
  },

  metaInfo () {
    return { title: 'settings' }
  },

  data() {
    return {
      isLoading: false,
      fullPage: true,
      allPlotNames: [],
      projectColumns: [
          {
              label:'Id',
              field:'id',
              width:'50px',
          },
          {
              label:'Project Name',
              field:'name',
              width:'80px',
          },
          {
              label:'Action',
              field:'action',
              width:'80px',
          },
      ],
      plotColumns: [
          {
              label:'Id',
              field:'id',
              width:'50px',
          },
          {
              label:'Created',
              field:'group',
              width:'80px',
          },
          {
              label:'Plot Name',
              field:'name',
              width:'80px',
          },
          {
              label:'Action',
              field:'action',
              width:'80px',
          },
      ],
    }
  },
  computed:{
    ...mapState({
      projectList : state => state.project.projectList
    }),
  },

  async mounted () {
    this.isLoading = true
    await store.dispatch('project/listProjects')
    this.allPlotNames = await store.dispatch('project/listPlots')
    this.isLoading = false
  },

  methods: {
    onGoHome() {
      this.$router.replace('home')
    },
    async onDeleteProject(row) {
      this.$confirm({
        message: 'Are you sure to remove this project: "' + row.name + '"?',
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: async confirm => {
          if (confirm) {
            let result = await store.dispatch('project/deleteProject', row)
            this.$router.go()
          }
        }
      })
    },
    async onDeletePlot(row) {
      this.$confirm({
        message: 'Are you sure to remove this plot: "' + row.name + '"?',
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: async confirm => {
          if (confirm) {
            let result = await store.dispatch('project/deletePlot', row)
            this.$router.go()
          }
        }
      })
    }
  }
}

</script>