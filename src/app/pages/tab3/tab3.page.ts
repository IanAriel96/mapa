import { Component, OnInit, Input } from '@angular/core';
import { RadiacionService } from '../../services/radiacion.service';
import { Radiacion } from '../../interfaces/interfaces';
import { interval } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public moment = require('moment');
  radiacion: Radiacion[] = []; // array del tipo radiacion que almacena objetos JSON
  sem: Radiacion[] = [];
  mes: Radiacion[] = [];
  maxsem: Radiacion[] = [];
  maxmes: Radiacion[] = [];
  mensual: Array<any>[] = [];
  semanal: Array<any>[] = [];
  maxmensual: Array<any>[] = [];
  maxsemanal: Array<any>[] = [];
  dataLineas: Array<any>[] = []; // marcadores de la base como objetos JavaScript
  constructor(private RadiacionService: RadiacionService) {
  }
  ngOnInit() {
    this.RadiacionService.getRadiacion().subscribe(resp => {
      this.radiacion.push( ...resp.radiacion);
      this.mapJsonToLinea(this.radiacion, this.dataLineas);
    });
    this.RadiacionService.getSemanal().subscribe(resp => {
      this.sem.push( ...resp.radiacion);
      this.mapJsonToLinea(this.sem, this.semanal);
    });
    this.RadiacionService.getMes().subscribe(resp => {
      this.mes.push( ...resp.radiacion);
      this.mapJsonToLinea(this.mes, this.mensual);
    });
    this.RadiacionService.getMaxSemanal().subscribe(resp => {
      this.maxsem.push( ...resp.radiacion);
      this.mapJsonToLinea(this.maxsem, this.maxsemanal);
    });
    this.RadiacionService.getMaxMes().subscribe(resp => {
      this.maxmes.push( ...resp.radiacion);
      this.mapJsonToLinea(this.maxmes, this.maxmensual);
    });
    const contador = interval(1800000); // 1800000 es cada 30 min y 3600000 es 1 hora
    contador.subscribe((n) => {
      this.funcionAsync().then(result => console.log(result)).catch(e => console.log (`Error capturadoo:${e}`));
    });
  }
  mapJsonToLinea(jsonObject, data) {
    for (const json of jsonObject ) {
      const fecha = this.moment(json.hora);
      // fecha.set('hour', fecha.hour() + 5); // asi se cambia la hora en momentjs
      const objeto =  {ubicacion: json.ubicacion, uv: json.uv, hora: fecha };
      data.push(objeto);
    }
  }
  public funcionAsync = async () => {
    try {
    await this.RadiacionService.getRecientes().subscribe(resp => { // await quiere decir espera a una promesa de forma asincrona en este caso la promesa es la resp de la BD
      this.radiacion = []; // importante resetear los array caso contrario en la func asincrona se superpondra las muestras recientes
      this.dataLineas = [];
      this.radiacion.push(...resp.radiacion);
      this.mapJsonToLinea(this.radiacion, this.dataLineas);
    });
    return `El JSON devuelto fue exitoso ..`;
    } catch (e) {
    // tslint:disable-next-line: no-string-throw // esto es una configuracion que quite para el warning
    throw `JSON no devuelto por la funcionAsync: ${e}`;
    }
  }
}
