import axios from 'axios'
const APPID = 'wx1ae5569fd1bd1e3e'
const APPSECRET = '22437a698a6bac6837a866d723c9a261'

// 获取路由
export const getAccessToken = () => {
  return axios({
    url: `/wechat/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: 'get'
  })
}