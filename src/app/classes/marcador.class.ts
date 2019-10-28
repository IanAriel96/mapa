
// aqui definimos la estructur que van a tener los marcadores
export class Marcador { // importante poner export ya que caso contrario no se podra exportar la clase
    public latitud: number;
    public longitud: number;
    public hora: Date;
    public uv: number;
    public ubicacion: string;
    public coordenadas: number[];
    public color: string;
    constructor( lat: number, lng: number, ubicacion: string, uv: number, hora: any, coordenadas: number[], color: string ) {
        this.latitud = lat;
        this.longitud = lng;
        this.ubicacion = ubicacion;
        this.uv = uv;
        hora.set('hour', hora.hour() + 5); // se compensa la diferencia de horas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5
        this.hora = hora.format('LLL');
        this.coordenadas = coordenadas;
        this.color = color;
    }
}


