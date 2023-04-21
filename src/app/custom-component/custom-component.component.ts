import { NgModule, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [],
  bootstrap: []
})
export class CustomComponent {
  constructor(private readonly alertController: AlertController) { }

  async presentAlert(header: string, subHeader: string, message: string, buttons: string[]){
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons
    });
    await alert.present();
  };
};
