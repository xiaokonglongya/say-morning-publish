const { appid, secret } = require('./config.js')
const axios = require('axios')
const { city_name, weather_key } = require('./config.js')
const api_url = {
  wx: 'https://api.weixin.qq.com',
  yy: 'https://v1.hitokoto.cn',
  wt: 'https://geoapi.qweather.com/',
}
module.exports = {
  /**
   * 获取一言
   * @returns
   */
  getHitokoto() {
    return axios.get(api_url.yy, {
      params: {
        c: 'i',
        code: 'json',
      },
    })
  },
  /**
   * 发送微信消息
   * @param {*} access_token token
   * @param {*} data 信息
   * @returns
   */
  sendWxMessage(access_token, data) {
    return axios({
      url: api_url.wx + `/cgi-bin/message/template/send?access_token=${access_token}`,
      method: 'post',
      data,
    })
  },
  /**
   * 获取access_token
   * @returns sccess_tokens
   */
  getAccessToken() {
    return axios.get(api_url.wx + `/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
  },
  /**
   * 获取城市位置经纬度
   * @description [https://dev.qweather.com/docs/api/geo/city-lookup/](https://dev.qweather.com/docs/api/geo/city-lookup/)
   * @returns
   */
  getLocalWather() {
    return axios({
      url: api_url.wt + '/v2/city/lookup',
      method: 'get',
      params: {
        location: city_name,
        key: weather_key,
      },
    })
  },
  /**
   *
   * @param {*} latlon
   * @desiription [https://dev.qweather.com/docs/api/weather/weather-now/](https://dev.qweather.com/docs/api/weather/weather-now/)
   * @returns
   */
  getWatherByLocal(latlon) {
    return axios({
      url: 'https://devapi.qweather.com/v7/weather/now',
      method: 'get',
      params: {
        location: latlon,
        key: weather_key,
      },
    })
  },
}
