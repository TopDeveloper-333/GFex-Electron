import { isFlowDeclaration } from '@babel/types'
import axios from 'axios'
import * as types from '../mutation-types'
import Cookies from 'js-cookie'

export const state = {
  projectList: [],
  projectName: "",
  projectId : -1,
  isFDP : "1",
  isCondensate: "1",
  isEconomics: true,
  isSeparatorOptimizer: false,
  sep : {},
  drygas : {},
  surface: {},
  reservoir: {},
  wellhistory: {},
  economics: {},
  operations: {},
  gascondensate : {},
  relPerm: {},
  resKGKO: [],
  resOPT: [],
  resFastPlan: {},
  resMonitoring: {},
  resCvdOut: []
}

function getCookie(name, defaultValue) {
  let value = Cookies.get(name)
  if (value === "true") 
    return true
  else if (value === "false")
    return false
  else if (value === undefined)
    return defaultValue
  else
    return value
}

export const getters = {
  projectName: state => state.projectName,
  projectId: state => state.projectId,
  isFDP : state => state.isFDP,
  isCondensate : state => state.isCondensate,
  isEconomics: state => state.isEconomics,
  isSeparatorOptimizer: state => state.isSeparatorOptimizer,
  sep : state => state.sep,
  drygas : state => state.drygas,
  surface: state => state.surface,
  reservoir: state => state.reservoir,
  wellhistory: state => state.wellhistory,
  economics: state => state.economics,
  operations: state => state.operations,
  gascondensate : state => state.gascondensate,
  relPerm: state => state.relPerm,
  resKGKO: state => state.resKGKO,
  resOPT: state => state.resOPT,
  resFastPlan: state => state.resFastPlan,
  resMonitoring: state => state.resMonitoring,
  resCvdOut: state => state.resCvdOut
}

export const mutations = {
  [types.SAVE_PROJECT_LIST] (state, projectList) {
    state.projectList = projectList
  },
  [types.LOAD_PROJECT] (state, {projectName, payload}) {
    debugger
    console.log('LOAD_PROJECT')
    state.projectName = projectName
    state.projectId = payload.id
    state.isFDP = payload.fastplan.isFDP
    state.isCondensate = payload.fastplan.isCondensate
    state.isEconomics = payload.fastplan.isEconomics
    state.isSeparatorOptimizer = payload.fastplan.isSeparatorOptimizer
    state.sep = payload.sep
    state.drygas = payload.drygas
    state.surface = payload.surface
    state.reservoir = payload.reservoir
    state.wellhistory = payload.wellhistory
    state.economics = payload.economics
    state.operations = payload.operations
    state.gascondensate = payload.gascondensate
    state.relPerm = payload.relPerm
    state.resKGKO = payload.resKGKO
    state.resOPT = payload.resOPT
  },
  [types.SAVE_PROJECT_TYPE] (state, {isFDP, isCondensate, isEconomics, isSeparatorOptimizer}) {
    state.isFDP = isFDP
    state.isCondensate = isCondensate
    state.isEconomics = isEconomics
    state.isSeparatorOptimizer = isSeparatorOptimizer
  },
  [types.SAVE_SEP] (state, sep) {
    state.sep = sep
  },
  [types.SAVE_DRY_GAS] (state, drygas) {
    state.drygas = drygas
  },
  [types.SAVE_SURFACE] (state, surface) {
    state.surface = surface
  },
  [types.SAVE_RESERVOIR] (state, reservoir) {
    state.reservoir = reservoir
  },
  [types.SAVE_WELLHISTORY] (state, wellhistory) {
    state.wellhistory = wellhistory
  },
  [types.SAVE_ECONOMICS] (state, economics) {
    state.economics = economics
  },
  [types.SAVE_OPERATIONS] (state, operations) {
    state.operations = operations
  },
  [types.SAVE_GAS_CONDENSATE] (state, gascondensate) {
    state.gascondensate = gascondensate
  },
  [types.SAVE_REL_PERM] (state, relPerm) {
    state.relPerm = relPerm
  },
  [types.UPDATE_RES_KGKO] (state, resKGKO) {
    debugger
    state.resKGKO = resKGKO
  },
  [types.SAVE_RES_KGKO] (state, resKGKO) {
    state.resKGKO = resKGKO
  },
  [types.SAVE_RES_CVDOUT] (state, resCvdOut) {
    state.resCvdOut = resCvdOut
  },
  [types.SAVE_RES_OPTIMIZER] (state, resOPT) {
    state.resOPT = resOPT
  },
  [types.SAVE_RES_FASTPLAN] (state, resFastPlan) {
    state.resFastPlan = resFastPlan
  },
  [types.SAVE_RES_MONITORING] (state, resMonitoring) {
    state.resMonitoring = resMonitoring
  },
}

