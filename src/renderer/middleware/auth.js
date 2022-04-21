import store from '~/store'
import Cookies from 'js-cookie'
import { ipcRenderer } from 'electron'


export default async (to, from, next) => {

  // remove license

  // const data = ipcRenderer.sendSync('getLicense')
  // if (data != undefined && data.isVerified == true) {

  //   if (data.from != undefined && data.to != undefined && data.from == '' && data.to == '') {
  //     next()
  //   }
  //   else if (Date.parse(data.from) <= new Date() && new Date() <= Date.parse(data.to)) {
  //     next()    
  //   }
  // } 
  
  next()
  
  // next({ name: ''})

  // if (!store.getters['auth/check']) {
  //   Cookies.set('intended_url', to.path)

  //   next({ name: 'login' })
  // } else {
  //   next()
  // }
}
