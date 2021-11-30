import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import pkg from '../../package.json'
import { DBinitialize  } from './database'
import { LicenseInitialize, GenerateMachineKey, VerifyLicenseKey, UploadLicenseKey } from './license'

require('@electron/remote/main').initialize()

// set app name
app.name = pkg.productName

// to hide deprecation message
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const gotTheLock = app.requestSingleInstanceLock()
const isDev = process.env.NODE_ENV === 'development'
const isDebug = process.argv.includes('--debug')
let mainWindow
let verifyInfo

// only allow single instance of application
if (!isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow && mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    })
  } else {
    app.quit()
    process.exit(0)
  }
} else {
  // process.env.ELECTRON_ENABLE_LOGGING = true

  require('electron-debug')({
    showDevTools: false,
  })
}

async function installDevTools() {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS).catch((err) => {
    console.log('Unable to install `vue-devtools`: \n', err)
  })
}

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      contextIsolation: false,
      webSecurity: false,
    },
    show: false,
  })

  // create Project database
  DBinitialize()

  // initialize license
  verifyInfo = await LicenseInitialize()

  // eslint-disable-next-line
  setMenu()

  // load root file/url
  if (isDev) {
    mainWindow.loadURL('http://localhost:9080')
  } else {
    mainWindow.loadFile(`${__dirname}/index.html`)

    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    console.log('\nApplication exiting...')
  })
}

app.on('ready', () => {
  createWindow()

  if (isDev) {
    installDevTools()
    mainWindow.webContents.openDevTools()
  }

  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

const sendMenuEvent = async (data) => {
  mainWindow.webContents.send('change-view', data)
}

const template = [
  {
    label: "License",
    async click() {
      await doLicense()
    }
  }
]

ipcMain.on('getLicense', async (event, ...args) => { 
  const today = new Date()
  const from = Date.parse(verifyInfo.from)
  const to = Date.parse(verifyInfo.to)

  if (verifyInfo == undefined || verifyInfo.isVerified == false ||
    today <= from || to <= today)
  {
    doLicense()    
  }

  event.returnValue = verifyInfo
})


function setMenu() {
  if (process.platform === 'darwin') {

    // template.push({
    //   role: 'Home',
    // })

    // template.push({ role: 'services' })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

async function doLicense() {
  console.log(verifyInfo)

  if (verifyInfo == undefined || verifyInfo.isVerified == false) {
    updateLicense()
  }
  else {
    const today = new Date()
    const from = Date.parse(verifyInfo.from)
    const to = Date.parse(verifyInfo.to)

    let message = ''
    if (from <= today && today <= to) 
      message = 'This application has licensed'
    else
      message = 'The license is expired'

    const res = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
      title: 'License Information',
      message: message,
      detail: 'From: ' + verifyInfo.from + ' To: ' + verifyInfo.to,
      buttons: ['Ok', 'Update new license']
    })

    if (res == 1) {
      const response = dialog.showOpenDialogSync({
        title: 'Update license',
        defaultPath: app.getPath('downloads'),
        buttonLabel: 'Select',
        filters: [
          {name: 'PEM files', extensions:['pem']},
          {name: 'All Files', extensions:['*']}
        ],
        properties:['openFile'],
        message: 'Select the licenseKey.pem file'
      })
  
      if (response != undefined) {
        await UploadLicenseKey(response + '')
        verifyInfo = await VerifyLicenseKey()
      }                
    }
  }
}

async function updateLicense() {
  const res = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
    title: 'License',
    message: 'Please update the license file.',
    detail: 'You can create machine key and then send it to the administrator. After then he will give you license file',
    buttons: ['Generate machine key', 'Update license']
  })

  if (res == 0) {
    const response = dialog.showSaveDialogSync({
      title: 'Save machine key',
      defaultPath: 'machineKey.pem',
      buttonLabel: 'Save',
      filters: [
        { name: 'PEM files', extensions: ['pem']}
      ],
      message: 'Save the machineKey.pem'
    })

    if (response != undefined)
      GenerateMachineKey(response)
  }
  else if (res == 1) {
    const response = dialog.showOpenDialogSync({
      title: 'Update license',
      defaultPath: app.getPath('downloads'),
      buttonLabel: 'Select',
      filters: [
        {name: 'PEM files', extensions:['pem']},
        {name: 'All Files', extensions:['*']}
      ],
      properties:['openFile'],
      message: 'Select the licenseKey.pem file'
    })

    if (response != undefined) {
      await UploadLicenseKey(response + '')
      verifyInfo = await VerifyLicenseKey()
    }
  }

}