const apis = require('./api.js')
const dayjs = require('dayjs')
const { touser, template_id } = require('./config.js')
/**
 * 获取一言消息
 * @returns
 */
const getHitokotoMessage = async () => {
  try {
    let result = await apis.getHitokoto()
    if (result?.status === 200 && result?.data) {
      if (result.data?.hitokoto) {
        return result.data.hitokoto
      } else {
        throw Error('请求出错')
      }
    } else {
      throw Error('请求出错')
    }
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 16 ~ getHitokotoMessage ~ error', error)
  }
}
/**
 * 获取一次acc_token
 * @returns
 */
const getATO = async () => {
  try {
    let result = await apis.getAccessToken()
    if (result?.status === 200 && result?.data) {
      if (result.data?.access_token) {
        return result.data?.access_token
      } else {
        throw Error('获取access_token失败')
      }
    } else {
      throw Error('获取access_token失败')
    }
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 27 ~ getATO ~ error', error)
  }
}
/**
 * 发送模板信息
 * @param {*} access_token
 * @param {*} data
 */
const sendMessage = async (access_token, data) => {
  try {
    let result = await apis.sendWxMessage(access_token, data)
    if (result?.status === 200 && result?.data) {
      return result.data
    } else {
      throw Error(result?.errmsg)
    }
  } catch (error) {
    console.error('🚀 ~ file: index.js ~ line 38 ~ sendMessage ~ error', error)
  }
}
/**
 * 获取经纬度
 */
const getLocation = async () => {
  try {
    let result = await apis.getLocalWather()
    if (result?.status === 200) {
      const { location = [] } = result.data || {}
      if (location && location.length >= 1) {
        const { lat, lon, name } = location[0]
        return { city_name: name, lnglat: [lon, lat] }
      }
    }
  } catch (error) {
    throw Error('获取经纬度出错')
  }
}
const getWather = async () => {
  try {
    let lnglat = await getLocation()
    let result = await apis.getWatherByLocal(lnglat?.lnglat.join(','))
    if (result?.status === 200 && result?.data?.code == 200) {
      return { ...result.data.now, ...lnglat }
    } else {
      throw Error('获取天气出错')
    }
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 83 ~ getWather ~ error', error)
  }
}

const init = async () => {
  try {
    let access_token = await getATO()
    const message = await getHitokotoMessage()
    const wather = await getWather()
    console.log('🚀 ~ file: index.js ~ line 97 ~ init ~ wather', wather)
    const data = {
      time: {
        value: dayjs(wather.obsTime).format('YYYY年MM月DD日'),
        color: '#7d5886',
      },
      city: {
        value: wather.city_name,
        color: '#f7acbc',
      },
      wather: {
        value: `${wather.windScale} 级 ${wather.windDir}`,
        color: '#f05b72',
      },
      temperature: {
        value: `${wather.temp}`,
        color: '#f05b72',
      },
      remark: {
        value: message,
        color: '#1b315e',
      },
    }
    let result = await sendMessage(access_token, { touser, template_id, data: data })
    console.log('🚀 ~ file: index.js ~ line 119 ~ init ~ result', result)
  } catch (error) {
    throw Error('推送失败')
  }
}

init()
