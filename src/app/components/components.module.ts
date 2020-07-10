import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineaComponent } from './linea/linea.component';
import { ChartsModule } from 'ng2-charts';
import { NavbarComponent } from './navbar/navbar.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    LineaComponent,
    NavbarComponent
  ],
  exports: [
    LineaComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    IonicModule
  ]
})
export class ComponentsModule { }
