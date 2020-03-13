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