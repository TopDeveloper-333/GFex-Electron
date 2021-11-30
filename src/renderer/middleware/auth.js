import store from '~/store'
import Cookies from 'js-cookie'
import { ipcRenderer } from 'electron'


export default async (to, from, next) => {
  debugger 
  const data = ipcRenderer.sendSync('getLicense')
  if (data != undefined && data.isVerified == true && 
    (Date.parse(data.from) <= new Date() && new Date() <= Date.parse(data.to)))
    next()
  else {
    next({ name: ''})
  }

  // if (!store.getters['auth/check']) {
  //   Cookies.set('intended_url', to.path)

  //   next({ name: 'login' })
  // } else {
  //   next()
  // }
}
