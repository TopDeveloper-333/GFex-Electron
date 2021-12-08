<template>
  <div class="row">
    <div class="m-auto">
    <loading :active.sync="isLoading" 
             :is-full-page="fullPage"></loading>
    <form>
      <div class="card mb-3">
        <div class="card-header gf-header">
          <img src="../../assets/image/LOGO_GFEX.png" style="max-width:150px;max-height:180px;margin-left:-7px;float:left">
          <div style="margin:auto">FastPlan* Gas & Gas Condensate<br>
            <p style="font-size:3rem !important">Conventional and Shale Reservoirs</p>
          </div>
        </div>
        <div class="row g-0" style="background-color:var(--background-color);">
          <!-- <div class="col-md-4" style="display:flex; justify-content:center;">
            <img src="../../assets/image/LOGO_GFEX.png" class="img-fluid rounded-start" style="opacity:0.6;max-width:250px;max-height:300px">
          </div> -->
          <div class="col-md-8 offset-md-2">
            <div class="card-body">
              <h3 class="card-title gf-title text-wrap" >Project Management</h3>
              <p class="card-text gf-comment"></p>
              <hr class="gf-line">

              <div class="row">
                <div class="col-5">
                  <label class="gf-item">New Project
                  </label>

                  <div style="display:flex;align-items:center;margin-bottom:16px;margin-top:16px">
                    <input class="form-control gf-control" maxlength="20" v-model="myProjectName" placeholder="Non Empty">
                  </div>

                  <div>
                    <label class="btn btn-primary gf-button" v-on:click="onCreatePage">Create</label>
                  </div>

                  <label class="gf-item" style="margin-top:30px">Existing Projects
                  </label>

                  <div style="display:flex;align-items:center;margin-bottom:16px;margin-top:16px">
                    <multiselect v-model="existProject" :options="options" track-by="id" label="name" placeholder="Please select project name"></multiselect>
                  </div>

                  <div>
                    <label class="btn btn-primary gf-button" v-on:click="onOpenPage">Open</label>
                  </div>

                </div>
                <div class="col-2"></div>
                <div class="col-5">

                  <label class="gf-item">Plot for past projects
                  </label>

                  <div>
                    <label class="btn btn-primary gf-button" v-on:click="onGoPlots">Go</label>
                  </div>

                  <label class="gf-item" style="margin-top:40px">Remove projects or plots
                  </label>

                  <div>
                    <label class="btn btn-primary gf-button" v-on:click="onRemoveProjects">Go</label>
                  </div>

                  <label class="gf-item" style="margin-top:40px">Change theme colors
                  </label>

                  <div>
                    <label class="btn btn-primary gf-button" v-on:click="onChangeTheme">Go</label>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div id="issueModal" class="gf-modal">
      <div class="gf-modal-content">
        <div class="gf-modal-header">
          <span class="gf-comment" style="margin-left:30px;color:white">FastPlan* Gas & Gas Condensate</span>
          <span class="gf-close">&times;</span>
        </div>
        <p style="font-size: 1.25rem;margin-top:20px">{{description}}</p>
        <div style="margin-bottom:16px;margin-top:16px">
          <label class="btn btn-primary gf-button" v-on:click="onOK">OK</label>
        </div>
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

// import axios from 'axios'
export default {
  middleware: 'auth',

  components: {
    Multiselect,
    Loading
  },

  metaInfo () {
    return { title: this.$t('Project Management') }
  },

  data() {
    return {
      myProjectName : "",
      existProject: null,
      isLoading: false,
      fullPage: true,
      description: "",
    }
  },

  computed: {
    ...mapState({
      projectList : state => state.project.projectList,
      backgroundColor : state => state.project.backgroundColor,
      primaryColor : state => state.project.primaryColor,
      secondaryColor : state => state.project.secondaryColor,
    }),
    options: function() {
      if (typeof(this.projectList) == 'string')
        return JSON.parse(this.projectList)
      else 
        return this.projectList
    }
  },

  methods: {
    onOK: function(event) {
      var modal = document.getElementById("issueModal");
      modal.style.display = "none";
    },
    onGoPlots: async function (event) {
      this.$router.replace({ name: 'multipleplots' })
    },
    onRemoveProjects: async function(event) {
      this.$router.replace({ name: 'settings.removeproject' })
    },
    onChangeTheme: async function(event) {
      this.$router.replace({ name: 'settings.theme' })
    },
    onCreatePage: async function(event) {
      if (this.myProjectName=="")
      {
        var modal = document.getElementById("issueModal");
        this.description = "Please input new project's name"
        modal.style.display = "block";
        return; 
      }

      this.isLoading = true
      await store.dispatch('project/createProject', this.myProjectName)
      this.isLoading = false

      this.$router.replace({ name: 'fastplan' })
    },
    onOpenPage: async function(event) {
      if (this.existProject==null || this.existProject == "")
      {
        var modal = document.getElementById("issueModal");
        this.description = "Please choose existing project's name"
        modal.style.display = "block";
        return; 
      }

      this.isLoading = true
      await store.dispatch('project/openProject', this.existProject)
      this.isLoading = false

      this.$router.replace({ name: 'fastplan' })
    }
  },
  async mounted() {
    document.documentElement.style.setProperty('--background-color', this.backgroundColor);
    document.documentElement.style.setProperty('--primary-color', this.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);

    this.isLoading = true
    await store.dispatch('project/listProjects')
    this.isLoading = false
    mountErrorDialog();
  }
}

function mountErrorDialog() {

  // Get the modal
  var modal = document.getElementById("issueModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("gf-close")[0];

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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
