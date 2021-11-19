import Vue from 'vue'
import VueGoodTablePlugin from 'vue-good-table'
import VueConfirmDialog from 'vue-confirm-dialog'

Vue.use(VueGoodTablePlugin)
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)