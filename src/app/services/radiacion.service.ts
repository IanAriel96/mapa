import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RespuestaRadiacion } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RadiacionService {

  constructor(private http: HttpClient) { }

  getRadiacion(calendar: Date) {
    const dato = {calendar};
    return this.http.post<RespuestaRadiacion>(`${URL}/api/radiacion`, dato);
  }
  getRecientes() {
    return this.http.get<RespuestaRadiacion>(`${URL}/api/recientes`);
  }
  getSemanal() {
    return this.http.get<RespuestaRadiacion>(`${URL}/api/semanal`);
  }
  getMes() {
    return this.http.get<RespuestaRadiacion>(`${URL}/api/mes`);
  }
  getMaxSemanal() {
    return this.http.get<RespuestaRadiacion>(`${URL}/api/maxsemanal`);
  }
  getMaxMes() {
    return this.http.get<RespuestaRadiacion>(`${URL}/api/maxmes`);
  }
  getErrores() {
    return this.http.get<any>(`${URL}/api/errores`);
  }
  cambiarRadio(dato: number) {
    const radio = {dato};
    return new Promise( resolve => {
      this.http.post(`${URL}/api/radio`, radio)
      .subscribe(resp => {
        if (resp['ok']) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  getLimpiar() {
    return this.http.get<any>(`${URL}/api/limpiar`);
  }
}
