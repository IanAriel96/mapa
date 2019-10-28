import { Component } from '@angular/core';
export interface Element {
  uv: string;
  riesgo: string;
  exposicion: number;
  description: string;
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  displayedColumns: string[] = ['uv', 'riesgo', 'exposicion', 'description'];
  // tslint:disable-next-line: no-use-before-declare
  dataSource = ELEMENT_DATA;
 // constructor() {}
}
// var ejemplo =document.write("<ul>hola este es un ejemplo <li>separando para ver si funciona</li> </ul>");
// console.log(ejemplo);
const ELEMENT_DATA: Element[] = [
  {
    uv: '0 a 2',
    riesgo: 'Bajo',
    exposicion: 60,
    description: `Puede permanecer en el exterior sin riesgo
    Gafas de sol en dias brillantes
    No cambia nada`
  }, {
    uv: '3 a 5',
    riesgo: 'Moderado',
    exposicion: 45,
    description: `Utilice gorra, crema con filtro, gafas y permanezca en areas sombrias`
  }, {
    uv: '6 a 7',
    riesgo: 'Alto',
    exposicion: 30,
    description: `Utilice gorra, crema con filtro, gafas y sombrero + "<br>"Cuidado con bebes`
  }, {
    uv: '8 a 10',
    riesgo: 'Muy Alto',
    exposicion: 25,
    description: `Utilice gorra, crema con filtro, gafas y sombrero <br> Procure no exponerse al sol`
  }, {
    uv: '11+',
    riesgo: 'Extremo',
    exposicion: 10,
    description: `Evite la exposicion al sol`
  },
];
