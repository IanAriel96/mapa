import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { Poligono } from '../../classes/poligono.class';
import { LatLngLiteral} from '@agm/core';
import { RadiacionService } from '../../services/radiacion.service';
import { Radiacion } from '../../interfaces/interfaces';
import { interval, fromEvent } from 'rxjs';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page implements OnInit {
  public radiacion: Radiacion[] = []; // array del tipo radiacion que almacena objetos JSON
  public marcadoresBase: Marcador[] = []; // marcadores de la base como objetos JavaScript
  public poligonos: Array<Poligono> = [];
  public lat = -0.211; // esta informacion es utilizada para mostrar la lat y lng del donde queremos el mapa
  public lng = -78.5;
  public moment = require('moment'); // sera utilizada para hacer el cambio de json.hora a una variable moment ya que con Date no vale

  constructor(private RadiacionService: RadiacionService,
              // private markerManager: MarkerManager,
              // private mapWrapper: GoogleMapsAPIWrapper
    ) {
}
  ngOnInit() {
    // const contador = interval(5000);
    // contador.subscribe((n) => {
    //   this.funcionAsync().then(result => console.log(result)).catch(e => console.log (`Error capturadoo:${e}`));
    //   console.log(`cada ${n} segundos`);
    // });
    this.RadiacionService.getRecientes().subscribe(resp => {  // antigua forma de solicitar el servicio
      this.radiacion.push( ...resp.radiacion);
      this.mapJsonToObject(this.radiacion, this.marcadoresBase);
      this.dibujarPoligono(this.marcadoresBase, this.poligonos);
    });
  }
  public funcionAsync = async () => {
    try {
    await this.RadiacionService.getRecientes().subscribe(resp => { // await quiere decir espera a una promesa de forma asincrona en este caso la promesa es la resp de la BD
     // console.log('antes de limpiar radiacion:', this.radiacion);
      this.radiacion.push(...resp.radiacion);
     // console.log('despues de actualizar radiacion:', this.radiacion);
      this.mapJsonToObject(this.radiacion, this.marcadoresBase);
      this.dibujarPoligono(this.marcadoresBase, this.poligonos);
    });
    return `El JSON devuelto fue exitoso ..`;
    } catch (e) {
    // tslint:disable-next-line: no-string-throw // esto es una configuracion que quite para el warning
    throw `JSON no devuelto por la funcionAsync: ${e}`;
    }
  }
  public mapJsonToObject(jsonObject, marcadores) {
   // console.log('serviceObject', jsonObject);
    for (const json of jsonObject ) {
      let fecha = this.moment(json.hora); // Se transforma a moment debido a que esta es la unica variable que no me reconoce como Date pasandolo del json a js
      // fecha = fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
      const marcador = new Marcador(json.latitud, json.longitud, json.ubicacion, json.uv, fecha, json.coordenadas, json.color);
      marcadores.push(marcador);
    }
  }
  public dibujarPoligono(marcadores, poligonos) { // dibujar los poligonos como centros de los marcadores
    for (const marcador of marcadores ) {
    const ruta: Array<LatLngLiteral> = [
          { lat: marcador.latitud,  lng: marcador.longitud + marcador.coordenadas[2] },
          { lat: marcador.latitud + marcador.coordenadas[1],  lng: marcador.longitud + marcador.coordenadas[0] },
          { lat: marcador.latitud + marcador.coordenadas[1], lng: marcador.longitud - marcador.coordenadas[0] },
          { lat: marcador.latitud, lng: marcador.longitud - marcador.coordenadas[2] },
          { lat: marcador.latitud - marcador.coordenadas[1],  lng: marcador.longitud - marcador.coordenadas[0] },
          { lat: marcador.latitud - marcador.coordenadas[1], lng: marcador.longitud + marcador.coordenadas[0] }
      ];
    // el array del tipo number definido como coordenadas contienen unicamente 3 valores [x,y,radio]
    // los mismos valores utilizados para dibujar los hexagonos a partir de una coordenada centro (latitud,longitud del marcador)
    const poligono = new Poligono(ruta, marcador.color);
    poligonos.push(poligono);
    }
  }
  // public deleteMarker(){

  //   const resetMarcadores: any = {
  //     setMap:
  //   }
  // }
}
