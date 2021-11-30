import crypto from 'crypto'
import { machineId, machineIdSync } from 'node-machine-id'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

export async function LicenseInitialize() {
  const verifyInfo = await VerifyLicenseKey()
  return verifyInfo
}

export async function GenerateMachineKey(filePath) {

  const userDataPath = app.getPath('userData')
  
  // copy pub.pem into data
  if (!fs.existsSync(path.join(userDataPath, '/data/pub.pem'))) {
    if (isDev) {
      fs.copyFileSync(path.join(__dirname, '../data/pub.pem'),
                  path.join(userDataPath, '/data/pub.pem'))
    }
    else {
      fs.copyFileSync(path.join(__dirname, '../dist/data/pub.pem'),
                  path.join(userDataPath, '/data/pub.pem'))
    }
  }

  const publicKey = fs.readFileSync(userDataPath + '/data/pub.pem')

  const deviceFingerPrint = machineIdSync()
  const data = deviceFingerPrint + ':' + process.platform

  // encrypt the fingerprint
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(data)
  )

  // Encode the original data
  const machineKey = Buffer.from(encryptedData).toString('base64')
  fs.writeFileSync(filePath, machineKey)
  return true
}

export async function VerifyLicenseKey() {

  const userDataPath = app.getPath('userData')
  const deviceFingerPrint = machineIdSync()

  // copy pub.pem into data
  if (!fs.existsSync(path.join(userDataPath, '/data/pub.pem'))) {
    if (isDev) {
      fs.copyFileSync(path.join(__dirname, '../data/pub.pem'),
                  path.join(userDataPath, '/data/pub.pem'))
    }
    else {
      fs.copyFileSync(path.join(__dirname, '../dist/data/pub.pem'),
                  path.join(userDataPath, '/data/pub.pem'))
    }
  }

  if (!fs.existsSync(path.join(userDataPath, '/data/licenseKey.pem'))) {
    return { isVerified: false}
  }

  let licenseKey = fs.readFileSync(path.join(userDataPath, '/data/licenseKey.pem')) + ''

  // Create an RSA verifier
  const [encoded, signature] = licenseKey.split('.')
  const publicKey = fs.readFileSync(userDataPath + '/data/pub.pem')
  const verifier = crypto.createVerify('sha256')
  verifier.update(encoded)

  // Verify the signature for the data using the public key
  const valid = verifier.verify(publicKey, signature, 'base64')

  const encrypted = Buffer.from(encoded, 'base64')
  const decrypted = crypto.publicDecrypt(
    {
      key: publicKey
    },
    Buffer.from(encrypted)
  )

  const data = decrypted.toString()

  if (valid != true) {
    return { isVerified: false}
  }

  let contents = data.split(':')
  if (contents == undefined || contents.length != 4 || contents[0] != deviceFingerPrint) {
    return { isVerified: false}
  }

  return {isVerified: true, from: contents[2], to: contents[3]}

}

export async function UploadLicenseKey(licenseKeyPath) {
  const isDev = process.env.NODE_ENV === 'development'
  const userDataPath = app.getPath('userData')

  console.log('License Key Path : ' + licenseKeyPath)
  console.log('Path : ' + path.join(userDataPath, '/data/licenseKey.pem'))

  if (fs.existsSync(licenseKeyPath)) {
    fs.copyFileSync(licenseKeyPath, path.join(userDataPath, '/data/licenseKey.pem'))
  }
}