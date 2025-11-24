
import createHttpClient from './utils/request'
import emitter from './utils/emitter'
import { mqttStart, mqttStop } from './utils/mqtt'
import MyKonva from './utils/MyKonva'
import * as echarts from 'echarts'
import { v4 as uuid } from 'uuid'
import { ElMessage, ElMessageBox } from 'element-plus' 
import useTableHook from './hooks/useTableHook'
import { dateFormat, dateDiff, getDateByTimeOffset, isTimeWithinIntervals,
  exportExcel,exportManySheetExcel, setPosition, formatNumber, getAngle, getMouseAngleToDom, 
  hexToRgba, downloadFile, debounce, throttle, deepClone, listenDomSizeChange,
  isTimeRange, checkPassword, generatePassword, findIntersection, groupByField
} from './utils/common'

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
  dateFormat,
  dateDiff,
  getDateByTimeOffset,
  isTimeWithinIntervals,
  isTimeRange,
  exportExcel,
  exportManySheetExcel,
  setPosition,
  formatNumber,
  getAngle,
  getMouseAngleToDom,
  hexToRgba,
  downloadFile,
  debounce,
  throttle,
  deepClone,
  listenDomSizeChange,
  checkPassword,
  generatePassword,
  findIntersection,
  groupByField
}

export default toolite