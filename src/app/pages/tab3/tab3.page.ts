import { Component, OnInit, Input } from '@angular/core';
import { RadiacionService } from '../../services/radiacion.service';
import { Radiacion } from '../../interfaces/interfaces';
import { interval } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public moment = require('moment');
  radiacion: Radiacion[] = []; // array del tipo radiacion que almacena objetos JSON
  hoy: Radiacion [] = [];
  sem: Radiacion[] = [];
  mes: Radiacion[] = [];
  maxsem: Radiacion[] = [];
  maxmes: Radiacion[] = [];
  mensual: Array<any>[] = [];
  semanal: Array<any>[] = [];
  maxmensual: Array<any>[] = [];
  maxsemanal: Array<any>[] = [];
  calendar: Date = new Date();
  dataLineas: Array<any>[] = []; // marcadores de la base como objetos JavaScript
  arrayHoy: Array<any>[] = [];
  constructor(private radiacionService: RadiacionService,
              private dataService: DataService) {
  }
  public cambioFecha( event) {
    this.radiacion = [];
    this.dataLineas = [];
    this.calendar = new Date(event.detail.value);
    this.calendar.setHours(0);
    this.calendar = this.moment(this.calendar.toISOString());
    this.radiacionService.getRadiacion(this.calendar).subscribe(resp => {
       this.radiacion.push( ...resp.radiacion);
       this.mapJsonToLinea(this.radiacion, this.dataLineas);
       this.dataService.Calendar(); // evento aceptar del calendario
    });
  }
  ngOnInit() { // aqui solo itera una vez al cargar la pagina
    this.calendar.setHours(0); // se setea en cero para que la busqueda en la base sea desde la primera muestra del dia
    this.radiacionService.getRadiacion(this.calendar).subscribe(resp => {
      this.hoy.push( ...resp.radiacion);
      this.mapJsonToLinea(this.hoy, this.arrayHoy);
    });
    this.radiacionService.getSemanal().subscribe(resp => {
      this.sem.push( ...resp.radiacion);
      this.mapJsonToLinea(this.sem, this.semanal);
    });
    this.radiacionService.getMes().subscribe(resp => {
      this.mes.push( ...resp.radiacion);
      this.mapJsonToLinea(this.mes, this.mensual);
    });
    this.radiacionService.getMaxSemanal().subscribe(resp => {
      this.maxsem.push( ...resp.radiacion);
      this.mapJsonToLinea(this.maxsem, this.maxsemanal);
    });
    this.radiacionService.getMaxMes().subscribe(resp => {
      this.maxmes.push( ...resp.radiacion);
      this.mapJsonToLinea(this.maxmes, this.maxmensual);
    });
    const contador = interval(10000); // 1800000 es cada 30 min y 3600000 es 1 hora
    contador.subscribe((n) => {  // usamos esta funcAsync debido a que si el usuario quiere ver la actualizacion de la radiacion actual se actualice segun el contador
      this.funcionAsync().then(result => console.log(result)).catch(e => console.log (`Error capturadoo:${e}`));
    });
  }
  mapJsonToLinea(jsonObject, data) {
    for (const json of jsonObject ) {
      const fecha = this.moment(json.hora);
      const objeto =  {ubicacion: json.ubicacion, uv: json.uv, hora: fecha };
      data.push(objeto);
    }
  }
  public funcionAsync = async () => {
    try {
    const calendar2: Date = new Date();
    calendar2.setHours(0);
    await this.radiacionService.getRadiacion(calendar2).subscribe(resp => { // await quiere decir espera a una promesa de forma asincrona en este caso la promesa es la resp de la BD
      this.hoy = []; // importante resetear los array caso contrario en la func asincrona se superpondra las muestras recientes
      this.arrayHoy = [];
      this.hoy.push(...resp.radiacion);
      this.mapJsonToLinea(this.hoy, this.arrayHoy);
    });
    return `El JSON devuelto fue exitoso ..`;
    } catch (e) {
    // tslint:disable-next-line: no-string-throw // esto es una configuracion que quite para un warning referente a espacios
    throw `JSON no devuelto por la funcionAsync: ${e}`;
    }
  }
}
