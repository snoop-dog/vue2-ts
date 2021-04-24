/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-24 18:50:52
 * @FilePath: \vue2-ts\src\utils\interface.ts
 */
interface res {
  data: any[]
}

interface token {
  access_token: String,
  expires_in: Number,
  refresh_token?: String
}

interface echartsOption {
  timeline?: any,
  options: any[]
}

export {
  res,
  token,
  echartsOption
}