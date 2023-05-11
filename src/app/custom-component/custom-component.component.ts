import { NgModule } from '@angular/core';
import { AlertController } from '@ionic/angular';

@NgModule({})
export class CustomComponent {
  constructor(private readonly alertController: AlertController) {}

  async presentAlert(
    header: string,
    subHeader: string,
    message: string,
    buttons: string[]
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
    });
    await alert.present();
  }
}
