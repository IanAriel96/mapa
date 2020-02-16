import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RadiacionService } from '../../services/radiacion.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public alerta: AlertController,
              private radioService: RadiacionService) { }
  username: string;
  password: string;
  mostrar = false;
  radio: number;

  async presentAlert() {
    const alert = await this.alerta.create({
      header: 'Alerta',
      message: 'Por favor llenar todos los campos',
      buttons: ['OK']
    });
    if (this.username.length === 0 || this.password.length === 0) {
      alert.message = 'Por favor llenar todos los campos';
    } else {
      if (this.username === 'ian' && this.password === '2078389') {
        alert.message = 'Logeo Exitoso';
        this.mostrar = !this.mostrar;
      } else {
        alert.message = 'Usuario Incorrecto';
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
      const valido = await this.radioService.cambiarRadio(this.radio);
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


  ngOnInit() {
  }

}
