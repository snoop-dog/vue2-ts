import httpRequest from '../utils/request'

/**
 * @api {post} /api/login 登录请求
 * @param {Object} params 登录请求参数
 */
export function doLogin (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/login/login', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /api/vue-ts/menu 获取菜单
 * @param {Object} params 请求菜单参数
 */
export function getMenuData (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/role/queryMenuTree', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 房屋入住登记相关 API start
/**
 * @api {get} /rr/getHousesPage 获取登记房屋列表
 * @param {Object} params 请求菜单参数
 */
export function getHousePage (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getHousesPage', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 房屋入住登记相关 API end

// 用户角色相关 API start
/**
 * @api {get} /role/getRoleList 获取角色列表
 * @param {Object} params 请求角色列表参数
 */
export function getRoleList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/role/getRoleList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /role/add 角色新增
 * @param {Object} params 角色新增参数
 */
export function addRole (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/role/add', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /role/update 角色修改
 * @param {Object} params 角色修改参数
 */
export function updateRole (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/role/update', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {delete} /role/delete 角色删除
 * @param {Object} params 角色删除参数
 */
export function deleteRole (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/role/delete', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /role/enabled 角色启用状态修改
 * @param {Object} params 角色删除参数
 */
export function enableRole (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/role/enabled', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /role/getRole 获取角色(精简)
 * @param {Object} params 获取角色(精简)参数
 */
export function getRoleSimple (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/role/getRole', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 用户角色相关 API end
