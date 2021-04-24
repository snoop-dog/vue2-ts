/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2021-04-24 22:36:39
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-24 22:38:19
 * @FilePath: \vue2-ts\src\utils\index.ts
 */

export function flattenTree (data: any, flag: boolean) {
  if (flag) {
    return data.reduce((arr, currentValue) => {
      if (currentValue.children && currentValue.children.length > 0) {
        return arr.concat(flattenTree(currentValue.children, true))
      } else {
        return arr.concat(currentValue)
      }
    }, [])
  } else {
    return data.reduce((arr, currentValue) => {
      let obj = {}
      for (let key in currentValue) {
        if (key !== 'children') {
          obj[key] = currentValue[key]
        }
      }
      return arr.concat([obj], currentValue.children ? flattenTree(currentValue.children, flag) : [])
    }, [])
  }
}