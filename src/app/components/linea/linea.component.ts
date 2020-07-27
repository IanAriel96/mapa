import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss'],
})
export class LineaComponent implements OnInit  {
  @Input() datos; // contiene el array de JSON de radiacion conformado: ubicacion, uv, hora
  @Input() hoy; // contiene el array de JSON de las muestras de hoy conformado: ubicacion, uv, hora
  @Input() semanal; // contiene el array de JSON de semanal conformado: ubicacion, uv resumen sem, hora
  @Input() mensual; // contiene el array de JSON de mensual conformado: ubicacion, uv resum men, hora
  @Input() maxsemanal; // contiene el array de JSON de maxsemanal conformado: ubicacion, uv max sem, hora
  @Input() maxmensual; // contiene el array de JSON de maxmensual conformado: ubicacion, uv max men, hora
  // public moment = require('moment'); // en la page 3 ya se define el campo hora en formato momento para todos los Input
  public lineChartData: Array<any>  = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 1' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 2' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Sensor 3' },
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
 constructor( private dataService: DataService) {

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
  private actualizarLabels(sensores: number) {  // actualizamos para que no se superponga los otros datos y sea un grafico nuevo
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const label = 'Sensor';
    let i = 0;
    while (this.lineChartData.length < sensores) { // en caso de q se agrege un nuevo prototipo automaticamente se adjunta al chart
      this.lineChartData.push({data, label}); // agregamos el nuevo sensor si existe uno nuevo
    }
    while (i < sensores) {
        this.lineChartData[i].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // enceramos todo los data
        this.lineChartData[i].label = 'Sensor ' + i; // da igual el valor del label xq luego sera reemplazado
        i++;
    }
  }
  public actualizarRadiacion( ): void { // se agrega los nuevos uv a la grafica dinamica
    this.lineChartLabels = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let x = 0;
    let temp = 0; // variable para escoger solo la primera hora sin minutos en caso de repetirse por las muestras de media hora
    if (this.datos.length !== 0 ) { // verificamos si existe muestras en la fecha del calendario seleccionada
      ubicaciones = this.sinRepetidos(this.datos);
      this.actualizarLabels(ubicaciones.length);
      this. lineChartOptions = {
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
              labelString: `Horas de ${this.datos[0].hora.format('LL')}`
            }
          }]
        }
      };
    } else {
      this. lineChartOptions = {
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
    }
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
      for (const marcador of this.datos) { // se protege a los valore uv, para que no se mezclen entre marcadores
        this.lineChartData[i].label = ubicacion; // escoge una ubicacion para rellenar en ella los datos
        if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
          x = marcador.hora.hour() + 5; // si reseteamos directamente marcador.hora se queda asi la proxima vez
          if (x !== temp) { // con esto garantizamos q no tome la hora con 30 min extras
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
            temp = x; // con esto garantizamos q no tome la hora con 30 min extras
          }
        }
      }
      i++;
      temp = 0; // reseteamos a temp
    }
  }
  public actualizarSemana(): void {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    let x = 1;
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let j = 0;
    if (this.semanal.length !== 0 ) { // verificamos si existe muestras en la fecha del calendario seleccionada
      ubicaciones = this.sinRepetidos(this.semanal);
      this.actualizarLabels(ubicaciones.length);
      this. lineChartOptions = {
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
              labelString: `Dias de la semana ${this.semanal[this.semanal.length - 1].hora.format('MMMM, YYYY')}`
            }
          }]
        }
      };
    } else {
      this. lineChartOptions = {
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
    }
    this.lineChartLabels = []; // reiniciamos el chartlabels
    while (x < 31) { // en total ponemos 20 datos debido a que es la longitud max del labels
      this.lineChartLabels.push(start.getDate()); // usamos date en vez de enteros xq no sabemos si es 30 o 31 el mes
      start.setDate(start.getDate() + 1); // se aumenta los dias hasta completar el lineChartLabels
      x++;
     }
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
       for (const marcador of this.semanal) { // se protege a los valore uv, para que no se mezclen entre marcadores
         this.lineChartData[i].label = ubicacion; // referenciamos los data a la ubicacion correspond
         if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
          label: while (j < 31) {  // este lazo permite poner cada marcador en su dia correspondiente
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
    start.setDate(start.getDate() - 30);
    let x = 1;
    this.lineChartLabels = [];
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let j = 0;
    if (this.maxsemanal.length !== 0 ) { // verificamos si existe muestras en la fecha del calendario seleccionada
      ubicaciones = this.sinRepetidos(this.maxsemanal);
      this.actualizarLabels(ubicaciones.length);
      this. lineChartOptions = {
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
              labelString: `Dias de la semana ${this.semanal[this.semanal.length - 1].hora.format('MMMM, YYYY')}`
            }
          }]
        }
      };
    } else {
      this. lineChartOptions = {
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
    }
    while (x < 31) { // en total ponemos 20 datos debido a que es la longitud max del labels
     this.lineChartLabels.push(start.getDate());
     start.setDate(start.getDate() + 1);
     x++;
    }
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
      for (const marcador of this.maxsemanal) { // se protege a los valore uv, para que no se mezclen entre marcadores
        this.lineChartData[i].label = ubicacion; // referenciamos los data a la ubicacion correspond
        if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
         label: while (j < 31) {  // este lazo permite poner cada marcador en su dia correspondiente
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
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let x: number;
    if (this.mensual.length !== 0 ) { // verificamos si existe muestras en la fecha del calendario seleccionada
      ubicaciones = this.sinRepetidos(this.mensual);
      this.actualizarLabels(ubicaciones.length);
      this. lineChartOptions = {
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
              labelString: 'Meses'
            }
          }]
        }
      };
    } else {
      this. lineChartOptions = {
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
    }
    this.lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
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
  let ubicaciones: string[] = []; // guarda las ubicaciones distinct
  let i = 0;
  let x: number;
  if (this.maxmensual.length !== 0 ) { // verificamos si existe muestras en la fecha del calendario seleccionada
    ubicaciones = this.sinRepetidos(this.maxmensual);
    this.actualizarLabels(ubicaciones.length);
    this. lineChartOptions = {
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
            labelString: 'Meses'
          }
        }]
      }
    };
  } else {
    this. lineChartOptions = {
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
  }
  this.lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
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

  public actualizarHoy( ): void { // se agrega los nuevos uv a la grafica dinamica
    let ubicaciones: string[] = []; // guarda las ubicaciones distinct
    let i = 0;
    let x = 0;
    let temp = 0;
    if (this.hoy.length !== 0 ) { // verificamos si existe muestras en la fecha del calendario seleccionada
      ubicaciones = this.sinRepetidos(this.hoy);
      this.actualizarLabels(ubicaciones.length);
      this. lineChartOptions = {
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
              labelString: `Horas de hoy ${this.hoy[0].hora.format('LL')}`
            }
          }]
        }
      };
    } else {
      this. lineChartOptions = {
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
    }
    this.lineChartLabels = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    for (const ubicacion of ubicaciones) {  // todo estos lazos sirven para poner cada resumen en su ubicacion respectiva
      for (const marcador of this.hoy) { // se protege a los valore uv, para que no se mezclen entre marcadores
        this.lineChartData[i].label = ubicacion; // escoge una ubicacion para rellenar en ella los datos
        if (marcador.ubicacion === ubicacion) {  // condicional para poner cada uv en la ubi correspondiente
          x = marcador.hora.hour() + 5; // si reseteamos directamente marcador.hora se queda asi la proxima vez
          if (x !== temp) { // con esto garantizamos q no tome la hora con 30 min extras
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
            temp = x; // con esto garantizamos q no tome la hora con 30 min extras
          }
        }
      }
      i++;
      temp = 0; // reseteamos a temp
    }
  }

  public chartClicked( e: any): void {
  }

    ngOnInit() {
    this.dataService.dibujarCalendar.subscribe(() => {
      this.actualizarRadiacion();
    });
    this.dataService.dibujarHoy.subscribe(() => {
      this.actualizarHoy();
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
