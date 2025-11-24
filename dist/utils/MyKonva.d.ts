import { LineJoin } from 'konva/lib/Shape';
export interface Params {
    container: string;
    width: number;
    height: number;
}
export interface Text {
    id?: string;
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    color?: string;
}
export interface Img {
    id?: string;
    url: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    scale?: number;
}
export interface Line {
    id?: string;
    points: number[];
    color?: string;
    width?: number;
    lineGap?: string;
    lineJoin?: LineJoin;
}
export interface MyKonvaType {
    addTexts(texts: Text[]): void;
    addImages(imgs: Img[]): void;
    addLines(lines: Line[]): void;
    setState(params: {
        targetId: string;
        layerName?: string;
        color: string;
        type: string;
    }): void;
}
declare class MyKonva implements MyKonvaType {
    private params;
    private stage;
    private layers;
    constructor(params: Params);
    private addLayer;
    addTexts(texts: Text[], newLayer?: string): void;
    addImages(imgs: Img[], newLayer?: string): void;
    addLines(lines: Line[], newLayer?: string): void;
    setState({ layerName, targetId, color, type }: {
        targetId: string;
        layerName?: string;
        color: string;
        type: string;
    }): void;
}
export default MyKonva;
