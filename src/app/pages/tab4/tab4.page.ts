import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { RadiacionService } from '../../services/radiacion.service';
// import { ExcelService } from '../../services/excel.service';
import { Radiacion } from '../../interfaces/interfaces';
import { Papa } from 'ngx-papaparse';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public alerta: AlertController,
              // private excelService: ExcelService,
              private radiacionService: RadiacionService,
              private papa: Papa,
              private plt: Platform,
              private file: File,
              private socialSharing: SocialSharing) { }
  moment = require('moment');
  calendar: Date = new Date();
  username: string = null;
  password: string = null;
  mostrar = false;
  radio: number;
  errores: any [] = [];
  radiacion: any [] = [];
  dataLineas: any [] = [];
  sem: Radiacion[] = [];
  semanal: Array<any>[] = [];
  mes: Radiacion[] = [];
  mensual: Array<any>[] = [];
  listaErrores: any [] = [];
  headerRow = ['Sector', 'UV', 'Fecha' ];

  public cambioFecha(event) {
    this.radiacion = [];
    this.dataLineas = [];
    this.calendar = new Date(event.detail.value);
    this.calendar.setHours(0);
    this.calendar = this.moment(this.calendar.toISOString());
    this.radiacionService.getRadiacion(this.calendar).subscribe(resp => {
      this.radiacion.push( ...resp.radiacion);
      this.mapJsonToLinea(this.radiacion, this.dataLineas);
      this.exportRadiacion();
   });
  }

  async presentAlert() {
    const alert = await this.alerta.create({
      header: 'Alerta',
      message: 'Por favor llenar todos los campos',
      buttons: ['OK']
    });
    if ( this.username === null || this.password === null) {
      alert.message = 'Por favor llenar todos los campos';
    } else {
      if (this.username.length === 0 || this.password.length === 0 ) {
        alert.message = 'Por favor llenar todos los campos';
      } else {
        if (this.username === 'ian' && this.password === '2078389') {
          alert.message = 'Logeo Exitoso';
          this.mostrar = !this.mostrar;
        } else {
          alert.message = 'Usuario Incorrecto';
        }
      }
    }
    await alert.present();
  }

  async actualizarRadio() {
    const alert = await this.alerta.create({
      header: 'Alerta del campo radio',
      message: 'Ingrese un valor',
      buttons: ['OK']
    });
    if (this.radio < 5 && this.radio > 0 ) {
      const valido = await this.radiacionService.cambiarRadio(this.radio);
      if (valido) {
        alert.message = 'Cambio Exitoso !!';
      } else {
        alert.message = 'No se pudo modificar';
      }
    } else {
      alert.message = 'El radio debe ser mayor a 0 y menor a 5 km';
    }
    await alert.present();
  }

//   exportAsXLSX(): void { // otro metodo de descarga de excel
//     this.excelService.exportAsExcelFile(this.semanal, 'sample');
//  }

  exportRadiacion() {
    const csv = this.papa.unparse({
      data: this.dataLineas
    });
    if (this.plt.is('cordova')) {
      this.file.writeFile(this.file.dataDirectory, 'dataRadiacion.csv', csv, {replace: true}).then(res => {
        this.socialSharing.share(null, null, res.nativeURL, null);
      });
    } else {
        const blob = new Blob([csv]);
        const a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'radiacion.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  }
  limpiarLista() {
    this.radiacionService.getLimpiar().subscribe(resp => {
      this.errores.push( ...resp.log);
      if (this.errores.length === 0) {
          this.listaErrores = [];
          this.listaErrores[0] = {nombre: 'Estado del servidor', mensaje: 'Sin errores', fecha: new Date() };
        }
    });
  }
   mapJsonToLinea(jsonObject, data) {
    for (const json of jsonObject ) {
      const objeto = {ubicacion: json.ubicacion, uv: json.uv, hora: json.hora };
      data.push(objeto);
    }
  }

  mapJsonToError(jsonObject, data) {
    for (const json of jsonObject ) {
      const objeto = {nombre: json.nombre, mensaje: json.mensaje, fecha: json.fecha }; // aqui toca cambiar cuando en localhost es log y en la BD lista
      data.push(objeto);
    }
  }
  ngOnInit() {
    this.radiacionService.getErrores().subscribe(resp => {
      this.listaErrores = [];
      this.errores = [];
      this.errores.push( ...resp.log); // ojo log es en el localhost y lista en el servidor por eso el error
      this.mapJsonToError(this.errores, this.listaErrores);
      if (this.listaErrores.length === 0) {
          this.listaErrores[0] = {nombre: 'Estado del servidor', mensaje: 'Sin errores', fecha: new Date() };
        }
      this.errores = [];
    });
  }
}
