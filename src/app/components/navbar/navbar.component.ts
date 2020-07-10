import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  {
  constructor( private dataService: DataService) {}
  clickHoy() {
    this.dataService.Hoy();
  }
  clickSemana() {
    this.dataService.Semana();
  }
  clickMes() {
    this.dataService.Mes();
  }
  clickMaxSemana() {
    this.dataService.MaxSemana();
  }
  clickMaxMes() {
    this.dataService.MaxMes();
  }
}
