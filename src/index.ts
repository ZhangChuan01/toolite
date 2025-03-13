import moment from 'moment'
import XLSX from 'xlsx-js-style'
import axios from 'axios'
/**
 * 格式化时间
* @param {string} date - 待格式化的日期字符串
* @param {string} [type='YYYY-MM-DD HH:mm:ss'] - 可选参数，指定日期的输出格式，默认为 'YYYY-MM-DD HH:mm:ss'
* @param {string} [offset] - 可选参数，时区偏移量
* @returns {string} 格式化后的日期字符串，如果输入无效则返回空字符串
*/
export function dateFormat({ date, type = 'YYYY-MM-DD HH:mm:ss',offset }:{date: string | Date, type?:string,offset?:number}) {
  if (!date) return ''
  if (date && date !== '0001-01-01T00:00:00') {
    return offset ? moment(date).utcOffset(offset).format(type) : moment(date).format(type)
  } else {
    return ''
  }
}

/**
 * 计算两个日期之间的差值
 * @param {Object} options - 包含计算所需信息的对象
 * @param {string} options.start - 开始日期字符串，格式应能被 JavaScript 的 Date 对象解析
 * @param {string} options.end - 结束日期字符串，格式应能被 JavaScript 的 Date 对象解析
 * @param {string} [options.type='days'] - 可选参数，指定要计算的时间差值类型，
 *                                         可以是 years,months,weeks,days,hours,minutes,seconds，默认为 'days'
 * @returns {number} 两个日期之间指定类型的时间差值
 */
export function dateDiff({ start,end,type = 'days' }: {start: string | Date,end: string | Date,type?: string}) {
  if (!start || !end) return 0
  return moment(moment(end)).diff(moment(start),type as moment.unitOfTime.Diff)
}
/**
 * 根据指定的起始时间、时间偏移量、时间单位和返回时间格式获取相应的日期时间
 * 
 * 此函数接收一个包含起始时间、偏移量、时间单位和返回时间格式的对象作为参数，
 * 根据偏移量的正负，使用 moment 库对起始日期时间进行增加或减少操作，
 * 最终返回按照指定格式格式化后的日期时间字符串。
 * 
 * @param {Object} options - 包含时间偏移信息的对象
 * @param {string} [options.startTime] - 可选参数，代表起始时间，默认为当前时间。若提供，格式需能被 moment 解析
 * @param {number} [options.num = 0] - 可选参数，代表时间的偏移量，正数表示往后偏移，负数表示往前偏移，默认为 0
 * @param {string} [options.type = 'd'] - 可选参数，指定时间的单位，支持 moment 库中可用于增减操作的时间单位，如 'd'（天）、'M'（月）、'y'（年）等，默认为 'd'
 * @param {string} [options.format = 'YYYY-MM-DD HH:mm:ss'] - 可选参数，指定返回时间的格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 按照指定格式格式化后的日期时间字符串
 */
export function getDateByTimeOffset({ startTime, num = 0, type = 'd', format = 'YYYY-MM-DD HH:mm:ss' }: { startTime?: string | Date; num?: number; type?: string; format?: string }) {
  let currentMoment = startTime ? moment(startTime) : moment()
  if (num > 0) {
    currentMoment = currentMoment.add(num, type as moment.DurationInputArg2)
  } else if (num < 0) {
    currentMoment = currentMoment.subtract(Math.abs(num), type as moment.DurationInputArg2)
  }
  return currentMoment.format(format)
}
/**
 * 检查给定的时间是否在一组时间区间内
 * 主要用于创建一组时间区间，然后检查给定的时间是否与这些区间内有交集，其中创建的start可以等于其他时间范围的end，创建的end可以等于其他时间范围的start
 * 
 * type为start，则时间可以等于数组内的结束时间，为end则可以等于数组内的开始时间
 * @param {Object} options - 包含检查所需信息的对象
 * @param {string} options.checkTime - 要检查的时间，格式为 'HH:mm:ss'
 * @param {[string, string][]} options.times - 时间区间数组，每个区间由起始时间和结束时间组成，格式为 'HH:mm:ss'
 * @param {string} [options.type = 'start'] - 可选参数，指定是否精确匹配区间的起始时间或结束时间，可选值为 'start' 或 'end'，默认为 'start'
 * @returns {boolean} 如果给定的时间在任意一个时间区间内，返回 true；否则返回 false
 */
