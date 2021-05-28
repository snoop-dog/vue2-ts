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
    httpRequest('post', '/user/enabled', params)
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

// 常用2级字典相关 API start
/**
 * @api {post} /data/add 新增字典
 * @param {Object} params 新增字典参数
 */
export function addDictionary (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/data/add', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {delete} /data/delete 字典删除
 * @param {Object} params 字典删除参数
 */
export function delDictionary (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/data/delete', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /data/getDataList 获取字典列表
 * @param {Object} params 获取字典列表参数
 */
export function getDicList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/data/getDataList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /data/getNationList 民族字典列表
 * @param {Object} params 民族字典列表参数
 */
export function getNationDic (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/data/getNationList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /data/update 字典修改
 * @param {Object} params 字典修改参数
 */
export function updateDictionary (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/data/update', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 常用2级字典相关 API start

// 省、市、区、街道、社区、小区管理 API start
/**
 * @api {post} /area/add 新增区划信息
 * @param {Object} params 新增区划信息参数
 */
export function addArea (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/area/add', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {delete} /area/delete 区划信息删除
 * @param {Object} params 区划信息删除参数
 */
export function deleteArea (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/area/delete', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /area/getAreaDim 获取省-市-区-街道-社区(精简)
 * @param {Object} params 获取省-市-区-街道-社区(精简)参数
 */
export function getAreaDim (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/area/getAreaDim', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /area/getAreaList 获取省、市、区、街道、社区列表
 * @param {Object} params 获取省、市、区、街道、社区列表参数
 */
export function getAreaList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/area/getAreaList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /area/update 
 * @param {Object} params 新增区划信息参数
 */
export function updateArea (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/area/update', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 省、市、区、街道、社区、小区管理 API end

// 角色单位职位相关 API start
/**
 * @api {post} /jobunit/addPosition 职位新增
 * @param {Object} params 职位新增参数
 */
export function addPosition (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/jobunit/addPosition', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /jobunit/addUnit 单位新增
 * @param {Object} params 单位新增参数
 */
export function addDepartment (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/jobunit/addUnit', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {delete} /jobunit/deletePosition 删除职位
 * @param {Object} params 删除职位参数
 */
export function deletePosition (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/jobunit/deletePosition', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {delete} /jobunit/deleteUnit 删除单位
 * @param {Object} params 删除单位参数
 */
export function deleteDepartment (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('delete', '/jobunit/deleteUnit', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getAreaByUnitId 根据单位ID该单位的省市区信息
 * @param {Object} params 根据单位ID该单位的省市区信息参数
 */
export function getAreaByUid (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getAreaByUnitId', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getJobUnitList 获取职位单位列表
 * @param {Object} params 获取职位单位列表参数
 */
export function getJobUnitList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getJobUnitList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getJobUnitPage 获取职位单位列表
 * @param {Object} params 获取职位单位列表参数
 */
 export function getJobUnitPage (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getJobUnitPage', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getJobUnitSimple 获取单位(精简)
 * @param {Object} params 获取单位(精简)参数
 */
export function getJobUnitSimple (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getJobUnitSimple', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getPositionSimple 获取职位(精简)
 * @param {Object} params 获取职位(精简)参数
 */
 export function getPositionSimple (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getPositionSimple', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getPositionTree 
 * @param {Object} params 获取单位所属职位树参数
 */
export function getPositionTree (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getPositionTree', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /jobunit/getUnitTree  获取单位树
 * @param {Object} params 获取单位树参数
 */
export function getUnitTree (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/jobunit/getUnitTree', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /jobunit/updatePosition  职位修改
 * @param {Object} params 职位修改参数
 */
export function updatePosition (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/jobunit/updatePosition', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /jobunit/updateUnit  
 * @param {Object} params 职位单位修改参数
 */
export function updateUnit (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/jobunit/updateUnit', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 角色单位职位相关 API end

// 房屋入住登记相关中介公司信息 API start
/**
 * @api {post} /rr/addDataAll  租户新增(一起添加)
 * @param {Object} params 租户新增(一起添加)参数
 */
export function addTenant (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/addDataAll', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/addHomeowner  户主/公司新增
 * @param {Object} params 户主/公司新增参数
 */
export function addHouseowner (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/addHomeowner', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/addHouses  登记房屋新增
 * @param {Object} params 登记房屋新增参数
 */
export function addHouseInfo (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/addHouses', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/addRegistrar  新增登记人中介公司
 * @param {Object} params 新增登记人中介公司参数
 */
export function addRegistrar (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/addRegistrar', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/addTenants  批量-租户新增
 * @param {Object} params 批量-租户新增参数
 */
export function addTenants (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/addTenants', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getHomeownerByHouse  根据房屋id查询房主信息
 * @param {Object} params 根据房屋id查询房主信息参数
 */
export function getHouseownerById (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getHomeownerByHouse', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getHomeownerList  获取当前用户可看户主/公司列表(名称+电话)
 * @param {Object} params 获取当前用户可看户主/公司列表(名称+电话)参数
 */
export function getHomeownerList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getHomeownerList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getHomeownerPage  获取户主/公司数据列表
 * @param {Object} params 获取户主/公司数据列表参数
 */
export function getHomeownerPage (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getHomeownerPage', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getHousesList  获取当前用户可看房屋列表(地址)
 * @param {Object} params 获取当前用户可看房屋列表(地址)参数
 */
export function getHousesList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getHousesList', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getHousesPage  获取登记数据列表
 * @param {Object} params 获取登记数据列表参数
 */
export function getHousesPage (params: any) {
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

/**
 * @api {get} /rr/getRegistrarByHouse  根据房屋id获取登记人信息
 * @param {Object} params 根据房屋id获取登记人信息参数
 */
export function getRegistrarByHouse (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getRegistrarByHouse', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getRegistrarByLogin  获取当前用户登记人信息
 * @param {Object} params 获取当前用户登记人信息参数
 */
export function getRegistrarByLogin (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getRegistrarByLogin', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getTenantPage  获取租户列表
 * @param {Object} params 获取租户列表参数
 */
export function getTenantPage (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getTenantPage', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/updateHomeowner  户主/公司修改
 * @param {Object} params 户主/公司修改参数
 */
export function updateHomeowner (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/updateHomeowner', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/updateHouses  登记房屋修改
 * @param {Object} params 登记房屋修改参数
 */
export function updateHouses (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/updateHouses', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/updateRegistrar  修改登记人中介公司
 * @param {Object} params 修改登记人中介公司参数
 */
export function updateRegistrar (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/updateRegistrar', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/updateTenant  租户修改
 * @param {Object} params 租户修改参数
 */
export function updateTenant (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/updateTenant', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /rr/getDataById  根据id查询登记详情(租户列表,房屋,房东信息)
 * @param {Object} params 根据id查询登记详情(租户列表,房屋,房东信息)参数
 */
export function getRegisterDetail (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/rr/getDataById', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {post} /rr/updateDataAll  出租登记修改(一起添加)
 * @param {Object} params 出租登记修改(一起添加)参数
 */
export function updateRegisterInfo (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/rr/updateDataAll', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 房屋入住登记相关中介公司信息 API end

// 日志管理 API start
/**
 * @api {post} /log/log-insert  日志添加
 * @param {Object} params 日志添加参数
 */
export function insertLog (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('post', '/log/log-insert', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @api {get} /log/log-page  日志查询
 * @param {Object} params 日志查询参数
 */
export function getLogList (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/log/log-page', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 日志管理 API end

// 数据检索 API start
/**
 * @api {get} /dr/getDataPage  数据检索
 * @param {Object} params 数据检索参数
 */
export function dataSearch (params: any) {
  return new Promise((resolve, reject) => {
    httpRequest('get', '/dr/getDataPage', params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 数据检索 API end
