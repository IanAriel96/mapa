import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  dibujarHoy = new EventEmitter();
  dibujarSemana = new EventEmitter();
  dibujarMes = new EventEmitter();
  dibujarMaxSemana = new EventEmitter();
  dibujarMaxMes = new EventEmitter();
  subsVar: Subscription;
  Hoy() {
    this.dibujarHoy.emit();
  }
  Semana() {
    this.dibujarSemana.emit();
  }
  Mes() {
    this.dibujarMes.emit();
  }
  MaxSemana() {
    this.dibujarMaxSemana.emit();
  }
  MaxMes() {
    this.dibujarMaxMes.emit();
  }
}