export function isTimeWithinIntervals({ checkTime, times, type = 'start' }: { checkTime: string, times: [string, string][], type?: string }) {
  // 检查输入参数是否有效
  if (!checkTime || !times || times.length === 0) {
    return false
  }

  // 将时间字符串转换为 Date 对象
  const convertToDate = (time: string) => new Date('1970-01-01T' + time)
  const checkDate = convertToDate(checkTime)

  // 遍历每个时间区间
  for (let i = 0; i < times.length; i++) {
    const [ startTime, endTime ] = times[i]
    const startDate = convertToDate(startTime)
    const endDate = convertToDate(endTime)

    // 检查是否精确匹配起始时间或结束时间
    if ((type === 'start' && startDate.getTime() === checkDate.getTime()) || (type === 'end' && endDate.getTime() === checkDate.getTime())) {
      return true
    }

    // 处理结束时间早于起始时间的情况
    if (endDate < startDate) {
      const endDateNextDay = new Date('1970-01-02T00:00:00')
      if (isDateBetween(checkDate, startDate, endDateNextDay)) {
        return true
      }
      const startDateMidnight = new Date('1970-01-01T00:00:00')
      if (isDateBetween(checkDate, startDateMidnight, endDate)) {
        return true
      }
    } else {
      if (isDateBetween(checkDate, startDate, endDate)) {
        return true
      }
    }
  }

  return false
}

/**
 * 检查一个 Date 对象是否在另外两个 Date 对象之间
 * 
 * @param {Date} date - 要检查的 Date 对象
 * @param {Date} start - 起始 Date 对象
 * @param {Date} end - 结束 Date 对象
 * @returns {boolean} 如果 date 在 start 和 end 之间，返回 true；否则返回 false
 */
function isDateBetween(date: Date, start: Date, end: Date): boolean {
  return date > start && date < end
}
/**
 * 导出数据为 Excel 文件
 * @param {Object} options - 包含导出所需信息的对象
 * @param {any[][]} options.data - 要导出为 Excel 的二维数组数据，数组的每一项代表一行数据
 * @param {number} [options.wpx = 150] - 可选参数，指定 Excel 表格中每列的宽度，默认为 150
 * @param {string} [options.fileName] - 可选参数，指定导出的 Excel 文件的文件名。若未提供，
 *                                       则使用当前日期格式化后的字符串作为文件名
 */
export function exportExcel({ data,wpx = 150,fileName }:{data: any[][],wpx?: number, fileName?: string}) {
  const ws = XLSX.utils.aoa_to_sheet(data)
  const arr: XLSX.ColInfo[] = []
  for (let i = 0; i < data[0].length; i++) {
    arr.push({
      wpx
    })
  }
  ws['!cols'] = arr
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'sheed')
  XLSX.writeFile(wb, (fileName || moment().format('YYYYMMDDHHmmss')) + '.xlsx')
}
function directionToAngle(direction: string): number {
  const map: Record<string, number> = {
    'top': 0,
    'right': 90,
    'bottom': 180,
    'left': 270
  }
  return map[direction.toLowerCase()] === undefined ? 0 : map[direction.toLowerCase()]
}
/**
 * 在圆形布局中精确定位元素，支持自定义起始角度和旋转方向
 * @param {Object} config - 定位配置对象
 * @param {string | HTMLElement} config.dom - 目标元素，支持选择器字符串或DOM对象
 * @param {number} config.angle - 定位角度（基于起始角度的偏移量）
 * @param {number} config.radius - 定位半径（距离圆心的像素值）
 * @param {boolean} [config.rotate=false] - 是否使元素跟随角度旋转
 * @param {{x: number, y: number}} [config.center] - 自定义圆心坐标（默认使用父容器中心）
 * @param {number | string} [config.startAngle=90] - 角度起始方向，支持数字或方向字符串：
 *   - 数字：数学坐标系角度（0度指向正上方，90度指向正右）
 *   - 字符串：'top' | 'right' | 'bottom' | 'left'（默认'top'）
 * @param {boolean} [config.clockwise=true] - 旋转方向，true为顺时针，false为逆时针
 */
