import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss'],
})
export class LineaComponent implements OnInit  {
  @Input() datos; // contiene el array de JSON recientes conformado: ubicacion, uv, hora
  @Input() semanal; // contiene el array de JSON recientes conformado: ubicacion, uv resumen sem, hora
  @Input() mensual; // contiene el array de JSON recientes conformado: ubicacion, uv resum men, hora
  @Input() maxsemanal; // contiene el array de JSON recientes conformado: ubicacion, uv max sem, hora
  @Input() maxmensual; // contiene el array de JSON recientes conformado: ubicacion, uv max men, hora
  public moment = require('moment'); // en la page 3 esta hora en formato moment de los objs
  public lineChartData: Array<any>  = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 1' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 2' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 3' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 4' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 5' },
  ];

  public lineChartLabels: Array<any> = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Radición UV'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Hora - Dia - Mes'
        }
      }]
    }
  };

 public lineChartColors: Array<any> = [];
 public lineChartLegend = true;
 public lineChartType = 'line';

 constructor(private dataService: DataService) {

 }

 public distinct(value: any, index: any, self: any) {  // metodo para realizar el proceso distinct
  return self.indexOf(value) === index;
 }
  public sinRepetidos(repetidos: any) {
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    for (const muestra of repetidos) {     // se separa cada objeto del array de radiacion
      ubicaciones.push(muestra.ubicacion); // se almacena unicamente las ubicaciones de cada sensor que haya funcionado en ese dia presente
      ubicaciones = ubicaciones.filter(this.distinct); // se llama al metodo distinct para filtrar los repetidos
    }
    return ubicaciones;
  }
  public actualizarLabels() {  // actualizamos para que no se superponga los otros datos y sea un grafico nuevo
    this.lineChartData = [
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 1' },
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 2' },
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 3' },
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 4' },
      { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 5' },
    ];
  }
  public actualizarSemana(): void {
     const start = new Date();
     start.setDate(start.getDate() - 19);
     let x = 1;
     let ubicaciones: string[] = []; // guarda las ubicaciones distinct
     let i = 0;
     let j = 0;
     ubicaciones = this.sinRepetidos(this.semanal);
     this.actualizarLabels();
     this.lineChartLabels = [];
     while (x < 21) { // en total ponemos 20 datos debido a que es la longitud max del labels
      this.lineChartLabels.push(start.getDate()); // usamos date en vez de enteros xq no sabemos si es 30 o 31 el mes
      start.setDate(start.getDate() + 1);
      x++;
     }
     for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
       for (const marcador of this.semanal) { // se protege a los valore uv, para que no se mezclen entre marcadores
         this.lineChartData[i].label = ubicacion; // referenciamos los data a la ubicacion correspond
         if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
          label: while (j < 20) {  // este lazo permite poner cada marcador en su dia correspondiente
              if (marcador.hora.date() === this.lineChartLabels[j] ) {
                this.lineChartData[i].data[j] = marcador.uv;
                break label; // solo hace break al lazo while no a todos los lazos
              }
              j++;
          }
        }
      }
       i++;
       j = 0;
    }
  }
  public MaxSemana(): void {
    const start = new Date();
    start.setDate(start.getDate() - 19);
    let x = 1;
    this.lineChartLabels = [];
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let j = 0;
    ubicaciones = this.sinRepetidos(this.maxsemanal);
    this.actualizarLabels();
    while (x < 21) { // en total ponemos 20 datos debido a que es la longitud max del labels
     this.lineChartLabels.push(start.getDate());
     start.setDate(start.getDate() + 1);
     x++;
    }
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
      for (const marcador of this.maxsemanal) { // se protege a los valore uv, para que no se mezclen entre marcadores
        this.lineChartData[i].label = ubicacion; // referenciamos los data a la ubicacion correspond
        if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
         label: while (j < 20) {  // este lazo permite poner cada marcador en su dia correspondiente
             if (marcador.hora.date() === this.lineChartLabels[j] ) {
               this.lineChartData[i].data[j] = marcador.uv;
               break label; // solo hace break al lazo while no a todos los lazos
             }
             j++;
         }
       }
     }
      i++;
      j = 0;
   }
 }
  public actualizarMes(): void {
    this.lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let x: number;
    ubicaciones = this.sinRepetidos(this.mensual);
    this.actualizarLabels();
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
    for (const marcador of this.mensual) { // se protege a los valore uv, para que no se mezclen entre marcadores
      this.lineChartData[i].label = ubicacion;
      if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
          x = marcador.hora.month();
          switch (x) {
            case 0:
                this.lineChartData[i].data[0] = marcador.uv;
                break;
            case 1:
                this.lineChartData[i].data[1] = marcador.uv;
                break;
            case 2:
                this.lineChartData[i].data[2] = marcador.uv;
                break;
            case 3:
                this.lineChartData[i].data[3] = marcador.uv;
                break;
            case 4:
                this.lineChartData[i].data[4] = marcador.uv;
                break;
            case 5:
                this.lineChartData[i].data[5] = marcador.uv;
                break;
            case 6:
                this.lineChartData[i].data[6] = marcador.uv;
                break;
            case 7:
                this.lineChartData[i].data[7] = marcador.uv;
                break;
            case 8:
                this.lineChartData[i].data[8] = marcador.uv;
                break;
            case 9:
                this.lineChartData[i].data[9] = marcador.uv;
                break;
            case 10:
                this.lineChartData[i].data[10] = marcador.uv;
                break;
            case 11:
                this.lineChartData[i].data[11] = marcador.uv;
                break;
            default:
                break;
          }
      }
    }
    i++;
  }
}

