import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineaComponent } from './linea/linea.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    LineaComponent
  ],
  exports: [
    LineaComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
