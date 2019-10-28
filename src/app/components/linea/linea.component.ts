import { Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss'],
})
export class LineaComponent implements OnInit  {
  @Input() datos; // contiene el array de JSON recientes conformado: ubicacion, uv, hora
  public lineChartData: Array<any>  = [
    { data: [0], label: 'Vicentina' },
    { data: [0], label: 'Foch' },
    { data: [0], label: 'Centro' }
  ];

  public lineChartLabels: Array<any> = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [];

 public lineChartLegend:boolean = true;
 public lineChartType:string = 'line';


  public actualizarData( ):void { // se agrega los nuevos uv a la grafica dinamica
    this.lineChartData = [
      { data: [0], label: 'Vicentina' },
      { data: [0], label: 'Foch' },
      { data: [0], label: 'Centro' }
    ];
    for (let marcador of this.datos) { // se protege a los valore uv, para que no se mezclen entre marcadores
      switch(marcador.ubicacion) {
        case 'Vicentina':
          this.lineChartData[0].data.push(marcador.uv); // linechartData[0] se guardo como Vicentina
        //  this.lineChartData[0].label = marcador.ubicacion;
          break;
        case 'Foch':
          this.lineChartData[1].data.push(marcador.uv); // linechartData[1] se guardo como Foch
        //  this.lineChartData[0].label = marcador.ubicacion;
          break;
        case 'Centro':
          this.lineChartData[2].data.push(marcador.uv); // linechartData[2] se guardo como Centro
        //  this.lineChartData[0].label = marcador.ubicacion;
          break;
        default:
          console.log('No entra en ninguna de las categorias');
          break;
      }
    }
    console.log('repetido:', this.datos);
  }
  public funcionAsync = async () => {
    try {
    await this.actualizarData;
    return `El JSON devuelto fue exitoso ..`;
    } catch (e) {
    // tslint:disable-next-line: no-string-throw // esto es una configuracion que quite para el warning
    throw `JSON no devuelto por la funcionAsync: ${e}`;
    }
  }
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
  ngOnInit() {
    // const contador = interval(5000);
    // contador.subscribe((n) => {
    //   this.funcionAsync().then(result => console.log(result)).catch(e => console.log (`Error capturadoo:${e}`));
    //   console.log(`cada ${n} segundos`);
    // });
  }
}
