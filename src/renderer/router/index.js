import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../views/welcome.vue'
import Home from '../pages/projects/home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/welcome'},
    { path: '/welcome', component: Welcome},
    { path: '/home', name: 'home', component: Home },


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
