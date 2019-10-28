export interface RespuestaRadiacion {
  radiacion: Radiacion[];
}

export interface Radiacion {
  _id: string;
  ubicacion: string;
  uv: number;
  hora: Date;
  latitud: number;
  longitud: number;
  coordenadas: number [];
}

