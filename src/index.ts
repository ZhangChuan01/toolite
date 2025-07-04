
import createHttpClient from './utils/request'
import emitter from './utils/emitter'
import { mqttStart, mqttStop } from './utils/mqtt'
import MyKonva from './utils/MyKonva'
import * as echarts from 'echarts'
import { v4 as uuid } from 'uuid'
import { ElMessage, ElMessageBox } from 'element-plus' 
import useTableHook from './hooks/useTableHook'
import * as common from './utils/common'
const toolite = {
  createHttpClient,
  emitter,
  mqttStart,
  mqttStop,
  MyKonva,
  echarts,
  uuid,
  message: ElMessage,
  messageBox: ElMessageBox,
  confirm: ElMessageBox.confirm,
  alert: ElMessageBox.alert,
  tableHook: useTableHook,
  ...common
}
export default toolite