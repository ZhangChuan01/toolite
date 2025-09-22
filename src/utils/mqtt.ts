import mqtt from 'mqtt'
import emitter from './emitter'

let mqttUrl = ''
if (process.env.NODE_ENV === 'development') {
  mqttUrl = 'ws://192.168.8.107:8083'
} else {
  // mqttUrl = 'http://192.168.8.45:8083/mqtt'
  mqttUrl = window.location.origin
}
function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(32).substring(1)
}
const MathRandom = (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())

const options = {
  username: 'admin',
  password: '1qaz@WSX',
  clean: true, // true: 清除会话, false: 保留会话
  connectTimeout: 4000, // 超时时间
  clientId: 'clientid-' + MathRandom,
  path: '/mqtt'
}
const topics = [ 'MqCoalInventoryLogF','MqCoalInventoryProgressB' ]
let client: any = null
export function mqttStart({username, password, customTopics}:{
  username?: string,
  password?: string,
  customTopics?: string[]
}) {
  console.log('mqttStart', username, password, customTopics)
  if(username) options.username = username
  if(password) options.password = password
  console.log('连接mqtt', options, mqttUrl)
  if(client && client.connected) return
  client = mqtt.connect(mqttUrl, options)
  // const client = mqtt.connect(, options)
  client.on('connect', (e: {}) => {
    console.log('web连接成功', e)
    topics.forEach(topic => {
      client.subscribe(topic)
    })
    if(customTopics) customTopics.forEach(topic => {
      client.subscribe(topic)
    })
  })
  // 断开发起重连
  client.on('reconnect', (error: {}) => {
    console.log('web正在重连...', error)
  })
  // 链接异常处理
  client.on('error', (error: {}) => {
    console.log('web连接失败...', error)
  })

  client.on('message', (topic: string, message: any) => {
    console.log('mmm', topic, message)
    try {
      const msg = JSON.parse(message.toString())
      console.log('mqttttttttttttttt',topic, msg)
      emitter.emit(topic, msg)
    } catch (error) {
      console.log(error)
    }
  })
}
export function mqttStop() {
  console.log('断开')
  if (client && client.connected) {
    try {
      client.end(false, () => {
        console.log('mqtt断开成功')
      })
    } catch (error) {
      console.log('mqtt断开失败', error)
    }
  }
}
// mqttStart()
