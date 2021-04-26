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

// 用户相关 API start
/**
 * @api {post} /user/add 用户添加
 * @param {Object} params 用户添加参数
 */
export function addUser (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/user/add', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {delete} /user/delete 用户删除
 * @param {Object} params 用户删除参数
 */
export function deleteUser (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/user/delete', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /user/post 用户启用状态修改
 * @param {Object} params 用户启用状态修改参数
 */
export function updateUserStatus (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/user/enabled', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /user/getUserPage 获取用户列表
 * @param {Object} params 获取用户列表参数
 */
export function getUserList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/user/getUserPage', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /user/info 获取当前用户信息详情
 * @param {Object} params 获取当前用户信息详情参数
 */
export function getUserDetail (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/user/info', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /user/password 用户修改密码
 * @param {Object} params 用户修改密码参数
 */
export function updatePassword (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/user/password', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /user/update (用户管理)用户信息修改
 * @param {Object} params (用户管理)用户信息修改参数
 */
export function updateUserInfo (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/user/update', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 用户相关 API end
