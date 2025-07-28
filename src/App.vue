<script setup lang='ts'>
import toolite from './index'

const testExportExcel = () => {
  const data = [
    [ '姓名', '年龄' ],
    [ '张三', 20 ],
    [ '李四', 25 ]
  ]
  toolite.exportExcel({
    data,
    fileName: 'aaa',
    vertical: 'center',
    horizontal: 'center'
  })
}
const testExportManySheetExcel = () => {
  const data1 = [
    [ '姓名', '年龄' ],
    [ '张三11111111', 20 ],
    [ '李四111111111', 25 ]
  ]
  const data2 = [
    [ '姓名', '年龄' ],
    [ '张三222222222', 20 ],
    [ '李四2222222222', 25 ]
  ]
  toolite.exportManySheetExcel({
    fileName: 'manysheet',
    sheetData: [
      { data: data1, sheetName: 'sheet123',vertical: 'center',horizontal: 'center' },
      { data: data2, sheetName: 'sheet2234',vertical: 'center',horizontal: 'center' }
    ]
  })
}
const setPoint = () => {
  toolite.setPosition({
    dom: '.point',
    angle: 0,
    radius: 50,
    startAngle: 'top'
  })
}
const addMouseMoveEvent = () => {
  document.addEventListener('mousemove', e => {
    // console.log(toolite.getMouseAngleToDom({
    //   e,
    //   dom: '.point'
    // }))
  })
}
const a = { x: 10 }
const b = toolite.deepClone(a)
b.x = 100

const listenDom = () => {
  toolite.listenDomSizeChange('body', () => {
    console.log('body')
  })
}
onMounted(() => {
  setPoint()
  addMouseMoveEvent()
  listenDom()
})
</script>

<template>
  <div>
    {{ toolite.dateFormat({date: new Date()}) }}
  </div>
  <div>
    {{ toolite.dateDiff({
      start: new Date('2025-01-01'),
      end: new Date(),
      type: 'days'
    }) }}
  </div>
  <button @click="testExportExcel">
    导出Excel
  </button>
  <button @click="testExportManySheetExcel">
    导出多个sheet的Excel
  </button>
  <div class="point-wrapper">
    <div class="point">
      90
    </div>
  </div>
  <div>{{ toolite.formatNumber(12345.678901234567890123456789,2) }}</div>
  <div>{{ toolite.getDateByTimeOffset({startTime: new Date(),num:1,type:'d',format:'YYYY-MM-DD HH:mm:ss'}) }}</div>
  <div>{{ toolite.getAngle([0,0],[1,1]) }}</div>
  <div>
    {{ toolite.isTimeWithinIntervals({
      checkTime: "12:00:00",
      times: [
        ["09:00:00", "12:00:00"],
        ["13:00:00", "18:00:00"]
      ],
      type: 'start'
    }) }}
  </div>
  <div :style="{color: toolite.hexToRgba('#FF0000')}">
    {{ toolite.hexToRgba('#FF0000') }}
  </div>
  <div>{{ a }},{{ b }}</div>
</template>
<style lang="scss" scoped>
.point-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  .point {
    width: 40px;
    height: 40px;
    background-color: red;
  }
}
</style>
