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

  getRadiacion() {
    return this.http.get<RespuestaRadiacion>(`${URL}/api/radiacion`);
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
}
