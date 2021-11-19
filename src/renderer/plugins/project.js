import Vue from 'vue'
import store from '~/store'

Vue.mixin({
  methods: {
    onSaveProject: async function() {
      debugger
      
      let payload = {}

      if (this.newProjectName != "") {
        payload.projectName = this.newProjectName
        payload.isSaveAs = true
      }
      else {
        payload.projectName = this.projectName
        payload.isSaveAs = false
      }

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      payload.relPerm = this.relPerm 
      payload.gascondensate = this.gascondensate
      payload.resKGKO = this.resKGKO
      await store.dispatch('project/saveProject', payload)
    },
    runDryGasProject: async function() {
      let payload = {}

      payload.projectName = this.projectName

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      // payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      // payload.relPerm = this.relPerm 
      // payload.resKGKO = this.resKGKO
      // payload.gascondensate = this.gascondensate
      await store.dispatch('project/runDryGasProject', payload)
    },
    runMonitoringProject: async function() {
      let payload = {}

      payload.projectName = this.projectName

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      // payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      // payload.relPerm = this.relPerm 
      // payload.resKGKO = this.resKGKO
      // payload.gascondensate = this.gascondensate
      await store.dispatch('project/runMonitoringProject', payload)
    },
    runGasCondensateProject: async function() {
      let payload = {}

      payload.projectName = this.projectName

      payload.projectId = this.projectId
      payload.isFDP = this.isFDP
      payload.isCondensate = this.isCondensate
      payload.isEconomics = this.isEconomics
      payload.isSeparatorOptimizer = this.isSeparatorOptimizer
      payload.sep = this.sep
      payload.drygas = this.drygas
      payload.surface = this.surface
      payload.reservoir = this.reservoir
      // payload.wellhistory = this.wellhistory
      payload.economics = this.economics
      payload.operations = this.operations
      payload.relPerm = this.relPerm 
      payload.resKGKO = this.resKGKO
      payload.gascondensate = this.gascondensate
      await store.dispatch('project/runGasCondensateProject', payload)
    },
  }
})