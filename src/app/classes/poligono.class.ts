import { LatLngLiteral, LatLng } from '@agm/core';
export class Poligono {
    public paths: Array<LatLngLiteral> = [];
    public color: string;
    constructor( paths: Array<LatLngLiteral>, color: string) {
        this.color = color;
        this.paths = paths;
    }
}
