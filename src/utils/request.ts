 
import axios, { InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { ElLoading,ElMessage } from 'element-plus'
import JSONbig from 'json-bigint'//解决超过 16 位数字精度丢失问题
export interface InternalRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
}
export interface RequestConfig extends AxiosRequestConfig {
  loading?: boolean;
}
function getCookie(cname:string) {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    if (ca[i].indexOf(name) >= 0) {
      return ca[i].split('=')[1]
    }
  }
  return ''
}

let loading: any
const createHttpClient = (version?: 'new' | 'old') => {
  const service = axios.create({
    transformResponse: [ function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        //  JSONbig.parse(data)
        return JSON.parse(JSON.stringify(JSONbig.parse(data)))
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    } ]
  })
  service.interceptors.request.use((config: InternalRequestConfig) => {
    if (config.url?.includes('token')) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    const hasLoading = Object.hasOwnProperty.call(config, 'loading')
    if (!hasLoading || (hasLoading && config.loading !== false)) {
      loading = ElLoading.service({ fullscreen: true })
    }
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const xsrfToken = getCookie('XSRF-TOKEN')
    if (xsrfToken) {
      config.headers.Requestverificationtoken = xsrfToken
    }
    config.headers['Accept-Language'] = 'zh-CN,zh;q=0.9,en;q=0.8'
    return config
  })
  const specialUrl = [ '/OData', '/token', '/permission', '/identity' ]
  const request = async <_T = any>(config: RequestConfig): Promise<any> => {
    try {
      const { data } = await service.request<any>(config)
      // if (data.code !== 200 && !specialUrl.find(str => config.url?.includes(str))) {
      //   ElMessage.error(data.message)
      // }
      // console.log('data', data)
      if (loading) {
        loading.close()
      }
      if (specialUrl.find(str => config.url?.includes(str))) {
        return data
      }
      if(version === 'old') return data
      if (data.code !== 200) {
        ElMessage.error(data.message)
        return {
          code: -1,
          message: data.message || '',
          data: null as any
        }
      } else {
        return data.data ?? ''
      }
    } catch (err: any) {
      if (loading) {
        loading.close()
      }
      console.log('request err', err)
      const { headers, data, status, message } = err.response
      // console.log('catch', headers)
      if (headers._abperrorformat) {
        const already = data.error && data.error.message.includes('is already taken')
        if (already) {
          const hasRole = data.error.message.includes('Role name')
          if (hasRole) {
            window.$message.error('角色名称已存在')
          }
          const hasUser = data.error.message.includes('Username')
          if (hasUser) {
            ElMessage.error('用户名称已存在')
          }
          if (!hasRole && !hasUser) {
            ElMessage.error(data.error.message)
          }
        } else {
          ElMessage.error(data.error.message)
        }
      } else {
        if (status === 401) {
          ElMessage.warning('登录已失效，请重新登陆')
          localStorage.clear()
          if (window.$router){
            window.$router.push('/login')
          }
        } else if (status === 403) {
          // ElMessage.warning('登录已失效，请重新登陆')
          // localStorage.clear()
          // Router.push('/login')
        }
      }
      return {
        code: -1,
        message: message || err.response.data.error_description || data.error.message || '',
        data: null as any
      }
    }
  }
  
  return request
}

export default createHttpClient