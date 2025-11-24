/**
 * 格式化时间
* @param {string} date - 待格式化的日期字符串
* @param {string} [type='YYYY-MM-DD HH:mm:ss'] - 可选参数，指定日期的输出格式，默认为 'YYYY-MM-DD HH:mm:ss'
* @param {string} [offset] - 可选参数，时区偏移量
* @returns {string} 格式化后的日期字符串，如果输入无效则返回空字符串
*/
export declare function dateFormat({ date, type, offset }: {
    date: string | Date;
    type?: string;
    offset?: number;
}): string;
/**
 * 计算两个日期之间的差值
 * @param {Object} options - 包含计算所需信息的对象
 * @param {string} options.start - 开始日期字符串，格式应能被 JavaScript 的 Date 对象解析
 * @param {string} options.end - 结束日期字符串，格式应能被 JavaScript 的 Date 对象解析
 * @param {string} [options.type='days'] - 可选参数，指定要计算的时间差值类型，
 *                                         可以是 years,months,weeks,days,hours,minutes,seconds，默认为 'days'
 * @returns {number} 两个日期之间指定类型的时间差值
 */
export declare function dateDiff({ start, end, type }: {
    start: string | Date;
    end: string | Date;
    type?: string;
}): number;
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
export declare function getDateByTimeOffset({ startTime, num, type, format }: {
    startTime?: string | Date;
    num?: number;
    type?: string;
    format?: string;
}): string;
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
export declare function isTimeWithinIntervals({ checkTime, times, type }: {
    checkTime: string;
    times: [string, string][];
    type?: string;
}): boolean;
/**
 * 导出数据为 Excel 文件
 * @param {Object} options - 包含导出所需信息的对象
 * @param {any[][]} options.data - 要导出为 Excel 的二维数组数据，数组的每一项代表一行数据
 * @param {number} [options.wpx = 150] - 可选参数，指定 Excel 表格中每列的宽度，默认为 150
 * @param {string} [options.fileName] - 可选参数，指定导出的 Excel 文件的文件名。若未提供则只有时间戳
 * @param {boolean} [options.fileNameNeedTime = true] - 可选参数，指定是否在文件名中包含时间戳
 * @param {any[]} [options.merges] - 可选参数，指定需要合并的单元格，例如:[{ s: { c: 0, r: 0 }, e: { c: 1, r: 0 } }]
 * @param {string} [options.sheetName] - 可选参数，指定要导出的Excel的sheet名称
 *
 */
export declare function exportExcel({ data, wpx, fileName, fileNameNeedTime, merges, sheetName, horizontal, vertical }: {
    data: any[][];
    wpx?: number;
    fileName?: string;
    fileNameNeedTime?: boolean;
    merges?: any[];
    sheetName?: string;
    horizontal?: string;
    vertical?: string;
}): void;
export declare function exportManySheetExcel({ fileName, fileNameNeedTime, sheetData }: {
    fileName?: string;
    fileNameNeedTime?: boolean;
    sheetData: {
        data: any[][];
        wpx?: number;
        merges?: any[];
        sheetName?: string;
        horizontal?: string;
        vertical?: string;
    }[];
}): void;
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
export declare function setPosition({ dom, angle, radius, rotate, center, startAngle, clockwise }: {
    dom: string | HTMLElement;
    angle: number;
    radius: number;
    rotate?: boolean;
    center?: {
        x: number;
        y: number;
    };
    startAngle?: number | string;
    clockwise?: boolean;
}): void;
/**
 * 安全截断数值（不四舍五入），避免科学计数法和精度丢失问题
 * @param number 待处理的数字（可接受字符串输入确保精度）
 * @param decimal 保留的小数位数（默认2，自动转为非负整数）
 * @returns 截断后的数字或原字符串（若输入为字符串）
 */
