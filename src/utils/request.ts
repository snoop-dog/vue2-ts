/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2021-04-24 14:03:25
 * @LastEditors  : snoop-dog
 * @LastEditTime : 2021-05-26 11:40:16
 * @FilePath     : \vue2-ts\src\utils\request.ts
 */
import axios from 'axios'
import qs from 'qs'
import router from '../router/index'
import { getToken, removeToken } from '../utils/auth'

const request = axios.create({
  timeout: 60000,
  baseURL: 'http://113.57.168.50:17880/'
  // withCredentials: true,
})

const pending: Array<any> = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const whiteListUrl = ['/area/getAreaDim', '/data/getDataList']
const CancelToken = axios.CancelToken
const removePending = (ever: any) => {
  pending.map((item, idx) => {
    if (whiteListUrl.includes(ever.url)) return
    if (item.u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
      item.f() // 执行取消操作
      pending.splice(idx, 1) // 把这条记录从数组中移除
    }
  })
}

request.interceptors.request.use(
  (config: any) => {
    if (['GET', 'DELETE'].includes(config.method.toUpperCase())) {
      // config.params = qs.stringify(config.params)
    } else if (['POST', 'PUT'].includes(config.method.toUpperCase())) {
      config.headers['content-type'] = 'appliaction/json'
      // config.data = qs.stringify(config.data)
    }
    if (getToken()) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    removePending(config) // 在一个ajax发送前执行一下取消操作
    config.cancelToken = new CancelToken((c) => {
      pending.push({ u: config.url + '&' + config.method, f: c })
    })

    return config
  },
  (err: object) => {
    Promise.reject(err)
  }
)

request.interceptors.response.use(
  (res: any) => {
    removePending(res.config)
    if (res.status === 200) {
      return res.data
    } else if (res.status === 401) {
      removeToken()
      router.replace({
        path: '/'
      })
    }
  },
  (err: object) => {
    if (JSON.stringify(err).includes('401')) {
      removeToken()
      router.replace({
        path: '/'
      })
    }
    Promise.reject(err)
  }
)

export default (method: string, url: string, data = {}) => {
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    return request[method](url, {
      params: data
    })
  } else if (['POST', 'PUT'].includes(method.toUpperCase())) {
    return request[method](url, data)
  }
}
