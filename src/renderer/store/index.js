import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import VueGoodTablePlugin from 'vue-good-table'
import VueConfirmDialog from 'vue-confirm-dialog'
import 'vue-good-table/dist/vue-good-table.css'

Vue.use(VueGoodTablePlugin)
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage, 
});

// Load store modules dynamically.
const requireContext = require.context('./modules', false, /.*\.js$/)

const modules = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
  )
  .reduce((modules, [name, module]) => {
    if (module.namespaced === undefined) {
      module.namespaced = true
    }

    return { ...modules, [name]: module }
  }, {})

export default new Vuex.Store({
  modules,
  plugins: [vuexLocalStorage.plugin]
})
