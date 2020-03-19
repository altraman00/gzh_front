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