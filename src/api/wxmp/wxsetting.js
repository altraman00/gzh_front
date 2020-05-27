import request from '@/utils/request'

export const getWexinInfo = () => {
    return request({
        url: '/open/wxmp/info',
        method: 'get'
    })
}

export const getTemplateList = params => {
    return request({
        url: '/wxactivity/template/list',
        method: 'get',
        params: params
    })
}

export const bindTemplate = params => {
    return request({
        url: '/wxactivity/template/bind',
        method: 'get',
        params: params
    })
}

export const getMsgTemplateList = params => {
    return request({
        url: '/wxactivity/template/message/list',
        method: 'get',
        params: params
    })
}

export const editTemplate = (id, params) => {
    // return request({
    //     url: `/wxactivity/template/message/${id}`,
    //     method: 'patch',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     params: params
    // })
    return request.patch(`/wxactivity/template/message/${id}`, params)
}

export const toggleActivity = (id, params) => {
    return request.patch(`/wxactivity/status/${id}`, params)
}

export const previewPoster = id => {
    return request.get(`/wxactivity/template/${id}/poster/preview`)
}

export const changeSingleTemplateStatus = (id, isEnable) => {
  return request.post(`/wxmp/activity/template/msg/${id}/do`, {
    activityEnable: isEnable
  }, {
    transformRequest: [
      function (data) {
         let ret = ''
         for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
         }
         ret = ret.substring(0, ret.lastIndexOf('&'));
         return ret
      }
    ],
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const getAllTemplateList = params => {
  return request({
    url: '/wxmp/activity/template/list',
    method: 'get',
    params: params
  })
}

export const changeTemplateStatus = (id, isEnable) => {
  return request({
    url: `/wxmp/activity/template/${id}/do`,
    method: 'post',
    data: {
      activityEnable: isEnable
    },
    transformRequest: [
      function (data) {
         let ret = ''
         for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
         }
         ret = ret.substring(0, ret.lastIndexOf('&'));
         return ret
      }
    ],
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const deleteTemplete = id => {
  return request.delete(`/wxmp/activity/template/${id}`)
}