export function setPosition({ dom, angle, radius, rotate = false, center,startAngle = 0,clockwise = true }:
  {
    dom: string | HTMLElement, angle: number, radius: number, rotate?: boolean, center?: { x: number, y: number }, startAngle?: number | string,
    clockwise?: boolean }) {
  let node: HTMLElement | null = null
  if (typeof dom === 'string') {
    node = document.querySelector(dom)
  } else {
    node = dom
  }
  if (!node) return

  // 处理起始角度转换
  const baseAngle = typeof startAngle === 'string' ? directionToAngle(startAngle) : startAngle

  // 转换为数学坐标系角度（从x轴右侧开始逆时针）
  const mathAngle = baseAngle - 90

  // 计算最终角度（考虑旋转方向）
  let finalAngle = clockwise ? angle : -angle
  finalAngle = mathAngle + finalAngle

  // 极坐标转换（适配屏幕坐标系Y轴向下）
  const rad = finalAngle * Math.PI / 180
  const x = Math.cos(rad) * radius  // 注意使用cos计算x
  const y = Math.sin(rad) * radius  // 保持y轴正向向下

  node.style.position = 'absolute'

  if (!center) {
    // 父容器中心为原点：使用双重 translate 调整中心点
    const transform = rotate ? `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)` : `translate(-50%, -50%) translate(${x}px, ${y}px)`
    node.style.transform = transform
    node.style.left = '50%'
    node.style.top = '50%'
  } else {
    // 指定圆心坐标时，直接计算绝对位置并调整中心点
    node.style.transform = rotate ? `translate(-50%, -50%) rotate(${angle}deg)` : 'translate(-50%, -50%)'
    node.style.left = `${center.x + x}px`
    node.style.top = `${center.y + y}px`
  }
}
/**
 * 安全截断数值（不四舍五入），避免科学计数法和精度丢失问题
 * @param number 待处理的数字（可接受字符串输入确保精度）
 * @param decimal 保留的小数位数（默认2，自动转为非负整数）
 * @returns 截断后的数字或原字符串（若输入为字符串）
 */
export function formatNumber(
  number: number | string | null | undefined,
  decimal: number = 2
): number | string | undefined {
  if (!number) return 0

  // 处理字符串输入（如大数传成字符串避免精度丢失）
  if (typeof number === 'string') {
    return handleStringInput(number, decimal)
  }

  // 处理科学计数法并截断
  const decimalDigits = Math.max(0, Math.floor(decimal))
  const factor = 10 ** decimalDigits
  return Math.trunc(number * factor) / factor
}

/**
 * 处理字符串类型的数字（直接操作字符串避免精度丢失）
 */
function handleStringInput(numStr: string, decimal: number): string | number {
  const decimalDigits = Math.max(0, Math.floor(decimal))
  const [ integerPart, fractionalPart = '' ] = numStr.split('.')

  // 直接截断小数部分（不四舍五入）
  const truncatedFraction = fractionalPart.slice(0, decimalDigits)
  const result = decimalDigits === 0
    ? integerPart
    : `${integerPart}.${truncatedFraction.padEnd(decimalDigits, '0')}`

  // 返回字符串或自动转换回数字（根据是否丢失精度）
  return isSafeToConvert(result) ? Number(result) : result
}

/**
 * 检查转换后的字符串是否在 JS 安全精度范围内
 */
