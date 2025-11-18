declare module 'georaster' {
  export default function parseGeoraster(input: ArrayBuffer | Blob | File | string): Promise<any>;
}

declare module 'georaster-layer-for-leaflet' {
  export default class GeoRasterLayer {
    constructor(options: any);
    addTo(map: any): this;
    setOpacity(opacity: number): this;
  }
}

declare module 'three' {
  export class Mesh {}
  export class BoxGeometry {}
  export class MeshStandardMaterial {}
  export class PerspectiveCamera {}
  export class Scene {}
  export class WebGLRenderer {}
  export class DirectionalLight {}
  export class AmbientLight {}
  export const ACESFilmicToneMapping: any;
  export const sRGBEncoding: any;
}
