import { LatLngLiteral, LatLng } from '@agm/core';
export class Poligono {
    public paths: Array<LatLngLiteral> = [];
    public color: string;
    public colorFilo: string;
    constructor( paths: Array<LatLngLiteral>, color: string, colorFilo: string) {
        this.color = color;
        this.paths = paths;
        this.colorFilo = colorFilo;
    }
}
