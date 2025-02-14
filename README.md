toolite
================
### 一个简易的人工具库
#### 如何使用
##### 1. 安装
    yarn add toolite --save
    npm install toolite --save
##### 2. 引入    
    import toolite from 'toolite'    
##### 3. 使用     
    可以在使用的地方直接引入整个工具或者单个函数    
    个人喜欢以下操作以便于在script和template中全局使用    
    在main.ts中加入以下代码    
    declare module '@vue/runtime-core' {
        interface ComponentCustomProperties {
            $toolite: typeof toolite
        }
    }     
    window.$toolite = toolite     

    const app = createApp(App)   

    app.config.globalProperties.$toolite = toolite     

    在vite-env.d.ts中加入以下代码       

    interface Window {
        $toolite: typeof import('toolite').default
    }      

    
##### 4. 函数简单介绍          

| 函数名                | 简单描述（具体函数参数可在使用时看ts提示）                           |
| --------------------- | ------------------------------ |
| dateFormat            | 格式化时间                      |
| dateDiff              | 计算时间差，不局限于天，月等单位    |
| getDateByTimeOffset   | 根据指定的起始时间、时间偏移量、时间单位和返回时间格式获取相应的日期时间    |
| isTimeWithinIntervals   | 检查给定的时间是否在一组时间区间内（针对于格式为HH:mm:ss的时间）    |
| exportExcel   | 导出数据为 Excel 文件    |
| setPosition   | 根据角度和半径指定元素位置，支持自定义圆心位置，起始角度和旋转方向    |
| formatNumber   | 安全截断数值（不四舍五入），避免科学计数法和精度丢失问题    |
| getAngle   | 计算从两点的角度（以度为单位），角度范围在 0 到 360 度之间    |
| getMouseAngleToDom   | 计算鼠标位置相对于指定 DOM 元素中心点的角度    |
| hexToRgba   | 将十六进制颜色值转换为带有透明度的 RGBA 颜色值字符串    |
| downloadFile   | 下载文件    |
| debounce   | 防抖    |
| throttle   | 节流    |
| deepClone   | 深克隆    |