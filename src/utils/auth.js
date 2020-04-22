import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const GZHKey = 'User-GZH'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCurrentGZH() {
  let value = Cookies.get(GZHKey)
  if (value) {
    return JSON.parse(Cookies.get(GZHKey))
  } else  {
    return null
  }
  
}

export function setCurrentGZH(gzh) {
  return Cookies.set(GZHKey, JSON.stringify(gzh))
}

export function removeCurrentGZH() {
  return Cookies.remove(GZHKey)
}