export declare function formatNumber(number: number | string | null | undefined, decimal?: number, round?: boolean): number | string;
/**
 * 计算从 point2 到 point1 的角度（以度为单位），角度范围在 0 到 360 度之间
 *
 * 以point坐标左上角为0,0点，向右增加X，向下增加Y
 * @param {[number, number]} point1 - 第一个点的坐标，格式为 [x, y]
 * @param {[number, number]} point2 - 第二个点的坐标，格式为 [x, y]
 * @returns {number} 从 point2 到 point1 的角度，范围在 0 到 360 度之间
 * @throws {Error} 如果传入的参数不是长度为 2 的数组，将抛出错误
 */
export declare function getAngle(point1: [number, number], point2: [number, number]): number;
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
export declare function getMouseAngleToDom({ e, dom }: {
    e: MouseEvent;
    dom: HTMLElement | string;
}): number;
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
export declare function hexToRgba(hex: string, opacity?: number): string;
export interface DownloadParams {
    url: string;
    method?: string;
    fileName?: string;
    data?: any;
    errorCallback?: (error?: any) => void;
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
export declare function downloadFile({ url, method, fileName, data, errorCallback }: DownloadParams): Promise<void>;
/**
 * 创建一个防抖函数，该函数在指定的延迟时间内，若多次触发，只有最后一次触发会真正执行传入的函数
 * 若设置 immediate 为 true，则第一次触发时会立即执行函数，后续在延迟时间内的触发会被忽略
 *
 * @param {Function} func - 需要进行防抖处理的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} [immediate = false] - 可选参数，是否在第一次触发时立即执行函数，默认为 false
 * @returns {Function & { cancel: () => void }} - 返回一个防抖后的函数，该函数包含一个 cancel 方法用于取消正在等待执行的函数
 */
export declare const debounce: <T extends (...args: any[]) => any>(func: T, delay: number, immediate?: boolean) => ((...args: Parameters<T>) => ReturnType<T>) & {
    cancel: () => void;
};
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
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): (...args: Parameters<T>) => ReturnType<T>;
export declare function deepClone(obj: any, map?: WeakMap<object, any>): any;
/**
 * 判断时间是否在指定时间范围内
 * @param {String | Date}time 传入时间可以是String或Date
 * @param {String}startTime 开始时间
 * @param {String}endTime 结束时间
 * @returns {Boolean}
 */
export declare function isTimeRange(time: string | Date, startTime: string, endTime: string): boolean;
/**
 * 监听DOM尺寸变化，并执行一个回调函数
 * @param dom 要监听的DOM，可以是DOM元素或选择器
 * @param callback 尺寸变化时执行的回调函数
 * @returns
 */
export declare const listenDomSizeChange: (dom: HTMLElement | string, callback: () => void) => void;
/**
 * 检查密码是否符合要求
 * @param {string} word - 要检查的密码
 * @returns {boolean} - 如果密码符合要求，返回true，否则返回false
 * */
export declare function checkPassword(word: string): boolean;
/**
 * 生成随机密码
 * @returns {string} 随机密码
 * */
export declare function generatePassword(): string;
/**
 * 给出容器宽高以及角度，计算出中心点往角度方向延伸的一条线与容器边界的交点
 * @param width 容器宽
 * @param height 容器高
 * @param angleDegrees 角度
 * @returns { x: number, y: number } 交点
 */
export declare function findIntersection(width: any, height: any, angleDegrees: any): {
    x: any;
    y: any;
};
/**
 * 一维数组转二维数组
 * @param {Object} options - 参数对象
 * @param {string} options.list - 需要转化的数组
 * @param {string} options.groupId - 对象数组中的指定字段名，用于分组
 * @param {string} [options.isSort=true] - 可选参数，是否需要排序，默认为 true
 * @returns {Array} 转换后的数组
 */
export declare function groupByField({ list, groupId, isSort }: {
    list: any[];
    groupId: string;
    isSort?: boolean;
}): any[];
