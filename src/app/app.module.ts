import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// este modulo contiene todas los componentes utilizados por angular material
// si termina en module siempre va en los imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { HttpClientModule } from '@angular/common/http'; // para hacer peticiones http

import { ReactiveFormsModule } from '@angular/forms';

// Graficos
import { ChartsModule } from 'ng2-charts';

// metodo setInterval para funciones asyncronicas
// import { setIntervalAsync } from 'set-interval-async/dynamic';
import { DataService } from './services/data.service';




@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [
    DataService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
