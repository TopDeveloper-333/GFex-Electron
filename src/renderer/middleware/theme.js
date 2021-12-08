import store from '~/store'

export default async (to, from, next) => {

  let backgroundColor = store.getters['project/backgroundColor']
  let primaryColor = store.getters['project/primaryColor']
  let secondaryColor = store.getters['project/secondaryColor']
  let textColor = store.getters['project/textColor']

  if (backgroundColor == null || backgroundColor == undefined || backgroundColor == '') {
    backgroundColor = '#f0f000'
  }
  if (primaryColor == null || primaryColor == undefined || primaryColor == '') {
    primaryColor = '#0d6efd'
  }
  if (secondaryColor == null || secondaryColor == undefined || secondaryColor == '') {
    secondaryColor = '#00FF00'
  }
  if (textColor == null || textColor == undefined || textColor == '') {
    textColor = '#FFFFFF'
  }

  let oldBackgroundColor = document.documentElement.style.getPropertyValue('--background-color')
  let oldPrimaryColor = document.documentElement.style.getPropertyValue('--primary-color')
  let oldSecondaryColor = document.documentElement.style.getPropertyValue('--secondary-color')
  let oldTextColor = document.documentElement.style.getPropertyValue('--text-color')
  
  if (oldBackgroundColor != backgroundColor)
    document.documentElement.style.setProperty('--background-color', backgroundColor);

  if (oldPrimaryColor != primaryColor)
    document.documentElement.style.setProperty('--primary-color', primaryColor);

  if (oldSecondaryColor != secondaryColor)
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);

  if (oldTextColor != textColor)  
    document.documentElement.style.setProperty('--text-color', textColor);

  next()
}