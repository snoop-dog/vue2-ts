/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-05 23:00:52
 * @FilePath: \vue2-ts\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-undef': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'no-trailing-spaces': 'off',
    'vue/no-unused-vars': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'prefer-rest-params': 'off',
    'no-tabs': 'off',
    indent: 'off'
  }
}
