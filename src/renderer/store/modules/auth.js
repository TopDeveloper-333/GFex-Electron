import axios from 'axios'
import Cookies from 'js-cookie'
import * as types from '../mutation-types'

// state
export const state = {
  user: null,
  users: {},
  token: Cookies.get('token')
}

// getters
export const getters = {
  user: state => state.user,
  users: state => state.users,
  token: state => state.token,
  check: state => state.user !== null
}

// mutations
export const mutations = {
  [types.SAVE_TOKEN] (state, { token, remember }) {
    state.token = token
    Cookies.set('token', token, { expires: remember ? 365 : null })
  },

  [types.FETCH_USER_SUCCESS] (state, { user }) {
    state.user = user
  },

  [types.FETCH_USER_FAILURE] (state) {
    state.token = null
    Cookies.remove('token')
  },

  [types.LOGOUT] (state) {
    state.user = null
    state.token = null

    Cookies.remove('token')
  },

  [types.UPDATE_USER] (state, { user }) {
    state.user = user
  },

  [types.FETCH_GETUSERS_SUCCESS] (state, users) {
    state.users = users
  }
}

// actions
export const actions = {
  saveToken ({ commit, dispatch }, payload) {
    commit(types.SAVE_TOKEN, payload)
  },

  async fetchUser ({ commit }) {
    try {
      const { data } = await axios.get('/api/user')

      commit(types.FETCH_USER_SUCCESS, { user: data })
    } catch (e) {
      commit(types.FETCH_USER_FAILURE)
    }
  },

  async fetchUsers({ commit }, page) {
    try {
      const { data } = await axios.post('/api/getUsers', {'page' : page})      
      if (typeof(data) == 'string') {
        let payload = JSON.parse(data)
        commit(types.FETCH_GETUSERS_SUCCESS, payload)
      }
      else {
        let payload = data
        commit(types.FETCH_GETUSERS_SUCCESS, payload)
      }
    } catch (e) {
      console.log('parse isse')
      commit(types.FETCH_GETUSERS_SUCCESS, [])
    }
  },

  async addUser({ commit }, newUser) {
    try {
      const { data } = await axios.post('/api/adduser', newUser)
      if (typeof(data) == 'string') {
        return JSON.parse(data)
      }
      else {
        return data
      }
    } catch (e) {
      console.log(e)
    }

    return { 'message' : 'The unknown error happened'}
  },

  async removeUser({commit}, existUser) {
    try {
      const { data } = await axios.post('/api/removeuser', existUser)
      return true
    } catch (e) {
      console.log(e)
    }

    return { 'message' : 'The unknown error happened'}
  },

  async updateOtherUser({ commit }, updateUser) {
    try {
      const { data } = await axios.patch('/api/updateuser', updateUser)
      if (typeof(data) == 'string') {
        return JSON.parse(data)
      }
      else {
        return data
      }
    } catch (e) {
      console.log(e)
    }

    return { 'message' : 'The unknown error happened'}
  },

  updateUser ({ commit }, payload) {
    commit(types.UPDATE_USER, payload)
  },

  async logout ({ commit }) {
    try {
      await axios.post('/api/logout')
    } catch (e) { }

    commit(types.LOGOUT)
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await axios.post(`/api/oauth/${provider}`)

    return data.url
  }
}