function isSafeToConvert(numStr: string): boolean {
  return Math.abs(Number(numStr)) <= Number.MAX_SAFE_INTEGER
}
/**
 * 计算从 point2 到 point1 的角度（以度为单位），角度范围在 0 到 360 度之间
 * 
 * 以point坐标左上角为0,0点，向右增加X，向下增加Y
 * @param {[number, number]} point1 - 第一个点的坐标，格式为 [x, y]
 * @param {[number, number]} point2 - 第二个点的坐标，格式为 [x, y]
 * @returns {number} 从 point2 到 point1 的角度，范围在 0 到 360 度之间
 * @throws {Error} 如果传入的参数不是长度为 2 的数组，将抛出错误
 */
export function getAngle(point1: [number, number], point2: [number, number]) {
  if (!Array.isArray(point1) || point1.length !== 2 || !Array.isArray(point2) || point2.length !== 2) {
    throw new Error('输入的参数必须是长度为 2 的数组，表示 [x, y] 坐标')
  }
  const deltaX = point1[0] - point2[0]
  const deltaY = point1[1] - point2[1]
  const angle = Math.atan2(-deltaX, deltaY) * (180 / Math.PI)
  return Math.floor(angle > 0 ? angle : angle === 0 ? 0 : angle + 360)
}
/**
 * 计算鼠标位置相对于指定 DOM 元素中心点的角度
 * 
 * 该函数接收一个包含鼠标事件对象和 DOM 元素信息的对象作为参数
 * 
 * @param {Object} options - 包含计算所需信息的对象
 * @param {MouseEvent} options.e - 鼠标事件对象，用于获取鼠标的位置
 * @param {HTMLElement | string} options.dom - 指定的 DOM 元素，可以是 HTMLElement 实例，
 *                                             也可以是用于查询 DOM 元素的选择器字符串
 * @returns {number} 鼠标位置相对于指定 DOM 元素中心点的角度，若无法获取 DOM 元素信息则返回 0
 */
export function getMouseAngleToDom({ e,dom }:{e: MouseEvent,dom:HTMLElement|string}): number {
  const clientX = e.clientX
  const clientY = e.clientY
  const rect = dom instanceof HTMLElement ? dom.getBoundingClientRect() : document.querySelector(dom)?.getBoundingClientRect()
  if (!rect) return 0
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const angle = getAngle([ centerX, centerY ], [ clientX, clientY ])
  return angle
}

/**
 * 将十六进制颜色值转换为带有透明度的 RGBA 颜色值字符串
 * 
 * 此函数接收一个十六进制颜色值和一个可选的透明度值作为输入，
 * 先对输入的十六进制颜色值和透明度值进行有效性验证，
 * 若输入有效，则将十六进制颜色值转换为对应的 RGB 值，并与透明度值组合成 RGBA 颜色值字符串；
 * 若输入无效，则返回空字符串
 * 
 * @param {string} hex - 要转换的十六进制颜色值，格式应为 #RRGGBB
 * @param {number} [opacity = 1] - 可选参数，透明度值，范围在 0 到 1 之间，默认为 1
 * @returns {string} 转换后的 RGBA 颜色值字符串（格式为 "rgba(R, G, B, A)"），若输入无效则返回空字符串
 * 
 */
