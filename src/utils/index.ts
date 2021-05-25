/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2021-04-24 22:36:39
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-26 00:49:26
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
      const obj = {}
      for (const key in currentValue) {
        if (key !== 'children') {
          obj[key] = currentValue[key]
        }
      }
      return arr.concat([obj], currentValue.children ? flattenTree(currentValue.children, flag) : [])
    }, [])
  }
}

/**
 * @description: [校验类方法] 手机格式校验
 * @param: {string} val 校验值
 * @return {boolean} 校验结果（true表示是正确格式，false表示错误格式）
 */
export function verifyPhoneFormat (val, type) {
  const reg = /^1[3456789]\d{9}$/
  if (val) {
    if (reg.test(val.trim())) return true
    else {
      return false
    }
  } else {
    if (val === '') {
      return true
    }
  }
}

/**
 * @description: [校验类方法] 身份证格式校验
 * @param: {string} card 校验值
 * @return {boolean} 校验结果（true表示是正确格式，false表示错误格式）
 */
export function verifyIdcardFormat (card, type) {
  const vcity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  
  // 15位转18位身份证号
  const changeFivteenToEighteen = function (card) {
    if (card.length === '15') {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let cardTemp = 0

      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
      for (let i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      card += arrCh[cardTemp % 11]
      return card
    }
    return card
  }

  // 校验日期
  const verifyBirthday = function (year, month, day, birthday) {
    const now = new Date()
    const now_year = now.getFullYear()
    // 年月日是否合理
    if (birthday.getFullYear() === year && (birthday.getMonth() + 1) === month && birthday.getDate() === day) {
      // 判断年份的范围（3岁到100岁之间)
      const time = now_year - year
      if (time >= 3 && time <= 100) {
        return true
      }
      return false
    }
    return false
  }
  // 检查号码是否符合规范，包括长度，类型
  const isCardNo = function (card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    const reg = /(^\d{15}$)|(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/
    if (reg.test(card) === false) return false
    return true
  }
  // 取身份证前两位,校验省份
  const checkProvince = function (card) {
    const province = card.substr(0, 2)
    if (vcity[province] === undefined) return false
    return true
  }
  // 检查生日是否正确
  const checkBirthday = function (card) {
    const len = card.length
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len === 15) {
      const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
      const arr_data = card.match(re_fifteen)
      const year = arr_data[2]
      const month = arr_data[3]
      const day = arr_data[4]
      const birthday = new Date('19' + year + '/' + month + '/' + day)
      return verifyBirthday('19' + year, month, day, birthday)
    }
    // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len === 18) {
      const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
      const arr_data = card.match(re_eighteen)
      const year = arr_data[2]
      const month = arr_data[3]
      const day = arr_data[4]
      const birthday = new Date(year + '/' + month + '/' + day)
      return verifyBirthday(year, month, day, birthday)
    }
    return false
  }

  // 校验位的检测
  const checkParity = function (card) {
    // 15位转18位
    card = changeFivteenToEighteen(card)
    const len = card.length
    if (len === 18) {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let cardTemp = 0

      for (let i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      const valnum = arrCh[cardTemp % 11]
      const lastnum = card.substr(17, 1).toUpperCase()
      if (valnum === lastnum) {
        return true
      }
      return false
    }
    return false
  }
  
  let message = ''
  /* if(!isCardNo(card)) message = "输入的身份证号码格式错误，请重新输入";
    if(!checkProvince(card)) message = "输入的身份证号码省份错误，请重新输入";
    if(!checkBirthday(card)) message = "输入的身份证号码生日错误，请重新输入";
    if(!checkParity(card)) message = "输入的身份证号码校验位错误，请重新输入"; */
  if (!isCardNo(card)) message = '输入的身份证号码格式错误，请重新输入'
  else if (!checkProvince(card)) message = '输入的身份证号码省份错误，请重新输入'
  else if (!checkBirthday(card)) message = '输入的身份证号码生日错误，请重新输入'
  else if (!checkParity(card)) message = '输入的身份证号码校验位错误，请重新输入'
  if (message !== '') {
    return false
  } else {
    return true
  }
}