export const actions = {
  async listProjects ({commit}) {
    const { data } = await axios.post('/api/listProjects')

    if (typeof(data) == 'string') {
      let payload = JSON.parse(data)
      commit(types.SAVE_PROJECT_LIST, payload)
    }
    else {
      let payload = data
      commit(types.SAVE_PROJECT_LIST, payload)
    }
  },
  async createProject ({commit}, projectName) {
    const { data } = await axios.post('/api/createProject', {'project': projectName})

    let payload = JSON.parse(data.content)
    payload.id = data.id
    commit(types.LOAD_PROJECT, {projectName, payload})

  },
  async openProject({commit}, project) {
    let id = project.id
    let projectName = project.name

    const { data } = await axios.post('/api/openProject', { 'id': id, 'project': projectName})

    let payload = JSON.parse(data.content)
    payload.id = data.id
    commit(types.LOAD_PROJECT, {projectName, payload})

  },
  async saveProject({commit}, payload) {
    const { data } = await axios.post('api/saveProject', payload)    
  },
  saveFastPlan ({commit}, payload) {
    const isFDP = payload.isFDP
    const isCondensate = payload.isCondensate
    const isEconomics = payload.isEconomics
    const isSeparatorOptimizer = payload.isSeparatorOptimizer
    commit(types.SAVE_PROJECT_TYPE, {isFDP, isCondensate, isEconomics, isSeparatorOptimizer})
  },
  async saveDryGas({commit}, dryGas) {
    commit(types.SAVE_DRY_GAS, dryGas)
  },
  async saveSurface({commit}, surface) {
    commit(types.SAVE_SURFACE, surface)
  },
  async saveReservoir({commit}, reservoir) {
    commit(types.SAVE_RESERVOIR, reservoir)
  },
  async saveWellHistory({commit}, wellhistory) {
    commit(types.SAVE_WELLHISTORY, wellhistory)
  },
  async saveEconomics({commit}, economics) {
    commit(types.SAVE_ECONOMICS, economics)
  },
  async saveOperations({commit}, operations) {
    commit(types.SAVE_OPERATIONS, operations)
  },
  async saveGasCondensate({commit}, gascondensate) {
    commit(types.SAVE_GAS_CONDENSATE, gascondensate)
  },
  async saveSEP({commit}, sep) {
    commit(types.SAVE_SEP, sep)
  },
  async saveRelPerm({commit}, relPerm) {
    commit(types.SAVE_REL_PERM, relPerm)
  },
  async saveResKGKO({commit}, resKGKO) {
    commit(types.UPDATE_RES_KGKO, resKGKO)
  },
  async fetchSEP ({commit}, sep) {
    const { data } = await axios.post('/api/requestOPT', sep)

    if (typeof (data) == 'string') {
      commit(types.SAVE_RES_OPTIMIZER, JSON.parse(data))
    }
    else {
      commit(types.SAVE_RES_OPTIMIZER, data)
    }
  },
  async fetchKGKO({commit}, relPerm) {
    commit(types.SAVE_REL_PERM, relPerm)
    const { data } = await axios.post('/api/requestKGKO', relPerm)

    if (typeof (data) == 'string') {
      commit(types.SAVE_RES_KGKO, JSON.parse(data))      
    }
    else {
      commit(types.SAVE_RES_KGKO, data)
    }    
  },
  async fetchCvdOut({commit}, cvd) {
    const { data } = await axios.post('/api/requestCvdOut', cvd)

    if (typeof (data) == 'string') {
      commit(types.SAVE_RES_CVDOUT, JSON.parse(data))      
    }
    else {
      commit(types.SAVE_RES_CVDOUT, data)
    }    
  },
  async runDryGasProject({commit}, payload) {
    const { data } = await axios.post('/api/runDryGas', payload)
    if (typeof (data) == 'string') {
      commit(types.SAVE_RES_FASTPLAN, JSON.parse(data))      
    }
    else {
      commit(types.SAVE_RES_FASTPLAN, data)
    }
  },
  async runMonitoringProject({commit}, payload) {
    const { data } = await axios.post('/api/runMonitoring', payload)
    if (typeof (data) == 'string') {
      commit(types.SAVE_RES_MONITORING, JSON.parse(data))      
    }
    else {
      commit(types.SAVE_RES_MONITORING, data)
    }
  },
  async runGasCondensateProject({commit}, payload) {
    const { data } = await axios.post('/api/runGasCondensate', payload)
    if (typeof (data) == 'string') {
      commit(types.SAVE_RES_FASTPLAN, JSON.parse(data))      
    }
    else {
      commit(types.SAVE_RES_FASTPLAN, data)
    }
  }

}