export function hexToRgba(hex: string, opacity = 1): string {
  if (/^#[A-Fa-f0-9]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  }
  const hexRegex = /^#([A-Fa-f0-9]{6})$/
  if (!hexRegex.test(hex) || opacity < 0 || opacity > 1) return ''
  // 提取十六进制颜色值中的 R、G、B 部分并转换为十进制
  const hexToDec = (start: number, end: number) => parseInt(hex.slice(start, end), 16)
  const r = hexToDec(1, 3)
  const g = hexToDec(3, 5)
  const b = hexToDec(5, 7)
  // 拼接 RGBA 颜色值字符串
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
interface DownloadParams {
  url: string;
  method?: string;
  fileName?: string;
  data?: any;
  errorCallback?: () => void;
}

/**
 * 下载文件函数
 * @param {DownloadParams} 配置参数 
 *  - url: 请求地址（必需）
 *  - method: 请求方法（默认'get'）
 *  - fileName: 指定文件名（可选，优先使用）
 *  - data: 请求参数（根据请求方法自动处理）
 *  - errorCallback: 错误回调函数（可选）
 */
export async function downloadFile({
  url,
  method = 'get',
  fileName,
  data,
  errorCallback
}: DownloadParams) {
  try {
    // 构造axios请求配置
    const config = {
      url,
      method,
      responseType: 'blob' as const,
      // 根据请求方法自动处理参数位置
      ...(data && (method.toLowerCase() === 'get' ? { params: data } : { data }))
    }

    // 发送请求并获取响应
    const response = await axios(config)

    // 响应数据类型校验
    if (!(response.data instanceof Blob)) {
      throw new Error('响应不是文件流类型')
    }

    // 处理错误响应（JSON格式）
    if (response.data.type === 'application/json') {
      const errorData = await new Response(response.data).json()
      console.error('服务端返回错误:', errorData)
      errorCallback?.()
      return
    }

    // 获取文件名逻辑
    const finalFileName = fileName || extractFileNameFromHeaders(response.headers as any)

    // 文件名合法性检查
    if (!finalFileName) {
      console.error('无法获取有效的文件名')
      errorCallback?.()
      return
    }

    // 触发文件下载
    triggerBlobDownload(response.data, finalFileName)

  } catch (error) {
    console.error('文件下载失败:', error)
    errorCallback?.()
  }
}

/**
 * 从响应头中提取文件名
 * @param headers 响应头对象
 * @returns 解析出的文件名，未找到返回空字符串
 */
function extractFileNameFromHeaders(headers: Record<string, string>): string {
  // 优先从Content-Disposition头解析
  const disposition = headers['content-disposition'] || ''
  const fileNameMatch = disposition.match(
    /filename\*?=((UTF-8''[^;]+)|((["'])(.*?)\4)|([^;]+))/ig
  )

  if (fileNameMatch) {
    console.log('fileNameMatch', fileNameMatch)
    const fileName = fileNameMatch.find(file => file.includes('utf-8') || file.includes('UTF-8')) || fileNameMatch[0]
    // 处理编码文件名（RFC 5987）
    if (fileName.includes('UTF-8\'\'') || fileName.includes('utf-8\'\'')) {
      try {
        return decodeURIComponent(fileName.split('\'')[2])
      } catch {
        return fileName.split('\'')[2] // 降级处理
      }
    }
    // 去除包裹的引号
    return fileName.replace(/^["']|["']$/g, '')
  }

  // 次之从Content-Type解析扩展名
  const contentType = headers['content-type'] || ''
  const extension = contentType.split('/').pop()?.split(';')[0]
  return extension ? `download.${extension}` : ''
}

/**
 * 触发浏览器文件下载
 * @param blob 文件二进制数据
 * @param fileName 下载文件名
 */
function triggerBlobDownload(blob: Blob, fileName: string): void {
  // IE10+兼容处理
  if ('msSaveOrOpenBlob' in navigator) {
    (navigator as any).msSaveBlob(blob, fileName)
    return
  }

  // 创建临时链接
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  // 设置链接属性
  link.href = url
  link.download = fileName
  link.style.display = 'none'

  // 加入文档结构（兼容Firefox）
  document.body.appendChild(link)

  try {
    // 模拟点击事件
    link.click()
  } finally {
    // 清理DOM和内存
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 100) // 延迟释放内存
  }
}
/**
 * 创建一个防抖函数，该函数在指定的延迟时间内，若多次触发，只有最后一次触发会真正执行传入的函数
 * 若设置 immediate 为 true，则第一次触发时会立即执行函数，后续在延迟时间内的触发会被忽略
 * 
 * @param {Function} func - 需要进行防抖处理的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} [immediate = false] - 可选参数，是否在第一次触发时立即执行函数，默认为 false
 * @returns {Function & { cancel: () => void }} - 返回一个防抖后的函数，该函数包含一个 cancel 方法用于取消正在等待执行的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
): ((...args: Parameters<T>) => ReturnType<T>) & { cancel: () => void } => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let result: ReturnType<T>

  // 定义防抖函数
  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    // 若存在正在等待执行的定时器，清除它
    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, delay)
      if (callNow) {
        // 立即执行函数
        result = func.apply(this, args)
        return result
      }
    } else {
      timeout = setTimeout(() => {
        // 延迟执行函数
        func.apply(this, args)
      }, delay)
    }
    return result
  }

  // 定义取消方法
  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  };

  // 将 cancel 方法挂载到防抖函数上
  (debounced as any).cancel = cancel

  return debounced as ((...args: Parameters<T>) => ReturnType<T>) & { cancel: () => void }
}
/**
 * 创建一个节流函数，限制函数在指定的时间间隔内只能执行一次。
 * 节流函数可以控制函数的调用频率，确保在一段时间内只执行一次函数。
 * 可以通过配置选项控制首次调用和最后一次调用的执行时机。
 * 
 * @param {Function} func - 需要进行节流处理的函数。
 * @param {number} wait - 节流的时间间隔（毫秒），在该时间内函数只能执行一次。
 * @param {Object} [options={ leading: true, trailing: false }] - 可选配置对象，包含以下属性：
 *   - {boolean} [leading=true] - 是否允许在节流开始时立即执行函数。
 *   - {boolean} [trailing=false] - 是否允许在节流结束后执行最后一次函数调用。
 * @returns {Function} - 返回一个节流后的函数。
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: false }
): (...args: Parameters<T>) => ReturnType<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let args: Parameters<T> | null = null
  let result: ReturnType<T>
  let previousTime = 0

  const later = function (this: ThisParameterType<T>) {
    previousTime = options.leading === false ? 0 : Date.now()
    timeout = null
    if (args) {
      result = func.apply(this, args)
    }
    if (!timeout) {
      args = null
    }
  }

  const throttled = function (this: ThisParameterType<T>, ...newArgs: Parameters<T>): ReturnType<T> {
    const now = Date.now()
    if (!previousTime && options.leading === false) {
      previousTime = now
    }
    const remaining = wait - (now - previousTime)
    args = newArgs

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previousTime = now
      result = func.apply(this, args)
      if (!timeout) {
        args = null
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later.bind(this), remaining)
    }
    return result
  }

  return throttled
}
export function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (map.has(obj)) {
    return map.get(obj)
  }

  let clone

  if (Array.isArray(obj)) {
    clone = []
    map.set(obj, clone)
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepClone(obj[i], map)
    }
  } else if (obj instanceof Date) {
    clone = new Date(obj.getTime())
    map.set(obj, clone)
  } else if (obj instanceof RegExp) {
    clone = new RegExp(obj)
    map.set(obj, clone)
  } else if (typeof obj === 'function') {
    // 简单处理函数，可根据需求完善
    clone = obj.bind({})
    map.set(obj, clone)
  } else {
    clone = {}
    map.set(obj, clone)
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = deepClone(obj[key], map)
      }
    }
  }

  return clone
}
/**
 * 判断时间是否在指定时间范围内
 * @param {String | Date}time 传入时间可以是String或Date
 * @param {String}startTime 开始时间
 * @param {String}endTime 结束时间
 * @returns {Boolean}
 */
export function isTimeRange(time: string | Date, startTime: string, endTime: string) {
  const start = timeToSeconds(startTime)
  const end = timeToSeconds(endTime)
  const currentTime = timeToSeconds(moment(time).format('HH:mm:ss'))
  if(start <= end){
    return currentTime >= start && currentTime < end
  }else{
    return currentTime >= start || currentTime < end
  }
}
const timeToSeconds = timeStr => {
  const [ hours, minutes, seconds ] = timeStr.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}
const toolite = {
  dateFormat,
  dateDiff,
  getDateByTimeOffset,
  isTimeWithinIntervals,
  exportExcel,
  setPosition,
  formatNumber,
  getAngle,
  getMouseAngleToDom,
  hexToRgba,
  downloadFile,
  debounce,
  throttle,
  deepClone,
  isTimeRange
}
export default toolite