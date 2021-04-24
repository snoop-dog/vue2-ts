/*
 * @Description: 认证
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:53:02
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-24 19:00:40
 * @FilePath: \vue2-ts\src\utils\auth.ts
 */
import Vue from 'vue'
const TokenKey = 'my-cookie'

/**
 * @desc 获取token
 */
export function getToken () {
  return Vue.$cookies.get(TokenKey)
}

/**
 * @desc 设置token
 * @param {*token值} token
 * @param {*过期时间} expires
 */
export function setToken (token, expires) {
  return Vue.$cookies.set(TokenKey, token, expires)
}

/**
 * @desc 移除token
 */
export function removeToken () {
  return Vue.$cookies.remove(TokenKey)
}
