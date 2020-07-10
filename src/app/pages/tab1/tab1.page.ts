import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { Poligono } from '../../classes/poligono.class';
import { LatLngLiteral} from '@agm/core';
import { RadiacionService } from '../../services/radiacion.service';
import { Radiacion } from '../../interfaces/interfaces';
import { interval } from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  public radiacion: Radiacion[] = []; // array del tipo radiacion que almacena objetos JSON
  public marcadoresBase: Marcador[] = []; // marcadores de la base como objetos JavaScript
  public poligonos: Array<Poligono> = [];
  public lat = -0.211; // esta informacion es utilizada para mostrar la lat y lng del donde queremos el mapa en el inicio de pantalla
  public lng = -78.5;
  public moment = require('moment'); // sera utilizada para hacer el cambio de json.hora a una variable moment ya que con Date no vale

  constructor(private radiacionService: RadiacionService,
              private alerta: AlertController,
              private localNotifications: LocalNotifications,
    ) {
}

  ngOnInit() {
    this.radiacionService.getRecientes().subscribe(resp => {  // antigua forma de solicitar el servicio
      this.radiacion.push( ...resp.radiacion);
      // this.mapJsonToObject(this.radiacion, this.marcadoresBase);
      for (const json of this.radiacion ) { // ponemos aqui xq la alerta solo debe hacerse una vez
        const fecha = this.moment(json.hora); // Se transforma a moment debido a que esta es la unica variable que no me reconoce como Date pasandolo del json a js
        json.latitud = parseFloat(json.latitud.toFixed(4)); // toFixed es para reducir los decimales a 4
        json.longitud = parseFloat(json.longitud.toFixed(4)); // toFixed es para reducir los decimales a 4
        const marcador = new Marcador(json.latitud, json.longitud, json.ubicacion, json.uv, fecha, json.coordenadas, json.color);
        this.marcadoresBase.push(marcador);
        if ( marcador.uv > 7) {
        this.notificacion(marcador.ubicacion);
        // this.presentAlert(marcador.uv, marcador.ubicacion);
        }
      }
      this.dibujarPoligono(this.marcadoresBase, this.poligonos);
    });
    const contador = interval(10000); // 1800000 es cada 30 min y 3600000 es 1 hora
    contador.subscribe((n) => {
      this.funcionAsync().then(result => console.log(result)).catch(e => console.log (`Error capturadoo:${e}`));
    });
  }
  public funcionAsync = async () => {
    try {
    await this.radiacionService.getRecientes().subscribe(resp => { // await quiere decir espera a una promesa de forma asincrona en este caso la promesa es la resp de la BD
      this.radiacion = []; // importante resetear los array caso contrario en la func asincrona se superpondra las muestras recientes
      this.poligonos = []; // importante resetear los array caso contrario en la func asincrona se superpondra las muestras recientes
      this.marcadoresBase = []; // importante resetear los array caso contrario en la func asincrona se superpondra las muestras recientes
      this.radiacion.push(...resp.radiacion);
      this.mapJsonToObject(this.radiacion, this.marcadoresBase);
      this.dibujarPoligono(this.marcadoresBase, this.poligonos);
    });
    return `El JSON devuelto fue exitoso ..`;
    } catch (e) {
    // tslint:disable-next-line: no-string-throw // esto es una configuracion que quite para el warning
    throw `JSON no devuelto por la funcionAsync: ${e}`;
    }
  }

  async notificacion(ubicacion: string) {
    this.localNotifications.schedule({
      id: 1,
      title: 'Alerta',
      text: 'Riesgo de exposicion solar, revisar en el mapa',
      // sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
      data: { secret: 'la dataaa es' }
    });
  }

  async presentAlert(uv: number, ubicacion: string) {
    const alert = await this.alerta.create({
      header: 'Alerta',
      message: 'Riesgo de exposicion al sol en ' + ubicacion + ', procure tomar las medidas de protección',
      buttons: ['OK']
    });
    await alert.present();
  }
  public mapJsonToObject(jsonObject, marcadores) {
    for (const json of jsonObject ) {
      const fecha = this.moment(json.hora); // Se transforma a moment debido a que esta es la unica variable que no me reconoce como Date pasandolo del json a js
      json.latitud = parseFloat(json.latitud.toFixed(4)); // toFixed es para reducir los decimales a 4
      json.longitud = parseFloat(json.longitud.toFixed(4)); // toFixed es para reducir los decimales a 4
      const marcador = new Marcador(json.latitud, json.longitud, json.ubicacion, json.uv, fecha, json.coordenadas, json.color);
      marcadores.push(marcador);
      // if ( marcador.uv > 7) {
      // this.notificacion(marcador.ubicacion);
      // // this.presentAlert(marcador.uv, marcador.ubicacion);
      // }
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
    const poligono = new Poligono(ruta, marcador.color, marcador.color);
    poligonos.push(poligono);
    }
  }
}
