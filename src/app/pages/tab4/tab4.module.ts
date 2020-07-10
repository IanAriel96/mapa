import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Tab4Page } from './tab4.page';
import { MaterialModule } from '../../material.module';
import { PapaParseModule } from 'ngx-papaparse';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    PapaParseModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    File,
    SocialSharing
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
