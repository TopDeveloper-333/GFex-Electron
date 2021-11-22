import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../views/welcome.vue'
import Home from '../pages/projects/home.vue'
import Fastplan from '../pages/projects/fastplan.vue'
import Condensate from '../pages/projects/condensate.vue'
import Drygas from '../pages/projects/drygas.vue'
import FastplanResult from '../pages/projects/fastplan_result.vue'
import MonitoringResult from '../pages/projects/monitoring_result.vue'
import Separator from '../pages/projects/separator.vue'
import SeparatorResult from '../pages/projects/separator_result.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/welcome'},
    { path: '/welcome', component: Welcome},
    { path: '/home', name: 'home', component: Home },
    { path: '/fastplan', name: 'fastplan', component: Fastplan},
    { path: '/condensate', name: 'condensate', component: Condensate },
    { path: '/drygas', name: 'drygas', component: Drygas },
    { path: '/fastplanresult', name: 'fastplanresult', component: FastplanResult },
    { path: '/monitoringresult', name: 'monitoringresult', component: MonitoringResult },
    { path: '/separator', name: 'separator', component: Separator },
    { path: '/separatorresult', name: 'separatorresult', component: SeparatorResult },
    

    { path: '*', redirect: '/welcome' },
  ],
})

// dynamically set application title to current view
router.afterEach((to) => {
  let title =
    to.path === '/home'
      ? process.env.PRODUCT_NAME
      : `${to.meta.title} - ${process.env.PRODUCT_NAME}`

  if (!title) {
    title = 'Home'
  }

  document.title = title
})

export default router
