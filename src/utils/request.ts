import axios from 'axios'
import qs from 'qs'

const request = axios.create({
  timeout: 60000,
  baseURL: 'http://172.16.3.225:9527'
  // withCredentials: true,
})

const pending: Array<any> = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken
const removePending = (ever: any) => {
  pending.map((item, idx) => {
    if (item.u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
      item.f() // 执行取消操作
      pending.splice(idx, 1) // 把这条记录从数组中移除
    }
  })
}

request.interceptors.request.use(
  (config: any) => {
    if (config.method.toUpperCase() === 'GET') {
      config.params = { ...config.data }
    } else if (config.method.toUpperCase() === 'POST') {
      config.headers['content-type'] = 'appliaction/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
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
    if (res.statusText === 'OK') {
      return res.data
    }
  },
  (err: object) => {
    Promise.reject(err)
  }
)

export default (method: string, url: string, data = {}) => {
  if (method.toUpperCase() === 'GET') {
    return request.get(url, {
      params: data
    })
  } else if (method.toUpperCase() === 'POST') {
    return request.post(url, data)
  }
}
