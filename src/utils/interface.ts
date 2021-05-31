/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-01 01:02:01
 * @FilePath: \vue2-ts\src\utils\interface.ts
 */
interface res {
  data: any[];
  message?: any;
  status?: number;
}

interface token {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

interface echartsOption {
  timeline?: any;
  options: any[];
}

export {
  res,
  token,
  echartsOption
}
