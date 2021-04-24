/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2021-04-24 22:38:28
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-24 23:00:36
 * @FilePath: \vue2-ts\src\utils\date.ts
 */

export function doDateTimeShift (arg1, arg2, arg3) {
  if (!arg1) return ''
  var arg = [].slice.call(arguments)
  if (typeof arg[0] === 'string') { // 如果是字符串形式的值, 先转成时间对象,以免在火狐上会报错
    let isNumber = Number(arg[0])
    if (!isNaN(isNumber)) {
      arg[0] = isNumber * 1000
      arg1 = isNumber * 1000
    } else {
      arg[0] = new Date(arg[0])
    }
  } else if (typeof arg[0] === 'object') {
    arg[0] = new Date(arg[0])
  } 
  // else if (typeof arg[0] === 'number'){
  //   arg1 = arg[0] * 1000
  // }
  function Format (date, fmt) {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
  if (arg.length <= 0) Format(new Date(),'yyyy-MM-dd HH:mm:ss')
  if (arg.length <= 1) {
    if (typeof (arg[0]) === 'string') {
      if (arg[0].indexOf('yyyy') !== -1) Format(new Date(),'yyyy-MM-dd HH:mm:ss')
      else {
        let date = Format(new Date(Date.parse(arg1.replace(/-/g, '/'))), 'yyyy-MM-dd HH:mm:ss')
        return sliceDateString(date)
      } 
    }
    if (typeof (arg[0]) === 'number') {
      let date = Format(new Date(arg1), 'yyyy-MM-dd HH:mm:ss')
      return sliceDateString(date)
    }
    if (typeof (arg[0]) === 'object') {
      let date = Format(new Date(arg1), 'yyyy-MM-dd HH:mm:ss')
      return sliceDateString(date)
    }
  }
  if (arg.length <= 2) {
    if (typeof (arg[0]) === 'string') {
      let date = Format(new Date(Date.parse(arg[0].replace(/-/g, '/'))), arg2)
      return sliceDateString(date)
    }
    if (typeof (arg[0]) === 'number') {
      let date = Format(new Date(arg1), arg2)
      return sliceDateString(date)
    }
    if (typeof (arg[0]) === 'object') {
      let date = Format(new Date(arg1), arg2)
      return sliceDateString(date)
    }
  }
  if (arg.length === 3 ) {
    if (typeof (arg[0]) === 'string') {
      let date = Format(new Date(Date.parse(arg[0].replace(/-/g, '/'))), arg2)
      return  arg3 === 'true' ? date :  sliceDateString(date)
    }
    if (typeof (arg[0]) === 'number') {
      let date = Format(new Date(arg1), arg2)
      return  arg3 === 'true' ? date :  sliceDateString(date)
    }
    if (typeof (arg[0]) === 'object') {
      let date = Format(new Date(arg1), arg2)
      return  arg3 === 'true' ? date :  sliceDateString(date)
    }
  }

  function sliceDateString (val) {
    let str = ' 00:00:00'
    if (val.indexOf('NaN') !== -1) val = '--'
    if (val.indexOf(str)) {
      let finalStr = val.replace(new RegExp(str, 'g'), '')
      return finalStr
    } else {
      return val
    }
  }
}