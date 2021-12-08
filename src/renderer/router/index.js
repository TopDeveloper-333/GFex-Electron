import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../views/welcome.vue'
import Home from '../pages/projects/home.vue'
import Fastplan from '../pages/projects/fastplan.vue'
import Condensate from '../pages/projects/condensate.vue'
import Drygas from '../pages/projects/drygas.vue'
import FastplanResult from '../pages/projects/fastplan_result.vue'
import MonitoringResult from '../pages/projects/monitoring_result.vue'
import MonitoringResult2 from '../pages/projects/monitoring_result2.vue'
import Separator from '../pages/projects/separator.vue'
import SeparatorResult from '../pages/projects/separator_result.vue'
import Plots from '../pages/projects/plots.vue'
import Theme from '../pages/settings/theme.vue'
import RemoveProject from '../pages/settings/removeproject.vue'

Vue.use(Router)

// Load middleware modules dynamically.
const globalMiddleware = []
const routeMiddleware = resolveMiddleware(
  require.context('../middleware', false, /.*\.js$/)
)

const router = new Router({
  routes: [
    { path: '/', redirect: '/welcome'},
    { path: '/welcome', name:'welcome', component: Welcome},
    { path: '/home', name: 'home', component: Home },
    { path: '/fastplan', name: 'fastplan', component: Fastplan},
    { path: '/condensate', name: 'condensate', component: Condensate },
    { path: '/drygas', name: 'drygas', component: Drygas },
    { path: '/fastplanresult', name: 'fastplanresult', component: FastplanResult },
    { path: '/monitoringresult', name: 'monitoringresult', component: MonitoringResult },
    { path: '/monitoringresult2', name: 'monitoringresult2', component: MonitoringResult2 },
    { path: '/separator', name: 'separator', component: Separator },
    { path: '/separatorresult', name: 'separatorresult', component: SeparatorResult },
    { path: '/multipleplots', name: 'multipleplots', component: Plots },
    { path: '/theme', name: 'settings.theme', component: Theme },
    { path: '/removeproject', name: 'settings.removeproject', component: RemoveProject },

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

router.beforeEach(async (to, from, next) =>  {
  let components = []

  try {
    // Get the matched components and resolve them.
    components = await resolveComponents(
      router.getMatchedComponents({ ...to })
    )
  } catch (error) {
    if (/^Loading( CSS)? chunk (\d)+ failed\./.test(error.message)) {
      window.location.reload(true)
      return
    }
  }

  if (components.length === 0) {
    return next()
  }

  // Get the middleware for all the matched components.
  const middleware = getMiddleware(components)

  // Load async data for all the matched components.
  await asyncData(components)

  // Call each middleware.
  callMiddleware(middleware, to, from, (...args) => {
    next(...args)
  })  
})

/**
 * @param  {Array} components
 * @return {Promise<void>
 */
 async function asyncData (components) {
  for (let i = 0; i < components.length; i++) {
    const component = components[i]

    if (!component.asyncData) {
      continue
    }

    const dataFn = component.data

    try {
      const asyncData = await component.asyncData()

      component.data = function () {
        return {
          ...(dataFn ? dataFn.apply(this) : {}),
          ...asyncData
        }
      }
    } catch (e) {
      component.layout = 'error'

      console.error('Failed to load asyncData', e)
    }
  }
}

/**
 * Call each middleware.
 *
 * @param {Array} middleware
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 */
 function callMiddleware (middleware, to, from, next) {
  const stack = middleware.reverse()

  const _next = (...args) => {
    // Stop if "_next" was called with an argument or the stack is empty.
    if (args.length > 0 || stack.length === 0) {
      if (args.length > 0) {
        //
      }

      return next(...args)
    }

    const { middleware, params } = parseMiddleware(stack.pop())

    if (typeof middleware === 'function') {
      middleware(to, from, _next, params)
    } else if (routeMiddleware[middleware]) {
      routeMiddleware[middleware](to, from, _next, params)
    } else {
      throw Error(`Undefined middleware [${middleware}]`)
    }
  }

  _next()
}

/**
 * @param  {String|Function} middleware
 * @return {Object}
 */
function parseMiddleware (middleware) {
  if (typeof middleware === 'function') {
    return { middleware }
  }

  const [name, params] = middleware.split(':')

  return { middleware: name, params }
}

/**
 * Resolve async components.
 *
 * @param  {Array} components
 * @return {Array}
 */
function resolveComponents (components) {
  return Promise.all(components.map(component => {
    return typeof component === 'function' ? component() : component
  }))
}

/**
 * Merge the the global middleware with the components middleware.
 *
 * @param  {Array} components
 * @return {Array}
 */
function getMiddleware (components) {
  const middleware = [...globalMiddleware]

  components.filter(c => c.middleware).forEach(component => {
    if (Array.isArray(component.middleware)) {
      middleware.push(...component.middleware)
    } else {
      middleware.push(component.middleware)
    }
  })

  return middleware
}

/**
 * @param  {Object} requireContext
 * @return {Object}
 */
 function resolveMiddleware (requireContext) {
  return requireContext.keys()
    .map(file =>
      [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
    )
    .reduce((guards, [name, guard]) => (
      { ...guards, [name]: guard.default }
    ), {})
}


export default router
