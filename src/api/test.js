import axios from 'axios'
import request from '@/utils/request'
const APPID = 'wx1ae5569fd1bd1e3e'
const APPSECRET = '22437a698a6bac6837a866d723c9a261'

// 获取路由
export const getAccessToken = () => {
  return axios({
    url: `/wechat/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: 'get'
  })
}

export const getWechatInfo = params => {
  return axios({
    url: '/api/open/wxmp/info',
    method: 'get',
    params: params
  })
}

export const getOauth2 = params => {
  return axios({
    // url: '/api/open/wxmp/oauth2',
    url: `/wechat/sns/oauth2/access_token?appid=${params.appId}&secret=${params.secret}&code=${params.code}&grant_type=authorization_code`,
    method: 'get',
    params: params
  })
}