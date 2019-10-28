import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tab1Page } from './tab1.page';

// google maps
import { AgmCoreModule } from '@agm/core';

import { MaterialModule } from '../../material.module';
@NgModule({
  entryComponents: [
  ],
  imports: [
    IonicModule,
    CommonModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBZhQOueM3jLsbHh6ZkayTlaOGCnHiCfjY'
      // libraries: ['places', 'drawing', 'geometry']
    })
  ],
  declarations: [
    Tab1Page
  ]
})
export class Tab1PageModule {}
