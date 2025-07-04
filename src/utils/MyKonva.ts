import Konva from 'konva'
import { LineJoin } from 'konva/lib/Shape'
export interface Params {
  container: string
  width: number
  height: number
}
export interface Text {
  id?: string
  text: string
  x: number
  y: number
  fontSize?: number
  color?: string
}
export interface Img{
  id?: string
  url: string
  x: number
  y: number
  width?: number
  height?: number
  scale?: number
}
export interface Line{
  id?: string
  points: number[]
  color?: string
  width?: number
  lineGap?: string
  lineJoin?: LineJoin
}
export interface MyKonvaType {
  addTexts(texts: Text[]): void
  addImages(imgs: Img[]): void
  addLines(lines: Line[]): void
  setState(params:{targetId: string, layerName?: string,color: string,type:string}): void
}

class MyKonva implements MyKonvaType{
  private stage: Konva.Stage
  private layers: Konva.Layer[]
  constructor(private params: Params) {
    this.stage = new Konva.Stage({
      container: this.params.container,
      width: this.params.width,
      height: this.params.height
    })
    this.layers = []
    this.addLayer()
  }
  private addLayer(name = ''): Konva.Layer {
    const layer = new Konva.Layer({
      name: name || 'layer'
    })
    this.layers.push(layer)
    this.stage.add(layer)
    return layer
  }
  addTexts(texts: Text[],newLayer: string = ''): void {
    let layer = this.layers[this.layers.length - 1]
    if(newLayer){
      layer = this.addLayer(newLayer)
    }
    texts.forEach((text,index) => {
      const textNode = new Konva.Text({
        id: text.id || (index + 1).toString(),
        text: text.text,
        x: text.x,
        y: text.y,
        fontSize: text.fontSize || 12,
        fill: text.color || 'black'
      })
      layer.add(textNode)
    })
    layer.batchDraw()
  }
  addImages(imgs: Img[], newLayer: string = '') {
    let layer = this.layers[this.layers.length - 1]
    if (newLayer) {
      layer = this.addLayer(newLayer)
    }
    imgs.forEach((img,index) => {
      Konva.Image.fromURL(img.url, (darthNode: Konva.Image) => {
        darthNode.setAttrs({
          id: img.id || (index + 1).toString(),
          x: img.x,
          y: img.y,
          width: img.width,
          height: img.height,
          scaleX: img.scale || 1,
          scaleY: img.scale || 1
        })
        layer.add(darthNode)
      })
    })
    layer.batchDraw()
  }
  addLines(lines: Line[], newLayer: string = '') {
    let layer = this.layers[this.layers.length - 1]
    if (newLayer) {
      layer = this.addLayer(newLayer)
    }
    lines.forEach((line,index) => {
      const lineNode = new Konva.Line({
        id: line.id || (index + 1).toString(),
        points: line.points,
        stroke: line.color || 'black',
        strokeWidth: line.width || 1,
        lineGap: line.lineGap || 'butt',
        lineJoin: line.lineJoin || 'miter'
      })
      layer.add(lineNode)
    })
    layer.batchDraw()
    console.log(layer,this.stage)
  }
  setState({ layerName,targetId,color,type } : { targetId: string, layerName?: string, color: string,type: string}){
    const layer = this.stage.children.find(layer => layerName ? layer.attrs.name === layerName : layer.attrs.name === 'layer')
    if(layer){
      const target = layer.children.find(ele => ele.attrs.id === targetId) as Konva.Shape
      if(target){
        // console.log(target)
        if(type === 'line'){
          target.stroke(color)
        }else if(type === 'text'){
          target.fill(color)
        }
        layer.batchDraw()
      }
    }
  }
}

export default MyKonva