public MaxMes(): void {
  this.lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  let ubicaciones: string[] = []; // guarda las ubicaciones distinct
  let i = 0;
  let x: number;
  ubicaciones = this.sinRepetidos(this.maxmensual);
  this.actualizarLabels();
  for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
  for (const marcador of this.maxmensual) { // se protege a los valore uv, para que no se mezclen entre marcadores
    this.lineChartData[i].label = ubicacion;
    if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
        x = marcador.hora.month();
        switch (x) {
          case 0:
              this.lineChartData[i].data[0] = marcador.uv;
              break;
          case 1:
              this.lineChartData[i].data[1] = marcador.uv;
              break;
          case 2:
              this.lineChartData[i].data[2] = marcador.uv;
              break;
          case 3:
              this.lineChartData[i].data[3] = marcador.uv;
              break;
          case 4:
              this.lineChartData[i].data[4] = marcador.uv;
              break;
          case 5:
              this.lineChartData[i].data[5] = marcador.uv;
              break;
          case 6:
              this.lineChartData[i].data[6] = marcador.uv;
              break;
          case 7:
              this.lineChartData[i].data[7] = marcador.uv;
              break;
          case 8:
              this.lineChartData[i].data[8] = marcador.uv;
              break;
          case 9:
              this.lineChartData[i].data[9] = marcador.uv;
              break;
          case 10:
              this.lineChartData[i].data[10] = marcador.uv;
              break;
          case 11:
              this.lineChartData[i].data[11] = marcador.uv;
              break;
          default:
              break;
        }
    }
  }
  i++;
}
}

  public actualizarData( ): void { // se agrega los nuevos uv a la grafica dinamica
    this.lineChartLabels = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let x = 0;
    ubicaciones = this.sinRepetidos(this.datos);
    this.actualizarLabels();
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
      for (const marcador of this.datos) { // se protege a los valore uv, para que no se mezclen entre marcadores
        this.lineChartData[i].label = ubicacion; // escoge una ubicacion para rellenar en ella los datos
        if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
          x = marcador.hora.hour() + 5; // si reseteamos directamente marcador.hora se queda asi la proxima vez
          switch (x) {  // utilizamos este switch para ordenar cada muestra en su respectiva hora, en caso que no haya muestra para una hora se pondra el valor de 0
            case 7:
                this.lineChartData[i].data[0] = marcador.uv;
                break;
            case 8:
                this.lineChartData[i].data[1] = marcador.uv;
                break;
            case 9:
                this.lineChartData[i].data[2] = marcador.uv;
                break;
            case 10:
                this.lineChartData[i].data[3] = marcador.uv;
                break;
            case 11:
                this.lineChartData[i].data[4] = marcador.uv;
                break;
            case 12:
                this.lineChartData[i].data[5] = marcador.uv;
                break;
            case 13:
                this.lineChartData[i].data[6] = marcador.uv;
                break;
            case 14:
                this.lineChartData[i].data[7] = marcador.uv;
                break;
            case 15:
                this.lineChartData[i].data[8] = marcador.uv;
                break;
            case 16:
                this.lineChartData[i].data[9] = marcador.uv;
                break;
            case 17:
                this.lineChartData[i].data[10] = marcador.uv;
                break;
            case 18:
                this.lineChartData[i].data[11] = marcador.uv;
                break;
            default:
                break;
          }
        }
      }
      i++;
    }
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ngOnInit() {
    this.dataService.dibujarHoy.subscribe(() => {
      this.actualizarData();
    });
    this.dataService.dibujarSemana.subscribe(() => {
      this.actualizarSemana();
    });
    this.dataService.dibujarMes.subscribe(() => {
      this.actualizarMes();
    });
    this.dataService.dibujarMaxSemana.subscribe(() => {
      this.MaxSemana();
    });
    this.dataService.dibujarMaxMes.subscribe(() => {
      this.MaxMes();
    });
  }
}
