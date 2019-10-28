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

  radiacion: Radiacion[] = []; // array del tipo radiacion que almacena objetos JSON
  dataLineas: Array<any>[] = []; // marcadores de la base como objetos JavaScript
  constructor(private RadiacionService: RadiacionService) {
  }

  ngOnInit() {
    const contador = interval(8000);
    contador.subscribe((n) => {
      this.funcionAsync().then(result => console.log(result)).catch(e => console.log (`Error capturadoo:${e}`));
      console.log(`cada ${n} segundos`);
      this.radiacion = []; // seteamos a 0 debido a que se sigue almacenando los objetos y debemos actualizar en la variable que recibe los json
    });
  // this.RadiacionService.getRecientes().subscribe(resp => {
  //   this.radiacion.push( ...resp.radiacion);
  //   this.mapJsonToLinea(this.radiacion, this.dataLineas);
  // });
}
mapJsonToLinea(jsonObject, data) {
  for (const json of jsonObject ) {
    const objeto =  {ubicacion: json.ubicacion, uv: json.uv, hora: json.hora };
    data.push(objeto);
  }
}

public funcionAsync = async () => {
  try {
  await this.RadiacionService.getRecientes().subscribe(resp => { // await quiere decir espera a una promesa de forma asincrona en este caso la promesa es la resp de la BD
    this.radiacion.push(...resp.radiacion);
  //  this.dataLineas = []; // seteamos a 0 debido a que se sigue almacenando los objetos y debemos actualizar en la variable local
    this.mapJsonToLinea(this.radiacion, this.dataLineas);
  });
  return `El JSON devuelto fue exitoso en tab3 ts ..`;
  } catch (e) {
  // tslint:disable-next-line: no-string-throw // esto es una configuracion que quite para el warning
  throw `JSON no devuelto por la funcionAsync: ${e}`;
  }
}
}
